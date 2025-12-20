import React, { useState, useMemo } from 'react';
import { VIDEOS } from '../data';
import VideoCard from '../components/VideoCard';
import { PlaySquare, Filter, ChevronDown, Tag, X } from 'lucide-react';
import { VideoCategory } from '../types';

const VideoGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<VideoCategory | 'All'>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories: (VideoCategory | 'All')[] = ['All', 'Music Video', 'Dance', 'Interview', 'Vlog', 'Performance'];

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    VIDEOS.forEach(video => {
        video.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filtering Logic
  const filteredVideos = VIDEOS.filter(v => {
    const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => v.tags?.includes(tag));
    return matchesCategory && matchesTags;
  });

  const visibleVideos = filteredVideos.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
    setVisibleCount(8); // Reset pagination on filter change
  };

  const clearTags = () => {
    setSelectedTags([]);
    setVisibleCount(8);
  };

  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 border-b border-gray-800 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="p-2 bg-red-600/10 rounded-lg text-red-500"><PlaySquare size={24} /></span>
               <span className="text-afro-primary font-bold uppercase tracking-widest text-xs">The Archives</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">Video Gallery</h1>
          </div>
          
          {/* Mobile Category Toggle */}
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
                    onClick={() => { setActiveCategory(cat); setIsFilterOpen(false); setVisibleCount(8); }}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium ${activeCategory === cat ? 'bg-afro-primary text-black' : 'text-gray-400 hover:bg-gray-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Category Filters */}
          <div className="hidden md:flex bg-gray-800/50 p-1 rounded-full backdrop-blur-sm border border-gray-700">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(8); }}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-afro-primary text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        <div className="mb-10">
           <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs font-bold uppercase tracking-wider">
               <Tag size={14} /> Filter by Tags
           </div>
           <div className="flex flex-wrap gap-2">
              {allTags.map(tag => {
                  const isActive = selectedTags.includes(tag);
                  return (
                    <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                            isActive 
                            ? 'bg-gray-700 border-afro-primary text-afro-primary shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                        }`}
                    >
                        #{tag}
                    </button>
                  );
              })}
              {selectedTags.length > 0 && (
                  <button onClick={clearTags} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-500 hover:text-red-400">
                      <X size={14} /> Clear
                  </button>
              )}
           </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 flex justify-between items-center text-gray-400 text-sm border-b border-gray-800 pb-4">
          <span>Showing <span className="text-white font-bold">{Math.min(visibleCount, filteredVideos.length)}</span> of <span className="text-white font-bold">{filteredVideos.length}</span> videos</span>
          {(activeCategory !== 'All' || selectedTags.length > 0) && (
              <span className="text-xs">
                  Filters: {activeCategory !== 'All' && <span className="text-afro-primary mr-2">{activeCategory}</span>}
                  {selectedTags.map(t => <span key={t} className="bg-gray-800 px-1.5 rounded text-gray-300 mr-1">#{t}</span>)}
              </span>
          )}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="py-20 text-center bg-gray-800/20 rounded-2xl border border-gray-800 border-dashed">
            <p className="text-gray-500 text-xl mb-2">No videos match your filters.</p>
            <p className="text-gray-600 text-sm">Try removing some tags or changing the category.</p>
            <button onClick={() => { setActiveCategory('All'); clearTags(); }} className="mt-6 text-afro-primary hover:underline font-bold">Reset all filters</button>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredVideos.length && (
          <div className="mt-20 text-center">
            <button 
              onClick={handleLoadMore}
              className="group border border-gray-600 hover:border-afro-primary text-gray-300 hover:text-afro-primary px-10 py-4 rounded-full font-bold transition-all duration-300 relative overflow-hidden"
            >
                <span className="relative z-10">Load More Videos</span>
                <div className="absolute inset-0 bg-afro-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGallery;