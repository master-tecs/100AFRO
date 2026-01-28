import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://100afro.com';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/charts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Try to get blog posts, but handle gracefully if database is not available
  let blogRoutes: MetadataRoute.Sitemap = [];
  
  try {
    // Only try to access database if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma');
      
      // Check if prisma is available (might be null during build)
      if (prisma) {
        const posts = await prisma.blogPost.findMany({
          select: {
            slug: true,
            updatedAt: true,
          },
        });

        blogRoutes = posts.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updatedAt,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    // If database access fails, just return static routes
    console.warn('Could not fetch blog posts for sitemap:', error);
  }

  return [...staticRoutes, ...blogRoutes];
}

