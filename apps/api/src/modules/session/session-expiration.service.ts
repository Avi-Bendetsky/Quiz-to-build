import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@libs/database';

@Injectable()
export class SessionExpirationService {
  private readonly logger = new Logger(SessionExpirationService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredSessions(): Promise<void> {
    const now = new Date();

    const result = await this.prisma.session.updateMany({
      where: {
        status: 'IN_PROGRESS',
        expiresAt: {
          lte: now,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    if (result.count > 0) {
      this.logger.log(`Expired ${result.count} sessions`);
    }
  }
}
