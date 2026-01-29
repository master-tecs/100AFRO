'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { hasConsentFor, waitForConsent } from '@/lib/consent';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    // Check consent immediately
    const checkConsent = async () => {
      const consented = await waitForConsent('analytics', 5000);
      setHasAnalyticsConsent(consented);
    };
    checkConsent();

    // Listen for consent updates
    const handler = () => {
      const consented = hasConsentFor('analytics');
      setHasAnalyticsConsent(consented);
    };
    window.addEventListener('consent-updated', handler);
    return () => window.removeEventListener('consent-updated', handler);
  }, []);

  useEffect(() => {
    if (!gaId || !hasAnalyticsConsent || !scriptsLoaded) return;
    if (typeof window === 'undefined') return;
    if (!window.gtag) return;

    const qs = searchParams?.toString();
    const pagePath = qs ? `${pathname}?${qs}` : pathname;
    window.gtag('config', gaId, { page_path: pagePath });
  }, [gaId, pathname, searchParams, hasAnalyticsConsent, scriptsLoaded]);

  if (!hasAnalyticsConsent) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        onLoad={() => setScriptsLoaded(true)}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}

