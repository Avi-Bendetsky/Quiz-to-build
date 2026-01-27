import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Question with scoring data
 */
export interface QuestionScore {
    id: string;
    text: string;
    dimensionKey: string | null;
    severity: number;
    coverage: number;
    persona: string | null;
    isAnswered: boolean;
}

/**
 * Dimension result with residual risk
 */
export interface DimensionResult {
    key: string;
    displayName: string;
    weight: number;
    residual: number;
    questionCount: number;
    answeredCount: number;
    coverageAverage: number;
}

/**
 * Heatmap cell for visualization
 */
export interface HeatmapCell {
    dimension: string;
    dimensionName: string;
    severityBucket: 'low' | 'medium' | 'high' | 'critical';
    residual: number;
    color: 'green' | 'amber' | 'red';
    questionCount: number;
}

/**
 * Next action with delta score
 */
export interface NextAction {
    questionId: string;
    questionText: string;
    dimensionKey: string;
    dimensionName: string;
    deltaScore: number;
    currentCoverage: number;
    severity: number;
    persona: string | null;
    rationale: string;
}

/**
 * Complete readiness response
 */
export interface ReadinessResponse {
    sessionId: string;
    score: number;
    targetScore: number;
    residualsByDimension: DimensionResult[];
    heatmapCells: HeatmapCell[];
    nextActions: NextAction[];
    progress: {
        totalQuestions: number;
        answeredQuestions: number;
        percentage: number;
        sectionsRemaining: number;
    };
    isComplete: boolean;
    meetsThreshold: boolean;
}

@Injectable()
export class ScoringService {
    // Epsilon to prevent division by zero
    private readonly EPSILON = 0.0001;

    // Target readiness score threshold
    private readonly TARGET_SCORE = 95;

    // Severity bucket thresholds
    private readonly SEVERITY_BUCKETS = {
        low: { min: 0, max: 0.25 },
        medium: { min: 0.25, max: 0.5 },
        high: { min: 0.5, max: 0.75 },
        critical: { min: 0.75, max: 1.0 },
    };

    // Residual color thresholds
    private readonly COLOR_THRESHOLDS = {
        green: 0.05,
        amber: 0.15,
    };

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Calculate complete readiness score for a session
     */
    async calculateReadiness(sessionId: string): Promise<ReadinessResponse> {
        // Verify session exists
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                questionnaire: {
                    include: {
                        sections: {
                            orderBy: { orderIndex: 'asc' },
                        },
                    },
                },
            },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        // Get all dimensions
        const dimensions = await this.prisma.dimensionCatalog.findMany({
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' },
        });

        // Get all questions for this questionnaire with their responses
        const questions = await this.prisma.question.findMany({
            where: {
                section: {
                    questionnaireId: session.questionnaireId,
                },
            },
            include: {
                responses: {
                    where: { sessionId },
                },
                section: true,
            },
        });

        // Build question scores
        const questionScores: QuestionScore[] = questions.map((q) => ({
            id: q.id,
            text: q.text,
            dimensionKey: q.dimensionKey,
            severity: q.severity ? Number(q.severity) : 0.5,
            coverage: q.responses.length > 0 && q.responses[0].coverage
                ? Number(q.responses[0].coverage)
                : 0,
            persona: q.persona,
            isAnswered: q.responses.length > 0,
        }));

        // Calculate dimension results
        const dimensionResults = this.calculateDimensionResults(dimensions, questionScores);

        // Calculate portfolio residual and score
        const portfolioResidual = this.calculatePortfolioResidual(dimensionResults);
        const score = this.calculateReadinessScore(portfolioResidual);

        // Generate heatmap cells
        const heatmapCells = this.generateHeatmapCells(dimensionResults, questionScores);

        // Calculate next actions
        const nextActions = this.calculateNextActions(dimensionResults, questionScores, 10);

        // Calculate progress
        const answeredCount = questionScores.filter((q) => q.isAnswered).length;
        const totalQuestions = questionScores.length;

        const answeredSections = new Set(
            questions
                .filter((q) => q.responses.length > 0)
                .map((q) => q.sectionId)
        );
        const sectionsRemaining = session.questionnaire.sections.length - answeredSections.size;

        // Update session with latest score
        await this.prisma.session.update({
            where: { id: sessionId },
            data: {
                readinessScore: new Decimal(score),
                lastScoreCalculation: new Date(),
            },
        });

        return {
            sessionId,
            score: Math.round(score * 100) / 100,
            targetScore: this.TARGET_SCORE,
            residualsByDimension: dimensionResults,
            heatmapCells,
            nextActions,
            progress: {
                totalQuestions,
                answeredQuestions: answeredCount,
                percentage: totalQuestions > 0
                    ? Math.round((answeredCount / totalQuestions) * 100)
                    : 0,
                sectionsRemaining,
            },
            isComplete: answeredCount === totalQuestions,
            meetsThreshold: score >= this.TARGET_SCORE,
        };
    }

    /**
     * Calculate residual risk for each dimension
     * Formula: R_d = Σ(S_i × (1 - C_i)) / (Σ S_i + ε)
     */
    calculateDimensionResults(
        dimensions: Array<{ key: string; displayName: string; weight: Decimal }>,
        questions: QuestionScore[],
    ): DimensionResult[] {
        return dimensions.map((dim) => {
            const dimQuestions = questions.filter((q) => q.dimensionKey === dim.key);

            if (dimQuestions.length === 0) {
                return {
                    key: dim.key,
                    displayName: dim.displayName,
                    weight: Number(dim.weight),
                    residual: 0,
                    questionCount: 0,
                    answeredCount: 0,
                    coverageAverage: 0,
                };
            }

            const residual = this.calculateDimensionResidual(dimQuestions);
            const answeredCount = dimQuestions.filter((q) => q.isAnswered).length;
            const coverageSum = dimQuestions.reduce((sum, q) => sum + q.coverage, 0);

            return {
                key: dim.key,
                displayName: dim.displayName,
                weight: Number(dim.weight),
                residual,
                questionCount: dimQuestions.length,
                answeredCount,
                coverageAverage: dimQuestions.length > 0
                    ? coverageSum / dimQuestions.length
                    : 0,
            };
        });
    }

    /**
     * Calculate residual for a single dimension
     * R_d = Σ(S_i × (1 - C_i)) / (Σ S_i + ε)
     */
    calculateDimensionResidual(questions: QuestionScore[]): number {
        const weightedUncovered = questions.reduce(
            (sum, q) => sum + q.severity * (1 - q.coverage),
            0,
        );
        const totalSeverity = questions.reduce((sum, q) => sum + q.severity, 0);

        return weightedUncovered / (totalSeverity + this.EPSILON);
    }

    /**
     * Calculate portfolio residual risk
     * R = Σ(W_d × R_d)
     */
    calculatePortfolioResidual(dimensions: DimensionResult[]): number {
        return dimensions.reduce(
            (sum, d) => sum + d.weight * d.residual,
            0,
        );
    }

    /**
     * Calculate readiness score from portfolio residual
     * Score = 100 × (1 - R)
     */
    calculateReadinessScore(portfolioResidual: number): number {
        return 100 * (1 - portfolioResidual);
    }

    /**
     * Generate heatmap cells for visualization
     */
    generateHeatmapCells(
        dimensions: DimensionResult[],
        questions: QuestionScore[],
    ): HeatmapCell[] {
        const cells: HeatmapCell[] = [];

        for (const dim of dimensions) {
            const dimQuestions = questions.filter((q) => q.dimensionKey === dim.key);

            for (const [bucket, range] of Object.entries(this.SEVERITY_BUCKETS)) {
                const bucketQuestions = dimQuestions.filter(
                    (q) => q.severity >= range.min && q.severity < range.max,
                );

                if (bucketQuestions.length > 0) {
                    const residual = this.calculateDimensionResidual(bucketQuestions);

                    cells.push({
                        dimension: dim.key,
                        dimensionName: dim.displayName,
                        severityBucket: bucket as HeatmapCell['severityBucket'],
                        residual,
                        color: this.getResidualColor(residual),
                        questionCount: bucketQuestions.length,
                    });
                }
            }
        }

        return cells;
    }

    /**
     * Get color based on residual value
     */
    getResidualColor(residual: number): 'green' | 'amber' | 'red' {
        if (residual <= this.COLOR_THRESHOLDS.green) return 'green';
        if (residual <= this.COLOR_THRESHOLDS.amber) return 'amber';
        return 'red';
    }

    /**
     * Calculate next actions ranked by delta score
     * ΔScore_i = 100 × W_d × (S_i / (Σ S_j + ε))
     */
    calculateNextActions(
        dimensions: DimensionResult[],
        questions: QuestionScore[],
        limit: number = 10,
    ): NextAction[] {
        const actions: NextAction[] = [];

        // Only consider unanswered or under-covered questions
        const candidateQuestions = questions.filter(
            (q) => !q.isAnswered || q.coverage < 1,
        );

        for (const question of candidateQuestions) {
            const dimension = dimensions.find((d) => d.key === question.dimensionKey);
            if (!dimension) continue;

            const dimQuestions = questions.filter((q) => q.dimensionKey === dimension.key);
            const totalSeverity = dimQuestions.reduce((sum, q) => sum + q.severity, 0);

            const deltaScore = 100 * dimension.weight * (question.severity / (totalSeverity + this.EPSILON));

            actions.push({
                questionId: question.id,
                questionText: question.text,
                dimensionKey: dimension.key,
                dimensionName: dimension.displayName,
                deltaScore,
                currentCoverage: question.coverage,
                severity: question.severity,
                persona: question.persona,
                rationale: this.generateActionRationale(question, dimension, deltaScore),
            });
        }

        // Sort by delta score descending and take top N
        return actions
            .sort((a, b) => b.deltaScore - a.deltaScore)
            .slice(0, limit);
    }

    /**
     * Generate rationale for a next action
     */
    private generateActionRationale(
        question: QuestionScore,
        dimension: DimensionResult,
        deltaScore: number,
    ): string {
        const coveragePercent = Math.round(question.coverage * 100);
        const deltaPercent = Math.round(deltaScore * 10) / 10;

        if (!question.isAnswered) {
            return `Answering this ${dimension.displayName} question could increase your score by ~${deltaPercent} points.`;
        }

        if (question.coverage < 0.5) {
            return `This question has ${coveragePercent}% coverage. Adding evidence could increase your score by ~${deltaPercent} points.`;
        }

        return `Verifying evidence for this ${dimension.displayName} question could contribute ~${deltaPercent} points.`;
    }

    /**
     * Get the next question to answer based on delta score (NQS)
     */
    async getNextQuestionByDeltaScore(sessionId: string): Promise<NextAction | null> {
        const readiness = await this.calculateReadiness(sessionId);
        return readiness.nextActions[0] || null;
    }

    /**
     * Check if session meets readiness threshold
     */
    async meetsReadinessThreshold(sessionId: string): Promise<boolean> {
        const readiness = await this.calculateReadiness(sessionId);
        return readiness.meetsThreshold;
    }

    /**
     * Check if a score meets the readiness threshold
     */
    meetsReadinessThresholdScore(score: number): boolean {
        return score >= this.TARGET_SCORE;
    }
}
