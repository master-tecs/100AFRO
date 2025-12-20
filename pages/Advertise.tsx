import React, { useEffect } from 'react';
import { BarChart, Target, Monitor, Download, Zap } from 'lucide-react';

const Advertise: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-gray-900 min-h-screen pt-20 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-20">
            <span className="inline-block py-1 px-3 rounded bg-amber-900/30 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">100AFRO for Brands</span>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Reach the Global Afro Audience</h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Partner with the world's fastest-growing African entertainment platform. We create authentic connections between brands and the culture.
            </p>
            <div className="flex justify-center gap-4">
                <a href="#contact" className="bg-afro-primary text-black font-bold py-4 px-8 rounded-full hover:bg-white transition-colors">Start a Campaign</a>
                <button className="border border-gray-600 hover:border-white text-white font-bold py-4 px-8 rounded-full transition-colors flex items-center gap-2">
                    <Download size={20} /> Download Media Kit
                </button>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {[
                { label: "Monthly Impressions", value: "25M+" },
                { label: "Unique Visitors", value: "10M+" },
                { label: "Social Followers", value: "2M+" },
                { label: "Avg. Engagement Rate", value: "8.5%" },
            ].map((stat, idx) => (
                <div key={idx} className="bg-gray-800/50 p-8 rounded-2xl text-center border border-gray-800">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
            ))}
        </div>

        {/* Ad Products */}
        <div className="mb-24">
            <h2 className="text-3xl font-display font-bold mb-12 text-center">Ad Products & Solutions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                    <div className="bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                        <Monitor size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Display & High Impact</h3>
                    <p className="text-gray-400 text-sm">
                        Premium inventory including homepage takeovers, sticky footers, and interstitial video ads that guarantee visibility.
                    </p>
                </div>
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                    <div className="bg-purple-900/30 w-14 h-14 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                        <Zap size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Branded Content</h3>
                    <p className="text-gray-400 text-sm">
                        Custom storytelling created by our editorial team. Sponsored articles, video features, and social media amplifications.
                    </p>
                </div>
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                    <div className="bg-green-900/30 w-14 h-14 rounded-xl flex items-center justify-center text-green-400 mb-6">
                        <Target size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Programmatic & Data</h3>
                    <p className="text-gray-400 text-sm">
                        Target specific demographics, locations, or interests using our first-party data. Available via direct IO or PMP.
                    </p>
                </div>
            </div>
        </div>

        {/* Contact Form */}
        <div id="contact" className="bg-gray-950 border border-gray-800 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Let's Work Together</h2>
            <p className="text-gray-400 text-center mb-10">Fill out the form below and our sales team will be in touch within 24 hours.</p>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent!"); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Name</label>
                        <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:border-afro-primary outline-none text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Company / Agency</label>
                        <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:border-afro-primary outline-none text-white" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Work Email</label>
                    <input type="email" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:border-afro-primary outline-none text-white" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Budget Range (USD)</label>
                    <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:border-afro-primary outline-none text-gray-300">
                        <option>Select budget...</option>
                        <option>$5,000 - $10,000</option>
                        <option>$10,000 - $50,000</option>
                        <option>$50,000+</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Campaign Goals</label>
                    <textarea rows={4} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:border-afro-primary outline-none text-white"></textarea>
                </div>
                <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-afro-primary transition-colors uppercase tracking-wide">
                    Submit Inquiry
                </button>
            </form>
        </div>

      </div>
    </div>
  );
};

export default Advertise;