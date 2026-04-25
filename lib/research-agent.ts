import Parser from 'rss-parser';
import { TwitterApi } from 'twitter-api-v2';
import { prisma } from './prisma';
import { BlogCategory } from '@prisma/client';

const parser = new Parser();

export interface DiscoveredTopic {
  title: string;
  description: string;
  source: 'twitter' | 'rss' | 'google_news';
  sourceUrl?: string;
  category?: BlogCategory;
  relevanceScore: number;
}

// African-related keywords for filtering
const AFRICAN_KEYWORDS = [
  'africa', 'african', 'afro', 'nigeria', 'nigerian', 'ghana', 'ghanaian',
  'south africa', 'kenya', 'kenyan', 'tanzania', 'uganda', 'ethiopia',
  'afrobeats', 'afropop', 'amapiano', 'afrobeat', 'afrofusion',
  'nollywood', 'ghollywood', 'sollywood', 'african music', 'african artist',
  'african culture', 'african entertainment', 'african lifestyle',
  'west africa', 'east africa', 'southern africa', 'african diaspora'
];

// Blog categories for topic matching
const BLOG_CATEGORIES: BlogCategory[] = ['Music', 'Culture', 'Lifestyle', 'News', 'Industry'];

export class ResearchAgent {
  private twitterClient: TwitterApi | null = null;

  constructor() {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    if (bearerToken) {
      this.twitterClient = new TwitterApi(bearerToken);
    }
  }

  async discoverTopics(): Promise<DiscoveredTopic[]> {
    const topics: DiscoveredTopic[] = [];

    // Run all research sources in parallel
    const [twitterTopics, rssTopics, googleNewsTopics] = await Promise.allSettled([
      this.searchTwitter(),
      this.searchRSSFeeds(),
      this.searchGoogleNews(),
    ]);

    if (twitterTopics.status === 'fulfilled') {
      topics.push(...twitterTopics.value);
    } else {
      console.error('Twitter search failed:', twitterTopics.reason);
    }

    if (rssTopics.status === 'fulfilled') {
      topics.push(...rssTopics.value);
    } else {
      console.error('RSS search failed:', rssTopics.reason);
    }

    if (googleNewsTopics.status === 'fulfilled') {
      topics.push(...googleNewsTopics.value);
    } else {
      console.error('Google News search failed:', googleNewsTopics.reason);
    }

    // Deduplicate and filter
    return this.deduplicateTopics(topics);
  }

  private async searchTwitter(): Promise<DiscoveredTopic[]> {
    if (!this.twitterClient) {
      console.warn('Twitter API not configured');
      return [];
    }

    const topics: DiscoveredTopic[] = [];
    const searchQueries = [
      'african music OR afrobeats OR afropop',
      'nigerian artist OR ghanaian artist',
      'african entertainment',
      'african culture',
      'nollywood OR ghollywood',
    ];

    try {
      for (const query of searchQueries) {
        try {
          const tweets = await this.twitterClient.v2.search(query, {
            max_results: 20,
            'tweet.fields': ['created_at', 'public_metrics', 'text'],
            expansions: ['author_id'],
          });

          for (const tweet of tweets.data.data || []) {
            const relevanceScore = this.calculateRelevanceScore(tweet.text, 'twitter');
            if (relevanceScore > 0.3) {
              const category = this.categorizeTopic(tweet.text);
              topics.push({
                title: this.extractTitle(tweet.text),
                description: tweet.text.substring(0, 500),
                source: 'twitter',
                sourceUrl: `https://twitter.com/i/web/status/${tweet.id}`,
                category,
                relevanceScore,
              });
            }
          }

          // Rate limiting: wait between queries
          await this.delay(1000);
        } catch (error) {
          console.error(`Twitter search failed for query "${query}":`, error);
        }
      }
    } catch (error) {
      console.error('Twitter search error:', error);
    }

    return topics;
  }

  private async searchRSSFeeds(): Promise<DiscoveredTopic[]> {
    const topics: DiscoveredTopic[] = [];
    const rssFeeds = this.getRSSFeeds();

    for (const feedUrl of rssFeeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
        
        for (const item of feed.items.slice(0, 10)) {
          const content = `${item.title || ''} ${item.contentSnippet || item.content || ''}`.toLowerCase();
          const relevanceScore = this.calculateRelevanceScore(content, 'rss');
          
          if (relevanceScore > 0.3) {
            const category = this.categorizeTopic(content);
            topics.push({
              title: item.title || 'Untitled',
              description: item.contentSnippet || item.content || item.title || '',
              source: 'rss',
              sourceUrl: item.link,
              category,
              relevanceScore,
            });
          }
        }

        // Rate limiting
        await this.delay(500);
      } catch (error) {
        console.error(`RSS feed error for ${feedUrl}:`, error);
      }
    }

    return topics;
  }

  private async searchGoogleNews(): Promise<DiscoveredTopic[]> {
    const topics: DiscoveredTopic[] = [];
    const searchQueries = [
      'african music news',
      'afrobeats latest',
      'nigerian entertainment',
      'african culture news',
      'african artist',
    ];

    // Google News RSS feeds
    const googleNewsRssBase = 'https://news.google.com/rss/search?q=';
    const hl = 'en';
    const gl = 'us';
    const ceid = 'US:en';

    for (const query of searchQueries) {
      try {
        const rssUrl = `${googleNewsRssBase}${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
        const feed = await parser.parseURL(rssUrl);

        for (const item of feed.items.slice(0, 15)) {
          const content = `${item.title || ''} ${item.contentSnippet || item.content || ''}`.toLowerCase();
          const relevanceScore = this.calculateRelevanceScore(content, 'google_news');
          
          if (relevanceScore > 0.4) { // Higher threshold for Google News
            const category = this.categorizeTopic(content);
            topics.push({
              title: item.title || 'Untitled',
              description: item.contentSnippet || item.content || item.title || '',
              source: 'google_news',
              sourceUrl: item.link,
              category,
              relevanceScore,
            });
          }
        }

        await this.delay(1000);
      } catch (error) {
        console.error(`Google News search failed for "${query}":`, error);
      }
    }

    return topics;
  }

  private getRSSFeeds(): string[] {
    const envFeeds = process.env.AFRICAN_NEWS_RSS_FEEDS;
    if (envFeeds) {
      return envFeeds.split(',').map((url) => url.trim()).filter(Boolean);
    }

    // Default RSS feeds (can be customized)
    return [
      'https://www.bellanaija.com/feed/',
      'https://www.pulse.ng/feed',
      'https://www.vanguardngr.com/feed/',
      'https://www.premiumtimesng.com/feed/',
    ];
  }

  private calculateRelevanceScore(content: string, source: string): number {
    const lowerContent = content.toLowerCase();
    let score = 0;

    // Count African keyword matches
    const keywordMatches = AFRICAN_KEYWORDS.filter((keyword) =>
      lowerContent.includes(keyword.toLowerCase())
    ).length;

    score += keywordMatches * 0.1;

    // Boost for multiple keywords
    if (keywordMatches > 3) {
      score += 0.2;
    }

    // Source-specific scoring
    if (source === 'twitter') {
      // Twitter content is usually shorter, adjust scoring
      score *= 1.2;
    }

    // Penalize if content is too short
    if (content.length < 50) {
      score *= 0.5;
    }

    // Cap at 1.0
    return Math.min(score, 1.0);
  }

  private categorizeTopic(content: string): BlogCategory | undefined {
    const lowerContent = content.toLowerCase();

    // Music-related keywords
    if (
      lowerContent.includes('music') ||
      lowerContent.includes('song') ||
      lowerContent.includes('album') ||
      lowerContent.includes('artist') ||
      lowerContent.includes('afrobeats') ||
      lowerContent.includes('afropop') ||
      lowerContent.includes('amapiano')
    ) {
      return 'Music';
    }

    // Culture-related keywords
    if (
      lowerContent.includes('culture') ||
      lowerContent.includes('tradition') ||
      lowerContent.includes('heritage') ||
      lowerContent.includes('festival') ||
      lowerContent.includes('celebration')
    ) {
      return 'Culture';
    }

    // Lifestyle-related keywords
    if (
      lowerContent.includes('lifestyle') ||
      lowerContent.includes('fashion') ||
      lowerContent.includes('food') ||
      lowerContent.includes('travel') ||
      lowerContent.includes('beauty')
    ) {
      return 'Lifestyle';
    }

    // Industry-related keywords
    if (
      lowerContent.includes('industry') ||
      lowerContent.includes('business') ||
      lowerContent.includes('market') ||
      lowerContent.includes('award') ||
      lowerContent.includes('record label')
    ) {
      return 'Industry';
    }

    // News-related (default for most content)
    if (
      lowerContent.includes('news') ||
      lowerContent.includes('announcement') ||
      lowerContent.includes('update') ||
      lowerContent.includes('breaking')
    ) {
      return 'News';
    }

    // Default to News if unclear
    return 'News';
  }

  private extractTitle(text: string): string {
    // Remove URLs, mentions, hashtags for cleaner title
    let title = text
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/@\w+/g, '')
      .replace(/#\w+/g, '')
      .trim();

    // Take first 100 characters
    if (title.length > 100) {
      title = title.substring(0, 97) + '...';
    }

    return title || 'Untitled Topic';
  }

  private async deduplicateTopics(topics: DiscoveredTopic[]): Promise<DiscoveredTopic[]> {
    const seen = new Set<string>();
    const unique: DiscoveredTopic[] = [];

    // Check against existing topics in database
    if (prisma) {
      const existingTopics = await prisma.researchTopic.findMany({
        select: { title: true },
        take: 1000,
      });
      const existingTitles = new Set(existingTopics.map((t) => t.title.toLowerCase()));

      for (const topic of topics) {
        const key = topic.title.toLowerCase();
        if (!seen.has(key) && !existingTitles.has(key)) {
          seen.add(key);
          unique.push(topic);
        }
      }
    } else {
      // Fallback: simple deduplication
      for (const topic of topics) {
        const key = topic.title.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(topic);
        }
      }
    }

    // Sort by relevance score
    return unique.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
