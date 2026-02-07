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

const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.nativeEnum(BlogCategory).optional(),
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

async function generateUniqueSlug(base: string, currentId: string) {
  if (!prisma) return base;
  let slug = base;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === currentId) return slug;
    slug = `${base}-${i}`;
    i += 1;
  }
}

async function createRevisionSnapshot(postId: string, userId: string) {
  if (!prisma) return;
  const existing = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!existing) return;
  await prisma.blogPostRevision.create({
    data: {
      postId: existing.id,
      title: existing.title,
      slug: existing.slug,
      excerpt: existing.excerpt,
      content: existing.content,
      category: existing.category,
      featured: existing.featured,
      imageUrl: existing.imageUrl,
      status: existing.status,
      publishAt: existing.publishAt,
      publishedAt: existing.publishedAt,
      tags: existing.tags,
      metaTitle: existing.metaTitle,
      metaDescription: existing.metaDescription,
      canonicalUrl: existing.canonicalUrl,
      ogImageUrl: existing.ogImageUrl,
      createdById: userId,
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser(request);

    if (!user || (user.role !== "ADMIN" && user.role !== "AUTHOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check authorization for authors
    if (user.role === "AUTHOR" && post.authorId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser(request);

    if (!user || (user.role !== "ADMIN" && user.role !== "AUTHOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(request, { windowMs: 60_000, max: 120, keyPrefix: "admin:blog:write", key: user.id });
    if (!rl.ok) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (user.role === "AUTHOR") {
      if (existing.authorId !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (existing.status === PostStatus.PUBLISHED || existing.status === PostStatus.ARCHIVED) {
        return NextResponse.json({ error: "Authors cannot edit published/archived posts" }, { status: 403 });
      }
    }

    // Verify user exists in database before using their ID
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database. Please log in again." },
        { status: 401 }
      );
    }

    await createRevisionSnapshot(existing.id, user.id);

    const updateData: any = { updatedById: user.id };
    const now = new Date();

    if (data.title) {
      updateData.title = data.title;
      const baseSlug = slugify(data.title);
      updateData.slug = await generateUniqueSlug(baseSlug, existing.id);
    }
    if (data.excerpt) updateData.excerpt = data.excerpt;
    if (data.content) updateData.content = data.content;
    if (data.category) updateData.category = data.category as BlogCategory;
    if (typeof data.imageUrl === "string") updateData.imageUrl = data.imageUrl;

    if (user.role === "ADMIN") {
      if (typeof data.featured === "boolean") updateData.featured = data.featured;
      if (data.tags) updateData.tags = data.tags;
      if (typeof data.metaTitle !== "undefined") updateData.metaTitle = data.metaTitle;
      if (typeof data.metaDescription !== "undefined") updateData.metaDescription = data.metaDescription;
      if (typeof data.canonicalUrl !== "undefined") updateData.canonicalUrl = data.canonicalUrl;
      if (typeof data.ogImageUrl !== "undefined") updateData.ogImageUrl = data.ogImageUrl;
      if (data.authorId) updateData.authorId = data.authorId;

      if (typeof data.publishAt !== "undefined") {
        updateData.publishAt = data.publishAt ? new Date(data.publishAt) : null;
      }
      if (data.status) {
        updateData.status = data.status;
        if (data.status !== PostStatus.PUBLISHED) {
          updateData.publishedAt = null;
        } else {
          const publishAtDate =
            typeof updateData.publishAt !== "undefined" ? updateData.publishAt : existing.publishAt;
          if (!publishAtDate || publishAtDate <= now) {
            updateData.publishedAt = existing.publishedAt ?? now;
          } else {
            updateData.publishedAt = null;
          }
        }
      }
    } else {
      // AUTHOR flow: allow draft -> in_review transition
      if (data.status && (data.status === PostStatus.DRAFT || data.status === PostStatus.IN_REVIEW)) {
        updateData.status = data.status;
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser(request);

    if (!user || (user.role !== "ADMIN" && user.role !== "AUTHOR")) {
      console.error("[DELETE /api/admin/blog/[id]] Unauthorized - no user or invalid role");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(request, { windowMs: 60_000, max: 60, keyPrefix: "admin:blog:write", key: user.id });
    if (!rl.ok) {
      console.error("[DELETE /api/admin/blog/[id]] Rate limit exceeded");
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    if (!prisma) {
      console.error("[DELETE /api/admin/blog/[id]] Database not available");
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const { id } = await params;
    console.log(`[DELETE /api/admin/blog/[id]] Attempting to archive post: ${id}`);

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      console.error(`[DELETE /api/admin/blog/[id]] Post not found: ${id}`);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (user.role === "AUTHOR") {
      if (existing.authorId !== user.id) {
        console.error(`[DELETE /api/admin/blog/[id]] Author unauthorized: ${user.id} != ${existing.authorId}`);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (existing.status === PostStatus.PUBLISHED) {
        console.error(`[DELETE /api/admin/blog/[id]] Author cannot archive published post`);
        return NextResponse.json({ error: "Authors cannot archive published posts" }, { status: 403 });
      }
    }

    // Verify user exists in database before using their ID
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      console.error(`[DELETE /api/admin/blog/[id]] User from token not found in database: ${user.id}`);
      return NextResponse.json(
        { error: "User not found in database. Please log in again." },
        { status: 401 }
      );
    }

    // Create revision snapshot (non-blocking - don't fail if this fails)
    try {
      await createRevisionSnapshot(existing.id, user.id);
      console.log(`[DELETE /api/admin/blog/[id]] Revision snapshot created for post: ${id}`);
    } catch (revisionError) {
      console.error(`[DELETE /api/admin/blog/[id]] Error creating revision snapshot (non-blocking):`, revisionError);
      // Continue with archiving even if revision creation fails
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        status: PostStatus.ARCHIVED,
        updatedById: user.id,
      },
    });

    console.log(`[DELETE /api/admin/blog/[id]] Successfully archived post: ${id}`);
    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("[DELETE /api/admin/blog/[id]] Error archiving blog post:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("[DELETE /api/admin/blog/[id]] Error stack:", errorStack);
    return NextResponse.json(
      { error: "Failed to archive blog post", details: errorMessage },
      { status: 500 }
    );
  }
}
