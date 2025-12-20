import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BLOG_POSTS, VIDEOS } from '../data';
import BlogPostCard from '../components/BlogPostCard';
import VideoCard from '../components/VideoCard';
import { Search, Frown } from 'lucide-react';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  // Filter Logic
  const filteredBlogs = query.trim()
    ? BLOG_POSTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredVideos = query.trim()
    ? VIDEOS.filter(
        (v) =>
          v.title.toLowerCase().includes(query.toLowerCase()) ||
          v.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hasResults = filteredBlogs.length > 0 || filteredVideos.length > 0;

  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 pb-8 border-b border-gray-800">
          <div className="flex items-center gap-3 text-afro-primary mb-4">
             <Search size={24} />
             <span className="font-bold uppercase tracking-widest text-sm">Search Results</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white break-words">
            {query ? `"${query}"` : 'All Content'}
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
             Found {filteredVideos.length + filteredBlogs.length} results matching your search.
          </p>
        </div>

        {!hasResults ? (
          <div className="py-20 text-center bg-gray-800/30 rounded-3xl border border-gray-800">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-6">
                <Frown size={40} className="text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't find anything matching "{query}". Try different keywords or check for typos.
            </p>
            <Link to="/" className="inline-block bg-afro-primary text-black font-bold px-8 py-3 rounded-full hover:bg-white transition-colors">
              Return Home
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Videos Section */}
            {filteredVideos.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-display font-bold text-white">Videos</h2>
                   <Link to="/videos" className="text-sm text-gray-400 hover:text-afro-primary">View All Videos</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            )}

            {/* Articles Section */}
            {filteredBlogs.length > 0 && (
              <section>
                 <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-display font-bold text-white">Articles</h2>
                   <Link to="/blog" className="text-sm text-gray-400 hover:text-afro-primary">View All Articles</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredBlogs.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;