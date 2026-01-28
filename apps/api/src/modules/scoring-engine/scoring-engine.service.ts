import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import { RedisService } from '@libs/redis';
import { Decimal } from '@prisma/client/runtime/library';
import {
    CalculateScoreDto,
    ReadinessScoreResult,
    DimensionResidual,
    NextQuestionsDto,
    NextQuestionsResult,
    PrioritizedQuestion,
    QuestionCoverageInput,
} from './dto';

/**
 * Scoring Engine Service
 * 
 * Implements Quiz2Biz risk-weighted readiness scoring with explicit formulas:
 * 
 * Coverage (per question): C_i ∈ [0,1]
 *   - 0 = no evidence/coverage
 *   - 1 = fully verified/covered
 * 
 * Dimension Residual Risk: R_d = Σ(S_i × (1-C_i)) / (Σ S_i + ε)
 *   - S_i = severity weight of question i
 *   - C_i = coverage of question i
 *   - ε = small epsilon to avoid division by zero (1e-10)
 * 
 * Portfolio Residual Risk: R = Σ(W_d × R_d)
 *   - W_d = weight of dimension d (from DimensionCatalog)
 *   - All weights sum to 1.0
 * 
 * Readiness Score: Score = 100 × (1 - R)
 *   - Range: 0-100
 *   - 100 = perfect readiness (no residual risk)
 *   - 0 = no readiness (maximum residual risk)
 * 
 * Next Question Selector (NQS) uses ΔScore:
 *   ΔScore_i = 100 × W_d(i) × S_i / (Σ S_j + ε)
 *   - Ranks unanswered/under-covered questions by expected score lift
 */
@Injectable()
export class ScoringEngineService {
    private readonly logger = new Logger(ScoringEngineService.name);

    /** Small epsilon to avoid division by zero */
    private readonly EPSILON = 1e-10;

    /** Cache TTL for score calculations (5 minutes) */
    private readonly SCORE_CACHE_TTL = 300;

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) { }

    /**
     * Calculate the complete readiness score for a session
     * Uses parameterized queries throughout for security
     */
    async calculateScore(dto: CalculateScoreDto): Promise<ReadinessScoreResult> {
        const startTime = Date.now();
        const { sessionId, coverageOverrides } = dto;

        // Validate session exists
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                questionnaire: true,
            },
        });

        if (!session) {
            throw new NotFoundException(`Session not found: ${sessionId}`);
        }

        // Get previous score for trend calculation
        const previousScore = session.readinessScore
            ? Number(session.readinessScore)
            : null;

        // Fetch all dimensions with their weights
        const dimensions = await this.prisma.dimensionCatalog.findMany({
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' },
        });

        // Fetch all questions for this questionnaire with their responses
        const questions = await this.prisma.question.findMany({
            where: {
                section: {
                    questionnaireId: session.questionnaireId,
                },
            },
            include: {
                responses: {
                    where: { sessionId },
                    take: 1,
                },
                dimension: true,
            },
        });

        // Build coverage map (apply overrides if provided)
        const coverageMap = this.buildCoverageMap(questions, coverageOverrides);

        // Calculate per-dimension residuals
        const dimensionResults = this.calculateDimensionResiduals(
            dimensions,
            questions,
            coverageMap,
        );

        // Calculate portfolio residual: R = Σ(W_d × R_d)
        const portfolioResidual = dimensionResults.reduce(
            (sum, dim) => sum + dim.weightedContribution,
            0,
        );

        // Calculate final score: Score = 100 × (1 - R)
        const score = Math.max(0, Math.min(100, 100 * (1 - portfolioResidual)));

        // Calculate statistics
        const totalQuestions = questions.length;
        const answeredQuestions = questions.filter(
            (q) => q.responses.length > 0,
        ).length;
        const completionPercentage = totalQuestions > 0
            ? (answeredQuestions / totalQuestions) * 100
            : 0;

        // Determine trend
        let trend: 'UP' | 'DOWN' | 'STABLE' | 'FIRST';
        if (previousScore === null) {
            trend = 'FIRST';
        } else if (score > previousScore + 0.5) {
            trend = 'UP';
        } else if (score < previousScore - 0.5) {
            trend = 'DOWN';
        } else {
            trend = 'STABLE';
        }

        // Update session with new score using parameterized query
        await this.prisma.session.update({
            where: { id: sessionId },
            data: {
                readinessScore: new Decimal(score.toFixed(2)),
                lastScoreCalculation: new Date(),
            },
        });

        const result: ReadinessScoreResult = {
            sessionId,
            score: Math.round(score * 100) / 100, // Round to 2 decimal places
            portfolioResidual: Math.round(portfolioResidual * 10000) / 10000,
            dimensions: dimensionResults,
            totalQuestions,
            answeredQuestions,
            completionPercentage: Math.round(completionPercentage * 10) / 10,
            calculatedAt: new Date(),
            trend,
        };

        // Cache the result
        await this.cacheScore(sessionId, result);

        const elapsed = Date.now() - startTime;
        this.logger.log(
            `Score calculated for session ${sessionId}: ${score.toFixed(2)} in ${elapsed}ms`,
        );

        return result;
    }

    /**
     * Get prioritized next questions using NQS algorithm
     * 
     * ΔScore_i = 100 × W_d(i) × S_i / (Σ S_j + ε)
     * 
     * Returns questions ranked by their potential score improvement
     */
    async getNextQuestions(dto: NextQuestionsDto): Promise<NextQuestionsResult> {
        const { sessionId, limit = 5 } = dto;

        // Get current score or calculate it
        let currentResult = await this.getCachedScore(sessionId);
        if (!currentResult) {
            currentResult = await this.calculateScore({ sessionId });
        }

        // Fetch questions that are not fully covered
        const questions = await this.prisma.question.findMany({
            where: {
                section: {
                    questionnaire: {
                        sessions: {
                            some: { id: sessionId },
                        },
                    },
                },
                dimensionKey: { not: null },
            },
            include: {
                responses: {
                    where: { sessionId },
                    take: 1,
                },
                dimension: true,
            },
        });

        // Get all dimensions for weight lookup
        const dimensions = await this.prisma.dimensionCatalog.findMany({
            where: { isActive: true },
        });
        const dimensionWeightMap = new Map(
            dimensions.map((d) => [d.key, Number(d.weight)]),
        );

        // Calculate total severity per dimension for normalization
        const dimensionSeveritySum = new Map<string, number>();
        questions.forEach((q) => {
            if (q.dimensionKey) {
                const current = dimensionSeveritySum.get(q.dimensionKey) || 0;
                dimensionSeveritySum.set(
                    q.dimensionKey,
                    current + (q.severity ? Number(q.severity) : 0.5),
                );
            }
        });

        // Calculate ΔScore for each question
        const prioritizedQuestions: PrioritizedQuestion[] = [];

        for (const question of questions) {
            const response = question.responses[0];
            const currentCoverage: number = response?.coverage
                ? Number(response.coverage)
                : 0;

            // Skip fully covered questions
            if (currentCoverage >= 1.0) continue;

            const severity: number = question.severity ? Number(question.severity) : 0.5;
            const dimensionKey: string = question.dimensionKey || 'unknown';
            const dimensionWeight: number = Number(dimensionWeightMap.get(dimensionKey) ?? 0);
            const severitySum: number = Number(dimensionSeveritySum.get(dimensionKey) ?? 1);

            // ΔScore = 100 × W_d × S_i × (1 - C_i) / (Σ S_j + ε)
            // This represents the score gain if C_i goes from current to 1.0
            const deltaScore: number =
                (100 * dimensionWeight * severity * (1 - currentCoverage)) /
                (severitySum + this.EPSILON);

            prioritizedQuestions.push({
                questionId: question.id,
                text: question.text,
                dimensionKey,
                dimensionName: question.dimension?.displayName || dimensionKey,
                severity,
                currentCoverage,
                expectedScoreLift: Math.round(deltaScore * 100) / 100,
                rationale: this.generateRationale(
                    deltaScore,
                    dimensionKey,
                    question.dimension?.displayName || dimensionKey,
                    currentCoverage,
                ),
                rank: 0, // Will be set after sorting
            });
        }

        // Sort by expected score lift (descending)
        prioritizedQuestions.sort(
            (a, b) => b.expectedScoreLift - a.expectedScoreLift,
        );

        // Assign ranks and limit results
        const topQuestions = prioritizedQuestions.slice(0, limit).map((q, i) => ({
            ...q,
            rank: i + 1,
        }));

        // Calculate max potential score
        const totalPotentialLift = topQuestions.reduce(
            (sum, q) => sum + q.expectedScoreLift,
            0,
        );
        const maxPotentialScore = Math.min(
            100,
            currentResult.score + totalPotentialLift,
        );

        return {
            sessionId,
            currentScore: currentResult.score,
            questions: topQuestions,
            maxPotentialScore: Math.round(maxPotentialScore * 100) / 100,
        };
    }

    /**
     * Build coverage map from responses with optional overrides
     */
    private buildCoverageMap(
        questions: Array<{
            id: string;
            responses: Array<{ coverage: Decimal | null }>;
        }>,
        overrides?: QuestionCoverageInput[],
    ): Map<string, number> {
        const coverageMap = new Map<string, number>();

        // Initialize from actual responses
        questions.forEach((q) => {
            const response = q.responses[0];
            const coverage = response?.coverage ? Number(response.coverage) : 0;
            coverageMap.set(q.id, coverage);
        });

        // Apply overrides
        if (overrides) {
            overrides.forEach((override) => {
                if (coverageMap.has(override.questionId)) {
                    coverageMap.set(override.questionId, override.coverage);
                }
            });
        }

        return coverageMap;
    }

    /**
     * Calculate residual risk for each dimension
     * 
     * R_d = Σ(S_i × (1-C_i)) / (Σ S_i + ε)
     */
    private calculateDimensionResiduals(
        dimensions: Array<{
            key: string;
            displayName: string;
            weight: Decimal;
        }>,
        questions: Array<{
            id: string;
            dimensionKey: string | null;
            severity: Decimal | null;
            responses: Array<{ coverage: Decimal | null }>;
        }>,
        coverageMap: Map<string, number>,
    ): DimensionResidual[] {
        return dimensions.map((dim) => {
            // Get questions in this dimension
            const dimQuestions = questions.filter(
                (q) => q.dimensionKey === dim.key,
            );

            if (dimQuestions.length === 0) {
                return {
                    dimensionKey: dim.key,
                    displayName: dim.displayName,
                    weight: Number(dim.weight),
                    residualRisk: 0,
                    weightedContribution: 0,
                    questionCount: 0,
                    answeredCount: 0,
                    averageCoverage: 0,
                };
            }

            // Calculate numerator: Σ(S_i × (1-C_i))
            let numerator = 0;
            let severitySum = 0;
            let totalCoverage = 0;
            let answeredCount = 0;

            dimQuestions.forEach((q) => {
                const severity = q.severity ? Number(q.severity) : 0.5;
                const coverage = coverageMap.get(q.id) || 0;

                numerator += severity * (1 - coverage);
                severitySum += severity;
                totalCoverage += coverage;

                if (q.responses.length > 0) {
                    answeredCount++;
                }
            });

            // Calculate R_d = Σ(S_i × (1-C_i)) / (Σ S_i + ε)
            const residualRisk = numerator / (severitySum + this.EPSILON);
            const weight = Number(dim.weight);
            const weightedContribution = weight * residualRisk;

            return {
                dimensionKey: dim.key,
                displayName: dim.displayName,
                weight,
                residualRisk: Math.round(residualRisk * 10000) / 10000,
                weightedContribution: Math.round(weightedContribution * 10000) / 10000,
                questionCount: dimQuestions.length,
                answeredCount,
                averageCoverage:
                    Math.round((totalCoverage / dimQuestions.length) * 100) / 100,
            };
        });
    }

    /**
     * Generate human-readable rationale for question prioritization
     */
    private generateRationale(
        deltaScore: number,
        dimensionKey: string,
        dimensionName: string,
        currentCoverage: number,
    ): string {
        const scoreGain = deltaScore.toFixed(1);
        const coveragePercent = (currentCoverage * 100).toFixed(0);

        if (currentCoverage === 0) {
            return `Answering this ${dimensionName} question could improve your score by up to ${scoreGain} points. This question has no coverage yet.`;
        }

        return `Improving coverage on this ${dimensionName} question from ${coveragePercent}% to 100% could add ${scoreGain} points to your readiness score.`;
    }

    /**
     * Cache score result for faster retrieval
     */
    private async cacheScore(
        sessionId: string,
        result: ReadinessScoreResult,
    ): Promise<void> {
        try {
            const cacheKey = `score:${sessionId}`;
            await this.redis.set(
                cacheKey,
                JSON.stringify(result),
                this.SCORE_CACHE_TTL,
            );
        } catch (error) {
            this.logger.warn(`Failed to cache score for session ${sessionId}`, error);
        }
    }

    /**
     * Get cached score result
     */
    private async getCachedScore(
        sessionId: string,
    ): Promise<ReadinessScoreResult | null> {
        try {
            const cacheKey = `score:${sessionId}`;
            const cached = await this.redis.get(cacheKey);
            if (cached) {
                return JSON.parse(cached) as ReadinessScoreResult;
            }
        } catch (error) {
            this.logger.warn(
                `Failed to retrieve cached score for session ${sessionId}`,
                error,
            );
        }
        return null;
    }

    /**
     * Invalidate cached score for a session
     */
    async invalidateScoreCache(sessionId: string): Promise<void> {
        try {
            const cacheKey = `score:${sessionId}`;
            await this.redis.del(cacheKey);
        } catch (error) {
            this.logger.warn(
                `Failed to invalidate score cache for session ${sessionId}`,
                error,
            );
        }
    }

    /**
     * Calculate score for multiple sessions (batch operation)
     */
    async calculateBatchScores(
        sessionIds: string[],
    ): Promise<Map<string, ReadinessScoreResult>> {
        const results = new Map<string, ReadinessScoreResult>();

        // Process in parallel with controlled concurrency
        const batchSize = 5;
        for (let i = 0; i < sessionIds.length; i += batchSize) {
            const batch = sessionIds.slice(i, i + batchSize);
            const batchResults = await Promise.all(
                batch.map((id) =>
                    this.calculateScore({ sessionId: id }).catch((error) => {
                        this.logger.error(`Failed to calculate score for ${id}`, error);
                        return null;
                    }),
                ),
            );

            batchResults.forEach((result, index) => {
                if (result) {
                    results.set(batch[index], result);
                }
            });
        }

        return results;
    }
}
