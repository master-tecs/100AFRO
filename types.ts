export type BlogCategory = 'Music' | 'Culture' | 'Lifestyle' | 'News' | 'Industry';
export type VideoCategory = 'Music Video' | 'Dance' | 'Interview' | 'Vlog' | 'Performance';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  category: BlogCategory;
  featured?: boolean;
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl?: string; // Optional: Provide to override YouTube default
  duration: string;
  views: string;
  date: string;
  category: VideoCategory;
  featured?: boolean;
  tags: string[];
}

export interface ChartEntry {
  rank: number;
  title: string;
  artist: string;
  coverUrl: string;
  trend: 'up' | 'down' | 'same' | 'new';
  lastWeek: number | null;
  peak: number;
  weeksOnChart: number;
  previewUrl?: string; // URL to mp3 snippet
  externalLinks?: {
    spotify?: string;
    appleMusic?: string;
  };
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genre: string;
  socialLink?: string;
}

export interface TrendingTopic {
  id: string;
  name: string;
  count: string; // e.g., "120K Mentions"
  imageUrl: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}