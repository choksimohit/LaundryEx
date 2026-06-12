import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <meta name="robots" content="noindex" />
    <div className="text-center">
      <p className="text-6xl font-bold text-blue-600 mb-4">404</p>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Page not found</h1>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        Sorry, we couldn't find the page you're looking for. It may have been moved or no longer exists.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to homepage
        </Link>
        <Link
          to="/order"
          className="text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
        >
          Place an order
        </Link>
      </div>
    </div>
  </div>
);
