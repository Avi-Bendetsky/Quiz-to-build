/**
 * Questionnaire API client
 * Handles session lifecycle, question flow, scoring, and heatmap data
 */

import { apiClient } from './client';

// --- Types ---

export type Persona = 'CTO' | 'CFO' | 'CEO' | 'BA' | 'POLICY';

export interface QuestionnaireListItem {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  version: number;
  estimatedTime?: number;
  totalQuestions: number;
  sections: { id: string; name: string; questionCount: number }[];
  createdAt: string;
}

export interface CreateSessionRequest {
  questionnaireId: string;
  persona?: Persona;
  industry?: string;
}

export interface SessionResponse {
  id: string;
  questionnaireId: string;
  userId: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'EXPIRED';
  persona?: Persona;
  industry?: string;
  readinessScore?: number;
  progress: {
    percentage: number;
    answeredQuestions: number;
    totalQuestions: number;
    estimatedTimeRemaining?: number;
    sectionsLeft: number;
    questionsLeft: number;
    totalSections: number;
    completedSections: number;
  };
  currentSection?: { id: string; name: string };
  createdAt: string;
  lastActivityAt: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
}

export interface QuestionItem {
  id: string;
  text: string;
  type: string;
  required: boolean;
  helpText?: string;
  explanation?: string;
  placeholder?: string;
  options?: QuestionOption[];
  validation?: Record<string, unknown>;
}

export interface SubmitResponseRequest {
  questionId: string;
  value: unknown;
  timeSpentSeconds?: number;
}

export interface SubmitResponseResult {
  responseId: string;
  questionId: string;
  value: unknown;
  validationResult: { isValid: boolean; errors?: string[] };
  readinessScore?: number;
  nextQuestionByNQS?: {
    questionId: string;
    text: string;
    dimensionKey: string;
    expectedScoreLift: number;
  };
  progress: SessionResponse['progress'];
  createdAt: string;
}

export interface ContinueSessionResponse {
  session: SessionResponse;
  nextQuestions: QuestionItem[];
  currentSection: {
    id: string;
    name: string;
    description?: string;
    progress: number;
    questionsInSection: number;
    answeredInSection: number;
  };
  overallProgress: SessionResponse['progress'];
  readinessScore?: number;
  adaptiveState: {
    visibleQuestionCount: number;
    skippedQuestionCount: number;
    appliedRules: string[];
  };
  isComplete: boolean;
  canComplete: boolean;
}

export interface ReadinessScoreResult {
  sessionId: string;
  score: number;
  portfolioResidual: number;
  dimensions: DimensionResidual[];
  totalQuestions: number;
  answeredQuestions: number;
  completionPercentage: number;
  calculatedAt: string;
  trend: 'UP' | 'DOWN' | 'STABLE' | 'FIRST';
}

export interface DimensionResidual {
  dimensionKey: string;
  displayName: string;
  weight: number;
  residualRisk: number;
  weightedContribution: number;
  questionCount: number;
  answeredCount: number;
  averageCoverage: number;
}

export interface HeatmapResult {
  sessionId: string;
  cells: {
    dimensionKey: string;
    dimensionName: string;
    severityBucket: string;
    value: number;
    color: 'GREEN' | 'AMBER' | 'RED';
  }[];
  summary: {
    greenCells: number;
    amberCells: number;
    redCells: number;
    criticalGapCount: number;
  };
}

// --- API Functions ---

const API_PREFIX = '/api/v1';

export const questionnaireApi = {
  /** List available questionnaires */
  async listQuestionnaires(industry?: string): Promise<QuestionnaireListItem[]> {
    const params = industry ? { industry } : {};
    const { data } = await apiClient.get(`${API_PREFIX}/questionnaires`, { params });
    return data.items ?? data;
  },

  /** Create a new session */
  async createSession(request: CreateSessionRequest): Promise<SessionResponse> {
    const { data } = await apiClient.post(`${API_PREFIX}/sessions`, request);
    return data;
  },

  /** Get session by ID */
  async getSession(sessionId: string): Promise<SessionResponse> {
    const { data } = await apiClient.get(`${API_PREFIX}/sessions/${sessionId}`);
    return data;
  },

  /** List sessions for current user */
  async listSessions(status?: string): Promise<{ items: SessionResponse[]; total: number }> {
    const params = status ? { status } : {};
    const { data } = await apiClient.get(`${API_PREFIX}/sessions`, { params });
    return data;
  },

  /** Continue a session - get next questions and state */
  async continueSession(sessionId: string, questionCount = 1): Promise<ContinueSessionResponse> {
    const { data } = await apiClient.get(`${API_PREFIX}/sessions/${sessionId}/continue`, {
      params: { questionCount },
    });
    return data;
  },

  /** Submit a response to a question */
  async submitResponse(sessionId: string, request: SubmitResponseRequest): Promise<SubmitResponseResult> {
    const { data } = await apiClient.post(`${API_PREFIX}/sessions/${sessionId}/responses`, request);
    return data;
  },

  /** Complete a session (enforces >= 95% readiness gate) */
  async completeSession(sessionId: string): Promise<SessionResponse> {
    const { data } = await apiClient.post(`${API_PREFIX}/sessions/${sessionId}/complete`);
    return data;
  },

  /** Get readiness score for a session */
  async getScore(sessionId: string): Promise<ReadinessScoreResult> {
    const { data } = await apiClient.get(`${API_PREFIX}/scoring/${sessionId}`);
    return data;
  },

  /** Get NQS-prioritized next questions */
  async getNextQuestions(sessionId: string, limit = 5): Promise<{
    sessionId: string;
    currentScore: number;
    questions: Array<{
      questionId: string;
      text: string;
      dimensionKey: string;
      dimensionName: string;
      severity: number;
      currentCoverage: number;
      expectedScoreLift: number;
      rationale: string;
      rank: number;
    }>;
    maxPotentialScore: number;
  }> {
    const { data } = await apiClient.get(`${API_PREFIX}/scoring/${sessionId}/next-questions`, {
      params: { limit },
    });
    return data;
  },

  /** Get heatmap data for a session */
  async getHeatmap(sessionId: string): Promise<HeatmapResult> {
    const { data } = await apiClient.get(`${API_PREFIX}/heatmap/${sessionId}`);
    return data;
  },

  /** Get user session stats */
  async getUserStats(): Promise<{
    totalSessions: number;
    completedSessions: number;
    inProgressSessions: number;
    averageScore: number;
    highestScore: number;
  }> {
    const { data } = await apiClient.get(`${API_PREFIX}/sessions/stats`);
    return data;
  },
};

export default questionnaireApi;
