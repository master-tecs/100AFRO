import { hasConsentFor } from './consent';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Track a custom event in GA4
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
): void {
  if (typeof window === 'undefined') return;
  if (!hasConsentFor('analytics')) return;
  if (!window.gtag) return;

  const eventParams: any = {
    event_category: category,
    event_label: label,
  };

  if (value !== undefined) {
    eventParams.value = value;
  }

  window.gtag('event', action, eventParams);
}

/**
 * Track a page view (already handled by GoogleAnalytics component, but available for manual tracking)
 */
export function trackPageView(path: string): void {
  if (typeof window === 'undefined') return;
  if (!hasConsentFor('analytics')) return;
  if (!window.gtag) return;

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
    page_path: path,
  });
}

/**
 * Track a click event
 */
export function trackClick(element: string, label?: string): void {
  trackEvent('engagement', 'click', label || element);
}

/**
 * Track scroll depth
 */
let scrollTracked = {
  '25': false,
  '50': false,
  '75': false,
  '100': false,
};

export function initScrollTracking(): void {
  if (typeof window === 'undefined') return;
  if (!hasConsentFor('analytics')) return;

  // Reset on page load
  scrollTracked = {
    '25': false,
    '50': false,
    '75': false,
    '100': false,
  };

  let ticking = false;

  const handleScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercent = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      if (scrollPercent >= 25 && !scrollTracked['25']) {
        scrollTracked['25'] = true;
        trackEvent('engagement', 'scroll', '25%');
      } else if (scrollPercent >= 50 && !scrollTracked['50']) {
        scrollTracked['50'] = true;
        trackEvent('engagement', 'scroll', '50%');
      } else if (scrollPercent >= 75 && !scrollTracked['75']) {
        scrollTracked['75'] = true;
        trackEvent('engagement', 'scroll', '75%');
      } else if (scrollPercent >= 100 && !scrollTracked['100']) {
        scrollTracked['100'] = true;
        trackEvent('engagement', 'scroll', '100%');
      }

      ticking = false;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Track time on page
 */
let timeOnPageStart: number | null = null;
let timeOnPageInterval: NodeJS.Timeout | null = null;

export function initTimeOnPageTracking(): void {
  if (typeof window === 'undefined') return;
  if (!hasConsentFor('analytics')) return;

  timeOnPageStart = Date.now();

  // Track every 30 seconds
  timeOnPageInterval = setInterval(() => {
    if (timeOnPageStart) {
      const seconds = Math.floor((Date.now() - timeOnPageStart) / 1000);
      trackEvent('engagement', 'time_on_page', `${seconds}s`, seconds);
    }
  }, 30000);

  // Track on page unload
  window.addEventListener('beforeunload', () => {
    if (timeOnPageStart) {
      const seconds = Math.floor((Date.now() - timeOnPageStart) / 1000);
      trackEvent('engagement', 'time_on_page', 'final', seconds);
    }
    if (timeOnPageInterval) {
      clearInterval(timeOnPageInterval);
    }
  });
}

/**
 * Track form interactions
 */
export function trackFormInteraction(
  formId: string,
  field: string,
  action: 'focus' | 'blur' | 'change' | 'submit'
): void {
  trackEvent('form', action, `${formId}:${field}`);
}

/**
 * Initialize all tracking (call this in a useEffect on pages where you want tracking)
 */
export function initTracking(): void {
  if (typeof window === 'undefined') return;
  if (!hasConsentFor('analytics')) return;

  initScrollTracking();
  initTimeOnPageTracking();
}

/**
 * Cleanup tracking (call this in useEffect cleanup)
 */
export function cleanupTracking(): void {
  if (timeOnPageInterval) {
    clearInterval(timeOnPageInterval);
    timeOnPageInterval = null;
  }
  timeOnPageStart = null;
}
