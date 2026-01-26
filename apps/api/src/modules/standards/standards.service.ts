import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import { StandardCategory, EngineeringStandard } from '@prisma/client';
import {
  StandardResponse,
  StandardWithMappings,
  GeneratedStandardsSection,
  Principle,
  STANDARD_CATEGORY_TITLES,
} from './types/standard.types';

@Injectable()
export class StandardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<StandardResponse[]> {
    const standards = await this.prisma.engineeringStandard.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    });

    return standards.map((standard) => this.mapToResponse(standard));
  }

  async findByCategory(category: StandardCategory): Promise<StandardResponse> {
    const standard = await this.prisma.engineeringStandard.findUnique({
      where: { category },
    });

    if (!standard) {
      throw new NotFoundException(`Standard category ${category} not found`);
    }

    return this.mapToResponse(standard);
  }

  async findWithMappings(category: StandardCategory): Promise<StandardWithMappings> {
    const standard = await this.prisma.engineeringStandard.findUnique({
      where: { category },
      include: {
        documentMappings: {
          include: {
            documentType: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: { priority: 'asc' },
        },
      },
    });

    if (!standard) {
      throw new NotFoundException(`Standard category ${category} not found`);
    }

    return {
      ...this.mapToResponse(standard),
      documentTypes: standard.documentMappings.map((mapping) => ({
        id: mapping.documentType.id,
        name: mapping.documentType.name,
        slug: mapping.documentType.slug,
        sectionTitle: mapping.sectionTitle ?? undefined,
        priority: mapping.priority,
      })),
    };
  }

  async getStandardsForDocument(documentTypeIdOrSlug: string): Promise<StandardResponse[]> {
    // Try to find by ID first, then by slug
    const documentType = await this.prisma.documentType.findFirst({
      where: {
        OR: [
          { id: documentTypeIdOrSlug },
          { slug: documentTypeIdOrSlug },
        ],
      },
      include: {
        standardMappings: {
          where: {
            standard: {
              isActive: true,
            },
          },
          include: {
            standard: true,
          },
          orderBy: { priority: 'asc' },
        },
      },
    });

    if (!documentType) {
      throw new NotFoundException(`Document type ${documentTypeIdOrSlug} not found`);
    }

    return documentType.standardMappings.map((mapping) =>
      this.mapToResponse(mapping.standard),
    );
  }

  async generateStandardsSection(documentTypeIdOrSlug: string): Promise<GeneratedStandardsSection> {
    const documentType = await this.prisma.documentType.findFirst({
      where: {
        OR: [
          { id: documentTypeIdOrSlug },
          { slug: documentTypeIdOrSlug },
        ],
      },
      include: {
        standardMappings: {
          where: {
            standard: {
              isActive: true,
            },
          },
          include: {
            standard: true,
          },
          orderBy: { priority: 'asc' },
        },
      },
    });

    if (!documentType) {
      throw new NotFoundException(`Document type ${documentTypeIdOrSlug} not found`);
    }

    if (documentType.standardMappings.length === 0) {
      return {
        markdown: '',
        standards: [],
      };
    }

    const standards = documentType.standardMappings.map((mapping) => ({
      category: mapping.standard.category,
      title: mapping.sectionTitle || STANDARD_CATEGORY_TITLES[mapping.standard.category],
      principles: mapping.standard.principles as Principle[],
    }));

    const markdown = this.generateMarkdown(standards);

    return {
      markdown,
      standards,
    };
  }

  private generateMarkdown(
    standards: { category: StandardCategory; title: string; principles: Principle[] }[],
  ): string {
    if (standards.length === 0) {
      return '';
    }

    const lines: string[] = [
      '## Engineering Standards Applied',
      '',
      'This document adheres to the following engineering standards and best practices:',
      '',
    ];

    for (const standard of standards) {
      lines.push(`### ${standard.title}`);
      lines.push('');

      for (const principle of standard.principles) {
        lines.push(`- **${principle.title}**: ${principle.description}`);
      }

      lines.push('');
    }

    lines.push('---');
    lines.push('');
    lines.push('*Standards Version: 2026*');

    return lines.join('\n');
  }

  private mapToResponse(standard: EngineeringStandard): StandardResponse {
    return {
      id: standard.id,
      category: standard.category,
      title: standard.title,
      description: standard.description,
      principles: standard.principles as Principle[],
      version: standard.version,
      isActive: standard.isActive,
    };
  }
}
