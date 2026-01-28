import React, { Suspense } from 'react';
import NewsletterConfirmContent from './NewsletterConfirmContent';

export default function NewsletterConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-afro-primary mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
        </div>
      </div>
    }>
      <NewsletterConfirmContent />
    </Suspense>
  );
}
