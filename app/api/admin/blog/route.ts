import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { prisma } from "@/lib/prisma";
import { BlogCategory, PostStatus } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const dateTimeString = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), { message: "Invalid datetime" });

const createPostSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  category: z.nativeEnum(BlogCategory),
  featured: z.boolean().optional(),
  imageUrl: z.string().url().optional(),
  status: z.nativeEnum(PostStatus).optional(),
  publishAt: dateTimeString.optional().nullable(),
  tags: z.array(z.string().min(1)).optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  canonicalUrl: z.string().url().optional().nullable(),
  ogImageUrl: z.string().url().optional().nullable(),
  authorId: z.string().optional().nullable(),
});

async function generateUniqueSlug(base: string) {
  if (!prisma) return base;
  let slug = base;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${i}`;
    i += 1;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);

    if (!user || (user.role !== "ADMIN" && user.role !== "AUTHOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;
    const q = searchParams.get("q") || "";
    const status = searchParams.get("status") as PostStatus | null;
    const includeArchived = searchParams.get("includeArchived") === "true";
    const authorId = searchParams.get("authorId");

    const where: any = {};
    if (user.role === "AUTHOR") {
      where.authorId = user.id;
    } else if (authorId && user.role === "ADMIN") {
      // Admin can filter by specific author
      where.authorId = authorId;
    }
    if (!includeArchived) {
      where.status = { not: "ARCHIVED" };
    }
    if (status) {
      where.status = status;
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);

    if (!user || (user.role !== "ADMIN" && user.role !== "AUTHOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(request, { windowMs: 60_000, max: 60, keyPrefix: "admin:blog:write", key: user.id });
    if (!rl.ok) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const baseSlug = slugify(data.title);
    const slug = await generateUniqueSlug(baseSlug);

    const requestedAuthorId = user.role === "ADMIN" ? (data.authorId || user.id) : user.id;
    
    // Validate that both author and creator exist
    const [authorExists, creatorExists] = await Promise.all([
      prisma.user.findUnique({ where: { id: requestedAuthorId }, select: { id: true } }),
      prisma.user.findUnique({ where: { id: user.id }, select: { id: true } }),
    ]);
    
    if (!authorExists) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 400 }
      );
    }
    
    if (!creatorExists) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 400 }
      );
    }
    
    const now = new Date();
    const publishAtDate = data.publishAt ? new Date(data.publishAt) : null;

    const requestedStatus = user.role === "ADMIN" ? (data.status ?? PostStatus.DRAFT) : PostStatus.DRAFT;
    const status = requestedStatus;
    const publishedAt =
      status === PostStatus.PUBLISHED && (!publishAtDate || publishAtDate <= now)
        ? now
        : null;

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        featured: user.role === "ADMIN" ? (data.featured || false) : false,
        imageUrl: data.imageUrl || "https://picsum.photos/seed/new/800/600",
        authorId: requestedAuthorId,
        status,
        publishAt: user.role === "ADMIN" ? publishAtDate : null,
        publishedAt,
        tags: data.tags || [],
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        ogImageUrl: data.ogImageUrl || null,
        createdById: user.id,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
