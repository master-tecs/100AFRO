import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Instagram, Twitter, Mail, Facebook, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 text-gray-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand Column (2 cols wide on LG) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/logo.PNG"
                  alt="100AFRO - African Entertainment Hub"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-cover rounded-full"
                />
              </div>
              <span className="font-display font-bold text-3xl text-white tracking-tighter">
                100<span className="text-afro-primary">AFRO</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              The world&apos;s leading destination for African entertainment, bridging the gap between the continent and the diaspora. We are the pulse of the culture, delivering verified news, exclusive interviews, and premium video content to over 10 million monthly readers.
            </p>
            <div className="flex space-x-4 items-center">
               <a href="https://www.tiktok.com/@100afro_?lang=en" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-afro-primary hover:text-black transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
              </a>
              <a href="https://youtube.com/@100AFRO" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><Youtube size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all"><Twitter size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-all"><Instagram size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-afro-primary transition-colors">About Us</Link></li>
              <li><Link href="/team" className="hover:text-afro-primary transition-colors">Our Team</Link></li>
              <li><Link href="/careers" className="hover:text-afro-primary transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-afro-primary transition-colors">Press & Media</Link></li>
              <li><Link href="/advertise" className="hover:text-afro-primary transition-colors">Advertise</Link></li>
            </ul>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/search?q=News" className="hover:text-afro-primary transition-colors">News</Link></li>
              <li><Link href="/search?q=Music" className="hover:text-afro-primary transition-colors">Music</Link></li>
              <li><Link href="/search?q=Lifestyle" className="hover:text-afro-primary transition-colors">Lifestyle</Link></li>
              <li><Link href="/videos" className="hover:text-afro-primary transition-colors">Videos</Link></li>
              <li><Link href="/search?q=Events" className="hover:text-afro-primary transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Legal/Support */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/contact" className="hover:text-afro-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-afro-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-afro-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-afro-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="/sitemap" className="hover:text-afro-primary transition-colors">Sitemap</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} 100AFRO Media Group. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <span>Lagos</span>
             <span>London</span>
             <span>New York</span>
             <span>Johannesburg</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

