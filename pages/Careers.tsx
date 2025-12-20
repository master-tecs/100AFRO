import React, { useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';

const Careers: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const benefits = [
    "Competitive salary packages",
    "Remote-first work culture",
    "Health & Wellness stipend",
    "Annual company retreats in Africa",
    "Equipment allowance",
    "Professional development budget"
  ];

  const jobs = [
    { title: "Senior React Developer", department: "Engineering", type: "Full-time", location: "Remote (Global)" },
    { title: "Entertainment Staff Writer", department: "Editorial", type: "Full-time", location: "Lagos / Remote" },
    { title: "Social Media Specialist", department: "Marketing", type: "Contract", location: "London" },
    { title: "Video Editor", department: "Production", type: "Full-time", location: "Remote" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen pt-20 pb-24 text-white">
      {/* Hero */}
      <div className="bg-gray-950 border-b border-gray-800 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block py-1 px-3 rounded bg-blue-900/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">We Are Hiring</span>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8">Join the Movement</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Help us shape the future of African entertainment media. We're looking for passionate creators, innovators, and storytellers.
            </p>
            <a href="#positions" className="bg-afro-primary text-black font-bold py-4 px-8 rounded-full hover:bg-white transition-colors">
                View Open Positions
            </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Culture & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
            <div>
                <h2 className="text-3xl font-display font-bold mb-6">Why work at 100AFRO?</h2>
                <p className="text-gray-400 text-lg mb-8">
                    We are more than just a media company; we are a cultural bridge. Working here means being at the forefront of the global explosion of African music, film, and fashion.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="bg-green-900/30 p-1 rounded-full text-green-500"><Check size={16} /></div>
                            <span className="text-gray-300 font-medium">{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative">
                <div className="absolute -inset-4 bg-afro-primary/20 rounded-xl blur-lg"></div>
                <img src="https://picsum.photos/seed/office/800/600" alt="Team working" className="relative rounded-xl border border-gray-700 shadow-2xl" />
            </div>
        </div>

        {/* Job Listings */}
        <div id="positions">
             <h2 className="text-3xl font-display font-bold mb-8 border-b border-gray-800 pb-4">Current Openings</h2>
             <div className="space-y-4">
                 {jobs.map((job, idx) => (
                     <div key={idx} className="bg-gray-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center group hover:border-afro-primary border border-transparent transition-all">
                         <div className="mb-4 md:mb-0 text-center md:text-left">
                             <h3 className="text-xl font-bold text-white group-hover:text-afro-primary transition-colors">{job.title}</h3>
                             <div className="flex gap-4 text-sm text-gray-400 mt-2 justify-center md:justify-start">
                                 <span>{job.department}</span>
                                 <span>•</span>
                                 <span>{job.type}</span>
                                 <span>•</span>
                                 <span>{job.location}</span>
                             </div>
                         </div>
                         <button className="px-6 py-2 border border-gray-600 rounded-full hover:bg-white hover:text-black hover:border-white transition-colors font-bold text-sm flex items-center">
                             Apply Now <ArrowRight size={16} className="ml-2" />
                         </button>
                     </div>
                 ))}
             </div>
             <p className="text-center text-gray-500 mt-12">
                 Don't see a role for you? Email your portfolio to <a href="mailto:careers@100afro.com" className="text-afro-primary hover:underline">careers@100afro.com</a>
             </p>
        </div>

      </div>
    </div>
  );
};

export default Careers;