import { BlogPost, Video, ChartEntry, Comment, Artist, TrendingTopic, Poll } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'rise-of-afrobeats-global',
    title: 'The Unstoppable Rise of Afrobeats Globally',
    excerpt: 'How Nigerian and Ghanaian artists are taking over the world stage, from Grammy wins to sold-out stadium tours. We analyze the numbers behind the movement.',
    content: 'Afrobeats has transcended borders...',
    author: 'Chioma N.',
    date: 'Oct 12, 2023',
    imageUrl: 'https://picsum.photos/seed/afrobeats/800/600',
    category: 'Music',
    featured: true
  },
  {
    id: '2',
    slug: 'top-10-dance-challenges-2023',
    title: 'Top 10 Viral Dance Challenges of 2023',
    excerpt: 'From TikTok to the streets of Lagos, these represent the moves that defined the year. Did your favorite make the list?',
    content: 'Dance is the heartbeat of African entertainment...',
    author: 'David K.',
    date: 'Nov 05, 2023',
    imageUrl: 'https://picsum.photos/seed/dance/800/600',
    category: 'Culture'
  },
  {
    id: '3',
    slug: 'amapiano-sound-of-freedom',
    title: 'Amapiano: The Sound of Freedom',
    excerpt: 'Exploring the roots of the South African house music genre that has captivated the continent featuring exclusive DJ interviews.',
    content: 'Deep basslines and piano chords...',
    author: 'Sipho M.',
    date: 'Nov 20, 2023',
    imageUrl: 'https://picsum.photos/seed/amapiano/800/600',
    category: 'Music',
    featured: true
  },
  {
    id: '4',
    slug: 'fashion-week-lagos-recap',
    title: 'Lagos Fashion Week: A Recap',
    excerpt: 'The trends, the designers, and the looks that stole the show this season. A visual diary of African excellence.',
    content: 'Fashion in Africa is bold...',
    author: 'Zainab A.',
    date: 'Dec 01, 2023',
    imageUrl: 'https://picsum.photos/seed/fashion/800/600',
    category: 'Lifestyle'
  },
  {
    id: '5',
    slug: 'universal-music-africa-deal',
    title: 'Universal Music Group Expands African Operations',
    excerpt: 'A deep dive into the multimillion-dollar investment reshaping the continent\'s recording infrastructure and what it means for indie artists.',
    content: 'The major labels are here to stay...',
    author: 'Emeka O.',
    date: 'Dec 15, 2023',
    imageUrl: 'https://picsum.photos/seed/business1/800/600',
    category: 'Industry'
  },
  {
    id: '6',
    slug: 'spotify-streaming-report-2023',
    title: 'Spotify Africa Report: Streaming Numbers Double',
    excerpt: 'New data shows a 100% year-over-year growth in paid subscriptions across Sub-Saharan Africa. Here is the breakdown by region.',
    content: 'Data suggests a digital revolution...',
    author: 'Sarah J.',
    date: 'Dec 20, 2023',
    imageUrl: 'https://picsum.photos/seed/stats/800/600',
    category: 'Industry'
  },
  {
    id: '7',
    slug: 'afro-nation-portugal',
    title: 'Afro Nation Portugal: What to Expect',
    excerpt: 'The lineup, the vibes, and the travel tips you need for the world\'s biggest Afrobeats festival.',
    content: 'Summer is coming...',
    author: 'Sarah J.',
    date: 'Jan 05, 2024',
    imageUrl: 'https://picsum.photos/seed/festival/800/600',
    category: 'Music'
  },
  {
    id: '8',
    slug: 'burna-boy-interview',
    title: 'Burna Boy: Sitting on Top of the World',
    excerpt: 'An opinion piece on the African Giant\'s trajectory and his latest album impact.',
    content: 'He told us...',
    author: 'Michael B.',
    date: 'Jan 10, 2024',
    imageUrl: 'https://picsum.photos/seed/burna/800/600',
    category: 'Music'
  },
  {
    id: '9',
    slug: 'tech-meet-entertainment',
    title: 'How Fintech is Powering the Creative Economy',
    excerpt: 'Startups like Flutterwave and Paystack are becoming the biggest sponsors of entertainment events in West Africa.',
    content: 'Money moves...',
    author: 'Kweku A.',
    date: 'Jan 12, 2024',
    imageUrl: 'https://picsum.photos/seed/fintech/800/600',
    category: 'Industry'
  }
];

export const VIDEOS: Video[] = [
  {
    id: '1',
    title: '100AFRO Vibes: Official Channel Highlight',
    youtubeId: 'Y0zwOpTGq-E',
    thumbnailUrl: 'https://img.youtube.com/vi/Y0zwOpTGq-E/maxresdefault.jpg',
    duration: '03:45',
    views: '15K',
    date: 'Featured',
    category: 'Dance',
    featured: true,
    tags: ['Highlight', 'Official', 'Compilation']
  },
  {
    id: '2',
    title: 'Top 5 Afrobeats Songs This Week',
    youtubeId: 'kJQP7kiw5Fk',
    thumbnailUrl: 'https://picsum.photos/seed/vid2/640/360',
    duration: '08:15',
    views: '540K',
    date: '1 week ago',
    category: 'Music Video',
    tags: ['Afrobeats', 'Charts', 'Nigeria', 'Ghana']
  },
  {
    id: '3',
    title: 'Exclusive Interview with Burna Boy Lookalike',
    youtubeId: '9bZkp7q19f0',
    thumbnailUrl: 'https://picsum.photos/seed/vid3/640/360',
    duration: '15:30',
    views: '2.1M',
    date: '2 weeks ago',
    category: 'Interview',
    featured: true,
    tags: ['Comedy', 'Burna Boy', 'Viral']
  },
  {
    id: '4',
    title: 'How to Cook Jollof Rice (Ghana Style)',
    youtubeId: 'M7lc1UVf-VE',
    thumbnailUrl: 'https://picsum.photos/seed/vid4/640/360',
    duration: '12:00',
    views: '800K',
    date: '3 weeks ago',
    category: 'Vlog',
    tags: ['Food', 'Ghana', 'Jollof', 'Tutorial']
  },
  {
    id: '5',
    title: 'Reaction: Wizkid New Album',
    youtubeId: 'frhPjoW2qSg',
    thumbnailUrl: 'https://picsum.photos/seed/vid5/640/360',
    duration: '09:45',
    views: '300K',
    date: '1 month ago',
    category: 'Vlog',
    tags: ['Review', 'Wizkid', 'Music', 'Reaction']
  },
  {
    id: '6',
    title: 'Amapiano Mix 2024',
    youtubeId: 'lTRiuFIWV54',
    thumbnailUrl: 'https://picsum.photos/seed/vid6/640/360',
    duration: '45:00',
    views: '5M',
    date: '1 month ago',
    category: 'Music Video',
    tags: ['Amapiano', 'South Africa', 'Mix', 'DJ']
  },
   {
    id: '7',
    title: 'Street Food Tour in Nairobi',
    youtubeId: 'ScMzIvxBSi4',
    thumbnailUrl: 'https://picsum.photos/seed/vid7/640/360',
    duration: '14:20',
    views: '600K',
    date: '1 month ago',
    category: 'Vlog',
    tags: ['Food', 'Travel', 'Kenya', 'Nairobi']
  },
  {
    id: '8',
    title: 'Afro Future Festival Highlights',
    youtubeId: '5qap5aO4i9A',
    thumbnailUrl: 'https://picsum.photos/seed/vid8/640/360',
    duration: '04:50',
    views: '120K',
    date: '2 months ago',
    category: 'Performance',
    featured: true,
    tags: ['Festival', 'Live', 'Concert']
  },
  {
    id: '9',
    title: 'Traditional Wedding Entrance Dance',
    youtubeId: 'OPf0YbXqDm0',
    thumbnailUrl: 'https://picsum.photos/seed/vid9/640/360',
    duration: '03:10',
    views: '4.5M',
    date: '2 months ago',
    category: 'Dance',
    tags: ['Wedding', 'Culture', 'Viral', 'Dance']
  },
  {
    id: '10',
    title: 'Comedy Skit: African Mothers',
    youtubeId: 'C0DPdy98e4c',
    thumbnailUrl: 'https://picsum.photos/seed/vid10/640/360',
    duration: '02:45',
    views: '8M',
    date: '3 months ago',
    category: 'Vlog',
    tags: ['Comedy', 'Skit', 'Relatable']
  },
  {
    id: '11',
    title: 'Behind The Scenes: Music Video Shoot',
    youtubeId: 'jNQXAC9IVRw',
    thumbnailUrl: 'https://picsum.photos/seed/vid11/640/360',
    duration: '11:10',
    views: '200K',
    date: '3 months ago',
    category: 'Interview',
    tags: ['BTS', 'Music', 'Production']
  },
  {
    id: '12',
    title: 'Learning Swahili in 24 Hours',
    youtubeId: 'JGwWNGJdvx8',
    thumbnailUrl: 'https://picsum.photos/seed/vid12/640/360',
    duration: '18:00',
    views: '150K',
    date: '4 months ago',
    category: 'Vlog',
    tags: ['Language', 'Education', 'Challenge']
  },
  {
    id: '13',
    title: 'Davido Concert Live London',
    youtubeId: 'JGwWNGJdvx8',
    thumbnailUrl: 'https://picsum.photos/seed/vid13/640/360',
    duration: '01:20:00',
    views: '10M',
    date: '5 months ago',
    category: 'Performance',
    tags: ['Davido', 'Live', 'Concert', 'London']
  },
    {
    id: '14',
    title: 'Rema - Calm Down (Live)',
    youtubeId: 'JGwWNGJdvx8',
    thumbnailUrl: 'https://picsum.photos/seed/vid14/640/360',
    duration: '04:00',
    views: '50M',
    date: '6 months ago',
    category: 'Performance',
    tags: ['Rema', 'Live', 'Global']
  }
];

// Sample audio link for demo purposes
const DEMO_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const CHART_DATA: { songs: ChartEntry[], albums: ChartEntry[] } = {
  songs: [
    { 
      rank: 1, 
      title: 'Water', 
      artist: 'Tyla', 
      coverUrl: 'https://picsum.photos/seed/tyla/300', 
      trend: 'same', 
      lastWeek: 1, 
      peak: 1, 
      weeksOnChart: 12,
      previewUrl: DEMO_AUDIO,
      externalLinks: { spotify: '#', appleMusic: '#' }
    },
    { 
      rank: 2, 
      title: 'City Boys', 
      artist: 'Burna Boy', 
      coverUrl: 'https://picsum.photos/seed/burna2/300', 
      trend: 'up', 
      lastWeek: 4, 
      peak: 2, 
      weeksOnChart: 8,
      previewUrl: DEMO_AUDIO,
      externalLinks: { spotify: '#', appleMusic: '#' }
    },
    { 
      rank: 3, 
      title: 'Unavailable', 
      artist: 'Davido ft. Musa Keys', 
      coverUrl: 'https://picsum.photos/seed/davido2/300', 
      trend: 'down', 
      lastWeek: 2, 
      peak: 1, 
      weeksOnChart: 24,
      previewUrl: DEMO_AUDIO,
      externalLinks: { spotify: '#' }
    },
    { 
      rank: 4, 
      title: 'Me & U', 
      artist: 'Tems', 
      coverUrl: 'https://picsum.photos/seed/tems/300', 
      trend: 'same', 
      lastWeek: 4, 
      peak: 4, 
      weeksOnChart: 6,
      previewUrl: DEMO_AUDIO,
      externalLinks: { spotify: '#', appleMusic: '#' }
    },
    { 
      rank: 5, 
      title: 'Lonely At The Top', 
      artist: 'Asake', 
      coverUrl: 'https://picsum.photos/seed/asake/300', 
      trend: 'down', 
      lastWeek: 3, 
      peak: 1, 
      weeksOnChart: 16,
      previewUrl: DEMO_AUDIO,
      externalLinks: { appleMusic: '#' }
    },
    { rank: 6, title: 'Calm Down', artist: 'Rema', coverUrl: 'https://picsum.photos/seed/rema/300', trend: 'same', lastWeek: 6, peak: 1, weeksOnChart: 52, previewUrl: DEMO_AUDIO, externalLinks: { spotify: '#', appleMusic: '#' } },
    { rank: 7, title: 'Terminator', artist: 'King Promise', coverUrl: 'https://picsum.photos/seed/kingpromise/300', trend: 'up', lastWeek: 9, peak: 7, weeksOnChart: 5, previewUrl: DEMO_AUDIO, externalLinks: { spotify: '#', appleMusic: '#' } },
    { rank: 8, title: 'Cast', artist: 'Shallipopi', coverUrl: 'https://picsum.photos/seed/shalli/300', trend: 'new', lastWeek: null, peak: 8, weeksOnChart: 1, previewUrl: DEMO_AUDIO, externalLinks: { spotify: '#', appleMusic: '#' } },
    { rank: 9, title: 'Amapiano', artist: 'Asake ft. Olamide', coverUrl: 'https://picsum.photos/seed/asake2/300', trend: 'down', lastWeek: 7, peak: 2, weeksOnChart: 20, previewUrl: DEMO_AUDIO, externalLinks: { spotify: '#', appleMusic: '#' } },
    { rank: 10, title: 'Sittin\' on Top of the World', artist: 'Burna Boy', coverUrl: 'https://picsum.photos/seed/burna3/300', trend: 'down', lastWeek: 8, peak: 3, weeksOnChart: 14, previewUrl: DEMO_AUDIO, externalLinks: { spotify: '#', appleMusic: '#' } },
  ],
  albums: [
    { rank: 1, title: 'I Told Them...', artist: 'Burna Boy', coverUrl: 'https://picsum.photos/seed/itoldthem/300', trend: 'same', lastWeek: 1, peak: 1, weeksOnChart: 15, externalLinks: { spotify: '#', appleMusic: '#' } },
    { rank: 2, title: 'Timeless', artist: 'Davido', coverUrl: 'https://picsum.photos/seed/timeless/300', trend: 'same', lastWeek: 2, peak: 1, weeksOnChart: 30, externalLinks: { spotify: '#', appleMusic: '#' } },
    { rank: 3, title: 'Work of Art', artist: 'Asake', coverUrl: 'https://picsum.photos/seed/workofart/300', trend: 'up', lastWeek: 4, peak: 2, weeksOnChart: 22, externalLinks: { spotify: '#', appleMusic: '#' } },
    { rank: 4, title: 'Rave & Roses Ultra', artist: 'Rema', coverUrl: 'https://picsum.photos/seed/rave/300', trend: 'down', lastWeek: 3, peak: 1, weeksOnChart: 60, externalLinks: { spotify: '#', appleMusic: '#' } },
    { rank: 5, title: 'Thy Kingdom Come', artist: 'Seyi Vibez', coverUrl: 'https://picsum.photos/seed/seyi/300', trend: 'new', lastWeek: null, peak: 5, weeksOnChart: 1, externalLinks: { spotify: '#', appleMusic: '#' } },
  ]
};

export const COMMENTS: Comment[] = [
  { id: 'c1', postId: '1', author: 'Kwame', content: 'Great article! The stats on Burna Boy are incredible.', date: '2 hours ago', likes: 12 },
  { id: 'c2', postId: '1', author: 'Nia', content: 'Afrobeats to the world! 🌍', date: '5 hours ago', likes: 45 },
  { id: 'c3', postId: '1', author: 'John Doe', content: 'I wish you covered more East African artists though.', date: '1 day ago', likes: 3 },
  { id: 'c4', postId: '3', author: 'DJ Maphorisa fan', content: 'Amapiano is a lifestyle, not just a genre.', date: '30 mins ago', likes: 8 },
];

export const FEATURED_ARTISTS: Artist[] = [
  { id: '1', name: 'Burna Boy', imageUrl: 'https://ui-avatars.com/api/?name=Burna+Boy&background=166534&color=fff&size=200', genre: 'Afro-Fusion', socialLink: '#' },
  { id: '2', name: 'Tyla', imageUrl: 'https://ui-avatars.com/api/?name=Tyla&background=F59E0B&color=000&size=200', genre: 'Amapiano/Pop', socialLink: '#' },
  { id: '3', name: 'Davido', imageUrl: 'https://ui-avatars.com/api/?name=Davido&background=111827&color=fff&size=200', genre: 'Afrobeats', socialLink: '#' },
  { id: '4', name: 'Ayra Starr', imageUrl: 'https://ui-avatars.com/api/?name=Ayra+Starr&background=EF4444&color=fff&size=200', genre: 'Afropop', socialLink: '#' },
  { id: '5', name: 'Rema', imageUrl: 'https://ui-avatars.com/api/?name=Rema&background=8B5CF6&color=fff&size=200', genre: 'Afrorave', socialLink: '#' },
  { id: '6', name: 'Wizkid', imageUrl: 'https://ui-avatars.com/api/?name=Wizkid&background=10B981&color=fff&size=200', genre: 'Afrobeats', socialLink: '#' },
];

export const TRENDING_TOPICS: TrendingTopic[] = [
  { id: '1', name: 'Detty December', count: '125K Posts', imageUrl: 'https://picsum.photos/seed/detty/400/200' },
  { id: '2', name: 'Grammy 2024', count: '89K Posts', imageUrl: 'https://picsum.photos/seed/grammy/400/200' },
  { id: '3', name: 'Davido vs Wizkid', count: '500K Posts', imageUrl: 'https://picsum.photos/seed/rivalry/400/200' },
  { id: '4', name: 'AfroNation', count: '45K Posts', imageUrl: 'https://picsum.photos/seed/afronation/400/200' },
  { id: '5', name: 'BBNaija', count: '2M Posts', imageUrl: 'https://picsum.photos/seed/bbnaija/400/200' },
];

export const CURRENT_POLL: Poll = {
  id: 'poll-1',
  question: 'Who should win Artist of the Year?',
  options: [
    { id: 'opt1', text: 'Burna Boy', votes: 1240 },
    { id: 'opt2', text: 'Davido', votes: 1150 },
    { id: 'opt3', text: 'Rema', votes: 890 },
    { id: 'opt4', text: 'Asake', votes: 1050 },
  ]
};

export const ON_THIS_DAY = {
  year: '2012',
  event: 'Oliver Twist by D\'banj enters the UK Top 10 Charts, marking a pivotal moment for Afrobeats global crossover.'
};