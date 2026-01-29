import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@libs/database';
import {
  Document,
  DocumentType,
  DocumentStatus,
  SessionStatus,
} from '@prisma/client';
import { TemplateEngineService } from './template-engine.service';
import { DocumentBuilderService } from './document-builder.service';
import { StorageService } from './storage.service';

export interface GenerateDocumentParams {
  sessionId: string;
  documentTypeId: string;
  userId: string;
}

export interface DocumentWithType extends Document {
  documentType: DocumentType;
}

@Injectable()
export class DocumentGeneratorService {
  private readonly logger = new Logger(DocumentGeneratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly templateEngine: TemplateEngineService,
    private readonly documentBuilder: DocumentBuilderService,
    private readonly storage: StorageService,
  ) {}

  /**
   * Generate a document for a completed session
   */
  async generateDocument(params: GenerateDocumentParams): Promise<Document> {
    const { sessionId, documentTypeId, userId } = params;

    // 1. Validate session exists and is completed
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: { select: { id: true } },
        questionnaire: { select: { name: true } },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.status !== SessionStatus.COMPLETED) {
      throw new BadRequestException(
        `Session must be completed before generating documents. Current status: ${session.status}`,
      );
    }

    // Verify user owns the session or is admin
    if (session.userId !== userId) {
      throw new BadRequestException('You can only generate documents for your own sessions');
    }

    // 2. Validate document type exists
    const documentType = await this.prisma.documentType.findUnique({
      where: { id: documentTypeId },
    });

    if (!documentType) {
      throw new NotFoundException(`Document type with ID ${documentTypeId} not found`);
    }

    if (!documentType.isActive) {
      throw new BadRequestException('This document type is not currently available');
    }

    // 3. Check if required questions are answered
    if (documentType.requiredQuestions.length > 0) {
      const answeredQuestions = await this.prisma.response.findMany({
        where: {
          sessionId,
          questionId: { in: documentType.requiredQuestions },
          isValid: true,
        },
        select: { questionId: true },
      });

      const answeredIds = new Set(answeredQuestions.map((r) => r.questionId));
      const missingQuestions = documentType.requiredQuestions.filter(
        (id) => !answeredIds.has(id),
      );

      if (missingQuestions.length > 0) {
        throw new BadRequestException(
          `Missing required questions for this document type: ${missingQuestions.length} questions not answered`,
        );
      }
    }

    // 4. Create document record with PENDING status
    const document = await this.prisma.document.create({
      data: {
        sessionId,
        documentTypeId,
        status: DocumentStatus.PENDING,
        format: 'DOCX',
        version: 1,
      },
    });

    // 5. Generate document asynchronously (for now, synchronously)
    try {
      await this.processDocumentGeneration(document.id, documentType);
    } catch (error) {
      // Mark as failed if generation fails
      await this.prisma.document.update({
        where: { id: document.id },
        data: {
          status: DocumentStatus.FAILED,
          generationMetadata: {
            error: error instanceof Error ? error.message : 'Unknown error',
            failedAt: new Date().toISOString(),
          },
        },
      });
      throw error;
    }

    // Return updated document
    return this.prisma.document.findUnique({
      where: { id: document.id },
      include: { documentType: true },
    }) as Promise<Document>;
  }

  /**
   * Process document generation
   */
  private async processDocumentGeneration(
    documentId: string,
    documentType: DocumentType,
  ): Promise<void> {
    // Update status to GENERATING
    const document = await this.prisma.document.update({
      where: { id: documentId },
      data: { status: DocumentStatus.GENERATING },
    });

    this.logger.log(`Generating document ${documentId} of type ${documentType.name}`);

    // Assemble template data
    const templateData = await this.templateEngine.assembleTemplateData(
      document.sessionId,
      documentType.slug,
    );

    // Build DOCX
    const buffer = await this.documentBuilder.buildDocument(templateData, {
      name: documentType.name,
      slug: documentType.slug,
      category: documentType.category,
    });

    // Upload to storage
    const fileName = `${documentType.slug}-${documentId}.docx`;
    const uploadResult = await this.storage.upload(
      buffer,
      fileName,
      documentType.category.toLowerCase(),
    );

    // Update document with results
    await this.prisma.document.update({
      where: { id: documentId },
      data: {
        status: DocumentStatus.GENERATED,
        storageUrl: uploadResult.url,
        fileName: uploadResult.fileName,
        fileSize: BigInt(uploadResult.fileSize),
        generatedAt: new Date(),
        generationMetadata: {
          templateVersion: templateData.metadata.version,
          generatedAt: new Date().toISOString(),
        },
      },
    });

    this.logger.log(`Document ${documentId} generated successfully`);
  }

  /**
   * Get document by ID
   */
  async getDocument(id: string, userId: string): Promise<DocumentWithType> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        documentType: true,
        session: { select: { userId: true } },
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Verify access (user owns the session)
    if (document.session.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    return document;
  }

  /**
   * Get all documents for a session
   */
  async getSessionDocuments(
    sessionId: string,
    userId: string,
  ): Promise<DocumentWithType[]> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    return this.prisma.document.findMany({
      where: { sessionId },
      include: { documentType: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get download URL for a document
   */
  async getDownloadUrl(
    id: string,
    userId: string,
    expiresInMinutes: number = 60,
  ): Promise<string> {
    const document = await this.getDocument(id, userId);

    if (document.status !== DocumentStatus.GENERATED && 
        document.status !== DocumentStatus.APPROVED) {
      throw new BadRequestException(
        `Document is not available for download. Status: ${document.status}`,
      );
    }

    if (!document.storageUrl) {
      throw new BadRequestException('Document file not found');
    }

    return this.storage.getDownloadUrl(document.storageUrl, expiresInMinutes);
  }

  /**
   * List all document types
   */
  async listDocumentTypes(): Promise<DocumentType[]> {
    return this.prisma.documentType.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  /**
   * Get documents pending review (admin)
   */
  async getPendingReviewDocuments(): Promise<DocumentWithType[]> {
    return this.prisma.document.findMany({
      where: { status: DocumentStatus.PENDING_REVIEW },
      include: { documentType: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Approve a document (admin)
   */
  async approveDocument(id: string, adminUserId: string): Promise<Document> {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    if (document.status !== DocumentStatus.PENDING_REVIEW) {
      throw new BadRequestException(
        `Only documents with PENDING_REVIEW status can be approved. Current: ${document.status}`,
      );
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.APPROVED,
        approvedById: adminUserId,
        approvedAt: new Date(),
        reviewStatus: {
          approvedBy: adminUserId,
          approvedAt: new Date().toISOString(),
        },
      },
    });
  }

  /**
   * Reject a document (admin)
   */
  async rejectDocument(
    id: string,
    adminUserId: string,
    reason: string,
  ): Promise<Document> {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    if (document.status !== DocumentStatus.PENDING_REVIEW) {
      throw new BadRequestException(
        `Only documents with PENDING_REVIEW status can be rejected. Current: ${document.status}`,
      );
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.REJECTED,
        rejectionReason: reason,
        reviewStatus: {
          rejectedBy: adminUserId,
          rejectedAt: new Date().toISOString(),
          reason,
        },
      },
    });
  }
}
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import { Document, DocumentType, DocumentStatus, SessionStatus } from '@prisma/client';
import { TemplateEngineService } from './template-engine.service';
import { DocumentBuilderService } from './document-builder.service';
import { StorageService } from './storage.service';

export interface GenerateDocumentParams {
  sessionId: string;
  documentTypeId: string;
  userId: string;
}

export interface DocumentWithType extends Document {
  documentType: DocumentType;
}

@Injectable()
export class DocumentGeneratorService {
  private readonly logger = new Logger(DocumentGeneratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly templateEngine: TemplateEngineService,
    private readonly documentBuilder: DocumentBuilderService,
    private readonly storage: StorageService,
  ) {}

  /**
   * Generate a document for a completed session
   */
  async generateDocument(params: GenerateDocumentParams): Promise<Document> {
    const { sessionId, documentTypeId, userId } = params;

    // 1. Validate session exists and is completed
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: { select: { id: true } },
        questionnaire: { select: { name: true } },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.status !== SessionStatus.COMPLETED) {
      throw new BadRequestException(
        `Session must be completed before generating documents. Current status: ${session.status}`,
      );
    }

    // Verify user owns the session or is admin
    if (session.userId !== userId) {
      throw new BadRequestException('You can only generate documents for your own sessions');
    }

    // 2. Validate document type exists
    const documentType = await this.prisma.documentType.findUnique({
      where: { id: documentTypeId },
    });

    if (!documentType) {
      throw new NotFoundException(`Document type with ID ${documentTypeId} not found`);
    }

    if (!documentType.isActive) {
      throw new BadRequestException('This document type is not currently available');
    }

    // 3. Check if required questions are answered
    if (documentType.requiredQuestions.length > 0) {
      const answeredQuestions = await this.prisma.response.findMany({
        where: {
          sessionId,
          questionId: { in: documentType.requiredQuestions },
          isValid: true,
        },
        select: { questionId: true },
      });

      const answeredIds = new Set(answeredQuestions.map((r) => r.questionId));
      const missingQuestions = documentType.requiredQuestions.filter((id) => !answeredIds.has(id));

      if (missingQuestions.length > 0) {
        throw new BadRequestException(
          `Missing required questions for this document type: ${missingQuestions.length} questions not answered`,
        );
      }
    }

    // 4. Create document record with PENDING status
    const document = await this.prisma.document.create({
      data: {
        sessionId,
        documentTypeId,
        status: DocumentStatus.PENDING,
        format: 'DOCX',
        version: 1,
      },
    });

    // 5. Generate document asynchronously (for now, synchronously)
    try {
      await this.processDocumentGeneration(document.id, documentType);
    } catch (error) {
      // Mark as failed if generation fails
      await this.prisma.document.update({
        where: { id: document.id },
        data: {
          status: DocumentStatus.FAILED,
          generationMetadata: {
            error: error instanceof Error ? error.message : 'Unknown error',
            failedAt: new Date().toISOString(),
          },
        },
      });
      throw error;
    }

    // Return updated document
    return this.prisma.document.findUnique({
      where: { id: document.id },
      include: { documentType: true },
    }) as Promise<Document>;
  }

  /**
   * Process document generation
   */
  private async processDocumentGeneration(
    documentId: string,
    documentType: DocumentType,
  ): Promise<void> {
    // Update status to GENERATING
    const document = await this.prisma.document.update({
      where: { id: documentId },
      data: { status: DocumentStatus.GENERATING },
    });

    this.logger.log(`Generating document ${documentId} of type ${documentType.name}`);

    // Assemble template data
    const templateData = await this.templateEngine.assembleTemplateData(
      document.sessionId,
      documentType.slug,
    );

    // Build DOCX
    const buffer = await this.documentBuilder.buildDocument(templateData, {
      name: documentType.name,
      slug: documentType.slug,
      category: documentType.category,
    });

    // Upload to storage
    const fileName = `${documentType.slug}-${documentId}.docx`;
    const uploadResult = await this.storage.upload(
      buffer,
      fileName,
      documentType.category.toLowerCase(),
    );

    // Update document with results
    await this.prisma.document.update({
      where: { id: documentId },
      data: {
        status: DocumentStatus.GENERATED,
        storageUrl: uploadResult.url,
        fileName: uploadResult.fileName,
        fileSize: BigInt(uploadResult.fileSize),
        generatedAt: new Date(),
        generationMetadata: {
          templateVersion: templateData.metadata.version,
          generatedAt: new Date().toISOString(),
        },
      },
    });

    this.logger.log(`Document ${documentId} generated successfully`);
  }

  /**
   * Get document by ID
   */
  async getDocument(id: string, userId: string): Promise<DocumentWithType> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        documentType: true,
        session: { select: { userId: true } },
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Verify access (user owns the session)
    if (document.session.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    return document;
  }

  /**
   * Get all documents for a session
   */
  async getSessionDocuments(sessionId: string, userId: string): Promise<DocumentWithType[]> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    return this.prisma.document.findMany({
      where: { sessionId },
      include: { documentType: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get download URL for a document
   */
  async getDownloadUrl(id: string, userId: string, expiresInMinutes: number = 60): Promise<string> {
    const document = await this.getDocument(id, userId);

    if (
      document.status !== DocumentStatus.GENERATED &&
      document.status !== DocumentStatus.APPROVED
    ) {
      throw new BadRequestException(
        `Document is not available for download. Status: ${document.status}`,
      );
    }

    if (!document.storageUrl) {
      throw new BadRequestException('Document file not found');
    }

    return this.storage.getDownloadUrl(document.storageUrl, expiresInMinutes);
  }

  /**
   * List all document types
   */
  async listDocumentTypes(): Promise<DocumentType[]> {
    return this.prisma.documentType.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  /**
   * Get documents pending review (admin)
   */
  async getPendingReviewDocuments(): Promise<DocumentWithType[]> {
    return this.prisma.document.findMany({
      where: { status: DocumentStatus.PENDING_REVIEW },
      include: { documentType: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Approve a document (admin)
   */
  async approveDocument(id: string, adminUserId: string): Promise<Document> {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    if (document.status !== DocumentStatus.PENDING_REVIEW) {
      throw new BadRequestException(
        `Only documents with PENDING_REVIEW status can be approved. Current: ${document.status}`,
      );
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.APPROVED,
        approvedById: adminUserId,
        approvedAt: new Date(),
        reviewStatus: {
          approvedBy: adminUserId,
          approvedAt: new Date().toISOString(),
        },
      },
    });
  }

  /**
   * Reject a document (admin)
   */
  async rejectDocument(id: string, adminUserId: string, reason: string): Promise<Document> {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    if (document.status !== DocumentStatus.PENDING_REVIEW) {
      throw new BadRequestException(
        `Only documents with PENDING_REVIEW status can be rejected. Current: ${document.status}`,
      );
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.REJECTED,
        rejectionReason: reason,
        reviewStatus: {
          rejectedBy: adminUserId,
          rejectedAt: new Date().toISOString(),
          reason,
        },
      },
    });
  }

  /**
   * Batch generate multiple documents for a session
   */
  async batchGenerateDocuments(
    sessionId: string,
    documentTypeIds: string[],
    userId: string,
  ): Promise<BatchGenerationResult> {
    const results: BatchGenerationResult = {
      sessionId,
      successful: [],
      failed: [],
      totalRequested: documentTypeIds.length,
    };

    for (const documentTypeId of documentTypeIds) {
      try {
        const document = await this.generateDocument({
          sessionId,
          documentTypeId,
          userId,
        });
        results.successful.push({
          documentId: document.id,
          documentTypeId,
        });
      } catch (error) {
        results.failed.push({
          documentTypeId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    this.logger.log(
      `Batch generation for session ${sessionId}: ${results.successful.length} successful, ${results.failed.length} failed`,
    );

    return results;
  }

  /**
   * Generate all available document types for a session
   */
  async generateAllDocuments(sessionId: string, userId: string): Promise<BatchGenerationResult> {
    const documentTypes = await this.listDocumentTypes();
    const documentTypeIds = documentTypes.map((dt) => dt.id);
    return this.batchGenerateDocuments(sessionId, documentTypeIds, userId);
  }

  /**
   * Regenerate a document with updated data
   */
  async regenerateDocument(documentId: string, userId: string): Promise<Document> {
    const existingDocument = await this.getDocument(documentId, userId);

    // Increment version
    const newVersion = existingDocument.version + 1;

    // Create new document record (maintains separate version records)
    const newDocument = await this.prisma.document.create({
      data: {
        sessionId: existingDocument.sessionId,
        documentTypeId: existingDocument.documentTypeId,
        status: DocumentStatus.PENDING,
        format: existingDocument.format,
        version: newVersion,
        generationMetadata: {
          previousVersionId: documentId,
          regeneratedFrom: documentId,
        },
      },
    });

    // Process generation
    const documentType = existingDocument.documentType;
    try {
      await this.processDocumentGeneration(newDocument.id, documentType);
    } catch (error) {
      await this.prisma.document.update({
        where: { id: newDocument.id },
        data: {
          status: DocumentStatus.FAILED,
          generationMetadata: {
            error: error instanceof Error ? error.message : 'Unknown error',
            failedAt: new Date().toISOString(),
          },
        },
      });
      throw error;
    }

    // Mark the old version as superseded (using REJECTED status for archived/superseded documents)
    await this.prisma.document.update({
      where: { id: documentId },
      data: {
        status: DocumentStatus.REJECTED,
        rejectionReason: `Superseded by version ${newVersion} (document ${newDocument.id})`,
      },
    });

    this.logger.log(`Document ${documentId} regenerated as ${newDocument.id} (v${newVersion})`);

    return this.prisma.document.findUnique({
      where: { id: newDocument.id },
      include: { documentType: true },
    }) as Promise<Document>;
  }

  /**
   * Get document version history
   */
  async getDocumentHistory(documentId: string, userId: string): Promise<DocumentHistoryEntry[]> {
    const document = await this.getDocument(documentId, userId);

    // Build version chain
    const history: DocumentHistoryEntry[] = [];
    let currentDoc: DocumentWithType | null = document;

    // Walk backwards through version history (using generationMetadata.previousVersionId)
    while (currentDoc) {
      history.push({
        documentId: currentDoc.id,
        version: currentDoc.version,
        status: currentDoc.status,
        createdAt: currentDoc.createdAt,
        generatedAt: currentDoc.generatedAt,
        fileSize: currentDoc.fileSize ? Number(currentDoc.fileSize) : null,
      });

      const metadata = currentDoc.generationMetadata as { previousVersionId?: string } | null;
      if (metadata?.previousVersionId) {
        currentDoc = await this.prisma.document.findUnique({
          where: { id: metadata.previousVersionId },
          include: { documentType: true },
        });
      } else {
        currentDoc = null;
      }
    }

    // Sort by version (ascending)
    history.sort((a, b) => a.version - b.version);

    return history;
  }

  /**
   * Clone document configuration for a new session
   * Useful when creating similar assessments
   */
  async cloneDocumentsToSession(
    sourceSessionId: string,
    targetSessionId: string,
    userId: string,
  ): Promise<BatchGenerationResult> {
    // Get document types used in source session
    const sourceDocuments = await this.prisma.document.findMany({
      where: { sessionId: sourceSessionId },
      select: { documentTypeId: true },
      distinct: ['documentTypeId'],
    });

    const documentTypeIds = sourceDocuments.map((d) => d.documentTypeId);

    return this.batchGenerateDocuments(targetSessionId, documentTypeIds, userId);
  }

  /**
   * Get document generation statistics
   */
  async getGenerationStats(sessionId?: string): Promise<GenerationStats> {
    const where = sessionId ? { sessionId } : {};

    const [total, byStatus, byType] = await Promise.all([
      this.prisma.document.count({ where }),
      this.prisma.document.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
      }),
      this.prisma.document.groupBy({
        by: ['documentTypeId'],
        where,
        _count: { id: true },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    byStatus.forEach((s) => {
      statusCounts[s.status] = s._count.id;
    });

    const typeCounts: Record<string, number> = {};
    byType.forEach((t) => {
      typeCounts[t.documentTypeId] = t._count.id;
    });

    return {
      totalDocuments: total,
      byStatus: statusCounts,
      byType: typeCounts,
      generated: statusCounts[DocumentStatus.GENERATED] || 0,
      pending: statusCounts[DocumentStatus.PENDING] || 0,
      failed: statusCounts[DocumentStatus.FAILED] || 0,
    };
  }

  /**
   * Export document list as CSV
   */
  async exportDocumentList(sessionId: string, userId: string): Promise<string> {
    const documents = await this.getSessionDocuments(sessionId, userId);

    const lines: string[] = [
      'Document ID,Type,Status,Version,Format,File Size,Generated At,Created At',
    ];

    for (const doc of documents) {
      lines.push(
        [
          doc.id,
          doc.documentType.name,
          doc.status,
          doc.version,
          doc.format,
          doc.fileSize?.toString() || '',
          doc.generatedAt?.toISOString() || '',
          doc.createdAt.toISOString(),
        ].join(','),
      );
    }

    return lines.join('\n');
  }

  /**
   * Schedule document regeneration for stale documents
   */
  async scheduleStaleDocumentRegeneration(maxAgeDays: number = 30): Promise<string[]> {
    const staleDate = new Date();
    staleDate.setDate(staleDate.getDate() - maxAgeDays);

    const staleDocuments = await this.prisma.document.findMany({
      where: {
        generatedAt: { lt: staleDate },
        status: { in: [DocumentStatus.GENERATED, DocumentStatus.APPROVED] },
      },
      select: { id: true },
    });

    // Mark for regeneration (in a real implementation, this would queue jobs)
    const ids = staleDocuments.map((d) => d.id);

    this.logger.log(`Identified ${ids.length} stale documents for regeneration`);

    return ids;
  }
}

/**
 * Batch generation result
 */
export interface BatchGenerationResult {
  sessionId: string;
  successful: Array<{ documentId: string; documentTypeId: string }>;
  failed: Array<{ documentTypeId: string; error: string }>;
  totalRequested: number;
}

/**
 * Document history entry
 */
export interface DocumentHistoryEntry {
  documentId: string;
  version: number;
  status: DocumentStatus;
  createdAt: Date;
  generatedAt: Date | null;
  fileSize: number | null;
}

/**
 * Generation statistics
 */
export interface GenerationStats {
  totalDocuments: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  generated: number;
  pending: number;
  failed: number;
}
