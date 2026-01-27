import { Module } from '@nestjs/common';
import { PrismaModule } from '@libs/database';
import { ScoringService } from './scoring.service';
import { ScoringController } from './scoring.controller';

/**
 * Scoring Module
 * 
 * Implements the Quiz2Biz Readiness Scoring Engine with:
 * - Per-dimension residual risk calculation
 * - Portfolio readiness score (0-100)
 * - Gap heatmap generation
 * - Next Question Selector (NQS) by delta score
 * 
 * Formulas:
 * - Dimension Residual: R_d = Σ(S_i × (1 - C_i)) / (Σ S_i + ε)
 * - Portfolio Residual: R = Σ(W_d × R_d)
 * - Readiness Score: Score = 100 × (1 - R)
 * - Delta Score: ΔScore_i = 100 × W_d × (S_i / (Σ S_j + ε))
 */
@Module({
    imports: [PrismaModule],
    controllers: [ScoringController],
    providers: [ScoringService],
    exports: [ScoringService],
})
export class ScoringModule { }
