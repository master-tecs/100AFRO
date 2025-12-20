import React from 'react';
import Link from 'next/link';
import { BookOpen, ChevronDown } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import BlogPostCard from '../components/BlogPostCard';
import { BlogCategory } from '@prisma/client';

interface BlogListPageProps {
  searchParams: { category?: string };
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const activeCategory = searchParams.category as BlogCategory | undefined;
  
  const categories: (BlogCategory | 'All')[] = ['All', 'Music', 'Culture', 'Lifestyle', 'News', 'Industry'];

  const where: any = {};
  if (activeCategory && activeCategory !== 'All') {
    where.category = activeCategory;
  }

  const posts = await prisma.blogPost.findMany({
    where,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-gray-800 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="p-2 bg-afro-primary/20 rounded-lg text-afro-primary"><BookOpen size={24} /></span>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">The Feed</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">Latest News</h1>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex space-x-2">
              {categories.map(cat => (
                <Link
                  key={cat}
                  href={cat === 'All' ? '/blog' : `/blog?category=${cat}`}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 border border-transparent ${
                    (activeCategory === cat || (!activeCategory && cat === 'All'))
                      ? 'bg-gray-800 text-afro-primary border-afro-primary/50' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 text-gray-400 text-sm">
          Showing {posts.length} articles
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

         {/* Empty State */}
         {posts.length === 0 && (
          <div className="py-20 text-center bg-gray-800/50 rounded-2xl">
            <p className="text-gray-400 text-xl">No articles found{activeCategory ? ` in ${activeCategory}` : ''}.</p>
            <Link href="/blog" className="mt-4 text-afro-primary hover:underline font-bold inline-block">Read all news</Link>
          </div>
        )}
      </div>
    </div>
  );
}

