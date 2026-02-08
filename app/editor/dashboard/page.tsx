"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  BarChart,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Eye,
  Calendar,
  ChevronRight,
} from "lucide-react";
import TruncatedTitle from "../../components/TruncatedTitle";
import ProfileSettings from "../../components/ProfileSettings";
import Header from "../../components/Header";

type BlogCategory = "Music" | "Culture" | "Lifestyle" | "News" | "Industry";
type PostStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  featured: boolean;
  imageUrl: string;
  status?: PostStatus | string;
  publishAt?: string | Date | null;
  publishedAt?: string | Date | null;
  tags?: string[];
  createdAt: Date;
}

function EditorDashboardContent() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"articles" | "stats" | "profile">("articles");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "DRAFT" | "IN_REVIEW" | "PUBLISHED">("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    inReviewPosts: 0,
    totalViews: 0,
    totalComments: 0,
  });

  // Handle URL query parameter for tab navigation
  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "profile" || tab === "stats" || tab === "articles") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    } else if (!loading && user && user.role !== "AUTHOR" && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user && (user.role === "AUTHOR" || user.role === "ADMIN")) {
      fetchPosts();
      if (activeTab === "stats") {
        fetchStats();
      }
    }
  }, [user, page, statusFilter, activeTab]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      params.set("authorId", user?.id || "");

      const response = await fetch(`/api/admin/blog?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      showToast("error", "Failed to load articles");
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/admin/blog?authorId=${user?.id}&limit=1000`);
      if (response.ok) {
        const data = await response.json();
        const allPosts = data.posts || [];
        setStats({
          totalPosts: allPosts.length,
          publishedPosts: allPosts.filter((p: BlogPost) => p.status === "PUBLISHED").length,
          draftPosts: allPosts.filter((p: BlogPost) => p.status === "DRAFT").length,
          inReviewPosts: allPosts.filter((p: BlogPost) => p.status === "IN_REVIEW").length,
          totalViews: 0,
          totalComments: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/blog/${postToDelete.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showToast("success", "Article archived successfully");
        setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
        setDeleteConfirmOpen(false);
        setPostToDelete(null);
      } else {
        const err = await response.json().catch(() => ({}));
        showToast("error", err.error || "Failed to archive article");
      }
    } catch (error) {
      showToast("error", "Failed to archive article");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-afro-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Site Header */}
      <Header />

      {/* Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Content Dashboard</h1>
              <p className="text-gray-400">Manage your articles and track your content performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center justify-center gap-2 bg-afro-primary hover:bg-white text-black font-bold py-3 px-6 rounded-lg transition-colors"
              >
                <Plus size={20} />
                New Article
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-gray-800">
            <button
              onClick={() => setActiveTab("articles")}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === "articles"
                  ? "text-afro-primary border-afro-primary"
                  : "text-gray-400 border-transparent hover:text-white"
              }`}
            >
              My Articles
            </button>
            <button
              onClick={() => {
                setActiveTab("stats");
                fetchStats();
              }}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === "stats"
                  ? "text-afro-primary border-afro-primary"
                  : "text-gray-400 border-transparent hover:text-white"
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === "profile"
                  ? "text-afro-primary border-afro-primary"
                  : "text-gray-400 border-transparent hover:text-white"
              }`}
            >
              Profile Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Articles Tab */}
          {activeTab === "articles" && (
            <div>
              {/* Filters */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-afro-primary transition-colors"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as any);
                      setPage(1);
                    }}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-afro-primary transition-colors"
                  >
                    <option value="ALL">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              {/* Posts List */}
              {postsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-afro-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-48 h-48 sm:h-auto sm:min-h-[160px] bg-gray-800 flex-shrink-0 overflow-hidden">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-semibold rounded-full">
                              {post.category}
                            </span>
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                post.status === "PUBLISHED"
                                  ? "bg-green-500/20 text-green-400"
                                  : post.status === "IN_REVIEW"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-gray-800 text-gray-400"
                              }`}
                            >
                              {post.status}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-afro-primary transition-colors">
                            <TruncatedTitle
                              title={post.title}
                              maxLines={2}
                              className="text-xl font-bold"
                            />
                          </h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              <Edit3 size={16} />
                              Edit
                            </Link>
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              <Eye size={16} />
                              View
                            </Link>
                            {post.status === "DRAFT" && (
                              <button
                                onClick={() => {
                                  setPostToDelete(post);
                                  setDeleteConfirmOpen(true);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-medium"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                  <FileText className="mx-auto text-gray-600 mb-4" size={48} />
                  <h3 className="text-white font-bold text-lg mb-2">No articles yet</h3>
                  <p className="text-gray-400 mb-6">Get started by creating your first article</p>
                  <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center gap-2 bg-afro-primary hover:bg-white text-black font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                    Create Your First Article
                  </Link>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-800">
                  <div className="text-gray-400 text-sm">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-2">Total Articles</div>
                  <div className="text-3xl font-bold text-white">{stats.totalPosts}</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-2">Published</div>
                  <div className="text-3xl font-bold text-green-400">{stats.publishedPosts}</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-2">Drafts</div>
                  <div className="text-3xl font-bold text-yellow-400">{stats.draftPosts}</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-2">In Review</div>
                  <div className="text-3xl font-bold text-blue-400">{stats.inReviewPosts}</div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <ProfileSettings />
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && postToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-white font-bold text-lg mb-2">Delete Article?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "{postToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setPostToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white font-semibold`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default function EditorDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-96 mb-8"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <EditorDashboardContent />
    </Suspense>
  );
}
