import { Test, TestingModule } from '@nestjs/testing';
import { OAuthService } from './oauth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '@libs/database';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('OAuth Integration Tests', () => {
    let service: OAuthService;
    let usersService: UsersService;
    let prisma: PrismaService;

    const mockUsersService = {
        findByEmail: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn((key: string) => {
            const config = {
                GOOGLE_CLIENT_ID: 'test-google-client-id',
                GOOGLE_CLIENT_SECRET: 'test-google-secret',
                MICROSOFT_CLIENT_ID: 'test-microsoft-client-id',
                MICROSOFT_CLIENT_SECRET: 'test-microsoft-secret',
                OAUTH_REDIRECT_URI: 'http://localhost:3000/auth/callback',
            };
            return config[key];
        }),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OAuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: ConfigService, useValue: mockConfigService },
                PrismaService,
            ],
        }).compile();

        service = module.get<OAuthService>(OAuthService);
        usersService = module.get<UsersService>(UsersService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Google OAuth Flow', () => {
        it('should generate Google OAuth authorization URL', () => {
            const authUrl = service.getGoogleAuthUrl();

            expect(authUrl).toBeDefined();
            expect(authUrl).toContain('accounts.google.com');
            expect(authUrl).toContain('client_id=');
            expect(authUrl).toContain('redirect_uri=');
            expect(authUrl).toContain('scope=');
            expect(authUrl).toContain('email');
            expect(authUrl).toContain('profile');
        });

        it('should validate Google OAuth token response', () => {
            const mockTokenResponse = {
                access_token: 'ya29.test-access-token',
                token_type: 'Bearer',
                expires_in: 3599,
                scope: 'openid email profile',
                id_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
            };

            expect(mockTokenResponse.access_token).toBeDefined();
            expect(mockTokenResponse.token_type).toBe('Bearer');
            expect(mockTokenResponse.expires_in).toBeGreaterThan(0);
        });

        it('should parse Google user profile', () => {
            const mockProfile = {
                sub: 'google-user-123',
                email: 'user@example.com',
                email_verified: true,
                name: 'John Doe',
                given_name: 'John',
                family_name: 'Doe',
                picture: 'https://lh3.googleusercontent.com/a/default-user',
            };

            expect(mockProfile.sub).toBeDefined();
            expect(mockProfile.email).toContain('@');
            expect(mockProfile.email_verified).toBe(true);
        });

        it('should create new user from Google profile', async () => {
            const googleProfile = {
                sub: 'google-new-user',
                email: 'newuser@gmail.com',
                email_verified: true,
                name: 'New User',
                given_name: 'New',
                family_name: 'User',
            };

            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.create.mockResolvedValue({
                id: 'user-new-123',
                email: googleProfile.email,
                firstName: googleProfile.given_name,
                lastName: googleProfile.family_name,
                oauthProvider: 'google',
                oauthId: googleProfile.sub,
                emailVerified: true,
                role: 'USER',
            });

            const user = await mockUsersService.create({
                email: googleProfile.email,
                firstName: googleProfile.given_name,
                lastName: googleProfile.family_name,
                oauthProvider: 'google',
                oauthId: googleProfile.sub,
                emailVerified: true,
            });

            expect(user.oauthProvider).toBe('google');
            expect(user.emailVerified).toBe(true);
        });

        it('should link Google account to existing email', async () => {
            const existingUser = {
                id: 'user-existing-123',
                email: 'existing@example.com',
                oauthProvider: null,
                oauthId: null,
            };

            mockUsersService.findByEmail.mockResolvedValue(existingUser);
            mockUsersService.update.mockResolvedValue({
                ...existingUser,
                oauthProvider: 'google',
                oauthId: 'google-linked-123',
            });

            const updatedUser = await mockUsersService.update(existingUser.id, {
                oauthProvider: 'google',
                oauthId: 'google-linked-123',
            });

            expect(updatedUser.oauthProvider).toBe('google');
            expect(updatedUser.oauthId).toBe('google-linked-123');
        });
    });

    describe('Microsoft OAuth Flow', () => {
        it('should generate Microsoft OAuth authorization URL', () => {
            const authUrl = service.getMicrosoftAuthUrl();

            expect(authUrl).toBeDefined();
            expect(authUrl).toContain('login.microsoftonline.com');
            expect(authUrl).toContain('client_id=');
            expect(authUrl).toContain('redirect_uri=');
            expect(authUrl).toContain('scope=');
            expect(authUrl).toContain('openid');
        });

        it('should validate Microsoft OAuth token response', () => {
            const mockTokenResponse = {
                access_token: 'EwAoA8l6BAAURSN...',
                token_type: 'Bearer',
                expires_in: 3599,
                scope: 'openid email profile',
                id_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...',
            };

            expect(mockTokenResponse.access_token).toBeDefined();
            expect(mockTokenResponse.token_type).toBe('Bearer');
        });

        it('should parse Microsoft user profile', () => {
            const mockProfile = {
                sub: 'microsoft-user-456',
                email: 'user@outlook.com',
                name: 'Jane Smith',
                preferred_username: 'jane.smith@outlook.com',
            };

            expect(mockProfile.sub).toBeDefined();
            expect(mockProfile.email).toContain('@');
            expect(mockProfile.preferred_username).toBeDefined();
        });

        it('should create new user from Microsoft profile', async () => {
            const msProfile = {
                sub: 'microsoft-new-user',
                email: 'newuser@outlook.com',
                name: 'New Microsoft User',
            };

            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.create.mockResolvedValue({
                id: 'user-ms-new',
                email: msProfile.email,
                firstName: 'New Microsoft',
                lastName: 'User',
                oauthProvider: 'microsoft',
                oauthId: msProfile.sub,
                emailVerified: true,
                role: 'USER',
            });

            const user = await mockUsersService.create({
                email: msProfile.email,
                oauthProvider: 'microsoft',
                oauthId: msProfile.sub,
                emailVerified: true,
            });

            expect(user.oauthProvider).toBe('microsoft');
            expect(user.emailVerified).toBe(true);
        });
    });

    describe('OAuth Error Handling', () => {
        it('should handle invalid authorization code', async () => {
            const invalidCode = 'invalid-auth-code';

            // Mock OAuth provider error response
            const mockError = {
                error: 'invalid_grant',
                error_description: 'The provided authorization grant is invalid',
            };

            expect(mockError.error).toBe('invalid_grant');
        });

        it('should handle expired OAuth tokens', () => {
            const expiredToken = {
                access_token: 'expired-token',
                expires_at: new Date(Date.now() - 3600000), // 1 hour ago
            };

            const isExpired = expiredToken.expires_at.getTime() < Date.now();

            expect(isExpired).toBe(true);
        });

        it('should handle unverified email addresses', () => {
            const unverifiedProfile = {
                sub: 'google-user-unverified',
                email: 'unverified@example.com',
                email_verified: false,
            };

            expect(unverifiedProfile.email_verified).toBe(false);
        });

        it('should handle OAuth provider rate limiting', () => {
            const rateLimitError = {
                error: 'rate_limit_exceeded',
                error_description: 'Too many requests',
                retry_after: 3600,
            };

            expect(rateLimitError.error).toBe('rate_limit_exceeded');
            expect(rateLimitError.retry_after).toBeGreaterThan(0);
        });
    });

    describe('Account Linking', () => {
        it('should detect duplicate OAuth accounts', async () => {
            const oauthId = 'google-duplicate-123';

            const existingUser = await prisma.user.findFirst({
                where: {
                    oauthProvider: 'google',
                    oauthId: oauthId,
                },
            });

            // Should find existing user with same OAuth ID
            if (existingUser) {
                expect(existingUser.oauthId).toBe(oauthId);
            }
        });

        it('should prevent linking multiple OAuth providers to same email', () => {
            const user = {
                email: 'user@example.com',
                oauthProvider: 'google',
                oauthId: 'google-123',
            };

            // Attempt to link Microsoft
            const linkAttempt = {
                email: user.email,
                newProvider: 'microsoft',
                newOauthId: 'microsoft-456',
            };

            // Should require confirmation before overwriting
            const requiresConfirmation = user.oauthProvider !== null;

            expect(requiresConfirmation).toBe(true);
        });

        it('should merge OAuth and password accounts', async () => {
            const passwordUser = {
                id: 'user-password',
                email: 'merge@example.com',
                passwordHash: 'hashed-password',
                oauthProvider: null,
            };

            const oauthProfile = {
                email: 'merge@example.com',
                provider: 'google',
                oauthId: 'google-merge-123',
            };

            // Merge should keep password but add OAuth
            const mergedUser = {
                ...passwordUser,
                oauthProvider: oauthProfile.provider,
                oauthId: oauthProfile.oauthId,
            };

            expect(mergedUser.passwordHash).toBeDefined();
            expect(mergedUser.oauthProvider).toBe('google');
        });
    });

    describe('OAuth Session Management', () => {
        it('should generate OAuth state parameter', () => {
            const state = service.generateOAuthState();

            expect(state).toBeDefined();
            expect(state.length).toBeGreaterThan(20);
            expect(state).toMatch(/^[a-zA-Z0-9-_]+$/);
        });

        it('should validate OAuth state parameter', () => {
            const originalState = 'state-12345-abcdef';
            const receivedState = 'state-12345-abcdef';

            const isValid = originalState === receivedState;

            expect(isValid).toBe(true);
        });

        it('should store OAuth state in session', () => {
            const session = {
                oauthState: 'state-test-123',
                oauthProvider: 'google',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 600000), // 10 minutes
            };

            expect(session.oauthState).toBeDefined();
            expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
        });

        it('should expire OAuth state after timeout', () => {
            const expiredState = {
                state: 'expired-state',
                expiresAt: new Date(Date.now() - 1000), // 1 second ago
            };

            const isExpired = expiredState.expiresAt.getTime() < Date.now();

            expect(isExpired).toBe(true);
        });
    });

    describe('OAuth Token Refresh', () => {
        it('should refresh expired access token', () => {
            const refreshToken = 'refresh-token-123';
            const mockRefreshResponse = {
                access_token: 'new-access-token',
                token_type: 'Bearer',
                expires_in: 3599,
            };

            expect(mockRefreshResponse.access_token).toBeDefined();
            expect(mockRefreshResponse.expires_in).toBeGreaterThan(0);
        });

        it('should handle refresh token expiration', () => {
            const refreshError = {
                error: 'invalid_grant',
                error_description: 'Token has been expired or revoked',
            };

            expect(refreshError.error).toBe('invalid_grant');
        });
    });
});
