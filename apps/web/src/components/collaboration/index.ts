/**
 * Collaboration Components - Barrel Export
 * Sprint 35: Version History & Collaboration
 * 
 * This module provides comprehensive collaboration features including:
 * - Undo/Redo with command pattern and keyboard shortcuts
 * - Version history with diff view and restore
 * - Real-time collaboration with WebSocket
 * - Conflict resolution for simultaneous edits
 * - Comment threads with @mentions and notifications
 * 
 * Nielsen Heuristics Addressed:
 * - #1 Visibility of system status (real-time indicators, version history)
 * - #3 User control and freedom (undo/redo, restore versions)
 * - #5 Error prevention (conflict detection, merge UI)
 * - #7 Flexibility and efficiency (keyboard shortcuts, collaboration)
 * - #10 Help and documentation (contextual comments)
 */

// ============================================================================
// Undo/Redo System
// ============================================================================

export {
  // Provider & Hook
  UndoRedoProvider,
  useUndoRedo,
  
  // Components
  UndoRedoToolbar,
  UndoRedoShortcuts,
  
  // Hooks
  useUndoableField,
  
  // Utilities
  createCommand,
  CommandTypes,
  
  // Types
  type Command,
  type UndoRedoContextValue,
} from './UndoRedo';

// ============================================================================
// Version History
// ============================================================================

export {
  // Provider & Hook
  VersionHistoryProvider,
  useVersionHistory,
  
  // Components
  VersionHistoryModal,
  VersionHistoryTrigger,
  
  // Hooks
  useVersionedResponse,
  
  // Types
  type ResponseVersion,
  type VersionHistoryContextValue,
} from './VersionHistory';

// ============================================================================
// Real-Time Collaboration
// ============================================================================

export {
  // Provider & Hook
  RealTimeProvider,
  useRealTime,
  
  // Components
  PresenceBar,
  RemoteCursors,
  FieldLockIndicator,
  ConflictResolver,
  TypingIndicator,
  
  // Types
  type CollaboratorInfo,
  type CursorPosition,
  type EditLock,
  type ConflictEvent,
  type RealTimeContextValue,
} from './RealTimeCollaboration';

// ============================================================================
// Comments & Discussion
// ============================================================================

export {
  // Provider & Hook
  CommentsProvider,
  useComments,
  
  // Components
  QuestionComments,
  CommentInput,
  CommentDisplay,
  CommentThreadDisplay,
  NotificationBell,
  CommentCountBadge,
  
  // Hooks
  useCommentNotifications,
  
  // Types
  type User,
  type Comment,
  type CommentThread,
  type CommentNotification,
  type CommentDraft,
  type Mention,
  type Reaction,
  type CommentsContextValue,
} from './Comments';

// ============================================================================
// Combined Collaboration Provider
// ============================================================================

import React from 'react';
import { UndoRedoProvider } from './UndoRedo';
import { VersionHistoryProvider } from './VersionHistory';
import { RealTimeProvider } from './RealTimeCollaboration';
import { CommentsProvider, User } from './Comments';

/**
 * CollaborationProviderProps
 * Configuration for the combined collaboration provider
 */
export interface CollaborationProviderProps {
  children: React.ReactNode;
  
  /**
   * Maximum number of undo/redo steps to keep in history
   * @default 50
   */
  maxUndoHistory?: number;
  
  /**
   * Maximum number of versions to store per response
   * @default 100
   */
  maxVersionsPerResponse?: number;
  
  /**
   * WebSocket server URL for real-time collaboration
   * @default 'ws://localhost:3001'
   */
  wsServerUrl?: string;
  
  /**
   * Current user information for collaboration features
   */
  currentUser?: User;
  
  /**
   * Team members available for @mentions
   */
  teamMembers?: User[];
  
  /**
   * Enable/disable real-time features
   * @default true
   */
  enableRealTime?: boolean;
  
  /**
   * Enable/disable comments feature
   * @default true
   */
  enableComments?: boolean;
  
  /**
   * Enable/disable undo/redo feature
   * @default true
   */
  enableUndoRedo?: boolean;
  
  /**
   * Enable/disable version history feature
   * @default true
   */
  enableVersionHistory?: boolean;
}

/**
 * CollaborationProvider
 * 
 * Combined provider that wraps all collaboration features into a single provider.
 * This simplifies setup when you need all collaboration features together.
 * 
 * @example
 * ```tsx
 * <CollaborationProvider
 *   currentUser={{ id: '1', name: 'John Doe', email: 'john@example.com' }}
 *   teamMembers={[...]}
 *   maxUndoHistory={100}
 * >
 *   <App />
 * </CollaborationProvider>
 * ```
 */
export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
  maxUndoHistory = 50,
  maxVersionsPerResponse = 100,
  wsServerUrl = 'ws://localhost:3001',
  currentUser,
  teamMembers = [],
  enableRealTime = true,
  enableComments = true,
  enableUndoRedo = true,
  enableVersionHistory = true,
}) => {
  // Build provider tree based on enabled features
  let content = <>{children}</>;
  
  // Wrap with CommentsProvider if enabled
  if (enableComments) {
    content = (
      <CommentsProvider
        initialUser={currentUser}
        initialTeamMembers={teamMembers}
      >
        {content}
      </CommentsProvider>
    );
  }
  
  // Wrap with RealTimeProvider if enabled
  if (enableRealTime) {
    content = (
      <RealTimeProvider serverUrl={wsServerUrl}>
        {content}
      </RealTimeProvider>
    );
  }
  
  // Wrap with VersionHistoryProvider if enabled
  if (enableVersionHistory) {
    content = (
      <VersionHistoryProvider maxVersionsPerResponse={maxVersionsPerResponse}>
        {content}
      </VersionHistoryProvider>
    );
  }
  
  // Wrap with UndoRedoProvider if enabled
  if (enableUndoRedo) {
    content = (
      <UndoRedoProvider maxHistory={maxUndoHistory}>
        {content}
      </UndoRedoProvider>
    );
  }
  
  return content;
};

// ============================================================================
// Collaboration Toolbar Component
// ============================================================================

export interface CollaborationToolbarProps {
  /**
   * Show undo/redo buttons
   * @default true
   */
  showUndoRedo?: boolean;
  
  /**
   * Show version history trigger
   * @default true
   */
  showVersionHistory?: boolean;
  
  /**
   * Show presence/collaborators
   * @default true
   */
  showPresence?: boolean;
  
  /**
   * Show notification bell
   * @default true
   */
  showNotifications?: boolean;
  
  /**
   * Question ID for version history and comments
   */
  questionId?: string;
  
  /**
   * Custom styles for the toolbar
   */
  style?: React.CSSProperties;
}

/**
 * CollaborationToolbar
 * 
 * A pre-built toolbar that combines common collaboration UI elements.
 * Use this for quick integration of collaboration features.
 */
export const CollaborationToolbar: React.FC<CollaborationToolbarProps> = ({
  showUndoRedo = true,
  showVersionHistory = true,
  showPresence = true,
  showNotifications = true,
  questionId,
  style,
}) => {
  // Import components dynamically to avoid circular deps
  const { UndoRedoToolbar } = require('./UndoRedo');
  const { VersionHistoryTrigger } = require('./VersionHistory');
  const { PresenceBar } = require('./RealTimeCollaboration');
  const { NotificationBell } = require('./Comments');
  
  const toolbarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '8px 16px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    ...style,
  };
  
  return (
    <div style={toolbarStyle} role="toolbar" aria-label="Collaboration tools">
      {showUndoRedo && <UndoRedoToolbar />}
      
      {showVersionHistory && questionId && (
        <VersionHistoryTrigger questionId={questionId} responseId="current" />
      )}
      
      {showPresence && <PresenceBar />}
      
      {showNotifications && <NotificationBell />}
    </div>
  );
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format a date for display in collaboration features
 */
export const formatCollaborationDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
};

/**
 * Generate a consistent color for a user based on their ID
 */
export const getUserColor = (userId: string): string => {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
  ];
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Get user initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ============================================================================
// Default Export
// ============================================================================

export default {
  // Providers
  CollaborationProvider,
  UndoRedoProvider,
  VersionHistoryProvider,
  RealTimeProvider,
  CommentsProvider,
  
  // Components
  CollaborationToolbar,
  UndoRedoToolbar,
  VersionHistoryModal,
  VersionHistoryTrigger,
  PresenceBar,
  RemoteCursors,
  FieldLockIndicator,
  ConflictResolver,
  TypingIndicator,
  QuestionComments,
  CommentInput,
  CommentDisplay,
  NotificationBell,
  CommentCountBadge,
  
  // Utilities
  formatCollaborationDate,
  getUserColor,
  getInitials,
};
