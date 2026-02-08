import React from 'react';
import Link from 'next/link';
import { Users, Mail, Linkedin, Twitter, Award, Heart, Globe, Zap } from 'lucide-react';

export const metadata = {
  title: 'Our Team | 100AFRO',
  description: 'Meet the talented team behind 100AFRO, dedicated to bringing you the best in African entertainment.',
};

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Adebayo Ogunlesi',
    role: 'Founder & CEO',
    bio: 'Visionary leader with over 15 years of experience in media and entertainment. Passionate about amplifying African voices globally.',
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`,
    email: 'adebayo@100afro.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Nkechi Okoro',
    role: 'Editor-in-Chief',
    bio: 'Award-winning journalist with expertise in African entertainment. Leads our editorial team in delivering quality content.',
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Nkechi&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`,
    email: 'nkechi@100afro.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Kwame Mensah',
    role: 'Head of Content',
    bio: 'Creative strategist specializing in video production and multimedia storytelling. Brings African stories to life.',
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`,
    email: 'kwame@100afro.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Amina Hassan',
    role: 'Senior Music Editor',
    bio: 'Music industry veteran with deep connections across the African music scene. Curates our charts and music content.',
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Amina&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`,
    email: 'amina@100afro.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'David Kariuki',
    role: 'Lead Developer',
    bio: 'Full-stack engineer building the technology that powers 100AFRO. Passionate about creating seamless user experiences.',
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`,
    email: 'david@100afro.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Fatima Diallo',
    role: 'Social Media Manager',
    bio: 'Digital marketing expert who connects 100AFRO with millions of followers across social platforms. Master of engagement.',
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`,
    email: 'fatima@100afro.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Tunde Adebayo',
    role: 'Video Producer',
    bio: 'Creative video producer specializing in music videos, interviews, and documentary content. Captures the essence of African culture.',
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`,
    email: 'tunde@100afro.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Zainab Ibrahim',
    role: 'Community Manager',
    bio: 'Builds and nurtures our vibrant community of fans and creators. Ensures every voice is heard and valued.',
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`,
    email: 'zainab@100afro.com',
    linkedin: '#',
    twitter: '#',
  },
];

const departments = [
  {
    name: 'Editorial',
    description: 'Our team of writers, editors, and journalists delivering breaking news and in-depth features.',
    icon: Award,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    name: 'Content Production',
    description: 'Video producers, photographers, and multimedia creators bringing stories to life.',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
  {
    name: 'Technology',
    description: 'Engineers and developers building the platform that connects millions of users worldwide.',
    icon: Globe,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
  },
  {
    name: 'Community & Growth',
    description: 'Marketing, social media, and community teams growing and engaging our global audience.',
    icon: Heart,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
  },
];

export default function TeamPage() {
  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="text-afro-primary" size={40} />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              Our Team
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Meet the passionate individuals dedicated to bringing you the best in African entertainment
          </p>
        </div>

        {/* Departments */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">Our Departments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.name}
                  className={`${dept.bgColor} ${dept.borderColor} border rounded-2xl p-6 hover:scale-105 transition-transform`}
                >
                  <div className={`${dept.color} mb-4`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{dept.name}</h3>
                  <p className="text-gray-300 text-sm">{dept.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team Members */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">Leadership & Key Team Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-afro-primary/50 transition-all group"
              >
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-700 ring-4 ring-gray-700 group-hover:ring-afro-primary/50 transition-all">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-afro-primary text-sm font-bold mb-3">{member.role}</p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">{member.bio}</p>
                  <div className="flex items-center justify-center gap-3">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-afro-primary hover:text-black transition-all"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail size={14} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin size={14} />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all"
                        aria-label={`${member.name} Twitter`}
                      >
                        <Twitter size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Join Us Section */}
        <section className="bg-gradient-to-br from-afro-primary/10 to-afro-secondary/10 rounded-2xl p-8 lg:p-12 border border-afro-primary/20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Join Our Team
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              We&apos;re always looking for talented individuals who share our passion for African entertainment. 
              If you&apos;re interested in joining our team, check out our open positions or get in touch.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-afro-primary text-black font-bold rounded-lg hover:bg-white transition-colors"
              >
                View Open Positions
                <Award size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
              >
                Get in Touch
                <Mail size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">What Drives Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <div className="text-4xl font-bold text-afro-primary mb-2">50+</div>
              <div className="text-gray-400 text-sm">Team Members Worldwide</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <div className="text-4xl font-bold text-afro-primary mb-2">15+</div>
              <div className="text-gray-400 text-sm">Countries Represented</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <div className="text-4xl font-bold text-afro-primary mb-2">100%</div>
              <div className="text-gray-400 text-sm">Passion for African Culture</div>
            </div>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-afro-primary hover:text-white font-bold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

