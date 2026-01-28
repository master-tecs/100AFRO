'use client';

import React, { useState } from 'react';
import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address');

interface NewsletterFormProps {
  variant?: 'default' | 'sidebar';
  className?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ 
  variant = 'default',
  className = '' 
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const validateEmail = (emailValue: string): boolean => {
    const result = emailSchema.safeParse(emailValue);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSuccess(false);

    // Client-side validation
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
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

      // Success
      setSuccess(true);
      if (data.pending) {
        setMessage('Please check your email to confirm your subscription.');
      } else {
        setMessage('Successfully subscribed!');
      }
      setEmail('');
      setIsLoading(false);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
      }, 5000);
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    // Clear success message when user starts typing
    if (success) {
      setSuccess(false);
      setMessage('');
    }
  };

  const handleBlur = () => {
    if (email) {
      validateEmail(email);
    }
  };

  if (variant === 'sidebar') {
    return (
      <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your email address"
          className={`w-full px-4 py-3 rounded-lg mb-3 bg-white/90 border-0 placeholder-gray-500 focus:ring-2 focus:ring-black ${
            error ? 'ring-2 ring-red-500' : ''
          }`}
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors uppercase text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe Now'}
        </button>
        {error && (
          <p className="text-red-500 text-xs mt-2">{error}</p>
        )}
        {success && message && (
          <p className="text-green-500 text-xs mt-2">{message}</p>
        )}
      </form>
    );
  }

  // Default variant (home page)
  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto"
      >
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email address"
            className={`px-6 py-4 rounded-full border border-gray-700 bg-gray-900 focus:ring-2 focus:ring-afro-primary focus:border-transparent text-white w-full font-medium placeholder-gray-500 shadow-xl ${
              error ? 'ring-2 ring-red-500 border-red-500' : ''
            }`}
            disabled={isLoading}
            required
          />
          {error && (
            <p className="text-red-500 text-xs mt-2 text-center sm:text-left px-2">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-afro-primary text-black font-bold py-4 px-10 rounded-full hover:bg-white transition-colors shadow-xl whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {success && message && (
        <p className="text-green-500 text-sm mt-4 text-center max-w-lg mx-auto">
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterForm;
