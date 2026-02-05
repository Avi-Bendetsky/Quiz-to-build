import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '@libs/database';
import { RedisService } from '@libs/redis';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token.dto';
import { User, UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly bcryptRounds: number;
  private readonly jwtRefreshSecret: string;
  private readonly jwtRefreshExpiresIn: string;
  private readonly refreshTokenTtlSeconds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.bcryptRounds = this.configService.get<number>('bcrypt.rounds', 12);
    this.jwtRefreshSecret = this.configService.get<string>('jwt.refreshSecret', 'refresh-secret');
    this.jwtRefreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn', '7d');
    this.refreshTokenTtlSeconds = this.parseExpiresInToSeconds(this.jwtRefreshExpiresIn);
  }

  async register(dto: RegisterDto): Promise<TokenResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        role: UserRole.CLIENT,
        profile: {
          name: dto.name,
        },
      },
    });

    this.logger.log(`User registered: ${user.id}`);

    // Generate tokens
    return this.generateTokens(user);
  }

  async login(dto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is temporarily locked. Please try again later.');
    }

    // Verify password
    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed login attempts and update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: dto.ip,
      },
    });

    this.logger.log(`User logged in: ${user.id}`);

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    // Verify refresh token exists in Redis
    const storedUserId = await this.redisService.get(`refresh:${refreshToken}`);

    if (!storedUserId) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: storedUserId },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new access token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      expiresIn: 900, // 15 minutes
    };
  }

  async logout(refreshToken: string): Promise<void> {
    // Remove refresh token from Redis
    await this.redisService.del(`refresh:${refreshToken}`);
    this.logger.log('User logged out');
  }

  async validateUser(payload: JwtPayload): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        profile: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt) {
      return null;
    }

    const profile = user.profile as Record<string, unknown> | null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: (profile?.name as string) || undefined,
    };
  }

  private async generateTokens(user: User): Promise<TokenResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    // Store refresh token in Redis
    await this.redisService.set(`refresh:${refreshToken}`, user.id, this.refreshTokenTtlSeconds);

    // Also store in database for audit
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + this.refreshTokenTtlSeconds * 1000),
      },
    });

    const profile = user.profile as Record<string, unknown> | null;

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: (profile?.name as string) || undefined,
      },
    };
  }

  private async handleFailedLogin(user: User): Promise<void> {
    const failedAttempts = user.failedLoginAttempts + 1;
    const maxAttempts = 5;
    const lockDurationMinutes = 15;

    const updateData: { failedLoginAttempts: number; lockedUntil?: Date } = {
      failedLoginAttempts: failedAttempts,
    };

    // Lock account after max attempts
    if (failedAttempts >= maxAttempts) {
      updateData.lockedUntil = new Date(Date.now() + lockDurationMinutes * 60 * 1000);
      this.logger.warn(`Account locked due to failed login attempts: ${user.id}`);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });
  }

  private parseExpiresInToSeconds(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 7 * 24 * 60 * 60; // Default: 7 days
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 7 * 24 * 60 * 60;
    }
  }
}
