'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid credentials. Please try again.');
        setLoading(false);
      } else {
        // Redirect based on user role
        const userRole = data.user?.role;
        if (userRole === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (userRole === 'AUTHOR') {
          router.push('/editor/dashboard');
        } else {
          router.push('/admin/dashboard'); // Fallback
        }
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
      {/* Background Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-afro-primary shadow-[0_0_20px_rgba(245,158,11,0.5)]"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-afro-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to main site
          </Link>
          <div className="flex justify-center mb-4">
             <div className="p-3 bg-afro-primary/20 rounded-2xl">
                <ShieldCheck size={40} className="text-afro-primary" />
             </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">ADMIN GATEWAY</h1>
          <p className="text-gray-500 mt-2 font-medium">100AFRO CMS v2.0</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Administrator Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-afro-primary focus:ring-1 focus:ring-afro-primary transition-all"
                  placeholder="admin@100afro.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-afro-primary focus:ring-1 focus:ring-afro-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-afro-primary hover:bg-white text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Authenticate & Entry'
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
             <p className="text-xs text-gray-600 font-medium">
               Authorized personnel only. All access attempts are logged.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

