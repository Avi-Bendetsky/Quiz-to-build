import { IsUUID, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: 'quest_001', description: 'ID of the questionnaire to start' })
  @IsUUID()
  questionnaireId: string;

  @ApiPropertyOptional({ example: 'saas', description: 'Industry context for adaptive logic' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;
}
