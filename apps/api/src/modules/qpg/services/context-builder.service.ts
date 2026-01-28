/**
 * Context Builder Service
 * Builds gap context from questionnaire session data
 */
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@quiz-to-build/database';
import { GapContext } from '../types';

@Injectable()
export class ContextBuilderService {
    private readonly logger = new Logger(ContextBuilderService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Build gap contexts for a session
     * Identifies questions with coverage < 1.0 (gaps)
     */
    async buildGapContexts(sessionId: string): Promise<GapContext[]> {
        this.logger.log(`Building gap contexts for session: ${sessionId}`);

        // Get session with answers and questions
        const session = await this.prisma.questionnaireSession.findUnique({
            where: { id: sessionId },
            include: {
                answers: {
                    include: {
                        question: {
                            include: {
                                dimension: true,
                            },
                        },
                    },
                },
            },
        });

        if (!session) {
            this.logger.warn(`Session not found: ${sessionId}`);
            return [];
        }

        const gaps: GapContext[] = [];

        for (const answer of session.answers) {
            // Only include answers with coverage < 1.0 (gaps)
            const coverage = answer.coverage ?? 0;
            if (coverage < 1.0) {
                const question = answer.question;
                const dimension = question.dimension;

                // Calculate residual risk for this gap
                const severity = question.severityWeight ?? 0.5;
                const residualRisk = severity * (1 - coverage);

                gaps.push({
                    sessionId,
                    dimensionKey: dimension.key,
                    dimensionName: dimension.name,
                    questionId: question.id,
                    questionText: question.questionText,
                    currentCoverage: coverage,
                    severity,
                    residualRisk,
                    bestPractice: question.bestPractice ?? '',
                    practicalExplainer: question.practicalExplainer ?? '',
                    standardRefs: this.parseStandardRefs(question.standardRefs),
                    userAnswer: answer.answerValue ?? undefined,
                    userNotes: answer.notes ?? undefined,
                });
            }
        }

        // Sort by residual risk (highest first)
        gaps.sort((a, b) => b.residualRisk - a.residualRisk);

        this.logger.log(`Found ${gaps.length} gaps for session ${sessionId}`);
        return gaps;
    }

    /**
     * Parse standard references from JSON or comma-separated string
     */
    private parseStandardRefs(refs: string | null | undefined): string[] {
        if (!refs) return [];

        try {
            // Try JSON parse first
            const parsed = JSON.parse(refs);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch {
            // Fall back to comma-separated
            return refs.split(',').map((s) => s.trim()).filter(Boolean);
        }

        return [];
    }

    /**
     * Get gap summary for a session
     */
    async getGapSummary(sessionId: string): Promise<{
        totalGaps: number;
        byDimension: Record<string, number>;
        highPriorityCount: number;
        totalResidualRisk: number;
    }> {
        const gaps = await this.buildGapContexts(sessionId);

        const byDimension: Record<string, number> = {};
        let highPriorityCount = 0;
        let totalResidualRisk = 0;

        for (const gap of gaps) {
            byDimension[gap.dimensionKey] = (byDimension[gap.dimensionKey] || 0) + 1;
            totalResidualRisk += gap.residualRisk;
            if (gap.residualRisk > 0.15) {
                highPriorityCount++;
            }
        }

        return {
            totalGaps: gaps.length,
            byDimension,
            highPriorityCount,
            totalResidualRisk,
        };
    }
}
