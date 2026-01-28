'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

export default function NewsletterConfirmContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');

    if (verified === 'true') {
      setStatus('success');
      setMessage('Your email has been confirmed! You\'re now subscribed to the 100AFRO newsletter.');
    } else if (error) {
      setStatus('error');
      switch (error) {
        case 'missing_token':
          setMessage('Verification token is missing. Please check your email and click the confirmation link again.');
          break;
        case 'invalid_token':
          setMessage('Invalid or expired verification token. The link may have expired. Please subscribe again.');
          break;
        case 'database_error':
          setMessage('Database error occurred. Please try again later.');
          break;
        case 'verification_failed':
          setMessage('Verification failed. Please try again or contact support.');
          break;
        default:
          setMessage('An error occurred during verification. Please try again.');
      }
    } else {
      setStatus('success');
      setMessage('Your email has been confirmed! You\'re now subscribed to the 100AFRO newsletter.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-afro-primary mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-white mb-4">Verifying your subscription...</h1>
            <p className="text-gray-400">Please wait while we confirm your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-500/20 p-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Email Confirmed!</h1>
            <p className="text-gray-400 mb-6">{message}</p>
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-afro-primary mb-2">
                <Mail className="h-5 w-5" />
                <span className="font-bold">Check your inbox</span>
              </div>
              <p className="text-sm text-gray-400">
                We've sent you a welcome email with more information about what to expect.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block bg-afro-primary text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-colors"
            >
              Back to Home
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-500/20 p-4">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Verification Failed</h1>
            <p className="text-gray-400 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/"
                className="block bg-afro-primary text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-colors text-center"
              >
                Back to Home
              </Link>
              <Link
                href="/#newsletter"
                className="block border border-gray-600 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-700 transition-colors text-center"
              >
                Try Subscribing Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
