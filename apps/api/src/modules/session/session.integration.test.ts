import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { PrismaService } from '@libs/database';
import { SessionStatus } from '@prisma/client';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('SessionService Integration Tests', () => {
    let service: SessionService;
    let prisma: PrismaService;
    let testUserId: string;
    let testQuestionnaireId: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SessionService, PrismaService],
        }).compile();

        service = module.get<SessionService>(SessionService);
        prisma = module.get<PrismaService>(PrismaService);

        // Create test user
        const user = await prisma.user.create({
            data: {
                email: `test-${Date.now()}@example.com`,
                passwordHash: 'test-hash',
                role: 'USER',
            },
        });
        testUserId = user.id;

        // Create test questionnaire
        const questionnaire = await prisma.questionnaire.create({
            data: {
                name: 'Test Questionnaire',
                description: 'Integration test questionnaire',
                version: '1.0',
                isActive: true,
            },
        });
        testQuestionnaireId = questionnaire.id;
    });

    afterAll(async () => {
        // Cleanup
        await prisma.session.deleteMany({ where: { userId: testUserId } });
        await prisma.questionnaire.delete({ where: { id: testQuestionnaireId } });
        await prisma.user.delete({ where: { id: testUserId } });
        await prisma.$disconnect();
    });

    describe('Session Creation and Retrieval', () => {
        it('should create a new session with PENDING status', async () => {
            const session = await service.createSession({
                questionnaireId: testQuestionnaireId,
                userId: testUserId,
            });

            expect(session).toBeDefined();
            expect(session.userId).toBe(testUserId);
            expect(session.questionnaireId).toBe(testQuestionnaireId);
            expect(session.status).toBe(SessionStatus.PENDING);
            expect(session.readinessScore).toBeNull();
        });

        it('should retrieve session by id', async () => {
            const created = await service.createSession({
                questionnaireId: testQuestionnaireId,
                userId: testUserId,
            });

            const retrieved = await service.getSessionById(created.id, testUserId);

            expect(retrieved).toBeDefined();
            expect(retrieved.id).toBe(created.id);
            expect(retrieved.userId).toBe(testUserId);
        });

        it('should throw NotFoundException for non-existent session', async () => {
            await expect(
                service.getSessionById('non-existent-id', testUserId),
            ).rejects.toThrow(NotFoundException);
        });

        it('should list all user sessions', async () => {
            // Create multiple sessions
            await service.createSession({
                questionnaireId: testQuestionnaireId,
                userId: testUserId,
            });
            await service.createSession({
                questionnaireId: testQuestionnaireId,
                userId: testUserId,
            });

            const sessions = await service.getUserSessions(testUserId);

            expect(sessions.length).toBeGreaterThanOrEqual(2);
            expect(sessions.every((s) => s.userId === testUserId)).toBe(true);
        });
    });

    describe('Session Status Transitions', () => {
        it('should transition from PENDING to IN_PROGRESS', async () => {
            const session = await service.createSession({
                questionnaireId: testQuestionnaireId,
                userId: testUserId,
            });

            const updated = await prisma.session.update({
                where: { id: session.id },
                data: { status: SessionStatus.IN_PROGRESS },
            });

            expect(updated.status).toBe(SessionStatus.IN_PROGRESS);
        });

        it('should transition to COMPLETED with readiness score', async () => {
            const session = await service.createSession({
                questionnaireId: testQuestionnaireId,
                userId: testUserId,
            });

            const updated = await prisma.session.update({
                where: { id: session.id },
                data: {
                    status: SessionStatus.COMPLETED,
                    readinessScore: 85.5,
                    completedAt: new Date(),
                },
            });

            expect(updated.status).toBe(SessionStatus.COMPLETED);
            expect(updated.readinessScore).toBe(85.5);
            expect(updated.completedAt).toBeDefined();
        });
    });

    describe('Transaction Handling', () => {
        it('should rollback on transaction failure', async () => {
            const sessionCountBefore = await prisma.session.count({
                where: { userId: testUserId },
            });

            try {
                await prisma.$transaction(async (tx) => {
                    await tx.session.create({
                        data: {
                            userId: testUserId,
                            questionnaireId: testQuestionnaireId,
                            status: SessionStatus.PENDING,
                        },
                    });

                    // Force transaction failure
                    throw new Error('Simulated failure');
                });
            } catch (error) {
                // Expected error
            }

            const sessionCountAfter = await prisma.session.count({
                where: { userId: testUserId },
            });

            expect(sessionCountAfter).toBe(sessionCountBefore);
        });

        it('should commit successful transaction', async () => {
            const sessionCountBefore = await prisma.session.count({
                where: { userId: testUserId },
            });

            await prisma.$transaction(async (tx) => {
                await tx.session.create({
                    data: {
                        userId: testUserId,
                        questionnaireId: testQuestionnaireId,
                        status: SessionStatus.PENDING,
                    },
                });
            });

            const sessionCountAfter = await prisma.session.count({
                where: { userId: testUserId },
            });

            expect(sessionCountAfter).toBe(sessionCountBefore + 1);
        });
    });

    describe('Data Integrity', () => {
        it('should enforce foreign key constraints', async () => {
            await expect(
                prisma.session.create({
                    data: {
                        userId: 'non-existent-user',
                        questionnaireId: testQuestionnaireId,
                        status: SessionStatus.PENDING,
                    },
                }),
            ).rejects.toThrow();
        });

        it('should cascade delete related responses on session delete', async () => {
            const session = await service.createSession({
                questionnaireId: testQuestionnaireId,
                userId: testUserId,
            });

            // Create a question
            const question = await prisma.question.create({
                data: {
                    questionnaireId: testQuestionnaireId,
                    dimensionKey: 'test-dimension',
                    text: 'Test question',
                    questionType: 'TEXT',
                    isRequired: true,
                    severity: 0.5,
                    order: 1,
                },
            });

            // Create a response
            await prisma.response.create({
                data: {
                    sessionId: session.id,
                    questionId: question.id,
                    value: 'Test answer',
                    isValid: true,
                },
            });

            const responseCount = await prisma.response.count({
                where: { sessionId: session.id },
            });
            expect(responseCount).toBe(1);

            // Delete session
            await prisma.session.delete({ where: { id: session.id } });

            // Verify responses are deleted
            const responseCountAfter = await prisma.response.count({
                where: { sessionId: session.id },
            });
            expect(responseCountAfter).toBe(0);

            // Cleanup question
            await prisma.question.delete({ where: { id: question.id } });
        });
    });

    describe('Concurrent Access', () => {
        it('should handle concurrent session creation for same user', async () => {
            const promises = Array.from({ length: 5 }, () =>
                service.createSession({
                    questionnaireId: testQuestionnaireId,
                    userId: testUserId,
                }),
            );

            const sessions = await Promise.all(promises);

            expect(sessions).toHaveLength(5);
            expect(new Set(sessions.map((s) => s.id)).size).toBe(5);
        });

        it('should handle concurrent updates to same session', async () => {
            const session = await service.createSession({
                questionnaireId: testQuestionnaireId,
                userId: testUserId,
            });

            const promises = Array.from({ length: 3 }, (_, i) =>
                prisma.session.update({
                    where: { id: session.id },
                    data: { readinessScore: 50 + i * 10 },
                }),
            );

            await Promise.all(promises);

            const updated = await prisma.session.findUnique({
                where: { id: session.id },
            });

            expect(updated?.readinessScore).toBeGreaterThanOrEqual(50);
            expect(updated?.readinessScore).toBeLessThanOrEqual(70);
        });
    });
});
