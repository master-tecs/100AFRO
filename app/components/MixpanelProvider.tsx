'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initMixpanel, track } from '@/lib/mixpanel';

export default function MixpanelProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    initMixpanel();
  }, []);

  useEffect(() => {
    const path = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    if (path === prevPath.current) return;
    prevPath.current = path;

    track('Page Viewed', {
      path,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    });
  }, [pathname, searchParams]);

  return null;
}
