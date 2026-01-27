import {
    Controller,
    Get,
    Param,
    UseGuards,
    Request,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScoringService } from './scoring.service';
import { PrismaService } from '@libs/database';

/**
 * Scoring Controller
 * 
 * REST API endpoints for Quiz2Biz Readiness Scoring Engine.
 * 
 * Endpoints:
 * - GET /sessions/:sessionId/readiness - Full readiness assessment
 * - GET /sessions/:sessionId/next-action - Single most impactful question (NQS)
 * - GET /sessions/:sessionId/readiness-check - Quick threshold check (≥ 95)
 * 
 * All endpoints require JWT authentication and verify session access.
 */
@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class ScoringController {
    constructor(
        private readonly scoringService: ScoringService,
        private readonly prisma: PrismaService,
    ) { }

    /**
     * Get Full Readiness Assessment
     * 
     * Returns complete readiness calculation including:
     * - Overall readiness score (0-100)
     * - Per-dimension residuals with color coding
     * - Gap heatmap (dimension × severity matrix)
     * - Next recommended actions ranked by delta score
     * - Progress metrics
     * 
     * @param sessionId - Session UUID
     * @param request - Express request with authenticated user
     * @returns ReadinessResponse with score, dimensions, heatmap, actions
     * 
     * @throws NotFoundException if session doesn't exist
     * @throws ForbiddenException if user doesn't have access to session
     * 
     * @example
     * GET /sessions/abc-123/readiness
     * Response:
     * {
     *   "score": 91.2,
     *   "residualsByDimension": [
     *     {
     *       "dimensionKey": "arch_sec",
     *       "displayName": "Architecture & Security",
     *       "weight": 0.15,
     *       "residual": 0.12,
     *       "color": "amber",
     *       "questionCount": 25,
     *       "answeredCount": 20
     *     }
     *   ],
     *   "heatmapCells": [...],
     *   "nextActions": [...],
     *   "progress": { ... }
     * }
     */
    @Get(':sessionId/readiness')
    async getReadiness(
        @Param('sessionId') sessionId: string,
        @Request() req: any,
    ) {
        // Verify session exists and user has access
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
            select: { userId: true },
        });

        if (!session) {
            throw new NotFoundException(`Session ${sessionId} not found`);
        }

        if (session.userId !== req.user.userId) {
            throw new ForbiddenException('You do not have access to this session');
        }

        // Calculate and return readiness
        return this.scoringService.calculateReadiness(sessionId);
    }

    /**
     * Get Next Best Question (NQS Implementation)
     * 
     * Returns the single most impactful question to answer next,
     * ranked by delta score (potential readiness improvement).
     * 
     * Formula: ΔScore_i = 100 × W_d × (S_i / (Σ S_j + ε))
     * 
     * Only returns unanswered or under-covered questions (coverage < 1.0).
     * 
     * @param sessionId - Session UUID
     * @param request - Express request with authenticated user
     * @returns NextAction with questionId, dimensionKey, deltaScore, severity
     * 
     * @throws NotFoundException if session doesn't exist
     * @throws ForbiddenException if user doesn't have access to session
     * 
     * @example
     * GET /sessions/abc-123/next-action
     * Response:
     * {
     *   "questionId": "q-456",
     *   "dimensionKey": "arch_sec",
     *   "dimensionName": "Architecture & Security",
     *   "deltaScore": 2.5,
     *   "severity": 0.85,
     *   "questionText": "Have you implemented a threat model?",
     *   "currentCoverage": 0
     * }
     */
    @Get(':sessionId/next-action')
    async getNextAction(
        @Param('sessionId') sessionId: string,
        @Request() req: any,
    ) {
        // Verify session exists and user has access
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
            select: { userId: true },
        });

        if (!session) {
            throw new NotFoundException(`Session ${sessionId} not found`);
        }

        if (session.userId !== req.user.userId) {
            throw new ForbiddenException('You do not have access to this session');
        }

        // Get next best question
        return this.scoringService.getNextQuestionByDeltaScore(sessionId);
    }

    /**
     * Check Readiness Threshold
     * 
     * Quick boolean check if session meets the readiness threshold (≥ 95).
     * Used for progress indicators and completion gates.
     * 
     * @param sessionId - Session UUID
     * @param request - Express request with authenticated user
     * @returns Object with meetsThreshold boolean and current score
     * 
     * @throws NotFoundException if session doesn't exist
     * @throws ForbiddenException if user doesn't have access to session
     * 
     * @example
     * GET /sessions/abc-123/readiness-check
     * Response:
     * {
     *   "meetsThreshold": false,
     *   "score": 91.2,
     *   "threshold": 95
     * }
     */
    @Get(':sessionId/readiness-check')
    async checkReadinessThreshold(
        @Param('sessionId') sessionId: string,
        @Request() req: any,
    ) {
        // Verify session exists and user has access
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
            select: { userId: true },
        });

        if (!session) {
            throw new NotFoundException(`Session ${sessionId} not found`);
        }

        if (session.userId !== req.user.userId) {
            throw new ForbiddenException('You do not have access to this session');
        }

        // Check threshold
        const readiness = await this.scoringService.calculateReadiness(sessionId);
        const meetsThreshold = this.scoringService.meetsReadinessThresholdScore(readiness.score);

        return {
            meetsThreshold,
            score: readiness.score,
            threshold: 95,
        };
    }
}
