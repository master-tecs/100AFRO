import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";
import { PostStatus } from "@prisma/client";
import { slugify } from "@/lib/utils";

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
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (user.role === "AUTHOR" && post.authorId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const revisions = await prisma.blogPostRevision.findMany({
      where: { postId: id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ revisions });
  } catch (error) {
    console.error("Error fetching revisions:", error);
    return NextResponse.json({ error: "Failed to fetch revisions" }, { status: 500 });
  }
}

export async function POST(
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
    const body = await request.json();
    const revisionId = body?.revisionId as string | undefined;
    if (!revisionId) {
      return NextResponse.json({ error: "revisionId is required" }, { status: 400 });
    }

    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (user.role === "AUTHOR") {
      if (post.authorId !== user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (post.status === PostStatus.PUBLISHED) {
        return NextResponse.json({ error: "Authors cannot restore published posts" }, { status: 403 });
      }
    }

    const revision = await prisma.blogPostRevision.findUnique({ where: { id: revisionId } });
    if (!revision || revision.postId !== id) {
      return NextResponse.json({ error: "Revision not found" }, { status: 404 });
    }

    // Snapshot current state before restore
    await prisma.blogPostRevision.create({
      data: {
        postId: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        featured: post.featured,
        imageUrl: post.imageUrl,
        status: post.status,
        publishAt: post.publishAt,
        publishedAt: post.publishedAt,
        tags: post.tags,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        canonicalUrl: post.canonicalUrl,
        ogImageUrl: post.ogImageUrl,
        createdById: user.id,
      },
    });

    const baseSlug = slugify(revision.title);
    const nextSlug = await generateUniqueSlug(baseSlug, post.id);

    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        title: revision.title,
        slug: nextSlug,
        excerpt: revision.excerpt,
        content: revision.content,
        category: revision.category,
        featured: user.role === "ADMIN" ? revision.featured : post.featured,
        imageUrl: revision.imageUrl,
        status: user.role === "ADMIN" ? revision.status : post.status,
        publishAt: user.role === "ADMIN" ? revision.publishAt : post.publishAt,
        publishedAt: user.role === "ADMIN" ? revision.publishedAt : post.publishedAt,
        tags: revision.tags,
        metaTitle: revision.metaTitle,
        metaDescription: revision.metaDescription,
        canonicalUrl: revision.canonicalUrl,
        ogImageUrl: revision.ogImageUrl,
        updatedById: user.id,
      },
      include: {
        author: { select: { name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error restoring revision:", error);
    return NextResponse.json({ error: "Failed to restore revision" }, { status: 500 });
  }
}

