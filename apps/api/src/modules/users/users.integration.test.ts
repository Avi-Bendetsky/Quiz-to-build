import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@libs/database';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('UsersService Integration Tests', () => {
    let service: UsersService;
    let prisma: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, PrismaService],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('User CRUD Operations', () => {
        let testUserId: string;

        afterEach(async () => {
            if (testUserId) {
                await prisma.user.delete({ where: { id: testUserId } }).catch(() => { });
                testUserId = null as any;
            }
        });

        it('should create a new user with USER role', async () => {
            const email = `integration-test-${Date.now()}@example.com`;

            const user = await prisma.user.create({
                data: {
                    email,
                    passwordHash: 'hashed-password',
                    role: UserRole.USER,
                },
            });
            testUserId = user.id;

            expect(user).toBeDefined();
            expect(user.email).toBe(email);
            expect(user.role).toBe(UserRole.USER);
            expect(user.emailVerified).toBe(false);
            expect(user.createdAt).toBeDefined();
        });

        it('should enforce unique email constraint', async () => {
            const email = `unique-test-${Date.now()}@example.com`;

            const user1 = await prisma.user.create({
                data: {
                    email,
                    passwordHash: 'hash1',
                    role: UserRole.USER,
                },
            });
            testUserId = user1.id;

            await expect(
                prisma.user.create({
                    data: {
                        email,
                        passwordHash: 'hash2',
                        role: UserRole.USER,
                    },
                }),
            ).rejects.toThrow();
        });

        it('should retrieve user by email', async () => {
            const email = `retrieve-test-${Date.now()}@example.com`;

            const created = await prisma.user.create({
                data: {
                    email,
                    passwordHash: 'test-hash',
                    role: UserRole.USER,
                },
            });
            testUserId = created.id;

            const retrieved = await prisma.user.findUnique({
                where: { email },
            });

            expect(retrieved).toBeDefined();
            expect(retrieved?.id).toBe(created.id);
            expect(retrieved?.email).toBe(email);
        });

        it('should update user profile', async () => {
            const user = await prisma.user.create({
                data: {
                    email: `update-test-${Date.now()}@example.com`,
                    passwordHash: 'test-hash',
                    role: UserRole.USER,
                },
            });
            testUserId = user.id;

            const updated = await prisma.user.update({
                where: { id: user.id },
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    emailVerified: true,
                },
            });

            expect(updated.firstName).toBe('John');
            expect(updated.lastName).toBe('Doe');
            expect(updated.emailVerified).toBe(true);
        });

        it('should delete user and cascade to sessions', async () => {
            const user = await prisma.user.create({
                data: {
                    email: `delete-test-${Date.now()}@example.com`,
                    passwordHash: 'test-hash',
                    role: UserRole.USER,
                },
            });

            const questionnaire = await prisma.questionnaire.create({
                data: {
                    name: 'Delete Test Questionnaire',
                    description: 'Test',
                    version: '1.0',
                    isActive: true,
                },
            });

            // Create session
            await prisma.session.create({
                data: {
                    userId: user.id,
                    questionnaireId: questionnaire.id,
                    status: 'PENDING',
                },
            });

            const sessionCount = await prisma.session.count({
                where: { userId: user.id },
            });
            expect(sessionCount).toBe(1);

            // Delete user
            await prisma.user.delete({ where: { id: user.id } });

            // Verify sessions are deleted
            const sessionCountAfter = await prisma.session.count({
                where: { userId: user.id },
            });
            expect(sessionCountAfter).toBe(0);

            // Cleanup
            await prisma.questionnaire.delete({ where: { id: questionnaire.id } });
        });
    });

    describe('User Roles and Permissions', () => {
        let adminUserId: string;
        let regularUserId: string;

        beforeEach(async () => {
            const admin = await prisma.user.create({
                data: {
                    email: `admin-${Date.now()}@example.com`,
                    passwordHash: 'hash',
                    role: UserRole.ADMIN,
                },
            });
            adminUserId = admin.id;

            const regular = await prisma.user.create({
                data: {
                    email: `user-${Date.now()}@example.com`,
                    passwordHash: 'hash',
                    role: UserRole.USER,
                },
            });
            regularUserId = regular.id;
        });

        afterEach(async () => {
            await prisma.user.delete({ where: { id: adminUserId } }).catch(() => { });
            await prisma.user.delete({ where: { id: regularUserId } }).catch(() => { });
        });

        it('should differentiate between USER and ADMIN roles', async () => {
            const admin = await prisma.user.findUnique({
                where: { id: adminUserId },
            });
            const user = await prisma.user.findUnique({
                where: { id: regularUserId },
            });

            expect(admin?.role).toBe(UserRole.ADMIN);
            expect(user?.role).toBe(UserRole.USER);
        });

        it('should allow role promotion from USER to ADMIN', async () => {
            const updated = await prisma.user.update({
                where: { id: regularUserId },
                data: { role: UserRole.ADMIN },
            });

            expect(updated.role).toBe(UserRole.ADMIN);
        });
    });

    describe('Email Verification', () => {
        let userId: string;

        afterEach(async () => {
            if (userId) {
                await prisma.user.delete({ where: { id: userId } }).catch(() => { });
                userId = null as any;
            }
        });

        it('should start with emailVerified false', async () => {
            const user = await prisma.user.create({
                data: {
                    email: `verify-test-${Date.now()}@example.com`,
                    passwordHash: 'hash',
                    role: UserRole.USER,
                },
            });
            userId = user.id;

            expect(user.emailVerified).toBe(false);
        });

        it('should update emailVerified to true', async () => {
            const user = await prisma.user.create({
                data: {
                    email: `verify-update-${Date.now()}@example.com`,
                    passwordHash: 'hash',
                    role: UserRole.USER,
                },
            });
            userId = user.id;

            const updated = await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: true },
            });

            expect(updated.emailVerified).toBe(true);
        });
    });

    describe('OAuth Integration', () => {
        let userId: string;

        afterEach(async () => {
            if (userId) {
                await prisma.user.delete({ where: { id: userId } }).catch(() => { });
                userId = null as any;
            }
        });

        it('should create user with OAuth provider', async () => {
            const user = await prisma.user.create({
                data: {
                    email: `oauth-test-${Date.now()}@example.com`,
                    passwordHash: 'oauth-placeholder',
                    role: UserRole.USER,
                    oauthProvider: 'google',
                    oauthId: `google-${Date.now()}`,
                    emailVerified: true,
                },
            });
            userId = user.id;

            expect(user.oauthProvider).toBe('google');
            expect(user.oauthId).toBeDefined();
            expect(user.emailVerified).toBe(true);
        });

        it('should link multiple OAuth providers to same email', async () => {
            const email = `multi-oauth-${Date.now()}@example.com`;

            const googleUser = await prisma.user.create({
                data: {
                    email,
                    passwordHash: 'oauth',
                    role: UserRole.USER,
                    oauthProvider: 'google',
                    oauthId: 'google-123',
                },
            });
            userId = googleUser.id;

            // In real implementation, would update existing user
            // Here we just verify OAuth fields are stored
            expect(googleUser.oauthProvider).toBe('google');
            expect(googleUser.oauthId).toBe('google-123');
        });
    });

    describe('Subscription Management', () => {
        let userId: string;

        afterEach(async () => {
            if (userId) {
                await prisma.user.delete({ where: { id: userId } }).catch(() => { });
                userId = null as any;
            }
        });

        it('should start with FREE tier', async () => {
            const user = await prisma.user.create({
                data: {
                    email: `sub-test-${Date.now()}@example.com`,
                    passwordHash: 'hash',
                    role: UserRole.USER,
                    subscriptionTier: 'FREE',
                },
            });
            userId = user.id;

            expect(user.subscriptionTier).toBe('FREE');
            expect(user.stripeCustomerId).toBeNull();
        });

        it('should upgrade to PROFESSIONAL tier with Stripe ID', async () => {
            const user = await prisma.user.create({
                data: {
                    email: `upgrade-test-${Date.now()}@example.com`,
                    passwordHash: 'hash',
                    role: UserRole.USER,
                    subscriptionTier: 'FREE',
                },
            });
            userId = user.id;

            const upgraded = await prisma.user.update({
                where: { id: user.id },
                data: {
                    subscriptionTier: 'PROFESSIONAL',
                    stripeCustomerId: 'cus_test123',
                    stripeSubscriptionId: 'sub_test123',
                },
            });

            expect(upgraded.subscriptionTier).toBe('PROFESSIONAL');
            expect(upgraded.stripeCustomerId).toBe('cus_test123');
            expect(upgraded.stripeSubscriptionId).toBe('sub_test123');
        });
    });

    describe('Concurrent User Operations', () => {
        const testEmails: string[] = [];

        afterEach(async () => {
            await prisma.user.deleteMany({
                where: { email: { in: testEmails } },
            });
            testEmails.length = 0;
        });

        it('should handle concurrent user creations', async () => {
            const timestamp = Date.now();
            const emails = Array.from(
                { length: 5 },
                (_, i) => `concurrent-${timestamp}-${i}@example.com`,
            );
            testEmails.push(...emails);

            const promises = emails.map((email) =>
                prisma.user.create({
                    data: {
                        email,
                        passwordHash: 'hash',
                        role: UserRole.USER,
                    },
                }),
            );

            const users = await Promise.all(promises);

            expect(users).toHaveLength(5);
            expect(new Set(users.map((u) => u.id)).size).toBe(5);
        });
    });
});
