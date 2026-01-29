export interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  performance: boolean;
  heatmaps?: boolean; // Optional: for session replay/heatmap tools
}

const CONSENT_STORAGE_KEY = 'cookie-consent-preferences';

export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    if (parsed.preferences) {
      return parsed.preferences as ConsentPreferences;
    }
  } catch {
    // Ignore parse errors
  }
  
  return null;
}

export function hasConsentFor(category: keyof ConsentPreferences): boolean {
  const prefs = getConsentPreferences();
  if (!prefs) return false;
  return prefs[category] === true;
}

export function waitForConsent(category: keyof ConsentPreferences, timeout = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    // Check immediately
    if (hasConsentFor(category)) {
      resolve(true);
      return;
    }

    // Wait for consent event
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<ConsentPreferences>;
      if (customEvent.detail && customEvent.detail[category]) {
        window.removeEventListener('consent-updated', handler);
        resolve(true);
      }
    };

    window.addEventListener('consent-updated', handler);

    // Timeout after 10 seconds
    setTimeout(() => {
      window.removeEventListener('consent-updated', handler);
      resolve(hasConsentFor(category));
    }, timeout);
  });
}
