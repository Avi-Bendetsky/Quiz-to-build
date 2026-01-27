import { Test, TestingModule } from '@nestjs/testing';
import { ScoringService, QuestionScore, DimensionResult } from './scoring.service';
import { PrismaService } from '@libs/database';
import { Decimal } from '@prisma/client/runtime/library';

describe('ScoringService', () => {
    let service: ScoringService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ScoringService,
                {
                    provide: PrismaService,
                    useValue: {
                        session: {
                            findUnique: jest.fn(),
                            update: jest.fn(),
                        },
                        dimensionCatalog: {
                            findMany: jest.fn(),
                        },
                        question: {
                            findMany: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<ScoringService>(ScoringService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    describe('calculateDimensionResidual', () => {
        it('should return 0 when all questions have full coverage', () => {
            const questions: QuestionScore[] = [
                { id: '1', text: 'Q1', dimensionKey: 'arch_sec', severity: 0.8, coverage: 1.0, persona: 'CTO', isAnswered: true },
                { id: '2', text: 'Q2', dimensionKey: 'arch_sec', severity: 0.6, coverage: 1.0, persona: 'CTO', isAnswered: true },
            ];

            const residual = service.calculateDimensionResidual(questions);

            expect(residual).toBe(0);
        });

        it('should return ~1 when all questions have zero coverage', () => {
            const questions: QuestionScore[] = [
                { id: '1', text: 'Q1', dimensionKey: 'arch_sec', severity: 0.8, coverage: 0, persona: 'CTO', isAnswered: false },
                { id: '2', text: 'Q2', dimensionKey: 'arch_sec', severity: 0.6, coverage: 0, persona: 'CTO', isAnswered: false },
            ];

            const residual = service.calculateDimensionResidual(questions);

            // Should be close to 1.0 (with epsilon adjustment)
            expect(residual).toBeGreaterThan(0.99);
            expect(residual).toBeLessThan(1.01);
        });

        it('should calculate weighted residual correctly with mixed coverage', () => {
            const questions: QuestionScore[] = [
                { id: '1', text: 'Q1', dimensionKey: 'arch_sec', severity: 0.8, coverage: 0.5, persona: 'CTO', isAnswered: true }, // 0.8 * (1 - 0.5) = 0.4
                { id: '2', text: 'Q2', dimensionKey: 'arch_sec', severity: 0.6, coverage: 0.75, persona: 'CTO', isAnswered: true }, // 0.6 * (1 - 0.75) = 0.15
            ];

            const residual = service.calculateDimensionResidual(questions);

            // (0.4 + 0.15) / (0.8 + 0.6) = 0.55 / 1.4 ≈ 0.393
            expect(residual).toBeCloseTo(0.393, 2);
        });

        it('should handle empty questions array', () => {
            const questions: QuestionScore[] = [];

            const residual = service.calculateDimensionResidual(questions);

            // Should return 0 (0 / epsilon ≈ 0)
            expect(residual).toBeCloseTo(0, 4);
        });

        it('should handle questions with zero severity', () => {
            const questions: QuestionScore[] = [
                { id: '1', text: 'Q1', dimensionKey: 'arch_sec', severity: 0, coverage: 0, persona: 'CTO', isAnswered: false },
                { id: '2', text: 'Q2', dimensionKey: 'arch_sec', severity: 0, coverage: 0.5, persona: 'CTO', isAnswered: true },
            ];

            const residual = service.calculateDimensionResidual(questions);

            // Should handle without error (epsilon prevents division by zero)
            expect(residual).toBeDefined();
            expect(residual).toBeGreaterThanOrEqual(0);
        });
    });

    describe('calculatePortfolioResidual', () => {
        it('should calculate weighted sum of dimension residuals', () => {
            const dimensions: DimensionResult[] = [
                {
                    key: 'arch_sec',
                    displayName: 'Architecture & Security',
                    weight: 0.15,
                    residual: 0.2,
                    questionCount: 10,
                    answeredCount: 8,
                    coverageAverage: 0.8,
                },
                {
                    key: 'devops_iac',
                    displayName: 'DevOps & Infrastructure',
                    weight: 0.12,
                    residual: 0.1,
                    questionCount: 8,
                    answeredCount: 6,
                    coverageAverage: 0.75,
                },
            ];

            const residual = service.calculatePortfolioResidual(dimensions);

            // (0.15 * 0.2) + (0.12 * 0.1) = 0.03 + 0.012 = 0.042
            expect(residual).toBeCloseTo(0.042, 3);
        });

        it('should return 0 when all dimensions have zero residual', () => {
            const dimensions: DimensionResult[] = [
                {
                    key: 'arch_sec',
                    displayName: 'Architecture & Security',
                    weight: 0.15,
                    residual: 0,
                    questionCount: 10,
                    answeredCount: 10,
                    coverageAverage: 1.0,
                },
                {
                    key: 'devops_iac',
                    displayName: 'DevOps & Infrastructure',
                    weight: 0.12,
                    residual: 0,
                    questionCount: 8,
                    answeredCount: 8,
                    coverageAverage: 1.0,
                },
            ];

            const residual = service.calculatePortfolioResidual(dimensions);

            expect(residual).toBe(0);
        });

        it('should handle empty dimensions array', () => {
            const dimensions: DimensionResult[] = [];

            const residual = service.calculatePortfolioResidual(dimensions);

            expect(residual).toBe(0);
        });
    });

    describe('calculateReadinessScore', () => {
        it('should return 100 when portfolio residual is 0', () => {
            const score = service.calculateReadinessScore(0);

            expect(score).toBe(100);
        });

        it('should return 0 when portfolio residual is 1', () => {
            const score = service.calculateReadinessScore(1);

            expect(score).toBe(0);
        });

        it('should return 91.2 when portfolio residual is 0.088', () => {
            const score = service.calculateReadinessScore(0.088);

            expect(score).toBeCloseTo(91.2, 1);
        });

        it('should return 95 when portfolio residual is 0.05', () => {
            const score = service.calculateReadinessScore(0.05);

            expect(score).toBe(95);
        });

        it('should handle fractional residuals correctly', () => {
            const score = service.calculateReadinessScore(0.123456);

            expect(score).toBeCloseTo(87.6544, 4);
        });
    });

    describe('calculateNextActions', () => {
        const mockDimensions: DimensionResult[] = [
            {
                key: 'arch_sec',
                displayName: 'Architecture & Security',
                weight: 0.15,
                residual: 0.2,
                questionCount: 10,
                answeredCount: 8,
                coverageAverage: 0.8,
            },
            {
                key: 'finance',
                displayName: 'Finance & Economics',
                weight: 0.10,
                residual: 0.3,
                questionCount: 5,
                answeredCount: 3,
                coverageAverage: 0.6,
            },
        ];

        it('should rank questions by delta score descending', () => {
            const questions: QuestionScore[] = [
                { id: '1', text: 'Q1', dimensionKey: 'arch_sec', severity: 0.8, coverage: 0, persona: 'CTO', isAnswered: false },
                { id: '2', text: 'Q2', dimensionKey: 'arch_sec', severity: 0.5, coverage: 0, persona: 'CTO', isAnswered: false },
                { id: '3', text: 'Q3', dimensionKey: 'finance', severity: 0.9, coverage: 0, persona: 'CFO', isAnswered: false },
            ];

            const actions = service.calculateNextActions(mockDimensions, questions, 10);

            // Should be sorted by delta score descending
            expect(actions.length).toBe(3);
            for (let i = 1; i < actions.length; i++) {
                expect(actions[i - 1].deltaScore).toBeGreaterThanOrEqual(actions[i].deltaScore);
            }
        });

        it('should only include unanswered or under-covered questions', () => {
            const questions: QuestionScore[] = [
                { id: '1', text: 'Q1', dimensionKey: 'arch_sec', severity: 0.8, coverage: 1.0, persona: 'CTO', isAnswered: true },
                { id: '2', text: 'Q2', dimensionKey: 'arch_sec', severity: 0.5, coverage: 0.5, persona: 'CTO', isAnswered: true },
                { id: '3', text: 'Q3', dimensionKey: 'finance', severity: 0.9, coverage: 0, persona: 'CFO', isAnswered: false },
            ];

            const actions = service.calculateNextActions(mockDimensions, questions, 10);

            // Should only include Q2 (under-covered) and Q3 (unanswered)
            expect(actions.length).toBe(2);
            expect(actions.find(a => a.questionId === '1')).toBeUndefined();
            expect(actions.find(a => a.questionId === '2')).toBeDefined();
            expect(actions.find(a => a.questionId === '3')).toBeDefined();
        });

        it('should limit results to specified count', () => {
            const questions: QuestionScore[] = [
                { id: '1', text: 'Q1', dimensionKey: 'arch_sec', severity: 0.8, coverage: 0, persona: 'CTO', isAnswered: false },
                { id: '2', text: 'Q2', dimensionKey: 'arch_sec', severity: 0.7, coverage: 0, persona: 'CTO', isAnswered: false },
                { id: '3', text: 'Q3', dimensionKey: 'arch_sec', severity: 0.6, coverage: 0, persona: 'CTO', isAnswered: false },
                { id: '4', text: 'Q4', dimensionKey: 'arch_sec', severity: 0.5, coverage: 0, persona: 'CTO', isAnswered: false },
                { id: '5', text: 'Q5', dimensionKey: 'arch_sec', severity: 0.4, coverage: 0, persona: 'CTO', isAnswered: false },
            ];

            const actions = service.calculateNextActions(mockDimensions, questions, 3);

            expect(actions.length).toBe(3);
        });

        it('should include all required fields in NextAction', () => {
            const questions: QuestionScore[] = [
                { id: '1', text: 'Q1', dimensionKey: 'arch_sec', severity: 0.8, coverage: 0, persona: 'CTO', isAnswered: false },
            ];

            const actions = service.calculateNextActions(mockDimensions, questions, 10);

            expect(actions.length).toBe(1);
            expect(actions[0]).toHaveProperty('questionId');
            expect(actions[0]).toHaveProperty('questionText');
            expect(actions[0]).toHaveProperty('dimensionKey');
            expect(actions[0]).toHaveProperty('dimensionName');
            expect(actions[0]).toHaveProperty('deltaScore');
            expect(actions[0]).toHaveProperty('currentCoverage');
            expect(actions[0]).toHaveProperty('severity');
            expect(actions[0]).toHaveProperty('persona');
            expect(actions[0]).toHaveProperty('rationale');
        });
    });

    describe('getResidualColor', () => {
        it('should return green for residual <= 0.05', () => {
            expect(service.getResidualColor(0)).toBe('green');
            expect(service.getResidualColor(0.03)).toBe('green');
            expect(service.getResidualColor(0.05)).toBe('green');
        });

        it('should return amber for residual between 0.05 and 0.15', () => {
            expect(service.getResidualColor(0.06)).toBe('amber');
            expect(service.getResidualColor(0.10)).toBe('amber');
            expect(service.getResidualColor(0.15)).toBe('amber');
        });

        it('should return red for residual > 0.15', () => {
            expect(service.getResidualColor(0.16)).toBe('red');
            expect(service.getResidualColor(0.50)).toBe('red');
            expect(service.getResidualColor(1.0)).toBe('red');
        });
    });

    describe('calculateDimensionResults', () => {
        it('should calculate results for dimensions with questions', () => {
            const dimensions = [
                {
                    key: 'arch_sec',
                    displayName: 'Architecture & Security',
                    weight: new Decimal(0.15),
                },
            ];

            const questions: QuestionScore[] = [
                { id: '1', text: 'Q1', dimensionKey: 'arch_sec', severity: 0.8, coverage: 0.5, persona: 'CTO', isAnswered: true },
                { id: '2', text: 'Q2', dimensionKey: 'arch_sec', severity: 0.6, coverage: 0.75, persona: 'CTO', isAnswered: true },
            ];

            const results = service.calculateDimensionResults(dimensions, questions);

            expect(results).toHaveLength(1);
            expect(results[0].key).toBe('arch_sec');
            expect(results[0].questionCount).toBe(2);
            expect(results[0].answeredCount).toBe(2);
            expect(results[0].coverageAverage).toBeCloseTo(0.625, 3);
            expect(results[0].residual).toBeCloseTo(0.393, 2);
        });

        it('should handle dimensions with no questions', () => {
            const dimensions = [
                {
                    key: 'empty_dim',
                    displayName: 'Empty Dimension',
                    weight: new Decimal(0.10),
                },
            ];

            const questions: QuestionScore[] = [];

            const results = service.calculateDimensionResults(dimensions, questions);

            expect(results).toHaveLength(1);
            expect(results[0].key).toBe('empty_dim');
            expect(results[0].questionCount).toBe(0);
            expect(results[0].answeredCount).toBe(0);
            expect(results[0].coverageAverage).toBe(0);
            expect(results[0].residual).toBe(0);
        });
    });

    describe('meetsReadinessThresholdScore', () => {
        it('should return true when score >= 95', () => {
            expect(service.meetsReadinessThresholdScore(95)).toBe(true);
            expect(service.meetsReadinessThresholdScore(96)).toBe(true);
            expect(service.meetsReadinessThresholdScore(100)).toBe(true);
        });

        it('should return false when score < 95', () => {
            expect(service.meetsReadinessThresholdScore(94.9)).toBe(false);
            expect(service.meetsReadinessThresholdScore(90)).toBe(false);
            expect(service.meetsReadinessThresholdScore(0)).toBe(false);
        });
    });

    describe('generateHeatmapCells', () => {
        it('should create cells for each dimension × severity bucket combination', () => {
            const dimensions: DimensionResult[] = [
                {
                    key: 'arch_sec',
                    displayName: 'Architecture & Security',
                    weight: 0.15,
                    residual: 0.2,
                    questionCount: 4,
                    answeredCount: 3,
                    coverageAverage: 0.75,
                },
            ];

            const questions: QuestionScore[] = [
                { id: '1', text: 'Q1', dimensionKey: 'arch_sec', severity: 0.2, coverage: 0.5, persona: 'CTO', isAnswered: true }, // low
                { id: '2', text: 'Q2', dimensionKey: 'arch_sec', severity: 0.4, coverage: 0.5, persona: 'CTO', isAnswered: true }, // medium
                { id: '3', text: 'Q3', dimensionKey: 'arch_sec', severity: 0.6, coverage: 0.5, persona: 'CTO', isAnswered: true }, // high
                { id: '4', text: 'Q4', dimensionKey: 'arch_sec', severity: 0.8, coverage: 0.5, persona: 'CTO', isAnswered: true }, // critical
            ];

            const cells = service.generateHeatmapCells(dimensions, questions);

            // Should have 4 cells (1 dimension × 4 severity buckets)
            expect(cells.length).toBe(4);
            expect(cells.map(c => c.severityBucket)).toContain('low');
            expect(cells.map(c => c.severityBucket)).toContain('medium');
            expect(cells.map(c => c.severityBucket)).toContain('high');
            expect(cells.map(c => c.severityBucket)).toContain('critical');
        });

        it('should only create cells for buckets with questions', () => {
            const dimensions: DimensionResult[] = [
                {
                    key: 'arch_sec',
                    displayName: 'Architecture & Security',
                    weight: 0.15,
                    residual: 0.2,
                    questionCount: 2,
                    answeredCount: 2,
                    coverageAverage: 0.5,
                },
            ];

            const questions: QuestionScore[] = [
                { id: '1', text: 'Q1', dimensionKey: 'arch_sec', severity: 0.8, coverage: 0.5, persona: 'CTO', isAnswered: true }, // critical
                { id: '2', text: 'Q2', dimensionKey: 'arch_sec', severity: 0.9, coverage: 0.5, persona: 'CTO', isAnswered: true }, // critical
            ];

            const cells = service.generateHeatmapCells(dimensions, questions);

            // Should only have 1 cell (critical bucket)
            expect(cells.length).toBe(1);
            expect(cells[0].severityBucket).toBe('critical');
            expect(cells[0].questionCount).toBe(2);
        });
    });
});
