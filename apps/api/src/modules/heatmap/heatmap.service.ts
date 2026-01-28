import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import { RedisService } from '@libs/redis';
import {
    HeatmapResultDto,
    HeatmapCellDto,
    HeatmapSummaryDto,
    HeatmapDrilldownDto,
    SeverityBucket,
    SeverityBuckets,
    HeatmapColor,
    HeatmapColors,
} from './dto';

/**
 * Gap Heatmap Generator Service
 * 
 * Generates dimension × severity matrix for visualizing readiness gaps.
 * Each cell shows: Sum(Severity × (1 - Coverage)) for questions in that bucket.
 * 
 * Color coding:
 * - Green: Residual <= 0.05 (low risk)
 * - Amber: Residual 0.05 - 0.15 (moderate risk)
 * - Red: Residual > 0.15 (high risk)
 */
@Injectable()
export class HeatmapService {
    private readonly logger = new Logger(HeatmapService.name);
    private readonly CACHE_TTL = 300; // 5 minutes

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {}

    /**
     * Generate complete heatmap for a session.
     */
    async generateHeatmap(sessionId: string): Promise<HeatmapResultDto> {
        const startTime = Date.now();

        // Check cache first
        const cached = await this.getCachedHeatmap(sessionId);
        if (cached) {
            this.logger.debug(`Heatmap cache hit for session ${sessionId}`);
            return cached;
        }

        // Load data
        const { session, dimensions, questions, responses } = await this.loadData(sessionId);

        // Generate cells
        const cells = this.generateCells(dimensions, questions, responses);

        // Calculate summary
        const summary = this.calculateSummary(cells);

        const result: HeatmapResultDto = {
            sessionId,
            cells,
            dimensions: dimensions.map((d: { displayName: string }) => d.displayName),
            severityBuckets: SeverityBuckets.order,
            summary,
            generatedAt: new Date(),
        };

        // Cache result
        await this.cacheHeatmap(sessionId, result);

        const elapsed = Date.now() - startTime;
        this.logger.log(`Heatmap generated for session ${sessionId} in ${elapsed}ms`);

        return result;
    }

    /**
     * Export heatmap to CSV format.
     */
    async exportToCsv(sessionId: string): Promise<string> {
        const result = await this.generateHeatmap(sessionId);
        const lines: string[] = [];

        // Header row
        lines.push('Dimension,' + SeverityBuckets.order.join(','));

        // Group cells by dimension
        const cellsByDimension = this.groupBy(result.cells, c => c.dimensionKey);
        
        for (const [dimKey, dimCells] of Object.entries(cellsByDimension)) {
            const values = [dimKey];
            for (const bucket of SeverityBuckets.order) {
                const cell = dimCells.find(c => c.severityBucket === bucket);
                values.push(cell?.cellValue.toFixed(4) ?? '0.0000');
            }
            lines.push(values.join(','));
        }

        // Summary
        lines.push('');
        lines.push('# Summary');
        lines.push(`Total Cells,${result.summary.totalCells}`);
        lines.push(`Green (<=0.05),${result.summary.greenCells}`);
        lines.push(`Amber (0.05-0.15),${result.summary.amberCells}`);
        lines.push(`Red (>0.15),${result.summary.redCells}`);
        lines.push(`Critical Gaps,${result.summary.criticalGapCount}`);
        lines.push(`Overall Risk Score,${result.summary.overallRiskScore.toFixed(2)}`);

        return lines.join('\n');
    }

    /**
     * Export heatmap to Markdown format.
     */
    async exportToMarkdown(sessionId: string): Promise<string> {
        const result = await this.generateHeatmap(sessionId);
        const lines: string[] = [];

        lines.push('# Gap Heatmap Report');
        lines.push('');
        lines.push(`**Session ID:** ${sessionId}`);
        lines.push(`**Generated:** ${result.generatedAt.toISOString()}`);
        lines.push('');

        // Table header
        lines.push('| Dimension | ' + SeverityBuckets.order.join(' | ') + ' |');
        lines.push('|' + Array(SeverityBuckets.order.length + 1).fill('---').join('|') + '|');

        // Group cells by dimension
        const cellsByDimension = this.groupBy(result.cells, c => c.dimensionKey);

        for (const [dimKey, dimCells] of Object.entries(cellsByDimension)) {
            const row = [dimKey];
            for (const bucket of SeverityBuckets.order) {
                const cell = dimCells.find(c => c.severityBucket === bucket);
                if (cell) {
                    const emoji = cell.colorCode === HeatmapColor.GREEN ? 'G' :
                                  cell.colorCode === HeatmapColor.AMBER ? 'A' : 'R';
                    row.push(`${emoji} ${cell.cellValue.toFixed(2)}`);
                } else {
                    row.push('G 0.00');
                }
            }
            lines.push('| ' + row.join(' | ') + ' |');
        }

        // Summary section
        lines.push('');
        lines.push('## Summary');
        lines.push('');
        lines.push('| Metric | Value |');
        lines.push('|--------|-------|');
        lines.push(`| Total Cells | ${result.summary.totalCells} |`);
        lines.push(`| Green (<=0.05) | ${result.summary.greenCells} |`);
        lines.push(`| Amber (0.05-0.15) | ${result.summary.amberCells} |`);
        lines.push(`| Red (>0.15) | ${result.summary.redCells} |`);
        lines.push(`| Critical Gaps | ${result.summary.criticalGapCount} |`);
        lines.push(`| Overall Risk Score | ${result.summary.overallRiskScore.toFixed(2)}% |`);

        // Legend
        lines.push('');
        lines.push('## Legend');
        lines.push('');
        lines.push('- **Cell Value**: Sum(Severity × (1 - Coverage)) for questions in that bucket');
        lines.push('- **G Green**: Residual <= 0.05 (low risk)');
        lines.push('- **A Amber**: Residual 0.05 - 0.15 (moderate risk)');
        lines.push('- **R Red**: Residual > 0.15 (high risk)');

        return lines.join('\n');
    }

    /**
     * Get heatmap summary statistics only.
     */
    async getSummary(sessionId: string): Promise<HeatmapSummaryDto> {
        const result = await this.generateHeatmap(sessionId);
        return result.summary;
    }

    /**
     * Get filtered cells from heatmap.
     */
    async getCells(
        sessionId: string,
        dimension?: string,
        severity?: string,
    ): Promise<HeatmapCellDto[]> {
        const result = await this.generateHeatmap(sessionId);
        let cells = result.cells;

        if (dimension) {
            cells = cells.filter(c => 
                c.dimensionKey.toLowerCase() === dimension.toLowerCase()
            );
        }
        if (severity) {
            cells = cells.filter(c => 
                c.severityBucket.toLowerCase() === severity.toLowerCase()
            );
        }

        return cells;
    }

    /**
     * Drilldown into a specific heatmap cell.
     */
    async drilldown(
        sessionId: string,
        dimensionKey: string,
        severityBucket: string,
    ): Promise<HeatmapDrilldownDto> {
        const { session, dimensions, questions, responses } = await this.loadData(sessionId);

        // Find matching cell
        const result = await this.generateHeatmap(sessionId);
        const cell = result.cells.find(
            c => c.dimensionKey.toLowerCase() === dimensionKey.toLowerCase() &&
                 c.severityBucket.toLowerCase() === severityBucket.toLowerCase()
        );

        if (!cell) {
            throw new NotFoundException('Cell not found');
        }

        // Build response lookup
        const responseLookup = new Map(responses.map((r: { questionId: string; coverage: any }) => [r.questionId, r]));

        // Get questions for this cell
        const bucket = severityBucket as SeverityBucket;
        const dim = dimensions.find((d: { key: string }) => 
            d.key.toLowerCase() === dimensionKey.toLowerCase()
        );

        const cellQuestions = questions
            .filter((q: { dimensionKey: string | null }) => q.dimensionKey === dim?.key)
            .filter((q: { severity: any }) => SeverityBuckets.getBucket(Number(q.severity || 0.5)) === bucket)
            .map((q: { id: string; text: string; severity: any }) => {
                const response = responseLookup.get(q.id) as { coverage: any } | undefined;
                const coverage = response?.coverage ? Number(response.coverage) : 0;
                const severity = Number(q.severity || 0.5);
                return {
                    questionId: q.id,
                    text: q.text,
                    severity,
                    currentCoverage: coverage,
                    residualContribution: severity * (1 - coverage),
                };
            });

        const potentialImprovement = cellQuestions.reduce(
            (sum, q) => sum + q.residualContribution,
            0
        );

        return {
            cell,
            contributingQuestions: cellQuestions,
            potentialImprovement,
        };
    }

    /**
     * Invalidate heatmap cache for a session.
     */
    async invalidateCache(sessionId: string): Promise<void> {
        const cacheKey = `heatmap:${sessionId}`;
        await this.redis.del(cacheKey);
        this.logger.debug(`Heatmap cache invalidated for session ${sessionId}`);
    }

    // ========================================
    // Private helpers
    // ========================================

    private async loadData(sessionId: string) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
            include: { questionnaire: true },
        });

        if (!session) {
            throw new NotFoundException(`Session not found: ${sessionId}`);
        }

        const dimensions = await this.prisma.dimensionCatalog.findMany({
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' },
        });

        const questions = await this.prisma.question.findMany({
            where: {
                section: {
                    questionnaireId: session.questionnaireId,
                },
                dimensionKey: { not: null },
            },
        });

        const responses = await this.prisma.response.findMany({
            where: { sessionId },
        });

        return { session, dimensions, questions, responses };
    }

    private generateCells(
        dimensions: Array<{ id: string; key: string; displayName: string }>,
        questions: Array<{ id: string; dimensionKey: string | null; severity: any }>,
        responses: Array<{ questionId: string; coverage: any }>,
    ): HeatmapCellDto[] {
        const responseLookup = new Map(responses.map(r => [r.questionId, r]));
        const cells: HeatmapCellDto[] = [];

        for (const dimension of dimensions) {
            const dimQuestions = questions.filter(q => q.dimensionKey === dimension.key);

            for (const bucket of SeverityBuckets.order) {
                const bucketQuestions = dimQuestions.filter(
                    q => SeverityBuckets.getBucket(Number(q.severity || 0.5)) === bucket
                );

                let cellValue = 0;
                for (const q of bucketQuestions) {
                    const response = responseLookup.get(q.id);
                    const coverage = response?.coverage ? Number(response.coverage) : 0;
                    const severity = Number(q.severity || 0.5);
                    cellValue += severity * (1 - coverage);
                }

                cells.push(new HeatmapCellDto({
                    dimensionId: dimension.id,
                    dimensionKey: dimension.key,
                    severityBucket: bucket,
                    cellValue: Math.round(cellValue * 10000) / 10000,
                    colorCode: HeatmapColors.getColor(cellValue),
                    questionCount: bucketQuestions.length,
                }));
            }
        }

        return cells;
    }

    private calculateSummary(cells: HeatmapCellDto[]): HeatmapSummaryDto {
        const greenCells = cells.filter(c => c.colorCode === HeatmapColor.GREEN).length;
        const amberCells = cells.filter(c => c.colorCode === HeatmapColor.AMBER).length;
        const redCells = cells.filter(c => c.colorCode === HeatmapColor.RED).length;
        const criticalGapCount = cells.filter(
            c => c.severityBucket === SeverityBucket.CRITICAL && c.colorCode === HeatmapColor.RED
        ).length;
        const overallRiskScore = cells.reduce((sum, c) => sum + c.cellValue, 0);

        return {
            totalCells: cells.length,
            greenCells,
            amberCells,
            redCells,
            criticalGapCount,
            overallRiskScore: Math.round(overallRiskScore * 100) / 100,
        };
    }

    private async getCachedHeatmap(sessionId: string): Promise<HeatmapResultDto | null> {
        try {
            const cacheKey = `heatmap:${sessionId}`;
            const cached = await this.redis.get(cacheKey);
            if (cached) {
                const result = JSON.parse(cached);
                result.generatedAt = new Date(result.generatedAt);
                return result;
            }
        } catch (error) {
            this.logger.warn(`Failed to get cached heatmap for ${sessionId}`, error);
        }
        return null;
    }

    private async cacheHeatmap(sessionId: string, result: HeatmapResultDto): Promise<void> {
        try {
            const cacheKey = `heatmap:${sessionId}`;
            await this.redis.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);
        } catch (error) {
            this.logger.warn(`Failed to cache heatmap for ${sessionId}`, error);
        }
    }

    private groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
        return array.reduce((acc, item) => {
            const key = keyFn(item);
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {} as Record<string, T[]>);
    }
}
