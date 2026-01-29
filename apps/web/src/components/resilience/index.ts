/**
 * Resilience Components Index
 * 
 * Sprint 36: Self-Healing & Analytics
 * Provides circuit breaker patterns, self-healing error recovery,
 * and AI-powered error diagnosis for application resilience.
 */

// =============================================================================
// SELF-HEALING ERROR RECOVERY EXPORTS
// =============================================================================

export {
  // Provider & Context
  SelfHealingProvider,
  useSelfHealing,
  
  // Types
  type CircuitBreakerConfig,
  type CircuitState,
  type CircuitBreakerState,
  type RetryConfig,
  type RetryState,
  type CacheEntry,
  type HealthStatus,
  type ServiceHealth,
  type SelfHealingContextType,
  
  // Components
  CircuitBreakerPanel,
  HealthStatusPanel,
  RetryIndicator,
  
  // Hooks
  useResilientFetch,
  useResilientMutation,
} from './SelfHealing';

// =============================================================================
// AI ERROR DIAGNOSIS EXPORTS
// =============================================================================

export {
  // Provider & Context
  AIErrorDiagnosisProvider,
  useAIErrorDiagnosis,
  
  // Types
  type ErrorCategory,
  type ErrorSeverity,
  type SuggestedFix,
  type ClassifiedError,
  type ErrorPattern,
  type DiagnosisStats,
  type AIErrorDiagnosisContextType,
  
  // Components
  ErrorCard,
  ErrorList,
  ErrorStatsPanel,
  
  // Hooks
  useErrorDiagnosisHandler,
} from './AIErrorDiagnosis';

// =============================================================================
// COMBINED RESILIENCE PROVIDER
// =============================================================================

import React, { ReactNode } from 'react';
import { SelfHealingProvider } from './SelfHealing';
import { AIErrorDiagnosisProvider } from './AIErrorDiagnosis';

export interface ResilienceProviderProps {
  children: ReactNode;
  enableSelfHealing?: boolean;
  enableAIDiagnosis?: boolean;
}

/**
 * Combined Resilience Provider
 * Wraps application with all resilience features:
 * - Self-healing error recovery (circuit breaker, retry, cache fallback)
 * - AI-powered error diagnosis and auto-fix
 */
export const ResilienceProvider: React.FC<ResilienceProviderProps> = ({
  children,
  enableSelfHealing = true,
  enableAIDiagnosis = true,
}) => {
  let content = <>{children}</>;
  
  if (enableAIDiagnosis) {
    content = <AIErrorDiagnosisProvider>{content}</AIErrorDiagnosisProvider>;
  }
  
  if (enableSelfHealing) {
    content = <SelfHealingProvider>{content}</SelfHealingProvider>;
  }
  
  return content;
};

// =============================================================================
// RESILIENCE DASHBOARD COMPONENT
// =============================================================================

import { CircuitBreakerPanel, HealthStatusPanel } from './SelfHealing';
import { ErrorList, ErrorStatsPanel } from './AIErrorDiagnosis';

export interface ResilienceDashboardProps {
  showCircuitBreaker?: boolean;
  showHealthStatus?: boolean;
  showErrorDiagnosis?: boolean;
  showErrorStats?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const dashboardStyles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    padding: '24px',
  } as React.CSSProperties,
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1a1a2e',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    margin: 0,
    backgroundColor: '#f9fafb',
  } as React.CSSProperties,
  sectionContent: {
    padding: '20px',
  } as React.CSSProperties,
};

/**
 * Resilience Dashboard
 * Comprehensive view of application resilience status
 */
export const ResilienceDashboard: React.FC<ResilienceDashboardProps> = ({
  showCircuitBreaker = true,
  showHealthStatus = true,
  showErrorDiagnosis = true,
  showErrorStats = true,
  className,
  style,
}) => {
  return (
    <div 
      className={className}
      style={{ ...dashboardStyles.container, ...style }}
    >
      {showCircuitBreaker && (
        <div style={dashboardStyles.section}>
          <h3 style={dashboardStyles.sectionTitle}>Circuit Breakers</h3>
          <div style={dashboardStyles.sectionContent}>
            <CircuitBreakerPanel />
          </div>
        </div>
      )}
      
      {showHealthStatus && (
        <div style={dashboardStyles.section}>
          <h3 style={dashboardStyles.sectionTitle}>Service Health</h3>
          <div style={dashboardStyles.sectionContent}>
            <HealthStatusPanel />
          </div>
        </div>
      )}
      
      {showErrorStats && (
        <div style={dashboardStyles.section}>
          <h3 style={dashboardStyles.sectionTitle}>Error Statistics</h3>
          <div style={dashboardStyles.sectionContent}>
            <ErrorStatsPanel />
          </div>
        </div>
      )}
      
      {showErrorDiagnosis && (
        <div style={{ ...dashboardStyles.section, gridColumn: '1 / -1' }}>
          <h3 style={dashboardStyles.sectionTitle}>Error Diagnosis</h3>
          <div style={dashboardStyles.sectionContent}>
            <ErrorList />
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

import { useCallback, useState } from 'react';

/**
 * Hook for resilient operations with automatic error handling
 * Combines self-healing and error diagnosis
 */
export const useResilientOperation = <T, A extends unknown[]>(
  operation: (...args: A) => Promise<T>,
  options?: {
    serviceName?: string;
    maxRetries?: number;
    retryDelay?: number;
    enableDiagnosis?: boolean;
  }
) => {
  const selfHealing = useSelfHealing();
  const diagnosis = useAIErrorDiagnosis();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (...args: A): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    const serviceName = options?.serviceName || 'operation';
    const maxRetries = options?.maxRetries ?? 3;
    const retryDelay = options?.retryDelay ?? 1000;
    
    let lastError: Error | null = null;
    let attempt = 0;

    // Check circuit breaker
    const circuitState = selfHealing.getCircuitState(serviceName);
    if (circuitState?.state === 'OPEN') {
      const err = new Error(`Service ${serviceName} is temporarily unavailable`);
      setError(err);
      setIsLoading(false);
      
      if (options?.enableDiagnosis) {
        diagnosis.classifyError(err);
      }
      
      return null;
    }

    while (attempt < maxRetries) {
      try {
        const result = await operation(...args);
        selfHealing.recordSuccess(serviceName);
        setData(result);
        setIsLoading(false);
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        selfHealing.recordFailure(serviceName);
        
        if (options?.enableDiagnosis) {
          const classified = diagnosis.classifyError(lastError);
          
          // Try auto-fix if available
          if (classified.suggestedFixes.some(f => f.autoApplicable)) {
            const autoFix = classified.suggestedFixes.find(f => f.autoApplicable);
            if (autoFix) {
              try {
                await diagnosis.applyFix(classified.id, autoFix.id);
                // Retry after auto-fix
                attempt++;
                continue;
              } catch {
                // Auto-fix failed, continue with retry
              }
            }
          }
        }
        
        attempt++;
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = retryDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    setError(lastError);
    setIsLoading(false);
    return null;
  }, [operation, options, selfHealing, diagnosis]);

  return {
    execute,
    isLoading,
    error,
    data,
    reset: useCallback(() => {
      setError(null);
      setData(null);
    }, []),
  };
};

// =============================================================================
// CONSTANTS
// =============================================================================

export const RESILIENCE_DEFAULTS = {
  circuitBreaker: {
    failureThreshold: 5,
    recoveryTimeout: 30000,
    successThreshold: 3,
    failureWindow: 60000,
  },
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitterFactor: 0.1,
  },
  cache: {
    defaultTTL: 300000, // 5 minutes
    maxEntries: 100,
  },
  healthCheck: {
    interval: 30000, // 30 seconds
    timeout: 5000, // 5 seconds
  },
} as const;

export const ERROR_CATEGORIES = [
  'network',
  'authentication',
  'authorization',
  'validation',
  'server',
  'timeout',
  'rate_limit',
  'data_corruption',
  'resource_not_found',
  'conflict',
  'unknown',
] as const;

export const ERROR_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;

// =============================================================================
// RE-EXPORT EVERYTHING FOR CONVENIENCE
// =============================================================================

export * from './SelfHealing';
export * from './AIErrorDiagnosis';
