import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-500/20 p-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Unsubscribed Successfully</h1>
        <p className="text-gray-400 mb-6">
          You have been unsubscribed from the 100AFRO newsletter. You will no longer receive emails from us.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          If you didn't request this unsubscribe, please contact us immediately.
        </p>
        <Link
          href="/"
          className="inline-block bg-afro-primary text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-colors"
        >
          Back to Home
        </Link>
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-500">
            Changed your mind?{' '}
            <Link href="/" className="text-afro-primary hover:underline font-medium">
              Subscribe again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
