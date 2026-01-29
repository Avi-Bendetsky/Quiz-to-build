/**
 * Personalization Components Index
 * 
 * Sprint 37: Adaptive UI & Personalization
 * Provides user preference learning, adaptive navigation,
 * personalized dashboards, smart recommendations, and A/B testing.
 */

// =============================================================================
// USER PREFERENCES EXPORTS
// =============================================================================

export {
  // Provider & Context
  UserPreferencesProvider,
  useUserPreferences,
  
  // Types
  type InteractionEvent,
  type InteractionType,
  type InteractionContext,
  type UsagePattern,
  type FeatureUsage,
  type NavigationPattern,
  type ShortcutUsage,
  type QuestionBehavior,
  type UserPreferences,
  type DashboardWidgetConfig,
  type NotificationPreference,
  type TimeRange,
  type LearnedInsight,
  type InsightType,
  type UserPreferencesState,
  type UserPreferencesContextType,
  type UserPreferencesProviderProps,
  
  // Components
  PreferencesPanel,
  InsightsPanel,
  UsageStatsPanel,
  
  // Hooks
  useInteractionTracking,
  useQuestionTracking,
} from './UserPreferences';

// =============================================================================
// ADAPTIVE NAVIGATION EXPORTS
// =============================================================================

export {
  // Provider & Context
  AdaptiveNavProvider,
  useAdaptiveNav,
  
  // Types
  type NavItem,
  type NavItemUsage,
  type NavigationSuggestion,
  type SuggestionType,
  type QuickAccessItem,
  type NavigationHistory,
  type AdaptiveNavState,
  type AdaptiveNavContextType,
  type AdaptiveNavProviderProps,
  
  // Components
  AdaptiveSidebar,
  NextActionSuggestion,
  AdaptiveBreadcrumb,
  type AdaptiveSidebarProps,
  type AdaptiveBreadcrumbProps,
} from './AdaptiveNavigation';

// =============================================================================
// PERSONALIZATION EXPORTS
// =============================================================================

export {
  // Provider & Context
  PersonalizationProvider,
  usePersonalization,
  
  // Dashboard Types
  type DashboardWidget,
  type WidgetType,
  type WidgetSize,
  type WidgetPosition,
  type WidgetInstance,
  type DashboardLayout,
  
  // Recommendation Types
  type Recommendation,
  type RecommendationType,
  type PredictionModel,
  type PredictionFactor,
  
  // A/B Testing Types
  type Experiment,
  type ExperimentStatus,
  type ExperimentVariant,
  type AudienceFilter,
  type ExperimentMetric,
  type MetricType,
  type VariantResult,
  type FeatureFlag,
  type FeatureFlagRule,
  type FlagCondition,
  
  // State Types
  type PersonalizationState,
  type PersonalizationContextType,
  type PersonalizationProviderProps,
  
  // Dashboard Components
  DashboardToolbar,
  WidgetPicker,
  WidgetComponent,
  RecommendationsWidget,
  PersonalizedDashboard,
  type WidgetComponentProps,
  
  // A/B Testing Components
  ABTest,
  FeatureFlag,
  type ABTestProps,
  type FeatureFlagProps,
  
  // Utility Components
  CompletionTimePredictor,
  type CompletionTimePredictorProps,
} from './Personalization';

// =============================================================================
// COMBINED PERSONALIZATION PROVIDER
// =============================================================================

import React, { ReactNode } from 'react';
import { UserPreferencesProvider } from './UserPreferences';
import { AdaptiveNavProvider, NavItem } from './AdaptiveNavigation';
import { PersonalizationProvider } from './Personalization';

export interface PersonalizationSuiteProviderProps {
  children: ReactNode;
  userId?: string;
  userRole?: string;
  userTier?: string;
  navItems?: NavItem[];
  onNavigate?: (path: string) => void;
  enablePreferenceLearning?: boolean;
  enableAdaptiveNav?: boolean;
  enablePersonalization?: boolean;
}

/**
 * Combined Personalization Suite Provider
 * Wraps application with all personalization features:
 * - User preference learning
 * - Adaptive navigation
 * - Personalized dashboards
 * - A/B testing
 */
export const PersonalizationSuiteProvider: React.FC<PersonalizationSuiteProviderProps> = ({
  children,
  userId,
  userRole,
  userTier,
  navItems,
  onNavigate,
  enablePreferenceLearning = true,
  enableAdaptiveNav = true,
  enablePersonalization = true,
}) => {
  let content = <>{children}</>;

  if (enablePersonalization) {
    content = (
      <PersonalizationProvider userId={userId} userRole={userRole} userTier={userTier}>
        {content}
      </PersonalizationProvider>
    );
  }

  if (enableAdaptiveNav) {
    content = (
      <AdaptiveNavProvider navItems={navItems} onNavigate={onNavigate}>
        {content}
      </AdaptiveNavProvider>
    );
  }

  if (enablePreferenceLearning) {
    content = (
      <UserPreferencesProvider userId={userId}>
        {content}
      </UserPreferencesProvider>
    );
  }

  return content;
};

// =============================================================================
// HOOKS FOR COMBINED FUNCTIONALITY
// =============================================================================

import { useCallback } from 'react';

/**
 * Hook for tracking user interactions across all personalization systems
 */
export const usePersonalizationTracking = () => {
  const userPrefs = useUserPreferences();
  const adaptiveNav = useAdaptiveNav();

  const trackPageView = useCallback((path: string) => {
    userPrefs.trackInteraction({
      type: 'navigation',
      target: path,
    });
    adaptiveNav.trackNavigation(path);
  }, [userPrefs, adaptiveNav]);

  const trackFeatureUse = useCallback((featureId: string) => {
    userPrefs.trackFeatureUsage(featureId);
  }, [userPrefs]);

  const trackShortcutUse = useCallback((shortcut: string, success: boolean) => {
    userPrefs.trackShortcut(shortcut, success);
  }, [userPrefs]);

  return {
    trackPageView,
    trackFeatureUse,
    trackShortcutUse,
  };
};

/**
 * Hook for getting combined personalization data
 */
export const usePersonalizationData = () => {
  const userPrefs = useUserPreferences();
  const adaptiveNav = useAdaptiveNav();
  const personalization = usePersonalization();

  return {
    // User preferences
    preferences: userPrefs.preferences,
    insights: userPrefs.getInsights(),
    frequentFeatures: userPrefs.getTopFeatures(),
    
    // Navigation
    frequentPaths: adaptiveNav.getFrequentPaths(),
    recentPages: adaptiveNav.getRecentItems(),
    predictedNextAction: adaptiveNav.predictNextAction(),
    
    // Dashboard
    activeLayout: personalization.getActiveLayout(),
    recommendations: personalization.getRecommendations(),
    
    // A/B testing
    isFeatureEnabled: personalization.isFeatureEnabled,
    getVariant: personalization.getVariant,
  };
};

// =============================================================================
// CONSTANTS
// =============================================================================

export const PERSONALIZATION_DEFAULTS = {
  // Preference learning
  minInteractionsForInsight: 5,
  insightConfidenceThreshold: 0.7,
  maxStoredInteractions: 1000,
  
  // Adaptive navigation
  minUsageForReorder: 3,
  maxQuickAccessItems: 5,
  suggestionConfidenceThreshold: 0.6,
  
  // Dashboard
  defaultGridColumns: 6,
  defaultGridRows: 6,
  maxWidgetsPerLayout: 12,
  
  // Recommendations
  maxRecommendations: 10,
  recommendationExpiryHours: 24,
  
  // A/B testing
  minSampleSize: 100,
  significanceThreshold: 0.95,
} as const;

export const WIDGET_TYPES = [
  'score_overview',
  'progress_chart',
  'recent_activity',
  'quick_actions',
  'notifications',
  'analytics_summary',
  'heatmap_mini',
  'upcoming_deadlines',
  'team_activity',
  'recommendations',
  'custom',
] as const;

export const RECOMMENDATION_TYPES = [
  'next_question',
  'similar_assessment',
  'completion_reminder',
  'difficulty_warning',
  'time_optimization',
  'feature_suggestion',
  'learning_resource',
] as const;

export const EXPERIMENT_STATUSES = [
  'draft',
  'running',
  'paused',
  'completed',
  'archived',
] as const;

// =============================================================================
// RE-EXPORT ALL
// =============================================================================

export * from './UserPreferences';
export * from './AdaptiveNavigation';
export * from './Personalization';
