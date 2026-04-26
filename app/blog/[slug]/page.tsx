import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Clock,
  Share2,
  Send,
  ThumbsUp,
  MessageSquare,
  Heart,
  Check,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { sanitizeBlogContent } from "@/lib/sanitize-html";
import BlogPostCard from "../../components/BlogPostCard";
import CommentsSection from "../../components/CommentsSection";
import NewsletterForm from "../../components/NewsletterForm";
import BlogViewTracker from "../../components/BlogViewTracker";
import ArticleTracker from "../../components/ArticleTracker";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Note: generateStaticParams cannot be used with edge runtime
// Routes will be generated dynamically at request time

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  // Handle missing DATABASE_URL during build
  if (!process.env.DATABASE_URL || !prisma) {
    return {
      title: "Blog Post | 100AFRO",
      description: "100AFRO Blog",
    };
  }

  const now = new Date();
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      OR: [{ publishAt: null }, { publishAt: { lte: now } }],
    },
    include: { author: { select: { name: true } } },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | 100AFRO`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  // Handle missing DATABASE_URL or Prisma
  let post = null;
  const now = new Date();

  try {
    if (process.env.DATABASE_URL && prisma !== null) {
      post = await prisma.blogPost.findFirst({
        where: {
          slug,
          status: "PUBLISHED",
          OR: [{ publishAt: null }, { publishAt: { lte: now } }],
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          comments: {
            where: { status: "APPROVED" },
            orderBy: {
              createdAt: "desc",
            },
            take: 50,
          },
        },
      });
    }
  } catch (error) {
    console.error("Error fetching blog post:", error);
  }

  if (!post) {
    notFound();
  }

  // Only fetch related posts if prisma is available
  let relatedPosts: any[] = [];
  let trendingPosts: any[] = [];

  try {
    if (prisma !== null) {
      [relatedPosts, trendingPosts] = await Promise.all([
        prisma.blogPost.findMany({
          where: {
            category: post.category,
            id: { not: post.id },
            status: "PUBLISHED",
            OR: [{ publishAt: null }, { publishAt: { lte: now } }],
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          take: 3,
          orderBy: {
            publishedAt: "desc",
          },
        }),
        prisma.blogPost.findMany({
          where: {
            status: "PUBLISHED",
            OR: [{ publishAt: null }, { publishAt: { lte: now } }],
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            publishedAt: "desc",
          },
          take: 4,
        }),
      ]);
    }
  } catch (error) {
    console.error("Error fetching related posts:", error);
    // Continue with empty arrays
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <BlogViewTracker slug={post.slug} />
      <ArticleTracker slug={post.slug} title={post.title} category={post.category} />
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
                href="/blog"
                className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors font-bold text-sm tracking-wide"
              >
                <ArrowLeft size={16} className="mr-2" /> BACK TO BLOG
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
                          post.author.name || "Author"
                        }&background=random`
                      }
                      alt={post.author.name || "Author"}
                    />
                  </div>
                  <div>
                    <p className="text-white font-bold">
                      {post.author.name || "Author"}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-7">
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
            <div className="mb-12 mt-12">
              <h4 className="text-sm font-bold uppercase text-gray-500 mb-4">
                Related Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Afrobeats",
                  "Culture",
                  "Music",
                  "Trending",
                  "Africa",
                  "Entertainment",
                ].map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${tag}`}
                    className="text-sm bg-gray-800 text-gray-300 px-4 py-2 rounded-full hover:bg-afro-primary hover:text-black transition-colors font-medium"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Box */}
            <div className="mb-16 bg-gray-800 rounded-2xl p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left border border-gray-700">
              <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden flex-shrink-0 border-2 border-afro-primary">
                <img
                  src={
                    post.author.image ||
                    `https://ui-avatars.com/api/?name=${
                      post.author.name || "Author"
                    }&background=random`
                  }
                  alt={post.author.name || "Author"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  About {post.author.name || "Author"}
                </h3>
                <p className="text-gray-400 text-sm mt-2 mb-4">
                  Senior Editor at 100AFRO. Passionate about African music,
                  culture, and digital storytelling. Covering the pulse of the
                  continent one story at a time.
                </p>
                <div className="flex justify-center sm:justify-start gap-4">
                  <button className="text-gray-400 hover:text-afro-primary">
                    <Twitter size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-afro-primary">
                    <Linkedin size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <CommentsSection postId={post.id} initialComments={post.comments} />
          </article>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Newsletter Widget */}
            <div className="bg-afro-primary text-black p-8 rounded-2xl text-center">
              <h3 className="font-display font-bold text-2xl mb-2">
                Don&apos;t Miss a Beat
              </h3>
              <p className="text-sm font-medium mb-6 opacity-80">
                Get the latest African entertainment news delivered straight to
                your inbox.
              </p>
              <NewsletterForm variant="sidebar" />
            </div>

            {/* Trending Posts Widget */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                  Trending Now
                </h3>
              </div>
              <div className="divide-y divide-gray-700">
                {trendingPosts.map((p, idx) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="flex gap-4 p-4 hover:bg-gray-700/50 transition-colors group"
                  >
                    <span className="text-2xl font-display font-bold text-gray-600 group-hover:text-afro-primary">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-white font-bold text-sm leading-snug group-hover:underline decoration-afro-primary underline-offset-2">
                        {p.title}
                      </h4>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {p.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ad Placeholder */}
            <div className="bg-gray-800 rounded-2xl h-64 flex items-center justify-center border border-gray-700 border-dashed">
              <span className="text-gray-600 font-bold uppercase tracking-widest text-xs">
                Advertisement
              </span>
            </div>
          </aside>
        </div>

        {/* Read Next Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-24 pt-12 border-t border-gray-800">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                More from {post.category}
              </h2>
              <Link
                href="/blog"
                className="text-afro-primary text-sm font-bold hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((p) => (
                <BlogPostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
