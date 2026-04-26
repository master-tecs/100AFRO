'use client';

import { useEffect } from 'react';
import { track } from '@/lib/mixpanel';

interface ArticleTrackerProps {
  slug: string;
  title: string;
  category: string;
}

export default function ArticleTracker({ slug, title, category }: ArticleTrackerProps) {
  useEffect(() => {
    track('Article Read', { slug, title, category });
  }, [slug, title, category]);

  return null;
}
