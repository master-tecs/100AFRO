import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogCategory } from '@prisma/client';
import TruncatedTitle from './TruncatedTitle';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  featured?: boolean;
  imageUrl: string;
  author: {
    name: string | null;
  };
  createdAt: Date;
}

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, featured = false }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <article className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col h-full hover:border-afro-primary/50 transition-colors duration-300 group`}>
      <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-afro-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {post.category}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-gray-400 mb-3 space-x-2">
          <span>{formatDate(post.createdAt)}</span>
          <span>•</span>
          <span>{post.author.name || 'Author'}</span>
        </div>
        <h3 className="mb-3">
          <TruncatedTitle
            title={post.title}
            as="span"
            className="text-xl font-bold text-white leading-tight group-hover:text-afro-primary transition-colors"
            linkHref={`/blog/${post.slug}`}
          />
        </h3>
        <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
          {post.excerpt}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-afro-primary font-semibold text-sm hover:underline mt-auto"
        >
          Read Article <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </article>
  );
};

export default BlogPostCard;

