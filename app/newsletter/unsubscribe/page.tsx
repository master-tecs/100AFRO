'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setEmail('');
      setIsLoading(false);
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Unsubscribe</h1>
          <p className="text-gray-400">
            We're sorry to see you go. Enter your email address to unsubscribe from our newsletter.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                  error ? 'border-red-500' : 'border-gray-700'
                } text-white placeholder-gray-500 focus:ring-2 focus:ring-afro-primary focus:border-transparent`}
                disabled={isLoading}
                required
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-500/20 p-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Unsubscribed Successfully</h2>
            <p className="text-gray-400 mb-6">
              You have been unsubscribed from the 100AFRO newsletter. You will no longer receive emails from us.
            </p>
            <Link
              href="/"
              className="inline-block bg-afro-primary text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
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
