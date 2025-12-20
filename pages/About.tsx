import React from 'react';
import { Mail, MapPin, Phone, Users, Globe, Award, Briefcase, TrendingUp } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Corporate Hero */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gray-950 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 opacity-20">
             <img src="https://picsum.photos/seed/crowd/1920/1080" alt="Background" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
            <span className="text-afro-primary font-bold uppercase tracking-widest text-sm mb-4 block">About 100AFRO Media Group</span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 tracking-tight">
                THE PULSE OF <br /><span className="text-afro-primary">AFRICAN CULTURE</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                We are the #1 digital media platform connecting the African continent to the global diaspora. We tell the stories that matter, drive the trends, and amplify the voices of the next generation.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Stats Section - The "Big Site" Feel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-b border-gray-800 pb-12">
            <div className="text-center p-6 bg-gray-800/30 rounded-2xl border border-gray-800">
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">10M+</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Monthly Readers</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 rounded-2xl border border-gray-800">
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">50+</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Countries Reached</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 rounded-2xl border border-gray-800">
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">500k</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Newsletter Subs</div>
            </div>
             <div className="text-center p-6 bg-gray-800/30 rounded-2xl border border-gray-800">
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">1B+</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Video Views</div>
            </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-afro-primary transition-colors duration-300">
                <div className="w-14 h-14 bg-afro-primary/20 rounded-full flex items-center justify-center text-afro-primary mb-6">
                    <Globe size={28} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">Global Reach</h3>
                <p className="text-gray-400">From Lagos to London, Accra to Atlanta, we cover the events and stories that matter to the global Afro community with on-the-ground reporters in 5 key cities.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-afro-primary transition-colors duration-300">
                <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6">
                    <TrendingUp size={28} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">Industry Authority</h3>
                <p className="text-gray-400">We don't just follow trends; we define them. Our "Business of Entertainment" reports are cited by major record labels and investment firms globally.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-afro-primary transition-colors duration-300">
                <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500 mb-6">
                    <Award size={28} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">Premium Content</h3>
                <p className="text-gray-400">Curated music videos, in-depth interviews, and verified news. We prioritize authenticity, quality, and journalistic integrity above all else.</p>
            </div>
        </div>

        {/* Partners Section */}
        <div className="mb-24 text-center">
             <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest mb-12">Trusted By Industry Leaders</h2>
             <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* Simulated Logos */}
                 <div className="text-3xl font-display font-bold text-white">Spotify</div>
                 <div className="text-3xl font-display font-bold text-white">Apple Music</div>
                 <div className="text-3xl font-display font-bold text-white">Universal</div>
                 <div className="text-3xl font-display font-bold text-white">Sony Music</div>
                 <div className="text-3xl font-display font-bold text-white">LiveNation</div>
             </div>
        </div>

        {/* Team Section */}
        <div className="mb-24">
            <h2 className="text-4xl font-display font-bold text-white mb-12 text-center">Executive Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  {role: "CEO & Founder", name: "Tunde O."},
                  {role: "Editor-in-Chief", name: "Amara K."},
                  {role: "Head of Strategy", name: "David L."},
                  {role: "Creative Director", name: "Zainab B."}
                ].map((member, i) => (
                    <div key={i} className="text-center group bg-gray-800 rounded-xl p-6 border border-gray-800 hover:border-gray-600 transition-colors">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gray-700 overflow-hidden mb-4 border-2 border-gray-600 group-hover:border-afro-primary transition-colors">
                            <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="text-white font-bold text-lg">{member.name}</h4>
                        <p className="text-sm text-afro-primary font-bold uppercase tracking-wider">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-6">Work With Us</h2>
                    <p className="text-gray-400 mb-8">
                        Interested in advertising, partnerships, or joining our team? Reach out to our corporate office.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center text-gray-300">
                            <Briefcase className="mr-4 text-afro-primary" size={20} />
                            <span>partnerships@100afro.com</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                            <Mail className="mr-4 text-afro-primary" size={20} />
                            <span>press@100afro.com</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                            <Phone className="mr-4 text-afro-primary" size={20} />
                            <span>+44 20 7123 4567 (London HQ)</span>
                        </div>
                         <div className="flex items-center text-gray-300">
                            <MapPin className="mr-4 text-afro-primary" size={20} />
                            <span>123 Oxford Street, London, UK</span>
                        </div>
                    </div>
                </div>
                <form className="space-y-4 bg-black/20 p-6 rounded-xl" onSubmit={(e) => {e.preventDefault(); alert("Message sent!")}}>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="First Name" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary" />
                        <input type="text" placeholder="Last Name" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary" />
                    </div>
                    <input type="email" placeholder="Business Email" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary" />
                    <select className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 focus:outline-none focus:border-afro-primary">
                        <option>Inquiry Type</option>
                        <option>Advertising</option>
                        <option>Press</option>
                        <option>Partnership</option>
                        <option>Careers</option>
                    </select>
                    <textarea placeholder="Message" rows={4} className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary"></textarea>
                    <button type="submit" className="bg-afro-primary text-black font-bold py-3 px-8 rounded-lg hover:bg-white transition-colors w-full uppercase tracking-wide">
                        Submit Inquiry
                    </button>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;