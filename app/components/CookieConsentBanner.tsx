'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Settings, Check, ChevronDown, ChevronUp } from 'lucide-react';

export interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  performance: boolean;
  heatmaps?: boolean; // Optional: for session replay/heatmap tools
}

interface CookieConsentBannerProps {
  onConsentChange?: (preferences: ConsentPreferences) => void;
}

const CONSENT_STORAGE_KEY = 'cookie-consent-preferences';
const CONSENT_VERSION = '1.0';

export default function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
    performance: false,
    heatmaps: false, // Optional: for session replay/heatmap tools
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 500);
    } else {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.version === CONSENT_VERSION) {
          setPreferences(parsed.preferences);
          if (onConsentChange) {
            onConsentChange(parsed.preferences);
          }
        } else {
          // Policy updated, show banner again
          setTimeout(() => setIsVisible(true), 500);
        }
      } catch {
        setTimeout(() => setIsVisible(true), 500);
      }
    }
  }, [onConsentChange]);

  const handleToggle = (category: keyof ConsentPreferences) => {
    if (category === 'essential') return; // Essential cannot be disabled
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      performance: true,
      heatmaps: true,
    };
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyEssential: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      performance: false,
    };
    saveConsent(onlyEssential);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const saveConsent = async (prefs: ConsentPreferences) => {
    setIsSaving(true);
    try {
      // Store in localStorage immediately
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({
          version: CONSENT_VERSION,
          preferences: prefs,
          timestamp: new Date().toISOString(),
        })
      );

      // Send to API
      const response = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: prefs }),
      });

      if (response.ok) {
        setIsVisible(false);
        if (onConsentChange) {
          onConsentChange(prefs);
        }
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('consent-updated', { detail: prefs }));
      }
    } catch (error) {
      console.error('Error saving consent:', error);
      // Still hide banner even if API fails (localStorage is saved)
      setIsVisible(false);
      if (onConsentChange) {
        onConsentChange(prefs);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 lg:p-8 border-b border-gray-700">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  Cookie Preferences
                </h2>
                <p className="text-gray-400 text-sm lg:text-base">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies. You can customize your preferences below.
                </p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleAcceptAll}
                disabled={isSaving}
                className="bg-afro-primary text-black font-bold px-6 py-3 rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Accept All
              </button>
              <button
                onClick={handleRejectAll}
                disabled={isSaving}
                className="bg-gray-700 text-white font-bold px-6 py-3 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject All
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-gray-700 text-white font-bold px-6 py-3 rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Settings size={18} />
                {isExpanded ? 'Hide Details' : 'Customize'}
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="p-6 lg:p-8 bg-gray-900/50 border-b border-gray-700 space-y-6">
              {/* Essential Cookies */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">Essential Cookies</h3>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">
                      Always Active
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    These cookies are necessary for the website to function properly. They enable core functionality 
                    such as security, network management, and accessibility. You cannot opt-out of these cookies.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Examples:</strong> Authentication, session management, security tokens</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                    <Check size={16} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">Analytics Cookies</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    These cookies help us understand how visitors interact with our website by collecting and reporting 
                    information anonymously. This helps us improve our website and user experience.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Examples:</strong> Google Analytics, page views, user behavior tracking</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleToggle('analytics')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      preferences.analytics ? 'bg-afro-primary' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">Marketing Cookies</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    These cookies are used to deliver advertisements that are more relevant to you and your interests. 
                    They may also be used to limit the number of times you see an advertisement.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Examples:</strong> Ad targeting, remarketing, social media pixels</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleToggle('marketing')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      preferences.marketing ? 'bg-afro-primary' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.marketing ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">Functional Cookies</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    These cookies enable enhanced functionality and personalization, such as remembering your preferences 
                    and settings to provide a more personalized experience.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Examples:</strong> Language preferences, region settings, user interface customization</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleToggle('functional')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      preferences.functional ? 'bg-afro-primary' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.functional ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">Performance Cookies</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    These cookies help us understand how well our website performs and identify areas for improvement. 
                    They collect information about how you use our site, such as which pages you visit most often.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Examples:</strong> Performance monitoring, error tracking, load time optimization</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleToggle('performance')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      preferences.performance ? 'bg-afro-primary' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.performance ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Heatmaps & Session Replay (Optional) */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">Heatmaps & Session Replay</h3>
                    <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded font-bold">
                      Optional
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    These tools help us visualize user interactions through heatmaps and session recordings. 
                    This allows us to understand how users navigate our site and identify usability improvements.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Examples:</strong> Hotjar, FullStory, LogRocket, PostHog (not currently active)</p>
                    <p className="text-gray-600 italic">This category is available for future integration with session replay tools.</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleToggle('heatmaps')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      preferences.heatmaps ? 'bg-afro-primary' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.heatmaps ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 lg:p-8 bg-gray-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              <p>
                By continuing to use our site, you agree to our{' '}
                <Link href="/cookie-policy" className="text-afro-primary hover:underline font-medium">
                  Cookie Policy
                </Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-afro-primary hover:underline font-medium">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            {isExpanded && (
              <button
                onClick={handleSavePreferences}
                disabled={isSaving}
                className="bg-afro-primary text-black font-bold px-8 py-3 rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
