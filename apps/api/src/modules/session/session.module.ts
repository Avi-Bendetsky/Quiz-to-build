import { Module, forwardRef } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { QuestionnaireModule } from '../questionnaire/questionnaire.module';
import { AdaptiveLogicModule } from '../adaptive-logic/adaptive-logic.module';

@Module({
  imports: [
    QuestionnaireModule,
    forwardRef(() => AdaptiveLogicModule),
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
