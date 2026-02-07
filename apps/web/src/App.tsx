/**
 * Main application component with routing and providers
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout, AuthLayout } from './components/layout';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/auth';
import { DashboardPage } from './pages/dashboard';
import { QuestionnairePage } from './pages/questionnaire';
import { HeatmapPage } from './pages/heatmap';
import { EvidencePage } from './pages/evidence';
import { DecisionsPage } from './pages/decisions';
import { PolicyPackPage } from './pages/policy-pack';
import { DocumentsPage } from './pages/documents';
import { BillingPage, InvoicesPage, UpgradePage } from './pages/billing';
import { PrivacyPage, TermsPage } from './pages/legal';
import { HelpPage } from './pages/help';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuthStore } from './stores/auth';
import type { ReactNode } from 'react';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

// Public route wrapper (redirects to dashboard if authenticated)
function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public auth routes */}
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            }
          >
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected app routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="questionnaire/:action?" element={<QuestionnairePage />} />
            <Route path="heatmap/:sessionId" element={<HeatmapPage />} />
            <Route path="evidence/:sessionId" element={<EvidencePage />} />
            <Route path="decisions/:sessionId" element={<DecisionsPage />} />
            <Route path="policy-pack/:sessionId" element={<PolicyPackPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="billing/invoices" element={<InvoicesPage />} />
            <Route path="billing/upgrade" element={<UpgradePage />} />
            {/* Add more protected routes here */}
          </Route>

          {/* Public legal and help pages */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* Fallback - redirect to login */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}
