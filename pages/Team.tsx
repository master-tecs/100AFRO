import React, { useEffect } from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const Team: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const leadership = [
    { name: "Tunde O.", role: "CEO & Founder", bio: "Former music executive with 15+ years in the African entertainment industry. Visionary behind the 100AFRO brand expansion." },
    { name: "Amara K.", role: "Editor-in-Chief", bio: "Award-winning journalist previously with BBC Africa. Leads editorial strategy and content integrity." },
    { name: "David L.", role: "Head of Strategy", bio: "MBA graduate focused on digital growth, partnerships, and global market penetration." },
    { name: "Zainab B.", role: "Creative Director", bio: "Visual storytelling expert responsible for the brand's iconic aesthetic and video production standards." },
  ];

  const editorial = [
    { name: "Chioma N.", role: "Senior Music Editor", location: "Lagos" },
    { name: "Sipho M.", role: "Culture & Lifestyle Lead", location: "Johannesburg" },
    { name: "Michael B.", role: "Video Producer", location: "London" },
    { name: "Sarah J.", role: "Staff Writer", location: "Accra" },
    { name: "Kweku A.", role: "Tech & Business Reporter", location: "Lagos" },
    { name: "Emeka O.", role: "Social Media Manager", location: "London" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen pt-20 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-afro-primary font-bold uppercase tracking-widest text-sm mb-4 block">The People Behind The Brand</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Meet the 100AFRO Team</h1>
          <p className="text-xl text-gray-400">
            We are a diverse group of storytellers, creatives, and strategists passionate about amplifying African culture globally.
          </p>
        </div>

        {/* Leadership Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-display font-bold border-b border-gray-800 pb-4 mb-12">Executive Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {leadership.map((member, idx) => (
              <div key={idx} className="bg-gray-800 rounded-2xl p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start border border-gray-700 hover:border-afro-primary transition-colors">
                 <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden flex-shrink-0 border-4 border-gray-600">
                    <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random&size=256`} alt={member.name} className="w-full h-full object-cover" />
                 </div>
                 <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                    <p className="text-afro-primary font-bold uppercase text-sm tracking-wider mb-3">{member.role}</p>
                    <p className="text-gray-400 mb-6">{member.bio}</p>
                    <div className="flex gap-4 justify-center sm:justify-start">
                        <button className="text-gray-500 hover:text-white transition-colors"><Linkedin size={20} /></button>
                        <button className="text-gray-500 hover:text-white transition-colors"><Twitter size={20} /></button>
                        <button className="text-gray-500 hover:text-white transition-colors"><Mail size={20} /></button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Team Grid */}
        <div>
          <h2 className="text-3xl font-display font-bold border-b border-gray-800 pb-4 mb-12">Editorial & Creative</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
             {editorial.map((member, idx) => (
               <div key={idx} className="bg-gray-800/50 p-6 rounded-xl text-center border border-gray-800 hover:bg-gray-800 transition-colors">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gray-700 overflow-hidden mb-4">
                     <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-white text-lg">{member.name}</h4>
                  <p className="text-gray-400 text-xs font-bold uppercase mt-1 mb-2">{member.role}</p>
                  <p className="text-gray-500 text-xs">{member.location}</p>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Team;