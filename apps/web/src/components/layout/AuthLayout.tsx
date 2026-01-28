/**
 * Auth layout for login, register, and password reset pages
 */

import { Outlet, Link } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-blue-600">Quiz2Biz</h1>
        </Link>
        <p className="mt-2 text-center text-sm text-gray-600">
          Adaptive Client Questionnaire System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Quiz2Biz. All rights reserved.
        </p>
      </div>
    </div>
  );
}
