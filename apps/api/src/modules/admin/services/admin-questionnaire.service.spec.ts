import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AdminQuestionnaireService } from './admin-questionnaire.service';
import { PrismaService } from '@libs/database';
import { AdminAuditService } from './admin-audit.service';

describe('AdminQuestionnaireService', () => {
    let service: AdminQuestionnaireService;
    let prisma: PrismaService;
    let auditService: AdminAuditService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminQuestionnaireService,
                {
                    provide: PrismaService,
                    useValue: {
                        questionnaire: {
                            findMany: jest.fn(),
                            count: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                        },
                        section: {
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        question: {
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
                {
                    provide: AdminAuditService,
                    useValue: {
                        log: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AdminQuestionnaireService>(AdminQuestionnaireService);
        prisma = module.get<PrismaService>(PrismaService);
        auditService = module.get<AdminAuditService>(AdminAuditService);
    });

    describe('findAllQuestionnaires', () => {
        it('returns paginated questionnaires', async () => {
            const mockQuestionnaires = [
                { id: 'q1', name: 'Questionnaire 1', _count: { sections: 5, sessions: 10 } },
                { id: 'q2', name: 'Questionnaire 2', _count: { sections: 3, sessions: 5 } },
            ];

            jest.spyOn(prisma.questionnaire, 'findMany').mockResolvedValue(mockQuestionnaires as any);
            jest.spyOn(prisma.questionnaire, 'count').mockResolvedValue(2);

            const result = await service.findAllQuestionnaires({ skip: 0, limit: 10 });

            expect(result).toEqual({
                items: mockQuestionnaires,
                total: 2,
            });
        });
    });

    describe('findQuestionnaireById', () => {
        it('returns questionnaire with details', async () => {
            const mockQuestionnaire = {
                id: 'q1',
                name: 'Test Questionnaire',
                sections: [
                    {
                        id: 's1',
                        questions: [
                            { id: 'qu1', visibilityRules: [] },
                        ],
                    },
                ],
                _count: { sessions: 5 },
            };

            jest.spyOn(prisma.questionnaire, 'findUnique').mockResolvedValue(mockQuestionnaire as any);

            const result = await service.findQuestionnaireById('q1');

            expect(result).toEqual(mockQuestionnaire);
        });

        it('throws NotFoundException when questionnaire not found', async () => {
            jest.spyOn(prisma.questionnaire, 'findUnique').mockResolvedValue(null);

            await expect(service.findQuestionnaireById('nonexistent')).rejects.toThrow(NotFoundException);
        });
    });

    describe('createQuestionnaire', () => {
        it('creates questionnaire and logs audit', async () => {
            const dto = {
                name: 'New Questionnaire',
                description: 'Test description',
                industry: 'Technology',
                isDefault: false,
                estimatedTime: 30,
                metadata: { key: 'value' },
            };

            const mockQuestionnaire = { id: 'q-new', ...dto };

            jest.spyOn(prisma.questionnaire, 'create').mockResolvedValue(mockQuestionnaire as any);

            const result = await service.createQuestionnaire(dto, 'user-123');

            expect(result).toEqual(mockQuestionnaire);
            expect(auditService.log).toHaveBeenCalledWith({
                userId: 'user-123',
                action: 'CREATE_QUESTIONNAIRE',
                resourceType: 'Questionnaire',
                resourceId: 'q-new',
                changes: { after: mockQuestionnaire },
            });
        });
    });

    describe('updateQuestionnaire', () => {
        it('updates questionnaire and logs audit', async () => {
            const existing = { id: 'q1', name: 'Old Name' };
            const dto = { name: 'New Name', description: 'Updated' };
            const updated = { id: 'q1', name: 'New Name', description: 'Updated' };

            jest.spyOn(prisma.questionnaire, 'findUnique').mockResolvedValue(existing as any);
            jest.spyOn(prisma.questionnaire, 'update').mockResolvedValue(updated as any);

            const result = await service.updateQuestionnaire('q1', dto, 'user-123');

            expect(result).toEqual(updated);
            expect(auditService.log).toHaveBeenCalledWith({
                userId: 'user-123',
                action: 'UPDATE_QUESTIONNAIRE',
                resourceType: 'Questionnaire',
                resourceId: 'q1',
                changes: { before: existing, after: updated },
            });
        });

        it('throws NotFoundException when questionnaire not found', async () => {
            jest.spyOn(prisma.questionnaire, 'findUnique').mockResolvedValue(null);

            await expect(
                service.updateQuestionnaire('nonexistent', { name: 'Test' }, 'user-123'),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteQuestionnaire', () => {
        it('soft deletes questionnaire and logs audit', async () => {
            const existing = {
                id: 'q1',
                name: 'To Delete',
                _count: { sessions: 0 },
            };

            jest.spyOn(prisma.questionnaire, 'findUnique').mockResolvedValue(existing as any);
            jest.spyOn(prisma.questionnaire, 'update').mockResolvedValue({ ...existing, isActive: false } as any);

            await service.deleteQuestionnaire('q1', 'user-123');

            expect(prisma.questionnaire.update).toHaveBeenCalledWith({
                where: { id: 'q1' },
                data: { isActive: false },
            });

            expect(auditService.log).toHaveBeenCalledWith({
                userId: 'user-123',
                action: 'DELETE_QUESTIONNAIRE',
                resourceType: 'Questionnaire',
                resourceId: 'q1',
                changes: { before: existing },
            });
        });
    });
});
