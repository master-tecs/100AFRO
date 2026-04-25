import OpenAI from 'openai';

export interface ArticleContent {
  title: string;
  excerpt: string;
  content: string; // HTML formatted
  tags: string[];
  metaDescription: string;
}

export interface AIService {
  generateArticle(
    topic: { title: string; description: string; category?: string },
    category: string
  ): Promise<ArticleContent>;
}

class OpenAIService implements AIService {
  private client: OpenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    this.client = new OpenAI({ apiKey });
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
  }

  async generateArticle(
    topic: { title: string; description: string; category?: string },
    category: string
  ): Promise<ArticleContent> {
    const prompt = this.buildPrompt(topic, category);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are a professional article copywriter specializing in African entertainment, music, culture, and lifestyle content. Your articles are engaging, well-researched, and always maintain an African perspective. You write in HTML format with proper headings, paragraphs, and formatting.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated from OpenAI');
      }

      return this.parseResponse(content, topic.title);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`Failed to generate article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildPrompt(
    topic: { title: string; description: string; category?: string },
    category: string
  ): string {
    return `Write a professional, engaging article about the following topic from an African perspective:

Topic: ${topic.title}
Description: ${topic.description}
Category: ${category}

Requirements:
1. Write 800-1500 words of high-quality content
2. Always maintain an African perspective - focus on how this topic relates to Africa, Africans, or impacts African communities
3. Use proper HTML formatting:
   - <h2> for main section headings
   - <h3> for subsections
   - <p> for paragraphs
   - <strong> for emphasis
   - <ul> and <li> for lists when appropriate
4. Make it engaging and professional
5. Include relevant context and background information
6. Write in a tone that's informative yet accessible

Format your response as JSON with the following structure:
{
  "title": "Engaging article title (60-70 characters, SEO-friendly)",
  "excerpt": "Compelling excerpt (150-160 characters)",
  "content": "Full HTML-formatted article content",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "metaDescription": "SEO meta description (150-160 characters)"
}

Ensure the article is well-structured, engaging, and provides value to readers interested in African entertainment and culture.`;
  }

  private parseResponse(content: string, fallbackTitle: string): ArticleContent {
    try {
      // Try to parse as JSON first
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          title: parsed.title || fallbackTitle,
          excerpt: parsed.excerpt || '',
          content: parsed.content || '',
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          metaDescription: parsed.metaDescription || parsed.excerpt || '',
        };
      }
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
    }

    // Fallback: treat entire response as content
    const lines = content.split('\n');
    const title = lines.find((l) => l.trim().startsWith('#') || l.trim().length > 0)?.replace(/^#+\s*/, '') || fallbackTitle;
    
    return {
      title,
      excerpt: content.substring(0, 160).replace(/\n/g, ' ').trim(),
      content: content,
      tags: [],
      metaDescription: content.substring(0, 160).replace(/\n/g, ' ').trim(),
    };
  }
}

// Factory function to get the appropriate AI service
export function getAIService(): AIService {
  const provider = process.env.AI_PROVIDER || 'openai';

  switch (provider.toLowerCase()) {
    case 'openai':
      return new OpenAIService();
    // Future: Add other providers here
    // case 'anthropic':
    //   return new AnthropicService();
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
