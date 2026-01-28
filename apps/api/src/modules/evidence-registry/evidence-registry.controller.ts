import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    HttpCode,
    HttpStatus,
    Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { EvidenceRegistryService } from './evidence-registry.service';
import {
    UploadEvidenceDto,
    VerifyEvidenceDto,
    EvidenceItemResponse,
    ListEvidenceDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Evidence Registry Controller
 * 
 * Provides endpoints for Quiz2Biz evidence management:
 * - Upload evidence files with SHA-256 hashing
 * - Verify evidence with coverage updates
 * - List and filter evidence items
 */
@ApiTags('Evidence Registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evidence')
export class EvidenceRegistryController {
    constructor(private readonly evidenceService: EvidenceRegistryService) { }

    /**
     * Upload evidence file
     */
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: 'Upload evidence file',
        description: `
Upload a file as evidence for a question response. 
The file will be stored in Azure Blob Storage with a SHA-256 hash computed for integrity verification.

**Allowed file types:** PDF, Word, Excel, images, JSON, CSV, XML, SBOM formats
**Maximum file size:** 50MB
    `,
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Evidence file to upload',
                },
                sessionId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Session ID',
                },
                questionId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Question ID',
                },
                artifactType: {
                    type: 'string',
                    enum: ['FILE', 'IMAGE', 'LINK', 'LOG', 'SBOM', 'REPORT', 'TEST_RESULT', 'SCREENSHOT', 'DOCUMENT'],
                    description: 'Type of evidence',
                },
                fileName: {
                    type: 'string',
                    description: 'Optional custom file name',
                },
            },
            required: ['file', 'sessionId', 'questionId', 'artifactType'],
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Evidence uploaded successfully',
        type: EvidenceItemResponse,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid file type, size, or missing required fields',
    })
    async uploadEvidence(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UploadEvidenceDto,
        @Request() req: { user: { userId: string } },
    ): Promise<EvidenceItemResponse> {
        return this.evidenceService.uploadEvidence(file, dto, req.user.userId);
    }

    /**
     * Verify evidence
     */
    @Post('verify')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Verify evidence',
        description: `
Mark evidence as verified or unverified. 
Optionally update the coverage value on the associated response.

Only users with Verifier role should be allowed to verify evidence.
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'Evidence verification status updated',
        type: EvidenceItemResponse,
    })
    @ApiResponse({
        status: 404,
        description: 'Evidence not found',
    })
    async verifyEvidence(
        @Body() dto: VerifyEvidenceDto,
        @Request() req: { user: { userId: string } },
    ): Promise<EvidenceItemResponse> {
        return this.evidenceService.verifyEvidence(dto, req.user.userId);
    }

    /**
     * Get evidence by ID
     */
    @Get(':evidenceId')
    @ApiOperation({
        summary: 'Get evidence by ID',
        description: 'Retrieve a single evidence item by its ID.',
    })
    @ApiParam({
        name: 'evidenceId',
        description: 'Evidence UUID',
    })
    @ApiResponse({
        status: 200,
        description: 'Evidence item',
        type: EvidenceItemResponse,
    })
    @ApiResponse({
        status: 404,
        description: 'Evidence not found',
    })
    async getEvidence(
        @Param('evidenceId') evidenceId: string,
    ): Promise<EvidenceItemResponse> {
        return this.evidenceService.getEvidence(evidenceId);
    }

    /**
     * List evidence with filters
     */
    @Get()
    @ApiOperation({
        summary: 'List evidence',
        description: 'List evidence items with optional filters for session, question, type, and verification status.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of evidence items',
        type: [EvidenceItemResponse],
    })
    async listEvidence(
        @Query() filters: ListEvidenceDto,
    ): Promise<EvidenceItemResponse[]> {
        return this.evidenceService.listEvidence(filters);
    }

    /**
     * Get evidence statistics for a session
     */
    @Get('stats/:sessionId')
    @ApiOperation({
        summary: 'Get evidence statistics',
        description: 'Get aggregated statistics about evidence for a session.',
    })
    @ApiParam({
        name: 'sessionId',
        description: 'Session UUID',
    })
    @ApiResponse({
        status: 200,
        description: 'Evidence statistics',
        schema: {
            type: 'object',
            properties: {
                total: { type: 'number' },
                verified: { type: 'number' },
                pending: { type: 'number' },
                byType: {
                    type: 'object',
                    additionalProperties: { type: 'number' },
                },
            },
        },
    })
    async getEvidenceStats(@Param('sessionId') sessionId: string) {
        return this.evidenceService.getEvidenceStats(sessionId);
    }

    /**
     * Delete evidence
     */
    @Delete(':evidenceId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Delete evidence',
        description: 'Delete an unverified evidence item. Verified evidence cannot be deleted.',
    })
    @ApiParam({
        name: 'evidenceId',
        description: 'Evidence UUID',
    })
    @ApiResponse({
        status: 204,
        description: 'Evidence deleted successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Cannot delete verified evidence',
    })
    @ApiResponse({
        status: 404,
        description: 'Evidence not found',
    })
    async deleteEvidence(
        @Param('evidenceId') evidenceId: string,
        @Request() req: { user: { userId: string } },
    ): Promise<void> {
        await this.evidenceService.deleteEvidence(evidenceId, req.user.userId);
    }
}
