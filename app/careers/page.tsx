import React from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, DollarSign, Users, Heart, Zap, Globe, Award, Mail, ArrowRight, CheckCircle, TrendingUp, Code, PenTool, Camera, Megaphone, Music } from 'lucide-react';

export const metadata = {
  title: 'Careers | 100AFRO',
  description: 'Join the 100AFRO team and help shape the future of African entertainment. Explore open positions and discover why 100AFRO is a great place to work.',
};

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: string;
  requirements: string[];
  icon: React.ElementType;
}

const jobOpenings: JobOpening[] = [
  {
    id: '1',
    title: 'Senior Content Writer',
    department: 'Editorial',
    location: 'Lagos, Nigeria / Remote',
    type: 'Full-time',
    description: 'We are seeking an experienced content writer to join our editorial team. You will be responsible for creating engaging articles, features, and news pieces about African entertainment.',
    requirements: [
      '5+ years of experience in journalism or content writing',
      'Strong knowledge of African entertainment industry',
      'Excellent writing and editing skills',
      'Ability to meet tight deadlines',
      'Bachelor\'s degree in Journalism, Communications, or related field',
    ],
    icon: PenTool,
  },
  {
    id: '2',
    title: 'Video Producer',
    department: 'Content Production',
    location: 'London, UK / Remote',
    type: 'Full-time',
    description: 'Join our video production team to create compelling video content including interviews, music videos, and documentaries. You will work closely with artists and industry professionals.',
    requirements: [
      '3+ years of video production experience',
      'Proficiency in Adobe Premiere Pro, Final Cut Pro, or similar',
      'Strong portfolio showcasing video work',
      'Experience with camera operation and lighting',
      'Knowledge of African music and culture',
    ],
    icon: Camera,
  },
  {
    id: '3',
    title: 'Full-Stack Developer',
    department: 'Technology',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for a skilled full-stack developer to help build and maintain our platform. You will work with modern technologies including Next.js, TypeScript, and PostgreSQL.',
    requirements: [
      '3+ years of full-stack development experience',
      'Proficiency in React, Next.js, and TypeScript',
      'Experience with PostgreSQL or similar databases',
      'Knowledge of RESTful APIs and GraphQL',
      'Strong problem-solving skills',
    ],
    icon: Code,
  },
  {
    id: '4',
    title: 'Social Media Manager',
    department: 'Marketing',
    location: 'New York, USA / Remote',
    type: 'Full-time',
    description: 'Lead our social media strategy across all platforms. You will create engaging content, manage community interactions, and grow our online presence.',
    requirements: [
      '4+ years of social media management experience',
      'Strong understanding of TikTok, Instagram, Twitter, and YouTube',
      'Experience with social media analytics tools',
      'Creative content creation skills',
      'Excellent communication and community management abilities',
    ],
    icon: Megaphone,
  },
  {
    id: '5',
    title: 'Music Editor',
    department: 'Editorial',
    location: 'Accra, Ghana / Remote',
    type: 'Full-time',
    description: 'Curate and manage our music content, including charts, reviews, and artist features. You will work closely with record labels and artists to deliver exclusive content.',
    requirements: [
      'Deep knowledge of African music genres and industry',
      '3+ years of experience in music journalism or curation',
      'Strong relationships within the music industry',
      'Excellent writing and analytical skills',
      'Passion for discovering new talent',
    ],
    icon: Music,
  },
  {
    id: '6',
    title: 'UX/UI Designer',
    department: 'Technology',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design beautiful and intuitive user experiences for our platform. You will work closely with developers to create engaging interfaces that showcase African content.',
    requirements: [
      '4+ years of UX/UI design experience',
      'Proficiency in Figma, Adobe XD, or similar tools',
      'Strong portfolio showcasing web and mobile designs',
      'Understanding of user research and testing',
      'Experience with design systems',
    ],
    icon: PenTool,
  },
];

const benefits = [
  {
    icon: Globe,
    title: 'Remote Work',
    description: 'Work from anywhere in the world. We support flexible working arrangements.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: DollarSign,
    title: 'Competitive Salary',
    description: 'We offer competitive compensation packages based on experience and location.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
  },
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance and wellness programs to keep you healthy.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
  },
  {
    icon: Award,
    title: 'Professional Development',
    description: 'Access to training, conferences, and opportunities for career growth.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: 'Work-life balance is important. We offer flexible working hours.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: Users,
    title: 'Great Team',
    description: 'Join a diverse, passionate team of professionals from around the world.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
];

export default function CareersPage() {
  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="text-afro-primary" size={40} />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              Careers at 100AFRO
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join us in shaping the future of African entertainment. We&apos;re building a team of passionate individuals who share our mission.
          </p>
        </div>

        {/* Why Work With Us */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">Why Work With Us</h2>
          <div className="bg-gradient-to-br from-afro-primary/10 to-afro-secondary/10 rounded-2xl p-8 border border-afro-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="text-afro-primary" size={24} />
                  Impact & Growth
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Be part of a platform that reaches millions of readers worldwide. Your work will directly impact how African entertainment is discovered and celebrated globally.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="text-afro-primary" size={24} />
                  Global Reach
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Work with a diverse team spanning multiple continents. Experience different cultures while contributing to a unified mission of celebrating African excellence.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="text-afro-primary" size={24} />
                  Innovation
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  We embrace new technologies and creative approaches. You&apos;ll have the freedom to experiment, innovate, and bring fresh ideas to the table.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Heart className="text-afro-primary" size={24} />
                  Culture & Values
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Join a team that values authenticity, excellence, and inclusivity. We foster a supportive environment where everyone&apos;s voice matters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className={`${benefit.bgColor} ${benefit.borderColor} border rounded-xl p-6 hover:scale-105 transition-transform`}
                >
                  <div className={`${benefit.color} mb-4`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-white">Open Positions</h2>
            <span className="text-gray-400 text-sm">
              {jobOpenings.length} positions available
            </span>
          </div>
          <div className="space-y-6">
            {jobOpenings.map((job) => {
              const Icon = job.icon;
              return (
                <div
                  key={job.id}
                  className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700 hover:border-afro-primary/50 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-afro-primary/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="text-afro-primary" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                              <Briefcase size={14} />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {job.type}
                            </span>
                          </div>
                          <p className="text-gray-300 leading-relaxed mb-4">{job.description}</p>
                          <div>
                            <p className="text-sm font-bold text-gray-400 mb-2">Key Requirements:</p>
                            <ul className="space-y-2">
                              {job.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                  <CheckCircle className="text-afro-primary flex-shrink-0 mt-0.5" size={16} />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:ml-4">
                      <a
                        href={`mailto:careers@100afro.com?subject=Application for ${job.title}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-afro-primary text-black font-bold rounded-lg hover:bg-white transition-colors whitespace-nowrap"
                      >
                        Apply Now
                        <ArrowRight size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Apply', description: 'Submit your application with resume and portfolio' },
              { step: 2, title: 'Review', description: 'Our team reviews your application' },
              { step: 3, title: 'Interview', description: 'Video or in-person interview with the team' },
              { step: 4, title: 'Decision', description: 'We make a decision and get back to you' },
            ].map((item) => (
              <div key={item.step} className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                <div className="w-12 h-12 rounded-full bg-afro-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-afro-primary font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Don't See a Role? */}
        <section className="bg-gradient-to-br from-afro-primary/10 to-afro-secondary/10 rounded-2xl p-8 lg:p-12 border border-afro-primary/20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Don&apos;t See a Role That Fits?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              We&apos;re always looking for talented individuals to join our team. Even if you don&apos;t see a specific role listed, we&apos;d love to hear from you. Send us your resume and let us know how you&apos;d like to contribute to 100AFRO.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:careers@100afro.com?subject=General Application"
                className="inline-flex items-center gap-2 px-6 py-3 bg-afro-primary text-black font-bold rounded-lg hover:bg-white transition-colors"
              >
                Send General Application
                <Mail size={18} />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
              >
                Contact Us
                <ArrowRight size={18} />
              </Link>
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

