/**
 * AI Components - Sprint 34: AI Help Assistant
 * 
 * This module provides AI-powered assistance features:
 * - AI Chat Widget with streaming responses
 * - AI Answer Suggestions with confidence scoring
 * - Smart Search with semantic search and embeddings
 * - Predictive Error Prevention with AI pattern analysis
 * 
 * Nielsen Heuristics Addressed:
 * - H1: Visibility of System Status (streaming indicators, confidence scores)
 * - H5: Error Prevention (predictive warnings, validation)
 * - H6: Recognition Rather Than Recall (suggestions, smart search)
 * - H10: Help and Documentation (AI chat, contextual help)
 */

// ============================================================================
// AI Chat Widget
// ============================================================================
export {
  AIChatProvider,
  useAIChat,
  AIChatWidget,
  ChatMessage,
  ChatInput,
  QuickActions,
  type AIChatContextValue,
  type ChatMessage as ChatMessageType,
  type PageContext,
  type QuickAction,
} from './AIChatWidget';

// ============================================================================
// AI Answer Suggestions
// ============================================================================
export {
  AISuggestionsProvider,
  useAISuggestions,
  SuggestionsPanel,
  SuggestionCard,
  SuggestionBadge,
  useSuggestionKeyboard,
  type AISuggestionsContextValue,
  type AnswerSuggestion,
  type SuggestionRequest,
  type SuggestionTemplate,
} from './AISuggestions';

// ============================================================================
// AI Smart Search
// ============================================================================
export {
  SmartSearchProvider,
  useSmartSearch,
  SearchInput,
  SearchResults,
  SmartSearchBox,
  useSearchShortcut,
  EmbeddingService,
  type SmartSearchContextValue,
  type SearchResult,
  type EmbeddingVector,
  type SearchSuggestion,
  type AISearchSummary,
} from './AISmartSearch';

// ============================================================================
// AI Predictive Error Prevention
// ============================================================================
export {
  PredictiveErrorProvider,
  usePredictiveErrors,
  PredictionsPanel,
  InlineWarning,
  usePredictiveInput,
  DEFAULT_VALIDATION_RULES,
  type PredictiveErrorContextValue,
  type InputPattern,
  type PredictedError,
  type InputAnalysis,
  type FieldConfig,
  type ValidationRule,
} from './AIPredictiveErrors';

// ============================================================================
// Combined AI Provider
// ============================================================================
import React from 'react';
import { AIChatProvider } from './AIChatWidget';
import { AISuggestionsProvider } from './AISuggestions';
import { SmartSearchProvider } from './AISmartSearch';
import { PredictiveErrorProvider } from './AIPredictiveErrors';

export interface AIProviderProps {
  children: React.ReactNode;
  config?: {
    chat?: {
      apiEndpoint?: string;
      apiKey?: string;
      model?: string;
    };
    suggestions?: {
      enabled?: boolean;
    };
    search?: {
      apiEndpoint?: string;
    };
    predictive?: {
      debounceMs?: number;
    };
  };
}

/**
 * Combined AI Provider that wraps all AI feature providers
 * Use this at the app root to enable all AI features
 * 
 * @example
 * ```tsx
 * <AIProvider config={{ chat: { apiKey: 'sk-...' } }}>
 *   <App />
 * </AIProvider>
 * ```
 */
export const AIProvider: React.FC<AIProviderProps> = ({
  children,
  config = {},
}) => {
  return (
    <AIChatProvider
      apiEndpoint={config.chat?.apiEndpoint}
      apiKey={config.chat?.apiKey}
      model={config.chat?.model}
    >
      <AISuggestionsProvider>
        <SmartSearchProvider apiEndpoint={config.search?.apiEndpoint}>
          <PredictiveErrorProvider debounceMs={config.predictive?.debounceMs}>
            {children}
          </PredictiveErrorProvider>
        </SmartSearchProvider>
      </AISuggestionsProvider>
    </AIChatProvider>
  );
};

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook to check if AI features are available
 */
export const useAIAvailability = () => {
  // Check for API key in environment
  const hasApiKey = typeof window !== 'undefined' && 
    (window as any).__AI_API_KEY__ !== undefined;

  return {
    chatAvailable: hasApiKey,
    suggestionsAvailable: true, // Template-based suggestions always available
    searchAvailable: true, // Local embedding search always available
    predictiveAvailable: true, // Rule-based validation always available
  };
};

// ============================================================================
// Default Export
// ============================================================================
export default {
  // Providers
  AIProvider,
  AIChatProvider,
  AISuggestionsProvider,
  SmartSearchProvider,
  PredictiveErrorProvider,
  
  // Hooks
  useAIChat,
  useAISuggestions,
  useSmartSearch,
  usePredictiveErrors,
  usePredictiveInput,
  useSearchShortcut,
  useSuggestionKeyboard,
  useAIAvailability,
  
  // Components
  AIChatWidget,
  ChatMessage,
  ChatInput,
  QuickActions,
  SuggestionsPanel,
  SuggestionCard,
  SuggestionBadge,
  SearchInput,
  SearchResults,
  SmartSearchBox,
  PredictionsPanel,
  InlineWarning,
  
  // Services
  EmbeddingService,
  
  // Constants
  DEFAULT_VALIDATION_RULES,
};
