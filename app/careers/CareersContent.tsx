'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  Radio,
  TrendingUp,
  Music,
  FileText,
  BarChart2,
  ChevronDown,
  X,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Mail,
} from 'lucide-react';
import { z } from 'zod';
import { track } from '@/lib/mixpanel';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type SectionType = 'paras' | 'list' | 'highlight';

interface Section {
  label: string;
  type: SectionType;
  content: string | string[];
}

interface Job {
  id: string;
  dept: string;
  deptSlug: string;
  title: string;
  tags: string[];
  comp: { amount: string; type: string; note: string };
  meta: { label: string; value: string }[];
  apply: { subject: string; instructions: string };
  sections: Section[];
}

// ─── JOB DATA ─────────────────────────────────────────────────────────────────

const JOBS: Job[] = [
  {
    id: 'writer',
    dept: 'Editorial',
    deptSlug: 'editorial',
    title: 'Staff Writer',
    tags: ['Remote — Nigeria', 'Freelance', 'Per article', '3 positions'],
    comp: {
      amount: '₦8,000 – ₦15,000',
      type: 'per article',
      note: 'Rate based on article length, complexity, and exclusivity. Feature articles and interviews at the higher end. Writers hitting 8+ articles/month move to a retainer of ₦50,000 + per-article rate.',
    },
    meta: [
      { label: 'Location', value: 'Remote — Nigeria' },
      { label: 'Type', value: 'Freelance, per article' },
      { label: 'Volume', value: '2–3 articles/week' },
      { label: 'Start date', value: 'Immediate' },
      { label: 'Positions', value: '3 open' },
    ],
    apply: {
      subject: 'Staff Writer Application — [Your Name]',
      instructions:
        'Send a short intro, 3 links to published work, and one original story pitch — a story you think 100AFRO should cover and why. No pitch = no consideration. Shortlisted candidates receive a paid test article brief.',
    },
    sections: [
      {
        label: 'The role',
        type: 'paras',
        content: [
          "100AFRO is looking for talented writers who live and breathe African music and culture. You'll be the voice of the platform — writing articles, features, and breaking news that our growing global audience reads every week.",
          'This is a freelance, per-article role to start. The best performers will be offered a monthly retainer and eventually a full-time position as the business grows. We want writers who want to grow with us.',
        ],
      },
      {
        label: "What you'll write",
        type: 'list',
        content: [
          'Breaking news in African music and entertainment — Afrobeats, Amapiano, Afropop, Afro-fusion, and beyond',
          'In-depth features and cultural commentary — long reads that get shared and cited',
          'Artist profiles, interviews, and album reviews',
          'Trend pieces covering the African entertainment industry — business, streaming numbers, events',
          'Lifestyle and culture content connecting the diaspora to the continent',
          'Weekly recurring features (charts commentary, artist spotlights, This Week in Afrobeats)',
        ],
      },
      {
        label: "What we're looking for",
        type: 'list',
        content: [
          "Strong, clear writing in English — you can tell a story and make people feel something",
          'Deep, genuine knowledge of African music — you know who produced the B-side on an Asake album',
          'Ability to write quickly and accurately on breaking news without sacrificing quality',
          "Self-directed — you pitch ideas, meet deadlines, and work without hand-holding",
          'Experience writing for a blog, publication, or online platform (portfolio required)',
          'Bonus: existing music industry contacts or access to artist press teams',
        ],
      },
      {
        label: "What we don't care about",
        type: 'list',
        content: [
          "Your degree — we care about your writing, full stop",
          'Years of experience — a great portfolio beats a long CV every time',
          "Your city — as long as you have reliable internet and meet your deadlines",
        ],
      },
    ],
  },
  {
    id: 'social',
    dept: 'Growth',
    deptSlug: 'growth',
    title: 'Social Media Manager',
    tags: ['Remote — Nigeria', 'Part-time', 'Monthly retainer', '1 position'],
    comp: {
      amount: '₦150,000 – ₦200,000',
      type: 'per month',
      note: 'Starting at ₦150,000 with a 90-day performance review. Strong growth results unlock raises and a path to Head of Social as the team scales.',
    },
    meta: [
      { label: 'Location', value: 'Remote — Nigeria' },
      { label: 'Type', value: 'Part-time retainer' },
      { label: 'Hours', value: '~20–25 hrs/week' },
      { label: 'Start date', value: 'Immediate' },
      { label: 'Platforms', value: 'Instagram, TikTok, X' },
    ],
    apply: {
      subject: 'Social Media Manager — [Your Name]',
      instructions:
        "Send links to 2–3 accounts or brand pages you've managed with approximate stats, your personal social handles, and your answer to: What's one thing 100AFRO should be posting that we're not? Best applications include content examples.",
    },
    sections: [
      {
        label: 'The role',
        type: 'paras',
        content: [
          "You are the face of 100AFRO on social media. You understand the culture from the inside — what's trending on Nigerian Twitter before it goes global, which sound is about to blow on TikTok, and how to write a caption that makes people stop scrolling.",
          "You'll manage our presence across Instagram, TikTok, and X, turning editorial content into engaging daily posts while also creating your own native social content. This role directly drives traffic, followers, and brand awareness.",
        ],
      },
      {
        label: "What you'll do daily",
        type: 'list',
        content: [
          'Post 2–3 times per day across Instagram, TikTok, and X — content calendared a week in advance',
          'Repurpose every blog article into platform-native content (quote cards, carousels, clips)',
          'Create original short-form video for TikTok and Reels — trending sounds, music reactions, cultural commentary',
          'Monitor and engage with comments, mentions, and DMs — build community, not just a broadcast',
          'Track and report on follower growth, engagement rate, and top performing content weekly',
          'Jump on breaking music news in real time — be the first credible voice',
          'Build relationships with micro-influencers in the African music space',
        ],
      },
      {
        label: "What we're looking for",
        type: 'list',
        content: [
          "You live on social media and you're good at it — show us accounts you've grown",
          "Genuine obsession with African music culture — you know the artists and the context",
          "Fluent in the language of each platform — TikTok is not X is not Instagram",
          'Basic graphic design using Canva or similar',
          'Experience managing a brand, creator, or media account',
          'Strong written communication — captions, hooks, replies all sound human and sharp',
          "Organized and proactive — you plan ahead, you don't miss posting windows",
        ],
      },
      {
        label: 'Success at 90 days',
        type: 'highlight',
        content:
          "5,000+ total followers across platforms, 5%+ average engagement rate, and at least 2 posts that broke 10,000 impressions organically. These are targets, not guarantees — but they tell us what good looks like.",
      },
    ],
  },
  {
    id: 'video',
    dept: 'Creative',
    deptSlug: 'creative',
    title: 'Video Editor',
    tags: ['Remote — Nigeria', 'Freelance', 'Per video', '1 position'],
    comp: {
      amount: '₦15,000 – ₦40,000',
      type: 'per video',
      note: 'Short-form Reels: ₦15,000–20,000. YouTube long-form: ₦30,000–40,000. Consistent volume (4+ videos/month) qualifies for a monthly retainer. Rates reviewed upward as the channel grows.',
    },
    meta: [
      { label: 'Location', value: 'Remote — Nigeria' },
      { label: 'Type', value: 'Freelance, per video' },
      { label: 'Volume', value: '4–8 videos/month' },
      { label: 'Turnaround', value: '48–72 hours per edit' },
      { label: 'Start date', value: 'Immediate' },
    ],
    apply: {
      subject: 'Video Editor — [Your Name]',
      instructions:
        'Send a showreel or portfolio link (YouTube, Vimeo, Drive), the tools you use, and your typical turnaround time per video type. No portfolio, no consideration. Shortlisted candidates are given a paid test edit.',
    },
    sections: [
      {
        label: 'The role',
        type: 'paras',
        content: [
          '100AFRO is growing its video presence across YouTube and social media. We need a video editor who can take raw footage, blog content, and music clips and turn them into polished, high-retention video that feels as premium as the brand.',
          "This is a freelance, per-video role with consistent volume — we plan to publish 4–8 videos per month. The right person will become our go-to editor and grow into a lead creative role.",
        ],
      },
      {
        label: "What you'll edit",
        type: 'list',
        content: [
          'YouTube long-form (5–15 min): artist breakdowns, Top 10 charts videos, Afrobeats deep dives, music history explainers',
          'Short-form vertical content for TikTok and Reels (30–90 seconds)',
          'Music video reaction and commentary clips',
          'Event recap and highlight reels',
          'Branded intro/outro sequences and lower thirds consistent with 100AFRO identity',
        ],
      },
      {
        label: "What we're looking for",
        type: 'list',
        content: [
          'Strong portfolio of edited video content — YouTube, social, or branded work',
          'Proficiency in Premiere Pro, DaVinci Resolve, or CapCut (minimum CapCut for short-form)',
          'Fast turnaround — standard edit delivered within 48–72 hours of raw files',
          'Strong sense of pacing, music timing, and visual storytelling',
          'Ability to add captions, motion text, and basic motion graphics',
          'Cultural awareness — you understand the African entertainment visual language',
          'Takes direction well and incorporates feedback without ego',
        ],
      },
      {
        label: 'Bonus skills',
        type: 'list',
        content: [
          'After Effects for motion graphics',
          'Thumbnail design for YouTube (Photoshop or Canva)',
          'Basic colour grading and audio mixing',
          'Experience editing in music or entertainment content',
        ],
      },
    ],
  },
  {
    id: 'eic',
    dept: 'Leadership',
    deptSlug: 'leadership',
    title: 'Editor-in-Chief',
    tags: ['Remote — Nigeria or diaspora', 'Part-time', 'Retainer + equity', '1 position'],
    comp: {
      amount: '₦150,000 – ₦300,000',
      type: 'per month + equity',
      note: "Retainer based on experience and commitment level. Equity stake offered to the right candidate. This is a founding team opportunity — compensation scales significantly as the business generates revenue.",
    },
    meta: [
      { label: 'Location', value: 'Remote — Nigeria or diaspora' },
      { label: 'Type', value: 'Part-time retainer + equity' },
      { label: 'Experience', value: '5+ years editorial' },
      { label: 'Seniority', value: 'Senior / founding team' },
      { label: 'Start date', value: 'Immediate' },
    ],
    apply: {
      subject: 'Editor-in-Chief — [Your Name]',
      instructions:
        "Send your CV or LinkedIn, links to 5 of your best published or edited pieces, and a 300-word editorial vision statement — how would you position 100AFRO editorially in the next 12 months? What would you do first? Applications without a vision statement will not receive a response.",
    },
    sections: [
      {
        label: 'The role',
        type: 'paras',
        content: [
          "This is 100AFRO's most important hire. The Editor-in-Chief sets the editorial voice of the platform, owns the content calendar, quality-controls every piece published, and builds the writing team into a disciplined, high-output unit.",
          "You are both a journalist and a leader. You can write when needed, but your highest leverage is elevating other writers and setting editorial standards that make 100AFRO the most credible voice in African entertainment media. We're offering equity alongside the retainer because we want someone building this with us, not just for us.",
        ],
      },
      {
        label: "What you'll own",
        type: 'list',
        content: [
          "Set and maintain 100AFRO's editorial tone, voice guidelines, and content standards",
          'Build and manage a weekly content calendar across all categories',
          'Edit and approve every article before publication — quality is non-negotiable',
          'Pitch and assign story ideas; develop angles that drive traffic and social sharing',
          'Commission exclusives, interviews, and special features',
          'Recruit, onboard, and develop the freelance writer pool',
          'Maintain relationships with publicists, PR firms, and label contacts for exclusive content',
          'Report to the founder on content performance and editorial direction monthly',
        ],
      },
      {
        label: "What we're looking for",
        type: 'list',
        content: [
          '5+ years of editorial or journalism experience, at least 2 in a leadership or senior role',
          'Deep knowledge of African music and entertainment — you are part of the culture',
          "Proven track record of growing a publication's readership or engagement",
          "Strong editorial instincts — you know what's a story and when something isn't ready to publish",
          'Experience managing and developing junior writers',
          'Connections across the African entertainment industry — labels, artists, publicists, events',
          'Comfortable in a startup environment — fast-moving, adaptable, resourceful',
        ],
      },
      {
        label: 'This role is for you if',
        type: 'highlight',
        content:
          "You've been frustrated watching African entertainment get covered by platforms that don't truly understand the culture. You want to build the platform you wish existed. You're not looking for a job — you're looking for a founding editorial role at something that could become the defining media brand of this generation of African music.",
      },
    ],
  },
  {
    id: 'intern',
    dept: 'Internship',
    deptSlug: 'internship',
    title: 'Content & Growth Intern',
    tags: ['Remote — Anywhere', 'Unpaid', '3–6 months', '15–20 hrs/week'],
    comp: {
      amount: 'Unpaid',
      type: 'byline · reference · mentorship',
      note: "No salary. In return: published bylines on 100afro.com, a formal reference letter, direct mentorship from the founder, and first-in-line priority for paid roles as the team grows.",
    },
    meta: [
      { label: 'Location', value: 'Remote — Anywhere' },
      { label: 'Commitment', value: '15–20 hours/week' },
      { label: 'Duration', value: '3–6 months' },
      { label: 'Compensation', value: 'Unpaid (byline + reference)' },
      { label: 'Start date', value: 'Immediate' },
    ],
    apply: {
      subject: 'Content Intern — [Your Name]',
      instructions:
        "No CV required. Tell us three things: who you are and why you want this specifically, a link to something you've written or posted that you're proud of, and one story you think 100AFRO should cover right now and why. Applications without a story pitch will not be considered.",
    },
    sections: [
      {
        label: 'What this is',
        type: 'paras',
        content: [
          "100AFRO is the emerging global home for African entertainment. We're early-stage and growing, and we're looking for one driven, culture-obsessed intern to work directly with our founding team.",
          "This is an unpaid internship, and we want to be straight with you: you won't earn a salary, but you will earn something that pays long-term — a real byline on a growing media platform, direct mentorship from the founder, a portfolio you can point to, and a front-row seat to how a media startup gets built.",
        ],
      },
      {
        label: "What you'll actually do",
        type: 'list',
        content: [
          'Write 2–3 articles per week published under your own byline on 100afro.com',
          'Research and pitch story ideas — think editorially, not just execute briefs',
          'Help manage and schedule daily social media content across Instagram, TikTok, and X',
          'Monitor trending topics in African music and flag time-sensitive stories to the team',
          'Assist with the weekly Inner Circle newsletter — drafting, curating, and formatting',
          'Support with research: artist bios, chart data, industry statistics for features',
          'Engage authentically with the 100AFRO audience — reply to comments, join conversations',
        ],
      },
      {
        label: "Who we're looking for",
        type: 'list',
        content: [
          'Genuinely passionate about African music and culture — not just for work experience',
          'Strong writer in English — clear, punchy, and culturally aware',
          'Active on social media and understands how different platforms work',
          "Self-starter — you see a gap and fill it without being told",
          "Reliable — you show up, meet commitments, and communicate when something comes up",
          'Available 15–20 hours per week consistently for at least 3 months',
        ],
      },
      {
        label: "What you'll walk away with",
        type: 'list',
        content: [
          'Published bylines on 100afro.com — a real, linkable portfolio',
          'Formal reference letter from the 100AFRO founder',
          'Hands-on startup experience — editorial strategy, growth decisions, brand direction',
          'First-in-line priority for paid roles as the company hires',
          'Access to music industry contacts, press releases, and label communications',
          'Direct weekly mentorship and feedback on your writing and creative work',
        ],
      },
      {
        label: 'Our commitment to you',
        type: 'highlight',
        content:
          "We know unpaid work requires trust. We will never give you busywork — every task you do will matter and be visible. Your name will appear on the site. Your ideas will be heard in editorial. If at any point this stops feeling like a fair exchange, tell us. We'd rather adjust than lose someone good.",
      },
    ],
  },
  {
    id: 'bizops',
    dept: 'Internship · Business',
    deptSlug: 'internship',
    title: 'Business Operations Intern',
    tags: ['Remote — Anywhere', 'Unpaid', '3–6 months', '15–20 hrs/week', '1 position'],
    comp: {
      amount: 'Unpaid',
      type: 'reference · mentorship · real experience',
      note: 'No salary. In return: a formal reference letter, hands-on startup business operations experience, direct mentorship from the founder, and first-in-line priority for a paid Business Manager role as the company grows.',
    },
    meta: [
      { label: 'Location', value: 'Remote — Anywhere' },
      { label: 'Type', value: 'Unpaid internship' },
      { label: 'Hours', value: '15–20 hrs/week' },
      { label: 'Duration', value: '3–6 months' },
      { label: 'Start date', value: 'Immediate' },
    ],
    apply: {
      subject: 'Business Operations Intern — [Your Name]',
      instructions:
        "Send a short intro (who you are, why 100AFRO), your CV or LinkedIn, and your answer to: How would you set up a simple payment tracking system for a team of freelance writers? No formal cover letter needed — just be clear and practical.",
    },
    sections: [
      {
        label: 'The role',
        type: 'paras',
        content: [
          "100AFRO is growing its team and we need someone to bring structure to our business operations. Right now, decisions are made fast and work gets done — but we need a dedicated person to make sure the business side runs cleanly: payments tracked, records kept, schedules maintained, and our growing team managed with care.",
          "This is a Business Operations Internship — unpaid, but real. You will work directly with the founder, own our internal financial records and team tracking, and help build the operational backbone of a growing media company. If you love bringing order to fast-moving environments and want startup experience that actually means something on your CV, this is for you.",
        ],
      },
      {
        label: "What you'll own",
        type: 'list',
        content: [
          'Maintain a live payment tracker for all freelance staff — every writer, editor, and contractor — logging articles submitted, amounts owed, payment dates, and outstanding balances',
          'Build and maintain a clear payment schedule: who gets paid, how much, and when — no one should ever have to chase us for money',
          'Keep a master record of all contracts, agreed rates, and role details for every team member',
          'Track content output — how many articles each writer published per week and month — and produce a simple weekly summary report for the founder',
          'Assist with onboarding new team members: collecting details, setting up records, explaining payment processes',
          'Flag any discrepancies, missed payments, or irregularities before they become problems',
          'Support the founder with general business admin: scheduling, follow-ups, communications, and ad hoc operational tasks',
          'Research and recommend tools as the business scales — CRM setup, invoicing systems, team management software',
        ],
      },
      {
        label: "What we're looking for",
        type: 'list',
        content: [
          "Highly organised — you love spreadsheets, systems, and making sure nothing slips through the cracks",
          'Trustworthy and discreet — you will have access to payment details and business records, and we need complete reliability',
          'Proactive communicator — you flag problems early and keep people informed without being asked',
          'Comfortable with Google Sheets or Excel — most of this work starts in spreadsheets',
          'Background in business, finance, operations, administration, or a related field',
          'Available consistently for 15–20 hours per week for at least 3 months',
          'Bonus: experience with CRM tools (HubSpot, Notion, Airtable) or invoicing and payments platforms',
        ],
      },
      {
        label: 'Why this role matters',
        type: 'highlight',
        content:
          "Every media company that scales has someone keeping the business side tight while the creative side runs free. That is this role. You are not in the background — you are the reason the team gets paid on time, the records are clean, and the founder can focus on growth. That is a real contribution, and it will show on your reference.",
      },
      {
        label: "What you'll walk away with",
        type: 'list',
        content: [
          'Formal reference letter from the 100AFRO founder detailing your role, responsibilities, and contributions',
          'Real startup operations experience — not theoretical, not busywork, actual business infrastructure you built from scratch',
          'Full exposure to the business side of a media company: contracts, payments, team management, and scaling operations',
          'First-in-line priority for a paid Business Manager or Operations Lead role as 100AFRO grows',
          'Direct mentorship from the founder and a growing network in African media and entertainment',
        ],
      },
      {
        label: 'Our commitment to you',
        type: 'highlight',
        content:
          "We know this is unpaid and we do not take that lightly. We will treat your time with full respect. Every hour you put in will go toward work that genuinely matters to the business. Clear direction, fast responses, honest feedback — always. And when we start paying people, you will be first in the conversation.",
      },
    ],
  },
];

const DEPARTMENTS = ['All', 'Editorial', 'Growth', 'Creative', 'Leadership', 'Internship'];

// ─── HIRING STATUS ────────────────────────────────────────────────────────────
// Set to false to close all roles and stop accepting applications.
// Flip back to true to reopen the listings — job data below is preserved.
const ACCEPTING_APPLICATIONS = false;

const VALUES = [
  {
    icon: Globe,
    title: 'Culture-first',
    body: "We cover African entertainment because we love it — not because it's a trend. Authenticity is everything here.",
  },
  {
    icon: Radio,
    title: 'Fully remote',
    body: 'Work from wherever you are. All we care about is your output, your passion, and your reliability.',
  },
  {
    icon: TrendingUp,
    title: 'Early-stage upside',
    body: 'The people who join us now will grow into senior roles, equity, and leadership as the company scales.',
  },
  {
    icon: FileText,
    title: 'Your name on it',
    body: "Your bylines, your content, your ideas — all visible on a growing platform. We build your portfolio, not just ours.",
  },
  {
    icon: Music,
    title: 'Industry access',
    body: "Press releases, label contacts, artist interviews — you'll be inside the music industry from day one.",
  },
  {
    icon: BarChart2,
    title: 'Rates that grow',
    body: "We're transparent about what we pay now and what we'll pay as revenue grows. Your compensation scales with the business.",
  },
];

// ─── APPLY SCHEMA ─────────────────────────────────────────────────────────────

const applySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  portfolio: z
    .string()
    .url('Please enter a valid URL (include https://)')
    .optional()
    .or(z.literal('')),
  coverLetter: z.string().min(50, 'Please write at least 50 characters'),
  role: z.string().min(1),
});

type ApplyFormData = z.infer<typeof applySchema>;

// ─── APPLICATION MODAL ────────────────────────────────────────────────────────

function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [form, setForm] = useState<ApplyFormData>({
    name: '',
    email: '',
    portfolio: '',
    coverLetter: '',
    role: job.title,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ApplyFormData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ApplyFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = applySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ApplyFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ApplyFormData;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || 'Something went wrong');
      }
      track('Careers Application Submitted', { jobId: job.id, jobTitle: job.title });
      setStatus('success');
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      track('Careers Application Failed', { jobId: job.id, error: errMsg });
      setStatus('error');
      setErrorMessage(errMsg);
    }
  };

  const inputCls = (field: keyof ApplyFormData) =>
    `w-full bg-gray-950 border ${
      errors[field] ? 'border-red-500' : 'border-gray-700 focus:border-afro-primary'
    } rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors text-sm`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" />

      <div className="relative bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-widest text-afro-primary uppercase font-bold mb-1">
              {job.dept}
            </p>
            <h2 className="text-xl font-display font-bold text-white leading-tight">
              Apply — {job.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors flex-shrink-0 mt-0.5 p-1 -mr-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success */}
        {status === 'success' ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-afro-primary/15 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="text-afro-primary" size={32} />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              Application sent!
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-2">
              We&apos;ve received your application for{' '}
              <strong className="text-white">{job.title}</strong> and sent a
              confirmation to your inbox.
            </p>
            <p className="text-gray-600 text-xs mb-8">
              We review every application personally. If you&apos;re shortlisted,
              expect to hear from us within 7 days.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-afro-primary text-black font-bold rounded-lg text-sm hover:bg-yellow-400 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Full Name <span className="text-afro-primary">*</span>
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputCls('name')}
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Email Address <span className="text-afro-primary">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={inputCls('email')}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Portfolio */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Portfolio / Work Samples / LinkedIn
              </label>
              <input
                name="portfolio"
                type="url"
                value={form.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
                className={inputCls('portfolio')}
              />
              {errors.portfolio && (
                <p className="text-red-400 text-xs mt-1.5">{errors.portfolio}</p>
              )}
              <p className="text-gray-600 text-xs mt-1.5">
                LinkedIn, portfolio site, Google Drive link, YouTube showreel, etc.
              </p>
            </div>

            {/* Cover letter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Cover Letter <span className="text-afro-primary">*</span>
              </label>
              <textarea
                name="coverLetter"
                value={form.coverLetter}
                onChange={handleChange}
                rows={6}
                placeholder={`Tell us why you're right for the ${job.title} role. Include your story pitch / vision / key examples as described in the application instructions below.`}
                className={`${inputCls('coverLetter')} resize-none leading-relaxed`}
              />
              {errors.coverLetter && (
                <p className="text-red-400 text-xs mt-1.5">{errors.coverLetter}</p>
              )}
              <div className="mt-2.5 bg-gray-950/60 border border-gray-800 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                  Application instructions
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">{job.apply.instructions}</p>
              </div>
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-afro-primary text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3.5 bg-gray-800 text-gray-400 font-bold rounded-lg hover:bg-gray-700 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── JOB CARD ─────────────────────────────────────────────────────────────────

function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`border-b border-gray-800 transition-colors duration-200 ${
        expanded ? 'bg-gray-800/30' : ''
      }`}
    >
      {/* Row trigger */}
      <button
        className="w-full text-left py-6 flex flex-col sm:flex-row sm:items-center gap-4 group"
        onClick={() => {
          const next = !expanded;
          setExpanded(next);
          if (next) track('Careers Job Expanded', { jobId: job.id, jobTitle: job.title });
        }}
        aria-expanded={expanded}
      >
        {/* Left */}
        <div className="flex-1 min-w-0">
          <p className="text-xs tracking-widest text-afro-primary uppercase font-bold mb-1.5">
            {job.dept}
          </p>
          <h3
            className={`text-xl sm:text-2xl font-display font-bold leading-tight transition-colors duration-200 ${
              expanded ? 'text-afro-primary' : 'text-white group-hover:text-afro-primary'
            }`}
          >
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-500 border border-gray-800 rounded-full px-3 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 flex-shrink-0 sm:ml-4">
          <div className="text-right">
            <p className="text-lg font-display font-bold text-white">{job.comp.amount}</p>
            <p className="text-xs text-gray-600 uppercase tracking-widest mt-0.5">
              {job.comp.type}
            </p>
          </div>
          <div
            className={`text-gray-600 transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
          >
            <ChevronDown size={20} />
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-10 grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-gray-800/60 pt-6">
          {/* Main JD */}
          <div className="lg:col-span-2 space-y-8">
            {job.sections.map((section) => (
              <div key={section.label}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs tracking-widest text-afro-primary uppercase font-bold">
                    {section.label}
                  </span>
                  <div className="flex-1 h-px bg-gray-800 max-w-[100px]" />
                </div>

                {section.type === 'paras' && (
                  <div className="space-y-3">
                    {(section.content as string[]).map((p, i) => (
                      <p key={i} className="text-gray-300 leading-relaxed text-sm">
                        {p}
                      </p>
                    ))}
                  </div>
                )}

                {section.type === 'list' && (
                  <ul className="space-y-2.5">
                    {(section.content as string[]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="text-afro-primary mt-0.5 flex-shrink-0 font-bold select-none">
                          —
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.type === 'highlight' && (
                  <div className="bg-afro-primary/5 border border-afro-primary/20 border-l-2 border-l-afro-primary rounded-r-lg px-5 py-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {section.content as string}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              {/* Comp block */}
              <div className="bg-gray-950 border border-gray-800 border-l-2 border-l-afro-primary rounded-r-xl px-5 py-5">
                <p className="text-2xl font-display font-bold text-white mb-0.5">
                  {job.comp.amount}
                </p>
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">
                  {job.comp.type}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">{job.comp.note}</p>
              </div>

              {/* Role details */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl px-5 py-5">
                <p className="text-xs tracking-widest text-afro-primary uppercase font-bold mb-4">
                  Role details
                </p>
                <div className="space-y-3.5">
                  {job.meta.map((m) => (
                    <div key={m.label}>
                      <p className="text-xs text-gray-600 uppercase tracking-widest">{m.label}</p>
                      <p className="text-sm text-white font-medium mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  track('Careers Apply Modal Opened', { jobId: job.id, jobTitle: job.title });
                  onApply(job);
                }}
                className="w-full py-4 bg-afro-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors text-sm tracking-wide"
              >
                Apply for this role →
              </button>
              <a
                href={`mailto:careers@100afro.com?subject=${encodeURIComponent(job.apply.subject)}`}
                className="flex items-center justify-center gap-2 py-3 border border-gray-800 text-gray-500 hover:text-afro-primary hover:border-afro-primary/40 rounded-xl transition-colors text-xs tracking-widest uppercase"
              >
                <Mail size={12} />
                careers@100afro.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function CareersContent() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  const filteredJobs = !ACCEPTING_APPLICATIONS
    ? []
    : activeFilter === 'All'
      ? JOBS
      : JOBS.filter((j) => j.dept === activeFilter);

  return (
    <>
      <div className="bg-gray-900 min-h-screen">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-gray-800">
          {/* Watermark */}
          <div
            aria-hidden="true"
            className="absolute right-[-2%] top-1/2 -translate-y-1/2 font-display font-bold text-afro-primary/[0.035] select-none pointer-events-none whitespace-nowrap leading-none"
            style={{ fontSize: 'clamp(72px, 16vw, 200px)', letterSpacing: '-0.04em' }}
          >
            CAREERS
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-afro-primary" />
              <p className="text-xs tracking-widest text-afro-primary uppercase font-bold">
                {ACCEPTING_APPLICATIONS ? 'Open positions · 2026' : 'Applications closed · 2026'}
              </p>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-display font-bold text-white leading-[1.06] max-w-3xl mb-6">
              Help us build the{' '}
              <span className="text-afro-primary italic">voice</span> of African
              culture online.
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mb-10">
              100AFRO is the digital home for African entertainment — music, culture,
              lifestyle, and news for the continent and its diaspora worldwide.
              We&apos;re building a remote team of passionate people who live and breathe
              this culture.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 sm:gap-14">
              {[
                { value: ACCEPTING_APPLICATIONS ? String(JOBS.length) : '0', label: 'Open roles' },
                { value: '100%', label: 'Remote' },
                { value: '5', label: 'Cities covered' },
                { value: ACCEPTING_APPLICATIONS ? 'Now' : 'Closed', label: 'Start date' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span className="text-3xl sm:text-4xl font-display font-bold text-white">
                    {s.value}
                  </span>
                  <span className="text-xs text-gray-600 uppercase tracking-widest">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FILTER BAR ───────────────────────────────────────────────────── */}
        {ACCEPTING_APPLICATIONS && (
        <div className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-3.5 scrollbar-hide">
              <span className="text-xs text-gray-700 uppercase tracking-widest flex-shrink-0 mr-1">
                Filter:
              </span>
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  onClick={() => { setActiveFilter(dept); track('Careers Filter Changed', { department: dept }); }}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeFilter === dept
                      ? 'bg-afro-primary text-black shadow-sm'
                      : 'border border-gray-800 text-gray-500 hover:border-afro-primary/40 hover:text-afro-primary'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* ── JOB LISTINGS ─────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {ACCEPTING_APPLICATIONS ? (
            <>
              <div className="flex items-center justify-between py-5 border-b border-gray-800/50">
                <span className="text-xs text-gray-600 uppercase tracking-widest">
                  {filteredJobs.length} open position
                  {filteredJobs.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div>
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} onApply={setApplyJob} />
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-gray-500 text-sm mb-3">
                    No open positions in this department right now.
                  </p>
                  <button
                    onClick={() => setActiveFilter('All')}
                    className="text-afro-primary text-sm hover:underline"
                  >
                    View all roles →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 sm:py-28 text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-afro-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-afro-primary" size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
                We&apos;re not accepting applications right now
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
                All of our current roles are now closed — we&apos;ve found the people we
                were looking for. Thank you to everyone who applied. We&apos;re not
                reviewing new applications at this time, but we&apos;re growing fast and
                expect to open new positions in the future.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 font-bold rounded-lg hover:border-afro-primary/40 hover:text-afro-primary transition-colors text-sm"
              >
                Stay in touch
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* ── WHY JOIN ─────────────────────────────────────────────────────── */}
        <section className="bg-gray-950 border-y border-gray-800 py-16 sm:py-20 mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-afro-primary" />
                <p className="text-xs tracking-widest text-afro-primary uppercase font-bold">
                  Why 100AFRO
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
                Why join 100AFRO?
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                We&apos;re not a corporate media company. We&apos;re builders, fans, and
                storytellers who believe African culture deserves a world-class home
                online. If you join us now, you&apos;re not just taking a job — you&apos;re
                shaping what this becomes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VALUES.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="group bg-gray-900 border border-gray-800 hover:border-afro-primary/30 rounded-xl p-6 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-lg bg-afro-primary/10 group-hover:bg-afro-primary/20 flex items-center justify-center mb-4 transition-colors">
                      <Icon className="text-afro-primary" size={20} />
                    </div>
                    <h3 className="font-display font-bold text-white text-lg mb-2">
                      {v.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{v.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── APPLICATION PROCESS ──────────────────────────────────────────── */}
        {ACCEPTING_APPLICATIONS && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-afro-primary" />
              <p className="text-xs tracking-widest text-afro-primary uppercase font-bold">
                How it works
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Application process
            </h2>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-8 left-[8%] right-[8%] h-px bg-gray-800" />

            {[
              {
                step: '01',
                title: 'Apply',
                body: 'Submit your application through the form on this page or via email with your portfolio and work samples.',
              },
              {
                step: '02',
                title: 'Review',
                body: 'We personally read every application. No automated rejections. If your work is strong, you hear from us.',
              },
              {
                step: '03',
                title: 'Interview',
                body: 'A video call with the founder. Relaxed, direct, and focused on your work and your vision for the role.',
              },
              {
                step: '04',
                title: 'Decision',
                body: 'We move fast. Expect a clear decision within 5–7 days of your interview — yes or no, with feedback.',
              },
            ].map((item) => (
              <div key={item.step}>
                <div className="relative z-10 w-16 h-16 rounded-full bg-gray-950 border border-gray-800 flex items-center justify-center mb-5">
                  <span className="font-display font-bold text-afro-primary text-xl">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* ── FOOTER CTA ───────────────────────────────────────────────────── */}
        <section className="border-t border-gray-800 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                {ACCEPTING_APPLICATIONS ? "Don't see your role?" : 'Applications are closed'}
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8 text-sm sm:text-base">
                {ACCEPTING_APPLICATIONS ? (
                  <>
                    We&apos;re always looking for talented people who believe in what we&apos;re
                    building. If you think you belong at 100AFRO but don&apos;t see your
                    role listed, tell us who you are and what you&apos;d do here.
                  </>
                ) : (
                  <>
                    All of our roles are currently filled and we&apos;re no longer accepting
                    applications. Thank you for your interest in 100AFRO — follow along and
                    check back later, as we expect to open new positions as we grow.
                  </>
                )}
              </p>
              <div className="flex flex-wrap gap-4">
                {ACCEPTING_APPLICATIONS && (
                  <a
                    href="mailto:careers@100afro.com?subject=General Application"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-afro-primary text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                  >
                    Send general application
                    <Mail size={16} />
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 font-bold rounded-lg hover:border-afro-primary/40 hover:text-afro-primary transition-colors text-sm"
                >
                  Contact us
                  <ArrowRight size={16} />
                </Link>
              </div>
              <p className="mt-8 text-xs text-gray-700 tracking-wide">
                Lagos · London · New York · Toronto · Johannesburg ·{' '}
                <a
                  href="mailto:careers@100afro.com"
                  className="hover:text-afro-primary transition-colors"
                >
                  careers@100afro.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── APPLY MODAL ──────────────────────────────────────────────────────── */}
      {applyJob && (
        <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />
      )}
    </>
  );
}
