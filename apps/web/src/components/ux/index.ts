/**
 * UX Enhancement Components
 * 
 * Nielsen Heuristic compliant UI components for:
 * - User Control & Freedom (drafts, confirmations, undo)
 * - Error Prevention & Recovery
 * - Help & Documentation
 */

// Draft Autosave System
export {
  DraftBanner,
  AutosaveIndicator,
  type DraftBannerProps,
  type AutosaveIndicatorProps,
} from './DraftBanner';

export {
  useDraftAutosave,
  formatTimeSinceSave,
  isDraftRecoverable,
  type DraftData,
  type AutosaveStatus,
  type UseDraftAutosaveOptions,
  type UseDraftAutosaveReturn,
} from '../../hooks/useDraftAutosave';

// Confirmation Dialogs
export {
  ConfirmationDialog,
  useConfirmation,
  confirmationPresets,
  type ConfirmationDialogProps,
  type ConfirmationVariant,
  type UseConfirmationOptions,
} from './ConfirmationDialog';

// Error Code System
export {
  ErrorDisplay,
  getErrorCode,
  parseApiError,
  useAutoRetry,
  ERROR_CODES,
  type ErrorCode,
  type ErrorCategory,
  type RecoveryAction,
  type ErrorDisplayProps,
  type UseAutoRetryOptions,
} from './ErrorCodeSystem';
