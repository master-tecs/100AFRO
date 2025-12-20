import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Youtube, Search, ArrowRight } from 'lucide-react';
import { BLOG_POSTS, VIDEOS } from '../data';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery('');
    if (!isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
    document.body.style.overflow = 'auto';
  }, [location]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      toggleSearch();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Charts', path: '/charts' },
    { name: 'Videos', path: '/videos' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  // Live Preview Logic
  const filteredBlogs = searchQuery.length > 2 
    ? BLOG_POSTS.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  
  const filteredVideos = searchQuery.length > 2 
    ? VIDEOS.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const hasResults = filteredBlogs.length > 0 || filteredVideos.length > 0;

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group relative z-50">
              <div className="relative">
                <span className="font-display font-bold text-3xl text-white tracking-tighter">
                  100<span className="text-afro-primary">AFRO</span>
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-1 bg-afro-primary transition-all duration-300 group-hover:w-full"></div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-afro-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <button 
                onClick={toggleSearch}
                className="text-gray-400 hover:text-white transition-colors p-2"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <a
                href="https://youtube.com/@100AFRO"
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 text-sm uppercase tracking-wide"
              >
                <Youtube size={18} />
                Subscribe
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={toggleSearch}
                className="text-gray-300 hover:text-white p-1"
              >
                <Search size={24} />
              </button>
              <button
                onClick={toggleMenu}
                className="text-gray-300 hover:text-white focus:outline-none p-1"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800 animate-in slide-in-from-top-5 absolute w-full left-0 top-20 h-screen z-40">
            <div className="px-4 pt-4 pb-12 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-4 rounded-xl text-lg font-bold border-b border-gray-800 ${
                    isActive(link.path)
                      ? 'text-afro-primary'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://youtube.com/@100AFRO"
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center mt-8 bg-red-600 hover:bg-red-700 text-white px-4 py-4 rounded-xl font-bold uppercase tracking-widest"
              >
                Subscribe on YouTube
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Full Screen Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-gray-900/98 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 h-full flex flex-col">
            <div className="flex justify-end mb-8">
              <button onClick={toggleSearch} className="text-gray-400 hover:text-white p-2">
                <X size={32} />
              </button>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="relative mb-12">
              <input
                type="text"
                autoFocus
                placeholder="Search videos, articles, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-700 text-3xl md:text-5xl font-bold text-white py-4 focus:outline-none focus:border-afro-primary placeholder-gray-700 font-display"
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-700 hover:text-afro-primary transition-colors">
                <Search size={32} />
              </button>
            </form>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {searchQuery.length > 2 ? (
                hasResults ? (
                  <div className="grid md:grid-cols-2 gap-12">
                    {filteredVideos.length > 0 && (
                      <div>
                         <h3 className="text-afro-primary font-bold uppercase tracking-widest text-sm mb-6 border-b border-gray-800 pb-2">Videos</h3>
                         <div className="space-y-6">
                            {filteredVideos.slice(0, 4).map(video => (
                              <Link to="/videos" onClick={toggleSearch} key={video.id} className="flex gap-4 group">
                                <div className="w-32 aspect-video bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                  <img src={video.thumbnailUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                                </div>
                                <div>
                                  <h4 className="text-white font-bold leading-tight group-hover:text-afro-primary transition-colors">{video.title}</h4>
                                  <p className="text-gray-500 text-xs mt-1">{video.category} • {video.views}</p>
                                </div>
                              </Link>
                            ))}
                         </div>
                      </div>
                    )}
                    
                    {filteredBlogs.length > 0 && (
                      <div>
                         <h3 className="text-afro-primary font-bold uppercase tracking-widest text-sm mb-6 border-b border-gray-800 pb-2">Articles</h3>
                         <div className="space-y-6">
                            {filteredBlogs.slice(0, 4).map(post => (
                              <Link to={`/blog/${post.slug}`} onClick={toggleSearch} key={post.id} className="block group border-b border-gray-800 pb-4 last:border-0">
                                <span className="text-xs text-afro-primary font-bold">{post.category}</span>
                                <h4 className="text-white font-bold text-lg mt-1 group-hover:underline decoration-afro-primary underline-offset-4">{post.title}</h4>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.excerpt}</p>
                              </Link>
                            ))}
                         </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <p className="text-xl">No results found for "{searchQuery}"</p>
                    <p className="text-sm mt-2">Try checking for typos or using different keywords.</p>
                  </div>
                )
              ) : (
                <div className="text-center text-gray-600 py-12">
                  <p>Start typing to search...</p>
                </div>
              )}
            </div>
            
            {hasResults && (
              <div className="mt-8 text-center pt-8 border-t border-gray-800">
                <button 
                  onClick={(e) => handleSearchSubmit(e)} 
                  className="inline-flex items-center text-white hover:text-afro-primary transition-colors font-bold"
                >
                  View all results <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;