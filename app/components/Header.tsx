'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/use-auth';
import { Menu, X, Youtube, Search } from 'lucide-react';
import UserAvatar from './UserAvatar';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const isAdmin = user?.role === 'ADMIN';
  const isAuthor = user?.role === 'AUTHOR';
  const isEditor = isAdmin || isAuthor;

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

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      // Use setTimeout to delay attaching listener, allowing current click to complete
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isProfileMenuOpen]);

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
    setIsProfileMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      toggleSearch();
    }
  };

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Charts', path: '/charts' },
    { name: 'Videos', path: '/videos' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative z-50">
              <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/logo.PNG"
                  alt="100AFRO - African Entertainment Hub"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-cover rounded-full transition-opacity duration-300 group-hover:opacity-80"
                  priority
                />
              </div>
              <div className="relative hidden sm:block">
                <span className="font-display font-bold text-3xl text-white tracking-tighter">
                  100<span className="text-afro-primary">AFRO</span>
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-1 bg-afro-primary transition-all duration-300 group-hover:w-full"></div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
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

              {/* Profile Menu for Logged-in Users */}
              {isEditor ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                    }}
                    className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-afro-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full"
                  >
                    <UserAvatar 
                      name={user?.name || user?.email} 
                      image={(user as any)?.image || null} 
                      size="sm" 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden z-[100]">
                      <div className="p-4 border-b border-gray-800">
                        <div className="text-white font-semibold">{user?.name || 'User'}</div>
                        <div className="text-gray-400 text-sm">{user?.email}</div>
                      </div>
                      <div className="py-2">
                        <a
                          href={isAdmin ? "/admin/dashboard" : "/editor/dashboard"}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{isAdmin ? 'Admin Dashboard' : 'Content Dashboard'}</span>
                          </div>
                        </a>
                        <a
                          href={isAdmin ? "/admin/dashboard?tab=settings" : "/editor/dashboard?tab=profile"}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profile Settings</span>
                          </div>
                        </a>
                        {isAdmin && (
                          <a
                            href="/admin/dashboard"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span>Admin Panel</span>
                            </div>
                          </a>
                        )}
                      </div>
                      <div className="border-t border-gray-800 py-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="https://youtube.com/@100AFRO"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 text-sm uppercase tracking-wide"
                >
                  <Youtube size={18} />
                  <span className="hidden xl:inline">Subscribe</span>
                </a>
              )}
            </nav>

            {/* Tablet/Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              <button 
                onClick={toggleSearch}
                className="text-gray-300 hover:text-white p-2"
                aria-label="Search"
              >
                <Search size={22} />
              </button>
              
              {/* Profile Menu for Mobile/Tablet */}
              {isEditor ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                    }}
                    className="flex items-center focus:outline-none focus:ring-2 focus:ring-afro-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full"
                  >
                    <UserAvatar 
                      name={user?.name || user?.email} 
                      image={(user as any)?.image || null} 
                      size="sm" 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden z-[100]">
                      <div className="p-4 border-b border-gray-800">
                        <div className="text-white font-semibold">{user?.name || 'User'}</div>
                        <div className="text-gray-400 text-sm">{user?.email}</div>
                      </div>
                      <div className="py-2">
                        <a
                          href={isAdmin ? "/admin/dashboard" : "/editor/dashboard"}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{isAdmin ? 'Admin Dashboard' : 'Content Dashboard'}</span>
                          </div>
                        </a>
                        <a
                          href={isAdmin ? "/admin/dashboard?tab=settings" : "/editor/dashboard?tab=profile"}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profile Settings</span>
                          </div>
                        </a>
                        {isAdmin && (
                          <a
                            href="/admin/dashboard"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span>Admin Panel</span>
                            </div>
                          </a>
                        )}
                      </div>
                      <div className="border-t border-gray-800 py-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="https://youtube.com/@100AFRO"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1 text-xs uppercase"
                >
                  <Youtube size={16} />
                  <span className="hidden sm:inline">Subscribe</span>
                </a>
              )}

              <button
                onClick={toggleMenu}
                className="text-gray-300 hover:text-white focus:outline-none p-1"
                aria-label="Menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-gray-900 border-b border-gray-800 animate-in slide-in-from-top-5 absolute w-full left-0 top-20 h-[calc(100vh-5rem)] z-40 overflow-y-auto">
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
              {isEditor && (
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/editor/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center mt-4 bg-afro-primary hover:bg-white text-black px-4 py-4 rounded-xl font-bold uppercase tracking-widest"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isAdmin ? "Admin Dashboard" : "Content Dashboard"}
                </Link>
              )}
              {!isEditor && (
                <a
                  href="https://youtube.com/@100AFRO"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center mt-8 bg-red-600 hover:bg-red-700 text-white px-4 py-4 rounded-xl font-bold uppercase tracking-widest"
                >
                  <Youtube size={18} className="inline mr-2" />
                  Subscribe on YouTube
                </a>
              )}
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
                <div className="text-center text-gray-500 py-12">
                  <p className="text-xl">No results found for &quot;{searchQuery}&quot;</p>
                  <p className="text-sm mt-2">Try checking for typos or using different keywords.</p>
                </div>
              ) : (
                <div className="text-center text-gray-600 py-12">
                  <p>Start typing to search...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
