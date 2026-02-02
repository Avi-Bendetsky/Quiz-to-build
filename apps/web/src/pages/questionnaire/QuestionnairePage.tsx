/**
 * Questionnaire page - Start or continue a questionnaire
 */

import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ClipboardList, AlertCircle } from 'lucide-react';

export function QuestionnairePage() {
  const navigate = useNavigate();
  const { action } = useParams<{ action?: string }>();
  const isNew = action === 'new';

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Go back to dashboard"
      >
        <ArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" />
        Back to Dashboard
      </button>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Start New Questionnaire' : 'Questionnaire'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isNew
            ? 'Select a questionnaire template to begin your assessment.'
            : 'Continue your assessment or view your progress.'}
        </p>
      </div>

      {/* Content placeholder */}
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center py-12">
          <ClipboardList className="h-16 w-16 mx-auto text-blue-500 mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Questionnaire Module</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            The questionnaire system allows you to complete comprehensive assessments to evaluate
            your organization's readiness across multiple dimensions.
          </p>

          {/* Coming soon notice */}
          <div className="mt-8 inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" aria-hidden="true" />
            <span className="text-yellow-700 text-sm">
              Full questionnaire functionality coming soon
            </span>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionnairePage;
