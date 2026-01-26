import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '@libs/database';
import { Session, SessionStatus, Question } from '@prisma/client';
import { CreateSessionDto } from './dto/create-session.dto';
import { SubmitResponseDto } from './dto/submit-response.dto';
import { QuestionnaireService, QuestionResponse } from '../questionnaire/questionnaire.service';
import { AdaptiveLogicService } from '../adaptive-logic/adaptive-logic.service';
import { PaginationDto } from '@libs/shared';

export interface ProgressInfo {
  percentage: number;
  answeredQuestions: number;
  totalQuestions: number;
  estimatedTimeRemaining?: number;
}

export interface SessionResponse {
  id: string;
  questionnaireId: string;
  userId: string;
  status: SessionStatus;
  industry?: string;
  progress: ProgressInfo;
  currentSection?: {
    id: string;
    name: string;
  };
  createdAt: Date;
  lastActivityAt: Date;
}

export interface NextQuestionResponse {
  questions: QuestionResponse[];
  section: {
    id: string;
    name: string;
    progress: number;
  };
  overallProgress: ProgressInfo;
}

export interface SubmitResponseResult {
  responseId: string;
  questionId: string;
  value: unknown;
  validationResult: {
    isValid: boolean;
    errors?: string[];
  };
  adaptiveChanges?: {
    questionsAdded: string[];
    questionsRemoved: string[];
    newEstimatedTotal: number;
  };
  progress: ProgressInfo;
  createdAt: Date;
}

export interface ContinueSessionResponse {
  session: SessionResponse;
  nextQuestions: QuestionResponse[];
  currentSection: {
    id: string;
    name: string;
    description?: string;
    progress: number;
    questionsInSection: number;
    answeredInSection: number;
  };
  overallProgress: ProgressInfo;
  adaptiveState: {
    visibleQuestionCount: number;
    skippedQuestionCount: number;
    appliedRules: string[];
  };
  isComplete: boolean;
  canComplete: boolean;
}

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionnaireService: QuestionnaireService,
    @Inject(forwardRef(() => AdaptiveLogicService))
    private readonly adaptiveLogicService: AdaptiveLogicService,
  ) { }

  async create(userId: string, dto: CreateSessionDto): Promise<SessionResponse> {
    // Get questionnaire
    const questionnaire = await this.questionnaireService.findById(dto.questionnaireId);

    // Get total question count
    const totalQuestions = await this.questionnaireService.getTotalQuestionCount(
      dto.questionnaireId,
    );

    // Get first section and question
    const firstSection = questionnaire.sections[0];
    const firstQuestion = firstSection?.questions?.[0];

    // Create session
    const session = await this.prisma.session.create({
      data: {
        userId,
        questionnaireId: dto.questionnaireId,
        questionnaireVersion: questionnaire.version,
        industry: dto.industry,
        status: SessionStatus.IN_PROGRESS,
        progress: {
          percentage: 0,
          answered: 0,
          total: totalQuestions,
        },
        currentSectionId: firstSection?.id,
        currentQuestionId: firstQuestion?.id,
        adaptiveState: {
          activeQuestionIds: [],
          skippedQuestionIds: [],
          branchHistory: [],
        },
      },
      include: {
        currentSection: true,
      },
    });

    return this.mapToSessionResponse(session, totalQuestions);
  }

  async findById(sessionId: string, userId: string): Promise<SessionResponse> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        currentSection: true,
        questionnaire: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Access denied to this session');
    }

    const totalQuestions = await this.questionnaireService.getTotalQuestionCount(
      session.questionnaireId,
    );

    return this.mapToSessionResponse(session, totalQuestions);
  }

  async findAllByUser(
    userId: string,
    pagination: PaginationDto,
    status?: SessionStatus,
  ): Promise<{ items: SessionResponse[]; total: number }> {
    const where = {
      userId,
      ...(status && { status }),
    };

    const [sessions, total] = await Promise.all([
      this.prisma.session.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { startedAt: 'desc' },
        include: {
          currentSection: true,
          questionnaire: true,
        },
      }),
      this.prisma.session.count({ where }),
    ]);

    const items = await Promise.all(
      sessions.map(async (session) => {
        const totalQuestions = await this.questionnaireService.getTotalQuestionCount(
          session.questionnaireId,
        );
        return this.mapToSessionResponse(session, totalQuestions);
      }),
    );

    return { items, total };
  }

  async getNextQuestion(
    sessionId: string,
    userId: string,
    count: number = 1,
  ): Promise<NextQuestionResponse> {
    const session = await this.getSessionWithValidation(sessionId, userId);

    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Session is already completed');
    }

    // Get all responses for this session
    const responses = await this.prisma.response.findMany({
      where: { sessionId },
    });

    const responseMap = new Map(responses.map((r) => [r.questionId, r.value]));

    // Get current question and evaluate visibility
    const currentQuestion = await this.questionnaireService.getQuestionById(
      session.currentQuestionId!,
    );

    if (!currentQuestion) {
      throw new NotFoundException('Current question not found');
    }

    // Evaluate adaptive logic to get visible questions
    const visibleQuestions = await this.adaptiveLogicService.getVisibleQuestions(
      session.questionnaireId,
      responseMap,
    );

    // Get the next N visible questions starting from current position
    const nextQuestions: QuestionResponse[] = [];
    let currentIndex = visibleQuestions.findIndex((q) => q.id === session.currentQuestionId);

    for (let i = currentIndex; i < visibleQuestions.length && nextQuestions.length < count; i++) {
      const question = visibleQuestions[i];
      // Skip already answered questions
      if (!responseMap.has(question.id)) {
        nextQuestions.push(this.mapQuestionToResponse(question));
      }
    }

    // Calculate progress
    const answeredCount = responses.length;
    const totalVisible = visibleQuestions.length;
    const progress = this.calculateProgress(answeredCount, totalVisible);

    // Get section info
    const section = await this.prisma.section.findUnique({
      where: { id: currentQuestion.sectionId },
    });

    const sectionQuestions = visibleQuestions.filter(
      (q) => q.sectionId === currentQuestion.sectionId,
    );
    const sectionAnswered = sectionQuestions.filter((q) => responseMap.has(q.id)).length;
    const sectionProgress = Math.round((sectionAnswered / sectionQuestions.length) * 100);

    return {
      questions: nextQuestions,
      section: {
        id: section!.id,
        name: section!.name,
        progress: sectionProgress,
      },
      overallProgress: progress,
    };
  }

  async submitResponse(
    sessionId: string,
    userId: string,
    dto: SubmitResponseDto,
  ): Promise<SubmitResponseResult> {
    const session = await this.getSessionWithValidation(sessionId, userId);

    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Session is already completed');
    }

    // Validate question exists
    const question = await this.questionnaireService.getQuestionById(dto.questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Validate response value
    const validation = this.validateResponse(question, dto.value);

    // Upsert response
    const response = await this.prisma.response.upsert({
      where: {
        sessionId_questionId: {
          sessionId,
          questionId: dto.questionId,
        },
      },
      create: {
        sessionId,
        questionId: dto.questionId,
        value: JSON.parse(JSON.stringify(dto.value)),
        isValid: validation.isValid,
        validationErrors: validation.errors ? JSON.parse(JSON.stringify({ errors: validation.errors })) : undefined,
        timeSpentSeconds: dto.timeSpentSeconds,
      },
      update: {
        value: JSON.parse(JSON.stringify(dto.value)),
        isValid: validation.isValid,
        validationErrors: validation.errors ? JSON.parse(JSON.stringify({ errors: validation.errors })) : undefined,
        timeSpentSeconds: dto.timeSpentSeconds,
        revision: { increment: 1 },
      },
    });

    // Get all responses to evaluate adaptive logic
    const allResponses = await this.prisma.response.findMany({
      where: { sessionId },
    });
    const responseMap = new Map(allResponses.map((r) => [r.questionId, r.value]));

    // Evaluate adaptive changes
    const visibleQuestions = await this.adaptiveLogicService.getVisibleQuestions(
      session.questionnaireId,
      responseMap,
    );

    // Find next question
    const nextQuestion = this.findNextUnansweredQuestion(
      visibleQuestions,
      dto.questionId,
      responseMap,
    );

    // Update session
    const progress = this.calculateProgress(allResponses.length, visibleQuestions.length);

    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        currentQuestionId: nextQuestion?.id,
        currentSectionId: nextQuestion?.sectionId,
        lastActivityAt: new Date(),
        progress: {
          percentage: progress.percentage,
          answered: progress.answeredQuestions,
          total: progress.totalQuestions,
        },
      },
    });

    return {
      responseId: response.id,
      questionId: dto.questionId,
      value: dto.value,
      validationResult: validation,
      progress,
      createdAt: response.answeredAt,
    };
  }

  async completeSession(sessionId: string, userId: string): Promise<SessionResponse> {
    const session = await this.getSessionWithValidation(sessionId, userId);

    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Session is already completed');
    }

    // Update session status
    const updatedSession = await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        status: SessionStatus.COMPLETED,
        completedAt: new Date(),
      },
      include: {
        currentSection: true,
        questionnaire: true,
      },
    });

    const totalQuestions = await this.questionnaireService.getTotalQuestionCount(
      session.questionnaireId,
    );

    return this.mapToSessionResponse(updatedSession, totalQuestions);
  }

  async continueSession(
    sessionId: string,
    userId: string,
    questionCount: number = 1,
  ): Promise<ContinueSessionResponse> {
    // Get session with full context
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        currentSection: true,
        questionnaire: {
          include: {
            sections: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Access denied to this session');
    }

    // Check if already completed
    const isComplete = session.status === SessionStatus.COMPLETED;

    // Get all responses for this session
    const responses = await this.prisma.response.findMany({
      where: { sessionId },
      orderBy: { answeredAt: 'desc' },
    });

    const responseMap = new Map(responses.map((r) => [r.questionId, r.value]));

    // Evaluate adaptive logic to get visible questions
    const visibleQuestions = await this.adaptiveLogicService.getVisibleQuestions(
      session.questionnaireId,
      responseMap,
    );

    // Get adaptive state info
    const adaptiveState = session.adaptiveState as {
      skippedQuestionIds?: string[];
      branchHistory?: string[];
    };

    // Calculate total questions and skipped
    const totalQuestionsInQuestionnaire = await this.questionnaireService.getTotalQuestionCount(
      session.questionnaireId,
    );
    const skippedCount = totalQuestionsInQuestionnaire - visibleQuestions.length;

    // Find next unanswered questions
    const nextQuestions: QuestionResponse[] = [];

    if (!isComplete && session.currentQuestionId) {
      const currentIndex = visibleQuestions.findIndex(
        (q) => q.id === session.currentQuestionId,
      );

      // Start from current question and find unanswered ones
      for (let i = Math.max(0, currentIndex); i < visibleQuestions.length && nextQuestions.length < questionCount; i++) {
        const question = visibleQuestions[i];
        if (!responseMap.has(question.id)) {
          nextQuestions.push(this.mapQuestionToResponse(question));
        }
      }

      // If we didn't find enough, check from the beginning
      if (nextQuestions.length < questionCount) {
        for (let i = 0; i < currentIndex && nextQuestions.length < questionCount; i++) {
          const question = visibleQuestions[i];
          if (!responseMap.has(question.id)) {
            nextQuestions.push(this.mapQuestionToResponse(question));
          }
        }
      }
    }

    // Calculate progress
    const answeredCount = responses.length;
    const progress = this.calculateProgress(answeredCount, visibleQuestions.length);

    // Get current section details
    let currentSectionInfo = {
      id: '',
      name: '',
      description: undefined as string | undefined,
      progress: 0,
      questionsInSection: 0,
      answeredInSection: 0,
    };

    if (session.currentSection) {
      const sectionQuestions = visibleQuestions.filter(
        (q) => q.sectionId === session.currentSection!.id,
      );
      const sectionAnswered = sectionQuestions.filter((q) => responseMap.has(q.id)).length;

      currentSectionInfo = {
        id: session.currentSection.id,
        name: session.currentSection.name,
        description: (session.currentSection as any).description ?? undefined,
        progress: sectionQuestions.length > 0
          ? Math.round((sectionAnswered / sectionQuestions.length) * 100)
          : 0,
        questionsInSection: sectionQuestions.length,
        answeredInSection: sectionAnswered,
      };
    }

    // Determine if session can be completed (all required questions answered)
    const unansweredRequired = visibleQuestions.filter(
      (q) => q.isRequired && !responseMap.has(q.id),
    );
    const canComplete = unansweredRequired.length === 0 && answeredCount > 0;

    // Build session response
    const sessionResponse: SessionResponse = {
      id: session.id,
      questionnaireId: session.questionnaireId,
      userId: session.userId,
      status: session.status,
      industry: session.industry ?? undefined,
      progress,
      currentSection: session.currentSection
        ? { id: session.currentSection.id, name: session.currentSection.name }
        : undefined,
      createdAt: session.startedAt,
      lastActivityAt: session.lastActivityAt,
    };

    // Update last activity timestamp
    if (!isComplete) {
      await this.prisma.session.update({
        where: { id: sessionId },
        data: { lastActivityAt: new Date() },
      });
    }

    return {
      session: sessionResponse,
      nextQuestions,
      currentSection: currentSectionInfo,
      overallProgress: progress,
      adaptiveState: {
        visibleQuestionCount: visibleQuestions.length,
        skippedQuestionCount: skippedCount,
        appliedRules: adaptiveState.branchHistory || [],
      },
      isComplete,
      canComplete,
    };
  }

  private async getSessionWithValidation(
    sessionId: string,
    userId: string,
  ): Promise<Session> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Access denied to this session');
    }

    return session;
  }

  private mapToSessionResponse(
    session: Session & { currentSection?: { id: string; name: string } | null },
    totalQuestions: number,
  ): SessionResponse {
    const progress = session.progress as { percentage: number; answered: number; total: number };

    return {
      id: session.id,
      questionnaireId: session.questionnaireId,
      userId: session.userId,
      status: session.status,
      industry: session.industry ?? undefined,
      progress: {
        percentage: progress.percentage,
        answeredQuestions: progress.answered,
        totalQuestions: progress.total || totalQuestions,
      },
      currentSection: session.currentSection
        ? { id: session.currentSection.id, name: session.currentSection.name }
        : undefined,
      createdAt: session.startedAt,
      lastActivityAt: session.lastActivityAt,
    };
  }

  private mapQuestionToResponse(question: Question): QuestionResponse {
    const options = question.options as { id: string; label: string; description?: string }[] | null;
    const validation = question.validationRules as Record<string, unknown> | null;

    return {
      id: question.id,
      text: question.text,
      type: question.type,
      required: question.isRequired,
      helpText: question.helpText ?? undefined,
      explanation: question.explanation ?? undefined,
      placeholder: question.placeholder ?? undefined,
      options: options ?? undefined,
      validation: validation ?? undefined,
    };
  }

  private calculateProgress(answered: number, total: number): ProgressInfo {
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
    const avgTimePerQuestion = 1.5; // minutes
    const estimatedTimeRemaining = Math.ceil((total - answered) * avgTimePerQuestion);

    return {
      percentage,
      answeredQuestions: answered,
      totalQuestions: total,
      estimatedTimeRemaining,
    };
  }

  private validateResponse(
    question: Question,
    value: unknown,
  ): { isValid: boolean; errors?: string[] } {
    const errors: string[] = [];
    const validation = question.validationRules as Record<string, unknown> | null;

    // Check required
    if (question.isRequired && (value === null || value === undefined || value === '')) {
      errors.push('This field is required');
    }

    // Type-specific validation
    if (value !== null && value !== undefined) {
      if (validation) {
        // Min/max length for text
        if (validation.minLength && typeof value === 'string' && value.length < (validation.minLength as number)) {
          errors.push(`Minimum length is ${validation.minLength} characters`);
        }
        if (validation.maxLength && typeof value === 'string' && value.length > (validation.maxLength as number)) {
          errors.push(`Maximum length is ${validation.maxLength} characters`);
        }

        // Min/max for numbers
        if (validation.min && typeof value === 'number' && value < (validation.min as number)) {
          errors.push(`Minimum value is ${validation.min}`);
        }
        if (validation.max && typeof value === 'number' && value > (validation.max as number)) {
          errors.push(`Maximum value is ${validation.max}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  private findNextUnansweredQuestion(
    visibleQuestions: Question[],
    currentQuestionId: string,
    responseMap: Map<string, unknown>,
  ): Question | null {
    const currentIndex = visibleQuestions.findIndex((q) => q.id === currentQuestionId);

    for (let i = currentIndex + 1; i < visibleQuestions.length; i++) {
      if (!responseMap.has(visibleQuestions[i].id)) {
        return visibleQuestions[i];
      }
    }

    // Check if there are any unanswered questions before current
    for (let i = 0; i < currentIndex; i++) {
      if (!responseMap.has(visibleQuestions[i].id)) {
        return visibleQuestions[i];
      }
    }

    return null;
  }
}
