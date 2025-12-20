'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/use-auth';
import { Menu, X, Youtube, Search, ArrowRight, Shield } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

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
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      toggleSearch();
    }
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Charts', path: '/charts' },
    { name: 'Videos', path: '/videos' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  // Note: Search preview will be handled via API in the search page
  const hasResults = false; // Will be replaced with API call

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group relative z-50">
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
                  href={link.path}
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

              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="bg-afro-primary hover:bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all text-sm uppercase tracking-wide"
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}

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
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="bg-afro-primary text-black px-3 py-1.5 rounded-full font-bold flex items-center gap-1 text-xs uppercase"
                >
                  <Shield size={14} />
                  Admin
                </Link>
              )}
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
                  href={link.path}
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
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center mt-4 bg-afro-primary hover:bg-white text-black px-4 py-4 rounded-xl font-bold uppercase tracking-widest"
                >
                  <Shield size={18} className="inline mr-2" />
                  Admin Dashboard
                </Link>
              )}
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
                  <div className="text-center text-gray-500 py-12">
                    <p className="text-xl">Searching...</p>
                    <p className="text-sm mt-2">Results will appear here</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <p className="text-xl">No results found for &quot;{searchQuery}&quot;</p>
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

