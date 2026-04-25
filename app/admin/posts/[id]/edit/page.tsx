"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Image as ImageIcon, Upload, X } from "lucide-react";
import RichTextEditor from "../../../../components/RichTextEditor";

type BlogCategory = "Music" | "Culture" | "Lifestyle" | "News" | "Industry";
type PostStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  featured: boolean;
  imageUrl: string;
  status: PostStatus;
  publishAt: string | Date | null;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
}

export default function EditPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Music" as BlogCategory,
    excerpt: "",
    content: "",
    imageUrl: "",
    featured: false,
    status: "DRAFT" as PostStatus,
    publishAt: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    ogImageUrl: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    } else if (!loading && user && user.role !== "ADMIN" && user.role !== "AUTHOR") {
      router.push("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (postId && user) {
      fetchPost();
    }
  }, [postId, user]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchPost = async () => {
    if (!postId) return;

    setLoadingPost(true);
    try {
      const response = await fetch(`/api/admin/blog/${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const postData = await response.json();
      setPost(postData);

      // Populate form with existing data
      setFormData({
        title: postData.title || "",
        category: postData.category || "Music",
        excerpt: postData.excerpt || "",
        content: postData.content || "",
        imageUrl: postData.imageUrl || "",
        featured: postData.featured || false,
        status: postData.status || "DRAFT",
        publishAt: postData.publishAt
          ? new Date(postData.publishAt).toISOString().slice(0, 16)
          : "",
        tags: (postData.tags || []).join(", "),
        metaTitle: postData.metaTitle || "",
        metaDescription: postData.metaDescription || "",
        canonicalUrl: postData.canonicalUrl || "",
        ogImageUrl: postData.ogImageUrl || "",
      });

      setImagePreview(postData.imageUrl);
    } catch (error) {
      console.error("Error fetching post:", error);
      setToast({ type: "error", message: "Failed to load post" });
      router.push("/admin/dashboard");
    } finally {
      setLoadingPost(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setToast({ type: "error", message: "File size must be less than 10MB" });
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "100afro/blog");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      setImagePreview(data.url);
      setToast({ type: "success", message: "Image uploaded successfully" });
    } catch (error) {
      console.error("Error uploading image:", error);
      setToast({ type: "error", message: "Failed to upload image" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    if (!postId) return;

    setSaving(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload: any = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        imageUrl: formData.imageUrl || "https://picsum.photos/seed/new/800/600",
        featured: formData.featured,
        status: publish ? "PUBLISHED" : formData.status,
        publishAt: formData.publishAt || null,
        tags: tagsArray,
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
        canonicalUrl: formData.canonicalUrl || null,
        ogImageUrl: formData.ogImageUrl || null,
      };

      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update post");
      }

      setToast({
        type: "success",
        message: publish ? "Post published successfully!" : "Post updated successfully!",
      });

      // Refresh post data
      await fetchPost();
    } catch (error) {
      console.error("Error updating post:", error);
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update post",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingPost) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "AUTHOR")) {
    return null;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg font-bold ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          } animate-in slide-in-from-right`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 safe-area-inset-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">
                  Edit Article
                </h1>
                <p className="text-sm text-gray-500 mt-1">{post.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={
                  post?.status === 'PUBLISHED'
                    ? `/blog/${post.slug || postId}`
                    : `/admin/posts/${postId}/preview`
                }
                target="_blank"
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-bold text-sm transition-colors flex items-center gap-2"
              >
                <Eye size={18} />
                Preview
              </Link>
              <button
                onClick={(e) => handleSubmit(e, false)}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                type="button"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {user.role === "ADMIN" && (
                <button
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-afro-primary text-black hover:bg-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  type="button"
                >
                  <Eye size={18} />
                  {saving ? "Publishing..." : "Publish"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Editor Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary text-lg"
                  placeholder="Enter article title..."
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                  Excerpt
                </label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  rows={3}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary resize-none"
                  placeholder="Brief summary of the article..."
                />
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                  Content
                </label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(html) =>
                    setFormData((prev) => ({ ...prev, content: html }))
                  }
                  placeholder="Start writing your article..."
                />
              </div>
            </div>

            {/* Sidebar - Same as new page */}
            <div className="space-y-6">
              {/* Cover Image */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-3 tracking-widest">
                  Cover Image
                </label>
                <div className="space-y-3">
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-afro-primary transition-colors">
                      {uploadingImage ? (
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-4 border-afro-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p className="text-sm text-gray-400">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-400">
                            <span className="font-semibold text-afro-primary">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={uploadingImage}
                    />
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-afro-primary"
                      placeholder="Or paste image URL..."
                    />
                  </div>
                  {(formData.imageUrl || imagePreview) && (
                    <div className="mt-3 w-full h-32 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                      <img
                        src={imagePreview || formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-3 tracking-widest">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as BlogCategory,
                    }))
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-afro-primary text-sm"
                >
                  <option value="Music">Music</option>
                  <option value="Culture">Culture</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="News">News</option>
                  <option value="Industry">Industry</option>
                </select>
              </div>

              {/* Status */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-3 tracking-widest">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as PostStatus,
                    }))
                  }
                  disabled={user.role !== "ADMIN"}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-afro-primary text-sm disabled:opacity-50"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="IN_REVIEW">In Review</option>
                  {user.role === "ADMIN" && (
                    <>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </>
                  )}
                </select>
              </div>

              {/* Featured */}
              {user.role === "ADMIN" && (
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 tracking-widest cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-afro-primary focus:ring-afro-primary"
                    />
                    Featured Post
                  </label>
                </div>
              )}

              {/* Publish Date */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-3 tracking-widest">
                  Schedule Publish
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishAt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, publishAt: e.target.value }))
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-afro-primary"
                />
              </div>

              {/* Tags */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-3 tracking-widest">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-afro-primary"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate tags with commas
                </p>
              </div>

              {/* SEO Fields */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500 tracking-widest">
                  SEO Settings
                </label>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-afro-primary"
                    placeholder="SEO title..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        metaDescription: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-afro-primary resize-none"
                    placeholder="SEO description..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    value={formData.canonicalUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        canonicalUrl: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-afro-primary"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">
                    OG Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.ogImageUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, ogImageUrl: e.target.value }))
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-afro-primary"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
