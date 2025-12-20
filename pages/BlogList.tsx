import React, { useState } from 'react';
import { BLOG_POSTS } from '../data';
import BlogPostCard from '../components/BlogPostCard';
import { BookOpen, ChevronDown } from 'lucide-react';
import { BlogCategory } from '../types';

const BlogList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories: (BlogCategory | 'All')[] = ['All', 'Music', 'Culture', 'Lifestyle', 'News'];

  const filteredPosts = activeCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === activeCategory);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

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

            {/* Mobile Filter Toggle */}
            <div className="md:hidden w-full">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between w-full bg-gray-800 p-4 rounded-xl text-white font-bold"
              >
                <span>Filter by: {activeCategory}</span>
                <ChevronDown size={20} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterOpen && (
                <div className="mt-2 bg-gray-800 rounded-xl overflow-hidden p-2 space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setIsFilterOpen(false); setVisibleCount(6); }}
                      className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium ${activeCategory === cat ? 'bg-afro-primary text-black' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex space-x-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 border border-transparent ${
                    activeCategory === cat 
                      ? 'bg-gray-800 text-afro-primary border-afro-primary/50' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 text-gray-400 text-sm">
          Showing {Math.min(visibleCount, filteredPosts.length)} of {filteredPosts.length} articles
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visiblePosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

         {/* Empty State */}
         {filteredPosts.length === 0 && (
          <div className="py-20 text-center bg-gray-800/50 rounded-2xl">
            <p className="text-gray-400 text-xl">No articles found in <span className="text-white font-bold">{activeCategory}</span>.</p>
            <button onClick={() => setActiveCategory('All')} className="mt-4 text-afro-primary hover:underline font-bold">Read all news</button>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredPosts.length && (
          <div className="mt-20 text-center">
            <button 
              onClick={handleLoadMore}
               className="group bg-gray-800 hover:bg-gray-700 text-white px-10 py-4 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
               Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;