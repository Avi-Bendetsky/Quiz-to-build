import { Module } from '@nestjs/common';
import { EvidenceRegistryService } from './evidence-registry.service';
import { EvidenceRegistryController } from './evidence-registry.controller';
import { PrismaModule } from '@libs/database';

/**
 * Evidence Registry Module
 * 
 * Implements Quiz2Biz evidence management:
 * - File uploads with SHA-256 hashing
 * - Azure Blob Storage integration
 * - Verification workflow with coverage updates
 * - Evidence linking to questions and sessions
 */
@Module({
    imports: [PrismaModule],
    controllers: [EvidenceRegistryController],
    providers: [EvidenceRegistryService],
    exports: [EvidenceRegistryService],
})
export class EvidenceRegistryModule { }
