import mixpanel from 'mixpanel-browser';

let initialized = false;

export function initMixpanel() {
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token || initialized || typeof window === 'undefined') return;
  mixpanel.init(token, {
    persistence: 'localStorage',
    track_pageview: false,
  });
  initialized = true;
}

export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !initialized) return;
  mixpanel.track(event, props);
}
