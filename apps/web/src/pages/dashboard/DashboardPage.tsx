/**
 * Dashboard page component
 */

import { useAuthStore } from '../../stores/auth';
import { ClipboardList, FileText, Clock, CheckCircle } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    { name: 'Active Sessions', value: '2', icon: ClipboardList, color: 'bg-blue-500' },
    { name: 'Documents Generated', value: '5', icon: FileText, color: 'bg-green-500' },
    { name: 'Pending Reviews', value: '1', icon: Clock, color: 'bg-yellow-500' },
    { name: 'Completed', value: '3', icon: CheckCircle, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-gray-600 mt-1">
          Here's an overview of your questionnaire progress and documents.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 flex items-center space-x-4"
          >
            <div className={`${stat.color} rounded-lg p-3`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <ClipboardList className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No recent activity</p>
            <p className="text-sm">Start a new questionnaire to see your progress here.</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button className="flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            <ClipboardList className="h-5 w-5 mr-2" />
            Start New Questionnaire
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="h-5 w-5 mr-2" />
            View Documents
          </button>
        </div>
      </div>
    </div>
  );
}
