import { Test, TestingModule } from '@nestjs/testing';
import { QuestionnaireService } from './questionnaire.service';
import { PrismaService } from '@libs/database';
import { NotFoundException } from '@nestjs/common';

describe('QuestionnaireService Integration Tests', () => {
    let service: QuestionnaireService;
    let prisma: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QuestionnaireService, PrismaService],
        }).compile();

        service = module.get<QuestionnaireService>(QuestionnaireService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Questionnaire CRUD Operations', () => {
        let testQuestionnaireId: string;

        afterEach(async () => {
            if (testQuestionnaireId) {
                await prisma.questionnaire.delete({ where: { id: testQuestionnaireId } });
                testQuestionnaireId = null as any;
            }
        });

        it('should create questionnaire with questions', async () => {
            const questionnaire = await prisma.questionnaire.create({
                data: {
                    name: 'Integration Test Questionnaire',
                    description: 'Full integration test',
                    version: '1.0',
                    isActive: true,
                },
            });
            testQuestionnaireId = questionnaire.id;

            // Add dimensions
            await prisma.dimensionCatalog.createMany({
                data: [
                    {
                        key: 'test-dim-1',
                        displayName: 'Test Dimension 1',
                        weight: 1.0,
                        orderIndex: 1,
                    },
                    {
                        key: 'test-dim-2',
                        displayName: 'Test Dimension 2',
                        weight: 1.0,
                        orderIndex: 2,
                    },
                ],
                skipDuplicates: true,
            });

            // Create section
            const section = await prisma.section.create({
                data: {
                    questionnaireId: testQuestionnaireId,
                    name: 'Test Section',
                    orderIndex: 1,
                },
            });

            // Add questions to section
            await prisma.question.createMany({
                data: [
                    {
                        sectionId: section.id,
                        dimensionKey: 'test-dim-1',
                        text: 'Test question 1',
                        type: 'TEXT',
                        isRequired: true,
                        severity: 0.7,
                        orderIndex: 1,
                    },
                    {
                        sectionId: section.id,
                        dimensionKey: 'test-dim-2',
                        text: 'Test question 2',
                        type: 'MULTIPLE_CHOICE',
                        isRequired: true,
                        severity: 0.8,
                        orderIndex: 2,
                    },
                ],
            });

            const questionsCount = await prisma.question.count({
                where: { sectionId: section.id },
            });

            expect(questionsCount).toBe(2);

            // Cleanup dimensions
            await prisma.dimensionCatalog.deleteMany({
                where: { key: { in: ['test-dim-1', 'test-dim-2'] } },
            });
        });

        it('should retrieve questionnaire with questions', async () => {
            const questionnaire = await prisma.questionnaire.create({
                data: {
                    name: 'Test Questionnaire',
                    description: 'Test',
                    version: 1,
                    isActive: true,
                },
            });
            testQuestionnaireId = questionnaire.id;

            await prisma.dimensionCatalog.create({
                data: {
                    key: 'test-dimension',
                    displayName: 'Test Dimension',
                    weight: 1.0,
                    orderIndex: 1,
                },
            });

            const section = await prisma.section.create({
                data: {
                    questionnaireId: testQuestionnaireId,
                    name: 'Test Section',
                    orderIndex: 1,
                },
            });

            await prisma.question.create({
                data: {
                    sectionId: section.id,
                    dimensionKey: 'test-dimension',
                    text: 'Test question',
                    type: 'TEXT',
                    isRequired: true,
                    severity: 0.5,
                    orderIndex: 1,
                },
            });

            const retrieved = await service.getQuestionById(testQuestionnaireId);

            expect(retrieved).toBeDefined();
            expect(retrieved.id).toBe(testQuestionnaireId);
            expect(retrieved.text).toBe('Test question');

            // Cleanup
            await prisma.dimensionCatalog.delete({ where: { key: 'test-dimension' } });
        });

        it('should list active questionnaires only', async () => {
            const active = await prisma.questionnaire.create({
                data: {
                    name: 'Active Questionnaire',
                    description: 'Active',
                    version: 1,
                    isActive: true,
                },
            });

            const inactive = await prisma.questionnaire.create({
                data: {
                    name: 'Inactive Questionnaire',
                    description: 'Inactive',
                    version: 1,
                    isActive: false,
                },
            });

            const activeQuestionnaires = await prisma.questionnaire.findMany({
                where: { isActive: true },
            });

            expect(activeQuestionnaires.some((q: any) => q.id === active.id)).toBe(true);
            expect(activeQuestionnaires.some((q: any) => q.id === inactive.id)).toBe(false);

            // Cleanup
            await prisma.questionnaire.delete({ where: { id: active.id } });
            await prisma.questionnaire.delete({ where: { id: inactive.id } });
        });
    });

    describe('Question Management', () => {
        let questionnaireId: string;
        let sectionId: string;
        let dimensionKey: string;

        beforeEach(async () => {
            const questionnaire = await prisma.questionnaire.create({
                data: {
                    name: 'Question Test Questionnaire',
                    description: 'For question tests',
                    version: 1,
                    isActive: true,
                },
            });
            questionnaireId = questionnaire.id;

            const section = await prisma.section.create({
                data: {
                    questionnaireId,
                    name: 'Test Section',
                    orderIndex: 1,
                },
            });
            sectionId = section.id;

            dimensionKey = `test-dim-${Date.now()}`;
            await prisma.dimensionCatalog.create({
                data: {
                    key: dimensionKey,
                    displayName: 'Test Dimension',
                    weight: 1.0,
                    orderIndex: 1,
                },
            });
        });

        afterEach(async () => {
            await prisma.dimensionCatalog.delete({ where: { key: dimensionKey } });
            await prisma.questionnaire.delete({ where: { id: questionnaireId } });
        });

        it('should maintain question order', async () => {
            const questions = await Promise.all([
                prisma.question.create({
                    data: {
                        sectionId,
                        dimensionKey,
                        text: 'Question 1',
                        type: 'TEXT',
                        isRequired: true,
                        severity: 0.5,
                        orderIndex: 1,
                    },
                }),
                prisma.question.create({
                    data: {
                        sectionId,
                        dimensionKey,
                        text: 'Question 2',
                        type: 'TEXT',
                        isRequired: true,
                        severity: 0.5,
                        orderIndex: 2,
                    },
                }),
                prisma.question.create({
                    data: {
                        sectionId,
                        dimensionKey,
                        text: 'Question 3',
                        type: 'TEXT',
                        isRequired: true,
                        severity: 0.5,
                        orderIndex: 3,
                    },
                }),
            ]);

            const retrieved = await prisma.question.findMany({
                where: { sectionId },
                orderBy: { orderIndex: 'asc' },
            });

            expect(retrieved).toHaveLength(3);
            expect(retrieved[0].orderIndex).toBe(1);
            expect(retrieved[1].orderIndex).toBe(2);
            expect(retrieved[2].orderIndex).toBe(3);
            expect(retrieved.map((q) => q.text)).toEqual([
                'Question 1',
                'Question 2',
                'Question 3',
            ]);
        });

        it('should support conditional logic', async () => {
            const parentQuestion = await prisma.question.create({
                data: {
                    sectionId,
                    dimensionKey,
                    text: 'Parent question',
                    type: 'SINGLE_CHOICE',
                    isRequired: true,
                    severity: 0.5,
                    orderIndex: 1,
                },
            });

            const conditionalQuestion = await prisma.question.create({
                data: {
                    sectionId,
                    dimensionKey,
                    text: 'Conditional question',
                    type: 'TEXT',
                    isRequired: true,
                    severity: 0.5,
                    orderIndex: 2,
                    metadata: {
                        conditionalLogic: {
                            rules: [
                                {
                                    questionId: parentQuestion.id,
                                    operator: 'equals',
                                    value: 'Yes',
                                },
                            ],
                        },
                    },
                },
            });

            const retrieved = await prisma.question.findUnique({
                where: { id: conditionalQuestion.id },
            });

            expect(retrieved?.metadata).toBeDefined();
            expect((retrieved?.metadata as any).conditionalLogic.rules).toHaveLength(1);
        });
    });

    describe('Data Relationships', () => {
        it('should enforce section-question relationship', async () => {
            await expect(
                prisma.question.create({
                    data: {
                        sectionId: 'non-existent-section',
                        dimensionKey: 'test-dim',
                        text: 'Test',
                        type: 'TEXT',
                        isRequired: true,
                        severity: 0.5,
                        orderIndex: 1,
                    },
                }),
            ).rejects.toThrow();
        });

        it('should delete questions when questionnaire is deleted', async () => {
            const questionnaire = await prisma.questionnaire.create({
                data: {
                    name: 'Delete Test',
                    description: 'Test cascade delete',
                    version: 1,
                    isActive: true,
                },
            });

            const section = await prisma.section.create({
                data: {
                    questionnaireId: questionnaire.id,
                    name: 'Test Section',
                    orderIndex: 1,
                },
            });

            const dimension = await prisma.dimensionCatalog.create({
                data: {
                    key: `cascade-test-${Date.now()}`,
                    displayName: 'Cascade Test',
                    weight: 1.0,
                    orderIndex: 1,
                },
            });

            await prisma.question.create({
                data: {
                    sectionId: section.id,
                    dimensionKey: dimension.key,
                    text: 'Question to delete',
                    type: 'TEXT',
                    isRequired: true,
                    severity: 0.5,
                    orderIndex: 1,
                },
            });

            const questionCount = await prisma.question.count({
                where: { sectionId: section.id },
            });
            expect(questionCount).toBe(1);

            // Delete questionnaire
            await prisma.questionnaire.delete({ where: { id: questionnaire.id } });

            // Verify questions are deleted (cascade delete via section)
            const questionCountAfter = await prisma.question.count({
                where: { sectionId: section.id },
            });
            expect(questionCountAfter).toBe(0);

            // Cleanup
            await prisma.dimensionCatalog.delete({ where: { key: dimension.key } });
        });
    });
});
