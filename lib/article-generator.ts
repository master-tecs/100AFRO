import { prisma } from './prisma';
import { getAIService } from './ai-service';
import { BlogCategory, PostStatus } from '@prisma/client';
import { generateUniqueSlug, slugify } from './utils';

export interface GenerateArticleOptions {
  topicId: string;
  authorId: string;
  category?: BlogCategory;
}

export interface GeneratedArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  metaDescription: string;
}

export class ArticleGenerator {
  async generateArticle(options: GenerateArticleOptions): Promise<GeneratedArticle> {
    if (!prisma) {
      throw new Error('Database not available');
    }

    // Fetch the topic
    const topic = await prisma.researchTopic.findUnique({
      where: { id: options.topicId },
    });

    if (!topic) {
      throw new Error('Topic not found');
    }

    if (topic.status === 'USED') {
      throw new Error('Topic has already been used');
    }

    // Create article generation record
    const articleGeneration = await prisma.articleGeneration.create({
      data: {
        topicId: options.topicId,
        status: 'GENERATING',
        model: process.env.OPENAI_MODEL || 'gpt-4',
      },
    });

    try {
      // Get AI service and generate article
      const aiService = getAIService();
      const category = options.category || topic.category || 'News';
      
      const articleContent = await aiService.generateArticle(
        {
          title: topic.title,
          description: topic.description,
          category: category,
        },
        category
      );

      // Generate unique slug
      const baseSlug = slugify(articleContent.title);
      const slug = await generateUniqueSlug(baseSlug);

      // Get default author (or use provided)
      const author = await prisma.user.findUnique({
        where: { id: options.authorId },
      });

      if (!author) {
        throw new Error('Author not found');
      }

      // Create blog post as draft
      const blogPost = await prisma.blogPost.create({
        data: {
          slug,
          title: articleContent.title,
          excerpt: articleContent.excerpt,
          content: articleContent.content,
          authorId: options.authorId,
          category: category as BlogCategory,
          featured: false,
          imageUrl: topic.sourceUrl || '/logo.PNG', // Default image, can be updated later
          status: PostStatus.DRAFT,
          tags: articleContent.tags,
          metaTitle: articleContent.title,
          metaDescription: articleContent.metaDescription,
          createdById: options.authorId,
          generatedFromTopicId: options.topicId,
        },
      });

      // Update article generation record
      await prisma.articleGeneration.update({
        where: { id: articleGeneration.id },
        data: {
          blogPostId: blogPost.id,
          status: 'COMPLETED',
          prompt: `Generated article for topic: ${topic.title}`,
        },
      });

      // Mark topic as used
      await prisma.researchTopic.update({
        where: { id: options.topicId },
        data: {
          status: 'USED',
          usedAt: new Date(),
        },
      });

      return {
        id: blogPost.id,
        slug: blogPost.slug,
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        category: blogPost.category,
        tags: blogPost.tags,
        metaDescription: blogPost.metaDescription || '',
      };
    } catch (error) {
      // Update article generation record with error
      await prisma.articleGeneration.update({
        where: { id: articleGeneration.id },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  async generateBulkArticles(
    topicIds: string[],
    authorId: string
  ): Promise<{ success: GeneratedArticle[]; failed: { topicId: string; error: string }[] }> {
    const results = {
      success: [] as GeneratedArticle[],
      failed: [] as { topicId: string; error: string }[],
    };

    for (const topicId of topicIds) {
      try {
        const article = await this.generateArticle({
          topicId,
          authorId,
        });
        results.success.push(article);
        
        // Add delay between generations to avoid rate limiting
        await this.delay(2000);
      } catch (error) {
        results.failed.push({
          topicId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
