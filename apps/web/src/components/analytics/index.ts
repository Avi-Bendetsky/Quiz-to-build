/**
 * Analytics Components Index
 * 
 * Sprint 36: Self-Healing & Analytics
 * Provides usage heatmaps, analytics dashboard, session replay,
 * and comprehensive user behavior tracking.
 */

// =============================================================================
// ANALYTICS CORE EXPORTS
// =============================================================================

export {
  // Provider & Context
  AnalyticsProvider,
  useAnalytics,
  
  // Types - Events
  type AnalyticsEvent,
  type PageViewEvent,
  type ClickEvent,
  type ScrollEvent,
  type FormEvent,
  type CustomEvent,
  
  // Types - Metrics
  type AnalyticsMetrics,
  type FunnelStep,
  type FunnelData,
  type UserJourney,
  type JourneyStep,
  
  // Types - Heatmap
  type HeatmapPoint,
  type HeatmapData,
  type ScrollDepthData,
  
  // Types - Session Replay
  type SessionEvent,
  type RecordedSession,
  type PlaybackState,
  
  // Types - Context
  type AnalyticsContextType,
  
  // Dashboard Components
  AnalyticsDashboard,
  MetricCard,
  FunnelChart,
  
  // Heatmap Components
  HeatmapVisualization,
  
  // Session Replay Components
  SessionReplayPlayer,
  
  // Hooks
  usePageTracking,
  useFormTracking,
} from './Analytics';

// =============================================================================
// ANALYTICS DASHBOARD WRAPPER
// =============================================================================

import React, { ReactNode, useState, useCallback } from 'react';
import { 
  AnalyticsProvider, 
  AnalyticsDashboard,
  HeatmapVisualization,
  SessionReplayPlayer,
  useAnalytics 
} from './Analytics';

export interface AnalyticsSuiteProps {
  children: ReactNode;
  enableTracking?: boolean;
  enableSessionRecording?: boolean;
  enableHeatmaps?: boolean;
  privacyMode?: boolean;
}

/**
 * Analytics Suite Provider
 * Wraps application with full analytics capabilities
 */
export const AnalyticsSuite: React.FC<AnalyticsSuiteProps> = ({
  children,
  enableTracking = true,
  enableSessionRecording = true,
  enableHeatmaps = true,
  privacyMode = false,
}) => {
  if (!enableTracking) {
    return <>{children}</>;
  }
  
  return (
    <AnalyticsProvider>
      {children}
    </AnalyticsProvider>
  );
};

// =============================================================================
// ANALYTICS ADMIN PAGE COMPONENT
// =============================================================================

export interface AnalyticsAdminPageProps {
  className?: string;
  style?: React.CSSProperties;
}

const adminPageStyles = {
  container: {
    padding: '24px',
    maxWidth: '1600px',
    margin: '0 auto',
  } as React.CSSProperties,
  header: {
    marginBottom: '32px',
  } as React.CSSProperties,
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: '0 0 8px 0',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '8px',
  } as React.CSSProperties,
  tab: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#6b7280',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  tabActive: {
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
  } as React.CSSProperties,
  content: {
    minHeight: '600px',
  } as React.CSSProperties,
};

type AdminTab = 'dashboard' | 'heatmaps' | 'sessions';

/**
 * Analytics Admin Page
 * Full admin interface for viewing analytics data
 */
export const AnalyticsAdminPage: React.FC<AnalyticsAdminPageProps> = ({
  className,
  style,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const analytics = useAnalytics();

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'heatmaps', label: 'Heatmaps' },
    { id: 'sessions', label: 'Session Replay' },
  ];

  return (
    <div className={className} style={{ ...adminPageStyles.container, ...style }}>
      <header style={adminPageStyles.header}>
        <h1 style={adminPageStyles.title}>Analytics</h1>
        <p style={adminPageStyles.subtitle}>
          User behavior insights, heatmaps, and session recordings
        </p>
      </header>

      <nav style={adminPageStyles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...adminPageStyles.tab,
              ...(activeTab === tab.id ? adminPageStyles.tabActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main style={adminPageStyles.content}>
        {activeTab === 'dashboard' && <AnalyticsDashboard />}
        {activeTab === 'heatmaps' && <HeatmapVisualization />}
        {activeTab === 'sessions' && <SessionReplayPlayer />}
      </main>
    </div>
  );
};

// =============================================================================
// ANALYTICS WIDGET COMPONENTS
// =============================================================================

export interface QuickStatsWidgetProps {
  className?: string;
  style?: React.CSSProperties;
}

const widgetStyles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  } as React.CSSProperties,
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#6b7280',
    marginBottom: '16px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  } as React.CSSProperties,
  statItem: {
    textAlign: 'center' as const,
  } as React.CSSProperties,
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
  } as React.CSSProperties,
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  } as React.CSSProperties,
};

/**
 * Quick Stats Widget
 * Compact analytics overview for dashboards
 */
export const QuickStatsWidget: React.FC<QuickStatsWidgetProps> = ({
  className,
  style,
}) => {
  const analytics = useAnalytics();
  const metrics = analytics.getMetrics();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className={className} style={{ ...widgetStyles.container, ...style }}>
      <h3 style={widgetStyles.title}>Quick Stats</h3>
      <div style={widgetStyles.statsGrid}>
        <div style={widgetStyles.statItem}>
          <p style={widgetStyles.statValue}>{formatNumber(metrics.totalSessions)}</p>
          <p style={widgetStyles.statLabel}>Total Sessions</p>
        </div>
        <div style={widgetStyles.statItem}>
          <p style={widgetStyles.statValue}>{formatNumber(metrics.uniqueUsers)}</p>
          <p style={widgetStyles.statLabel}>Unique Users</p>
        </div>
        <div style={widgetStyles.statItem}>
          <p style={widgetStyles.statValue}>{formatDuration(metrics.avgSessionDuration)}</p>
          <p style={widgetStyles.statLabel}>Avg. Duration</p>
        </div>
        <div style={widgetStyles.statItem}>
          <p style={widgetStyles.statValue}>{(metrics.conversionRate * 100).toFixed(1)}%</p>
          <p style={widgetStyles.statLabel}>Conversion</p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// TRACKING UTILITIES
// =============================================================================

/**
 * Track button click with analytics
 */
export const trackButtonClick = (
  buttonName: string,
  context?: Record<string, unknown>
) => {
  // This would connect to the analytics provider
  console.log('[Analytics] Button click:', buttonName, context);
};

/**
 * Track form submission with analytics
 */
export const trackFormSubmission = (
  formName: string,
  success: boolean,
  context?: Record<string, unknown>
) => {
  console.log('[Analytics] Form submission:', formName, success, context);
};

/**
 * Track error occurrence with analytics
 */
export const trackError = (
  errorType: string,
  errorMessage: string,
  context?: Record<string, unknown>
) => {
  console.log('[Analytics] Error:', errorType, errorMessage, context);
};

/**
 * Track feature usage with analytics
 */
export const trackFeatureUsage = (
  featureName: string,
  action: string,
  context?: Record<string, unknown>
) => {
  console.log('[Analytics] Feature usage:', featureName, action, context);
};

// =============================================================================
// ANALYTICS EVENT TYPES
// =============================================================================

export const ANALYTICS_EVENTS = {
  // Page events
  PAGE_VIEW: 'page_view',
  PAGE_LEAVE: 'page_leave',
  
  // User events
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  
  // Questionnaire events
  QUESTIONNAIRE_START: 'questionnaire_start',
  QUESTIONNAIRE_PROGRESS: 'questionnaire_progress',
  QUESTIONNAIRE_COMPLETE: 'questionnaire_complete',
  QUESTIONNAIRE_ABANDON: 'questionnaire_abandon',
  QUESTION_ANSWER: 'question_answer',
  QUESTION_SKIP: 'question_skip',
  
  // Document events
  DOCUMENT_GENERATE: 'document_generate',
  DOCUMENT_DOWNLOAD: 'document_download',
  DOCUMENT_VIEW: 'document_view',
  
  // Payment events
  PAYMENT_START: 'payment_start',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILURE: 'payment_failure',
  SUBSCRIPTION_UPGRADE: 'subscription_upgrade',
  SUBSCRIPTION_DOWNGRADE: 'subscription_downgrade',
  
  // Feature events
  FEATURE_USED: 'feature_used',
  HELP_VIEWED: 'help_viewed',
  SEARCH_PERFORMED: 'search_performed',
  
  // Error events
  ERROR_OCCURRED: 'error_occurred',
  ERROR_RECOVERED: 'error_recovered',
} as const;

// =============================================================================
// ANALYTICS CONFIGURATION
// =============================================================================

export const ANALYTICS_CONFIG = {
  // Sampling rate (0-1)
  samplingRate: 1.0,
  
  // Session timeout (30 minutes)
  sessionTimeout: 30 * 60 * 1000,
  
  // Heatmap settings
  heatmap: {
    maxPoints: 10000,
    gridSize: 10,
    decayRate: 0.95,
  },
  
  // Session replay settings
  sessionReplay: {
    maxDuration: 30 * 60 * 1000, // 30 minutes
    maxEvents: 50000,
    sampleRate: 0.1, // 10% of sessions
  },
  
  // Privacy settings
  privacy: {
    anonymizeIP: true,
    maskSensitiveData: true,
    respectDoNotTrack: true,
    cookieConsent: true,
  },
  
  // Performance settings
  performance: {
    batchSize: 10,
    flushInterval: 5000, // 5 seconds
    maxQueueSize: 1000,
  },
} as const;

// =============================================================================
// RE-EXPORT EVERYTHING
// =============================================================================

export * from './Analytics';
