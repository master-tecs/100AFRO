import React, { useEffect } from 'react';
import { Download, FileText, Mail } from 'lucide-react';

const Press: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const releases = [
    { date: "Jan 10, 2024", title: "100AFRO Reaches 10 Million Monthly Active Users", link: "#" },
    { date: "Dec 05, 2023", title: "100AFRO Partners with Spotify for 'Sound of Africa' Playlist Series", link: "#" },
    { date: "Nov 15, 2023", title: "Announcing the 2023 'Future Icons' List", link: "#" },
    { date: "Oct 01, 2023", title: "100AFRO Launches New Mobile App for iOS and Android", link: "#" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen pt-20 pb-24 text-white">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
         <div className="text-center mb-16">
            <span className="text-afro-primary font-bold uppercase tracking-widest text-sm mb-4 block">Newsroom</span>
            <h1 className="text-5xl font-display font-bold mb-6">Press & Media Center</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Resources for journalists, bloggers, and creators covering 100AFRO.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
             
             {/* About Boilerplate */}
             <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                 <h3 className="text-2xl font-bold mb-4">About 100AFRO</h3>
                 <p className="text-gray-400 leading-relaxed mb-6">
                     100AFRO is the world's leading digital media platform dedicated to African entertainment. Founded in 2020, we bridge the gap between the continent and the global diaspora, delivering verified news, exclusive interviews, and premium video content. With a monthly readership of over 10 million, 100AFRO is the definitive voice of the culture.
                 </p>
                 <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                     <p className="text-sm text-gray-500 font-mono">
                         <span className="text-afro-primary font-bold">Boilerplate:</span> Please use this description in all press coverage.
                     </p>
                 </div>
             </div>

             {/* Brand Assets */}
             <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                 <h3 className="text-2xl font-bold mb-6">Brand Assets</h3>
                 <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-black rounded flex items-center justify-center font-display font-bold">100<span className="text-afro-primary">A</span></div>
                             <div>
                                 <p className="font-bold">Primary Logo (Dark)</p>
                                 <p className="text-xs text-gray-500">PNG, SVG • Transparent</p>
                             </div>
                         </div>
                         <button className="text-gray-400 hover:text-white"><Download size={20}/></button>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white rounded flex items-center justify-center font-display font-bold border text-black">100<span className="text-afro-primary">A</span></div>
                             <div>
                                 <p className="font-bold text-black">Primary Logo (Light)</p>
                                 <p className="text-xs text-gray-500">PNG, SVG • Transparent</p>
                             </div>
                         </div>
                         <button className="text-gray-400 hover:text-black"><Download size={20}/></button>
                     </div>
                 </div>
             </div>
         </div>

         {/* Press Releases */}
         <div className="max-w-4xl mx-auto">
             <h2 className="text-3xl font-display font-bold mb-8 border-b border-gray-800 pb-4">Recent Press Releases</h2>
             <div className="space-y-6">
                 {releases.map((item, idx) => (
                     <div key={idx} className="flex flex-col md:flex-row gap-4 md:items-center justify-between bg-gray-800/50 p-6 rounded-xl border border-gray-800 hover:border-afro-primary transition-colors group">
                         <div>
                             <span className="text-afro-primary text-xs font-bold uppercase tracking-wider mb-1 block">{item.date}</span>
                             <h3 className="text-lg font-bold text-white group-hover:underline decoration-afro-primary underline-offset-4">{item.title}</h3>
                         </div>
                         <a href={item.link} className="flex items-center text-sm font-bold text-gray-400 hover:text-white whitespace-nowrap">
                             Read Release <FileText size={16} className="ml-2" />
                         </a>
                     </div>
                 ))}
             </div>
         </div>

         {/* Media Contact */}
         <div className="mt-20 text-center bg-gray-800 p-12 rounded-3xl border border-gray-700">
             <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
             <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                 For interview requests, press passes, or official comments, please contact our PR team directly.
             </p>
             <a href="mailto:press@100afro.com" className="inline-flex items-center bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-afro-primary transition-colors">
                 <Mail size={20} className="mr-2" /> press@100afro.com
             </a>
         </div>

       </div>
    </div>
  );
};

export default Press;