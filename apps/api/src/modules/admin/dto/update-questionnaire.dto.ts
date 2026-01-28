import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateQuestionnaireDto } from './create-questionnaire.dto';

export class UpdateQuestionnaireDto extends PartialType(CreateQuestionnaireDto) {
  @ApiPropertyOptional({ description: 'Whether questionnaire is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
