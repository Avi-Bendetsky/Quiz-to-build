import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@libs/database';
import { RedisModule } from '@libs/redis';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { QuestionnaireModule } from './modules/questionnaire/questionnaire.module';
import { SessionModule } from './modules/session/session.module';
import { AdaptiveLogicModule } from './modules/adaptive-logic/adaptive-logic.module';
import { StandardsModule } from './modules/standards/standards.module';
import { ScoringModule } from './modules/scoring/scoring.module';
import { HealthController } from './health.controller';
import { RootController } from './root.controller';
import { PagesController } from './pages.controller';
import { DashboardController } from './dashboard.controller';
import { AdminController } from './admin.controller';
import { QuestionnaireUIController } from './questionnaire-ui.controller';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Database
    PrismaModule,

    // Cache
    RedisModule,

    // Feature modules
    AuthModule,
    UsersModule,
    QuestionnaireModule,
    SessionModule,
    AdaptiveLogicModule,
    StandardsModule,
    ScoringModule,
  ],
  controllers: [
    HealthController,
    RootController,
    PagesController,
    DashboardController,
    AdminController,
    QuestionnaireUIController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
