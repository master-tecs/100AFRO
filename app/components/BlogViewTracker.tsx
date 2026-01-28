'use client';

import { useEffect } from 'react';

export default function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blog/${encodeURIComponent(slug)}/view`, { method: 'POST' }).catch(() => {});
  }, [slug]);

  return null;
}

