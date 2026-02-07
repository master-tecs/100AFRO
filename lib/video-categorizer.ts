/**
 * Intelligent Video Categorization
 * Auto-detects video category based on title and description keywords
 */

import { VideoCategory } from "@prisma/client";

/**
 * Count how many keywords from the array appear in the text
 */
function countMatches(text: string, keywords: string[]): number {
  let count = 0;
  for (const keyword of keywords) {
    // Use word boundary regex to match whole words
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      count += matches.length;
    }
  }
  return count;
}

/**
 * Detect video category from title and description using keyword matching
 */
export function detectVideoCategory(
  title: string,
  description: string
): VideoCategory {
  const text = `${title} ${description}`.toLowerCase();

  // Define keywords for each category
  const categoryKeywords: Record<VideoCategory, string[]> = {
    Music_Video: [
      "music video",
      "mv",
      "official video",
      "official music video",
      "music video official",
    ],
    Music: [
      "music",
      "song",
      "track",
      "album",
      "audio",
      "single",
      "release",
      "new music",
      "official",
      "sound",
      "beat",
      "melody",
    ],
    Dance: [
      "dance",
      "choreography",
      "dancing",
      "moves",
      "dance challenge",
      "dance video",
      "choreo",
      "dance routine",
      "dance tutorial",
    ],
    Interview: [
      "interview",
      "talks",
      "exclusive",
      "sitting down with",
      "conversation",
      "q&a",
      "qa",
      "question and answer",
      "chat",
      "discussion",
      "speaks",
    ],
    Vlog: [
      "vlog",
      "day in my life",
      "daily",
      "lifestyle",
      "travel",
      "vlogging",
      "day in the life",
    ],
    Performance: [
      "performance",
      "live",
      "concert",
      "stage",
      "show",
      "performing",
      "live performance",
      "live show",
      "on stage",
      "acoustic",
    ],
    Movie: [
      "movie",
      "film",
      "cinema",
      "feature film",
      "full movie",
      "movie trailer",
      "trailer",
      "film trailer",
    ],
    Series: [
      "series",
      "tv series",
      "episode",
      "ep",
      "season",
      "web series",
      "series episode",
      "tv show",
    ],
    BTS: [
      "bts",
      "behind the scenes",
      "behind the scene",
      "making of",
      "making",
      "behind scenes",
      "backstage",
      "on set",
    ],
  };

  // Calculate scores for each category
  const scores: Record<VideoCategory, number> = {
    Music_Video: countMatches(text, categoryKeywords.Music_Video),
    Music: countMatches(text, categoryKeywords.Music),
    Dance: countMatches(text, categoryKeywords.Dance),
    Interview: countMatches(text, categoryKeywords.Interview),
    Vlog: countMatches(text, categoryKeywords.Vlog),
    Performance: countMatches(text, categoryKeywords.Performance),
    Movie: countMatches(text, categoryKeywords.Movie),
    Series: countMatches(text, categoryKeywords.Series),
    BTS: countMatches(text, categoryKeywords.BTS),
  };

  // Find category with highest score
  const maxScore = Math.max(...Object.values(scores));

  // If no matches found, default to Music_Video
  if (maxScore === 0) {
    return "Music_Video";
  }

  // Return category with highest score
  const detectedCategory = Object.entries(scores).find(
    ([_, score]) => score === maxScore
  )?.[0] as VideoCategory;

  return detectedCategory || "Music_Video";
}
