import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 'usr_abc123' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: 'CLIENT' })
  role: UserRole;

  @ApiProperty({ example: 'John Doe', required: false })
  name?: string;
}

export class TokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ example: 'dGhpcyBpcyBhIHJlZnJlc2g...' })
  refreshToken: string;

  @ApiProperty({ example: 900, description: 'Token expiration time in seconds' })
  expiresIn: number;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ example: 900, description: 'Token expiration time in seconds' })
  expiresIn: number;
}
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 'usr_abc123' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: 'CLIENT' })
  role: UserRole;

  @ApiProperty({ example: 'John Doe', required: false })
  name?: string;
}

export class TokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ example: 'dGhpcyBpcyBhIHJlZnJlc2g...' })
  refreshToken: string;

  @ApiProperty({ example: 900, description: 'Token expiration time in seconds' })
  expiresIn: number;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ example: 900, description: 'Token expiration time in seconds' })
  expiresIn: number;
}
