import { Module } from '@nestjs/common';
import { DecisionLogService } from './decision-log.service';
import { DecisionLogController } from './decision-log.controller';
import { PrismaModule } from '@libs/database';

/**
 * Decision Log Module
 * 
 * Implements Quiz2Biz append-only forensic decision record:
 * - Status workflow: DRAFT -> LOCKED -> (AMENDED/SUPERSEDED)
 * - Append-only enforcement at service layer
 * - Supersession tracking for decision amendments
 * - Audit export for compliance
 */
@Module({
    imports: [PrismaModule],
    controllers: [DecisionLogController],
    providers: [DecisionLogService],
    exports: [DecisionLogService],
})
export class DecisionLogModule { }
