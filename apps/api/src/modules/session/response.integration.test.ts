import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@libs/database';
import { SessionStatus, CoverageLevel } from '@prisma/client';

describe('Response Integration Tests', () => {
    let prisma: PrismaService;
    let testUserId: string;
    let testQuestionnaireId: string;
    let testSessionId: string;
    let testQuestionId: string;
    let testDimensionKey: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrismaService],
        }).compile();

        prisma = module.get<PrismaService>(PrismaService);

        // Setup test data
        const user = await prisma.user.create({
            data: {
                email: `response-test-${Date.now()}@example.com`,
                passwordHash: 'test-hash',
                role: 'USER',
            },
        });
        testUserId = user.id;

        const questionnaire = await prisma.questionnaire.create({
            data: {
                name: 'Response Test Questionnaire',
                description: 'For response integration tests',
                version: '1.0',
                isActive: true,
            },
        });
        testQuestionnaireId = questionnaire.id;

        const session = await prisma.session.create({
            data: {
                userId: testUserId,
                questionnaireId: testQuestionnaireId,
                status: SessionStatus.IN_PROGRESS,
            },
        });
        testSessionId = session.id;

        testDimensionKey = `response-test-${Date.now()}`;
        await prisma.dimension.create({
            data: {
                key: testDimensionKey,
                displayName: 'Response Test Dimension',
                weight: 1.0,
            },
        });

        const question = await prisma.question.create({
            data: {
                questionnaireId: testQuestionnaireId,
                dimensionKey: testDimensionKey,
                text: 'Test question for responses',
                questionType: 'TEXT',
                isRequired: true,
                severity: 0.7,
                order: 1,
            },
        });
        testQuestionId = question.id;
    });

    afterAll(async () => {
        await prisma.response.deleteMany({ where: { sessionId: testSessionId } });
        await prisma.session.delete({ where: { id: testSessionId } });
        await prisma.dimension.delete({ where: { key: testDimensionKey } });
        await prisma.questionnaire.delete({ where: { id: testQuestionnaireId } });
        await prisma.user.delete({ where: { id: testUserId } });
        await prisma.$disconnect();
    });

    describe('Response Creation and Updates', () => {
        afterEach(async () => {
            await prisma.response.deleteMany({
                where: { sessionId: testSessionId, questionId: testQuestionId },
            });
        });

        it('should create response with NONE coverage', async () => {
            const response = await prisma.response.create({
                data: {
                    sessionId: testSessionId,
                    questionId: testQuestionId,
                    value: 'Test answer',
                    isValid: true,
                    coverage: 0.0,
                    coverageLevel: CoverageLevel.NONE,
                },
            });

            expect(response).toBeDefined();
            expect(response.coverage).toBe(0.0);
            expect(response.coverageLevel).toBe(CoverageLevel.NONE);
            expect(response.value).toBe('Test answer');
        });

        it('should update response with higher coverage level', async () => {
            const response = await prisma.response.create({
                data: {
                    sessionId: testSessionId,
                    questionId: testQuestionId,
                    value: 'Initial answer',
                    isValid: true,
                    coverage: 0.0,
                    coverageLevel: CoverageLevel.NONE,
                },
            });

            const updated = await prisma.response.update({
                where: { id: response.id },
                data: {
                    value: 'Updated answer with evidence',
                    coverage: 0.75,
                    coverageLevel: CoverageLevel.SUBSTANTIAL,
                },
            });

            expect(updated.coverage).toBe(0.75);
            expect(updated.coverageLevel).toBe(CoverageLevel.SUBSTANTIAL);
            expect(updated.value).toBe('Updated answer with evidence');
        });

        it('should track response history through updatedAt', async () => {
            const response = await prisma.response.create({
                data: {
                    sessionId: testSessionId,
                    questionId: testQuestionId,
                    value: 'Original',
                    isValid: true,
                    coverage: 0.0,
                    coverageLevel: CoverageLevel.NONE,
                },
            });

            const originalTimestamp = response.updatedAt;

            await new Promise((resolve) => setTimeout(resolve, 100));

            const updated = await prisma.response.update({
                where: { id: response.id },
                data: { value: 'Modified' },
            });

            expect(updated.updatedAt.getTime()).toBeGreaterThan(
                originalTimestamp.getTime(),
            );
        });
    });

    describe('Coverage Level Progression', () => {
        afterEach(async () => {
            await prisma.response.deleteMany({
                where: { sessionId: testSessionId },
            });
        });

        it('should progress through coverage levels: NONE → PARTIAL → HALF → SUBSTANTIAL → FULL', async () => {
            const response = await prisma.response.create({
                data: {
                    sessionId: testSessionId,
                    questionId: testQuestionId,
                    value: 'Initial',
                    isValid: true,
                    coverage: 0.0,
                    coverageLevel: CoverageLevel.NONE,
                },
            });

            // NONE → PARTIAL
            let updated = await prisma.response.update({
                where: { id: response.id },
                data: { coverage: 0.25, coverageLevel: CoverageLevel.PARTIAL },
            });
            expect(updated.coverageLevel).toBe(CoverageLevel.PARTIAL);

            // PARTIAL → HALF
            updated = await prisma.response.update({
                where: { id: response.id },
                data: { coverage: 0.5, coverageLevel: CoverageLevel.HALF },
            });
            expect(updated.coverageLevel).toBe(CoverageLevel.HALF);

            // HALF → SUBSTANTIAL
            updated = await prisma.response.update({
                where: { id: response.id },
                data: { coverage: 0.75, coverageLevel: CoverageLevel.SUBSTANTIAL },
            });
            expect(updated.coverageLevel).toBe(CoverageLevel.SUBSTANTIAL);

            // SUBSTANTIAL → FULL
            updated = await prisma.response.update({
                where: { id: response.id },
                data: { coverage: 1.0, coverageLevel: CoverageLevel.FULL },
            });
            expect(updated.coverageLevel).toBe(CoverageLevel.FULL);
        });

        it('should validate coverage matches level', async () => {
            const validCombinations = [
                { coverage: 0.0, level: CoverageLevel.NONE },
                { coverage: 0.25, level: CoverageLevel.PARTIAL },
                { coverage: 0.5, level: CoverageLevel.HALF },
                { coverage: 0.75, level: CoverageLevel.SUBSTANTIAL },
                { coverage: 1.0, level: CoverageLevel.FULL },
            ];

            for (const combo of validCombinations) {
                const response = await prisma.response.create({
                    data: {
                        sessionId: testSessionId,
                        questionId: testQuestionId,
                        value: `Test ${combo.level}`,
                        isValid: true,
                        coverage: combo.coverage,
                        coverageLevel: combo.level,
                    },
                });

                expect(response.coverage).toBe(combo.coverage);
                expect(response.coverageLevel).toBe(combo.level);

                await prisma.response.delete({ where: { id: response.id } });
            }
        });
    });

    describe('Session-Response Relationships', () => {
        it('should retrieve all responses for a session', async () => {
            // Create multiple questions
            const questions = await Promise.all([
                prisma.question.create({
                    data: {
                        questionnaireId: testQuestionnaireId,
                        dimensionKey: testDimensionKey,
                        text: 'Question 1',
                        questionType: 'TEXT',
                        isRequired: true,
                        severity: 0.5,
                        order: 2,
                    },
                }),
                prisma.question.create({
                    data: {
                        questionnaireId: testQuestionnaireId,
                        dimensionKey: testDimensionKey,
                        text: 'Question 2',
                        questionType: 'TEXT',
                        isRequired: true,
                        severity: 0.5,
                        order: 3,
                    },
                }),
            ]);

            // Create responses
            await Promise.all(
                questions.map((q) =>
                    prisma.response.create({
                        data: {
                            sessionId: testSessionId,
                            questionId: q.id,
                            value: `Answer for ${q.text}`,
                            isValid: true,
                            coverage: 0.5,
                            coverageLevel: CoverageLevel.HALF,
                        },
                    }),
                ),
            );

            const responses = await prisma.response.findMany({
                where: { sessionId: testSessionId },
                include: { question: true },
            });

            expect(responses.length).toBeGreaterThanOrEqual(2);
            expect(responses.every((r) => r.sessionId === testSessionId)).toBe(true);

            // Cleanup
            await prisma.response.deleteMany({
                where: { questionId: { in: questions.map((q) => q.id) } },
            });
            await prisma.question.deleteMany({
                where: { id: { in: questions.map((q) => q.id) } },
            });
        });

        it('should calculate session progress from responses', async () => {
            const totalQuestions = await prisma.question.count({
                where: { 
                    section: {
                        questionnaireId: testQuestionnaireId 
                    }
                },
            });

            const answeredQuestions = await prisma.response.count({
                where: { sessionId: testSessionId, isValid: true },
            });

            const progress = (answeredQuestions / totalQuestions) * 100;

            expect(progress).toBeGreaterThanOrEqual(0);
            expect(progress).toBeLessThanOrEqual(100);
        });
    });

    describe('Transaction Consistency', () => {
        it('should maintain response count consistency in transactions', async () => {
            const initialCount = await prisma.response.count({
                where: { sessionId: testSessionId },
            });

            let createdResponses: { id: string }[] = [];

            await prisma.$transaction(async (tx) => {
                const response1 = await tx.response.create({
                    data: {
                        sessionId: testSessionId,
                        questionId: testQuestionId,
                        value: 'Transaction test 1',
                        isValid: true,
                        coverage: 0.0,
                        coverageLevel: CoverageLevel.NONE,
                    },
                });

                const response2 = await tx.response.create({
                    data: {
                        sessionId: testSessionId,
                        questionId: testQuestionId,
                        value: 'Transaction test 2',
                        isValid: true,
                        coverage: 0.25,
                        coverageLevel: CoverageLevel.PARTIAL,
                    },
                });

                createdResponses = [response1, response2];
            });

            const finalCount = await prisma.response.count({
                where: { sessionId: testSessionId },
            });

            expect(finalCount).toBe(initialCount + 2);

            // Cleanup
            await prisma.response.deleteMany({
                where: {
                    id: { in: createdResponses.map((r) => r.id) },
                },
            });
        });
    });
});
