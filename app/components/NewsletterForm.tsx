'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { CheckCircle, X, Mail } from 'lucide-react';

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
  const [showModal, setShowModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

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
      setIsPending(data.pending || false);
      if (data.pending) {
        setMessage('Please check your email to confirm your subscription.');
      } else {
        setMessage('Successfully subscribed!');
      }
      setEmail('');
      setIsLoading(false);
      setShowModal(true);

      // Auto-close modal after 8 seconds
      setTimeout(() => {
        setShowModal(false);
        setTimeout(() => {
          setSuccess(false);
          setMessage('');
        }, 300); // Wait for animation to complete
      }, 8000);
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

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSuccess(false);
      setMessage('');
    }, 300); // Wait for animation to complete
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  if (variant === 'sidebar') {
    return (
      <>
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
        </form>
        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            />
            <div className="relative bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl transform transition-all scale-100 animate-scale-in">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-afro-primary/20 p-4 animate-bounce-in">
                    <CheckCircle className="h-16 w-16 text-afro-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 font-display">
                  Thank You for Being a Subscriber!
                </h2>
                {isPending ? (
                  <>
                    <p className="text-gray-300 mb-4 text-lg">
                      We've sent a confirmation email to your inbox.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
                      <div className="flex items-center justify-center gap-2 text-afro-primary mb-2">
                        <Mail className="h-5 w-5" />
                        <span className="font-bold">Check Your Email</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Please click the confirmation link to activate your subscription.
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-300 mb-6 text-lg">
                    You're all set! Get ready to receive the latest updates about African entertainment, music, and culture.
                  </p>
                )}
                <button
                  onClick={closeModal}
                  className="bg-afro-primary text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default variant (home page)
  return (
    <>
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
      </div>
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />
          <div className="relative bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl transform transition-all scale-100 animate-scale-in">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-afro-primary/20 p-4 animate-bounce-in">
                  <CheckCircle className="h-16 w-16 text-afro-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 font-display">
                Thank You for Being a Subscriber!
              </h2>
              {isPending ? (
                <>
                  <p className="text-gray-300 mb-4 text-lg">
                    We've sent a confirmation email to your inbox.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
                    <div className="flex items-center justify-center gap-2 text-afro-primary mb-2">
                      <Mail className="h-5 w-5" />
                      <span className="font-bold">Check Your Email</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Please click the confirmation link to activate your subscription.
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-300 mb-6 text-lg">
                  You're all set! Get ready to receive the latest updates about African entertainment, music, and culture.
                </p>
              )}
              <button
                onClick={closeModal}
                className="bg-afro-primary text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsletterForm;
