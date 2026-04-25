import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Eye } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-edge';
import { cookies } from 'next/headers';
import { sanitizeBlogContent } from '@/lib/sanitize-html';

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPostPage({ params }: PreviewPageProps) {
  const { id } = await params;
  
  // Check authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  let user = null;
  if (token) {
    user = await verifyToken(token);
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'AUTHOR')) {
    redirect('/admin/login');
  }

  if (!prisma) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Database not available</div>
      </div>
    );
  }

  // Fetch the post (including drafts)
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Check authorization for authors
  if (user.role === 'AUTHOR' && post.authorId !== user.id) {
    redirect('/admin/dashboard');
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  // Render the blog post content with a draft banner
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Draft Banner */}
      {post.status === 'DRAFT' && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-3 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-400">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-bold">DRAFT PREVIEW</span>
              <span className="text-xs text-yellow-500">
                This post is not publicly visible
              </span>
            </div>
            <Link
              href={`/admin/posts/${post.id}/edit`}
              className="text-sm text-yellow-400 hover:text-yellow-300 font-semibold"
            >
              Edit →
            </Link>
          </div>
        </div>
      )}
      {post.status === 'IN_REVIEW' && (
        <div className="bg-blue-500/10 border-b border-blue-500/30 px-4 py-3 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-bold">IN REVIEW</span>
              <span className="text-xs text-blue-500">
                This post is pending review
              </span>
            </div>
            <Link
              href={`/admin/posts/${post.id}/edit`}
              className="text-sm text-blue-400 hover:text-blue-300 font-semibold"
            >
              Edit →
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors font-bold text-sm tracking-wide"
              >
                <ArrowLeft size={16} className="mr-2" /> BACK TO DASHBOARD
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <span className="bg-afro-primary text-black text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-gray-300 text-sm flex items-center gap-1 font-medium">
                  <Clock size={14} /> 5 MIN READ
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-gray-300 border-l-2 border-afro-primary pl-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                    <img
                      src={
                        post.author.image ||
                        `https://ui-avatars.com/api/?name=${
                          post.author.name || 'Author'
                        }&background=random`
                      }
                      alt={post.author.name || 'Author'}
                    />
                  </div>
                  <div>
                    <p className="text-white font-bold">
                      {post.author.name || 'Author'}
                    </p>
                    <p className="text-xs text-gray-400">Senior Editor</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-600"></div>
                <span className="flex items-center gap-2">
                  <Calendar size={16} /> {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <article>
            <div className="prose prose-lg prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-afro-primary prose-img:rounded-2xl prose-blockquote:border-afro-primary prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic">
              <p className="lead text-2xl text-gray-200 font-serif leading-relaxed mb-8">
                {post.excerpt}
              </p>

              <div
                className="rich-content"
                dangerouslySetInnerHTML={{
                  __html: sanitizeBlogContent(post.content),
                }}
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-12 mt-12">
                <h4 className="text-sm font-bold uppercase text-gray-500 mb-4">
                  Related Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm bg-gray-800 text-gray-300 px-4 py-2 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
