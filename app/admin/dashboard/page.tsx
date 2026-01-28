"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Video as VideoIcon,
  Users,
  Settings,
  LogOut,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  BarChart,
  X,
  Image as ImageIcon,
  Menu,
  TrendingUp,
  Eye,
  MessageSquare,
  Clock,
  Calendar,
  Save,
} from "lucide-react";

type BlogCategory = "Music" | "Culture" | "Lifestyle" | "News" | "Industry";
type PostStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  category: BlogCategory;
  featured: boolean;
  imageUrl: string;
  status?: PostStatus | string;
  publishAt?: string | Date | null;
  publishedAt?: string | Date | null;
  tags?: string[];
  author: {
    name: string | null;
  };
  createdAt: Date;
}

interface AdminPollListItem {
  id: string;
  question: string;
  options: any;
  active: boolean;
  startsAt?: string | Date | null;
  endsAt?: string | Date | null;
  updatedAt: string | Date;
  totalVotes?: number;
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "posts" | "comments" | "stats" | "videos" | "polls"
  >(
    "posts"
  );
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED"
  >("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isRevisionsOpen, setIsRevisionsOpen] = useState(false);
  const [revisionsLoading, setRevisionsLoading] = useState(false);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [revisionsPost, setRevisionsPost] = useState<BlogPost | null>(null);
  const [commentsTabStatus, setCommentsTabStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | "SPAM"
  >("PENDING");
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [moderationQueue, setModerationQueue] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Polls (Admin)
  const [pollsLoading, setPollsLoading] = useState(false);
  const [polls, setPolls] = useState<AdminPollListItem[]>([]);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [pollSaving, setPollSaving] = useState(false);
  const [editingPoll, setEditingPoll] = useState<AdminPollListItem | null>(null);
  const [pollDraft, setPollDraft] = useState<{
    question: string;
    options: Array<{ id: string; text: string }>;
    startsAt: string;
    endsAt: string;
    active: boolean;
  }>({
    question: "",
    options: [
      { id: "opt_1", text: "" },
      { id: "opt_2", text: "" },
    ],
    startsAt: "",
    endsAt: "",
    active: false,
  });
  const [pollResults, setPollResults] = useState<any | null>(null);
  const [pollResultsLoading, setPollResultsLoading] = useState(false);
  const [pollResultsForId, setPollResultsForId] = useState<string | null>(null);

  // New Post Form State
  const [newPost, setNewPost] = useState({
    title: "",
    category: "Music" as BlogCategory,
    excerpt: "",
    content: "",
    imageUrl: "https://picsum.photos/seed/new/800/600",
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
    } else if (!loading && user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user && (user.role === "ADMIN" || user.role === "AUTHOR")) {
      fetchPosts();
    }
  }, [user, page, statusFilter]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    if (activeTab !== "comments") return;
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, commentsTabStatus, commentsPage, user]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    if (activeTab !== "polls") return;
    fetchPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  const openRevisions = async (post: BlogPost) => {
    setIsRevisionsOpen(true);
    setRevisionsPost(post);
    setRevisionsLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}/revisions`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast("error", err.error || "Failed to load revisions");
        setRevisions([]);
        return;
      }
      const data = await res.json();
      setRevisions(data.revisions || []);
    } catch (e) {
      showToast("error", "Failed to load revisions");
      setRevisions([]);
    } finally {
      setRevisionsLoading(false);
    }
  };

  const restoreRevision = async (revisionId: string) => {
    if (!revisionsPost) return;
    if (!window.confirm("Restore this revision? Current content will be saved as a new revision.")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/blog/${revisionsPost.id}/revisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast("error", err.error || "Failed to restore revision");
        return;
      }
      const updated = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast("success", "Revision restored.");
      await openRevisions(updated);
    } catch (e) {
      showToast("error", "Failed to restore revision");
    }
  };

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("status", commentsTabStatus);
      params.set("page", String(commentsPage));
      params.set("limit", "25");
      const res = await fetch(`/api/admin/comments?${params.toString()}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast("error", err.error || "Failed to load comments");
        setModerationQueue([]);
        return;
      }
      const data = await res.json();
      setModerationQueue(data.comments || []);
      setCommentsTotalPages(data.pagination?.totalPages || 1);
    } catch (e) {
      showToast("error", "Failed to load comments");
      setModerationQueue([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const moderateComment = async (id: string, status: "APPROVED" | "REJECTED" | "SPAM") => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast("error", err.error || "Failed to update comment");
        return;
      }
      const updated = await res.json();
      // Remove from current queue if status changed away from filter
      setModerationQueue((prev) => prev.filter((c) => c.id !== updated.id));
      showToast("success", `Comment marked as ${status}.`);
    } catch (e) {
      showToast("error", "Failed to update comment");
    }
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const response = await fetch(`/api/admin/blog?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchPolls = async () => {
    setPollsLoading(true);
    try {
      const res = await fetch("/api/admin/polls");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast("error", err.error || "Failed to load polls");
        setPolls([]);
        return;
      }
      const data = await res.json();
      setPolls(data.polls || []);
    } catch (e) {
      showToast("error", "Failed to load polls");
      setPolls([]);
    } finally {
      setPollsLoading(false);
    }
  };

  const openCreatePoll = () => {
    setEditingPoll(null);
    setPollResults(null);
    setPollDraft({
      question: "",
      options: [
        { id: "opt_1", text: "" },
        { id: "opt_2", text: "" },
      ],
      startsAt: "",
      endsAt: "",
      active: false,
    });
    setIsPollModalOpen(true);
  };

  const openEditPoll = async (poll: AdminPollListItem) => {
    setEditingPoll(poll);
    setPollResults(null);
    const options = Array.isArray(poll.options)
      ? poll.options
          .map((o: any, idx: number) => ({
            id: String(o.id || `opt_${idx + 1}`),
            text: String(o.text || ""),
          }))
          .filter((o: any) => o.id && o.text !== undefined)
      : [
          { id: "opt_1", text: "" },
          { id: "opt_2", text: "" },
        ];
    setPollDraft({
      question: poll.question || "",
      options: options.length >= 2 ? options : [{ id: "opt_1", text: "" }, { id: "opt_2", text: "" }],
      startsAt: poll.startsAt ? new Date(poll.startsAt as any).toISOString().slice(0, 16) : "",
      endsAt: poll.endsAt ? new Date(poll.endsAt as any).toISOString().slice(0, 16) : "",
      active: !!poll.active,
    });
    setIsPollModalOpen(true);
  };

  const savePoll = async () => {
    if (!pollDraft.question.trim()) {
      showToast("error", "Poll question is required.");
      return;
    }
    const cleanedOptions = pollDraft.options
      .map((o) => ({ id: o.id.trim(), text: o.text.trim() }))
      .filter((o) => o.id && o.text);
    if (cleanedOptions.length < 2) {
      showToast("error", "Add at least 2 options.");
      return;
    }

    setPollSaving(true);
    try {
      const payload = {
        question: pollDraft.question.trim(),
        options: cleanedOptions,
        startsAt: pollDraft.startsAt ? new Date(pollDraft.startsAt).toISOString() : null,
        endsAt: pollDraft.endsAt ? new Date(pollDraft.endsAt).toISOString() : null,
        active: pollDraft.active,
      };

      const res = await fetch(editingPoll ? `/api/admin/polls/${editingPoll.id}` : "/api/admin/polls", {
        method: editingPoll ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast("error", err.error || "Failed to save poll");
        return;
      }
      showToast("success", editingPoll ? "Poll updated." : "Poll created.");
      setIsPollModalOpen(false);
      await fetchPolls();
    } catch (e) {
      showToast("error", "Failed to save poll");
    } finally {
      setPollSaving(false);
    }
  };

  const deletePoll = async (id: string) => {
    if (!window.confirm("Delete this poll? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/polls/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast("error", err.error || "Failed to delete poll");
        return;
      }
      showToast("success", "Poll deleted.");
      await fetchPolls();
    } catch {
      showToast("error", "Failed to delete poll");
    }
  };

  const activatePoll = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/polls/${id}/activate`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast("error", err.error || "Failed to activate poll");
        return;
      }
      showToast("success", "Poll activated.");
      await fetchPolls();
    } catch {
      showToast("error", "Failed to activate poll");
    }
  };

  const loadPollResults = async (id: string) => {
    setPollResultsForId(id);
    setPollResults(null);
    setPollResultsLoading(true);
    try {
      const res = await fetch(`/api/admin/polls/${id}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast("error", err.error || "Failed to load results");
        return;
      }
      const data = await res.json();
      setPollResults(data.poll);
    } catch {
      showToast("error", "Failed to load results");
    } finally {
      setPollResultsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      setPage(1);
      fetchPosts();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const normalizePostPayload = () => {
    const tags = (newPost.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const publishAt = newPost.publishAt
      ? new Date(newPost.publishAt).toISOString()
      : null;
    const payload: any = {
      title: newPost.title,
      excerpt: newPost.excerpt,
      content: newPost.content,
      category: newPost.category,
      featured: newPost.featured,
      imageUrl: newPost.imageUrl,
      status: newPost.status,
      publishAt,
      tags,
      metaTitle: newPost.metaTitle || null,
      metaDescription: newPost.metaDescription || null,
      canonicalUrl: newPost.canonicalUrl || null,
      ogImageUrl: newPost.ogImageUrl || null,
    };
    return payload;
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url =
        isEditMode && editingPost
          ? `/api/admin/blog/${editingPost.id}`
          : "/api/admin/blog";

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizePostPayload()),
      });

      if (response.ok) {
        const post = await response.json();
        if (isEditMode) {
          setPosts(posts.map((p) => (p.id === editingPost!.id ? post : p)));
          showToast("success", "Post updated successfully.");
        } else {
          setPosts([post, ...posts]);
          showToast("success", "Draft saved. You can schedule or publish when ready.");
        }
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingPost(null);
        setNewPost({
          title: "",
          category: "Music",
          excerpt: "",
          content: "",
          imageUrl: "https://picsum.photos/seed/new/800/600",
          featured: false,
          status: "DRAFT",
          publishAt: "",
          tags: "",
          metaTitle: "",
          metaDescription: "",
          canonicalUrl: "",
          ogImageUrl: "",
        });
      } else {
        const error = await response.json();
        showToast(
          "error",
          error.error || `Failed to ${isEditMode ? "update" : "create"} post`
        );
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} post:`,
        error
      );
      showToast("error", `Failed to ${isEditMode ? "update" : "create"} post`);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setImagePreview(post.imageUrl);
    setNewPost({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content || post.excerpt,
      imageUrl: post.imageUrl,
      featured: post.featured,
      status: (post.status as PostStatus) || "DRAFT",
      publishAt: post.publishAt ? new Date(post.publishAt as any).toISOString().slice(0, 16) : "",
      tags: (post.tags || []).join(", "),
      metaTitle: (post as any).metaTitle || "",
      metaDescription: (post as any).metaDescription || "",
      canonicalUrl: (post as any).canonicalUrl || "",
      ogImageUrl: (post as any).ogImageUrl || "",
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const deletePost = async (id: string) => {
    if (!window.confirm("Archive this post? You can restore later from revisions.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== id));
        showToast("success", "Post archived.");
      } else {
        showToast("error", "Failed to archive post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast("error", "Failed to archive post");
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "100afro/blog");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNewPost({ ...newPost, imageUrl: data.url });
        setImagePreview(data.url);
      } else {
        const error = await response.json();
        showToast("error", error.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("error", "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setNewPost({ ...newPost, imageUrl: url });
    setImagePreview(url);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  if (loading || postsLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-afro-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white font-medium">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-afro-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "AUTHOR")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex h-screen overflow-hidden font-sans">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100]">
          <div
            className={`px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-sm ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-200"
                : "bg-red-500/10 border-red-500/30 text-red-200"
            }`}
          >
            <div className="text-sm font-bold">{toast.message}</div>
          </div>
        </div>
      )}
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 h-screen bg-gray-900 border-r border-gray-800 
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="font-display font-bold text-2xl text-white tracking-tighter"
            >
              100<span className="text-afro-primary">AFRO</span>{" "}
              <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-gray-800 px-1 rounded ml-1">
                Admin
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4 overflow-y-auto">
          <button
            onClick={() => {
              setActiveTab("posts");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "posts"
                ? "bg-afro-primary text-black"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <FileText size={20} /> Content Manager
          </button>
          <button
            onClick={() => {
              setActiveTab("stats");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "stats"
                ? "bg-afro-primary text-black"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <BarChart size={20} /> Analytics
          </button>
          <button
            onClick={() => {
              setActiveTab("videos");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "videos"
                ? "bg-afro-primary text-black"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <VideoIcon size={20} /> Video Hub
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <Users size={20} /> Community
          </button>
          {user?.role === "ADMIN" && (
            <button
              onClick={() => {
                setActiveTab("comments");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === "comments"
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <MessageSquare size={20} /> Moderation
            </button>
          )}
          {user?.role === "ADMIN" && (
            <button
              onClick={() => {
                setActiveTab("polls");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === "polls"
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <BarChart size={20} /> Polls
            </button>
          )}
          <div className="h-px bg-gray-800 my-4 mx-2"></div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="mb-3 px-4 py-2 text-xs text-gray-500">
            <p className="font-bold">{user?.name || "Admin"}</p>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} /> Exit CMS
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="font-display font-bold text-xl text-white">
            100<span className="text-afro-primary">AFRO</span>
          </Link>
          <div className="w-6"></div>
        </div>

        <div className="p-4 lg:p-8">
          {/* Header Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-10">
            <div className="bg-gray-900 border border-gray-800 p-4 lg:p-6 rounded-xl lg:rounded-2xl">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className="p-2 bg-afro-primary/10 text-afro-primary rounded-lg">
                  <FileText size={18} className="lg:w-5 lg:h-5" />
                </div>
                <span className="text-green-500 text-xs font-bold">+12%</span>
              </div>
              <p className="text-gray-500 text-xs lg:text-sm font-bold uppercase tracking-wider">
                Articles
              </p>
              <h3 className="text-xl lg:text-3xl font-display font-bold text-white mt-1">
                {posts.length}
              </h3>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-4 lg:p-6 rounded-xl lg:rounded-2xl">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                  <BarChart size={18} className="lg:w-5 lg:h-5" />
                </div>
                <span className="text-green-500 text-xs font-bold">+8%</span>
              </div>
              <p className="text-gray-500 text-xs lg:text-sm font-bold uppercase tracking-wider">
                Views
              </p>
              <h3 className="text-xl lg:text-3xl font-display font-bold text-white mt-1">
                1.2M
              </h3>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-4 lg:p-6 rounded-xl lg:rounded-2xl">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                  <Users size={18} className="lg:w-5 lg:h-5" />
                </div>
                <span className="text-red-500 text-xs font-bold">-2%</span>
              </div>
              <p className="text-gray-500 text-xs lg:text-sm font-bold uppercase tracking-wider">
                Users
              </p>
              <h3 className="text-xl lg:text-3xl font-display font-bold text-white mt-1">
                45.8K
              </h3>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-4 lg:p-6 rounded-xl lg:rounded-2xl">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg">
                  <VideoIcon size={18} className="lg:w-5 lg:h-5" />
                </div>
                <span className="text-green-500 text-xs font-bold">+24%</span>
              </div>
              <p className="text-gray-500 text-xs lg:text-sm font-bold uppercase tracking-wider">
                Videos
              </p>
              <h3 className="text-xl lg:text-3xl font-display font-bold text-white mt-1">
                892K
              </h3>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === "posts" && (
            <>
              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
                <h2 className="text-xl lg:text-2xl font-display font-bold text-white">
                  Editorial Board
                </h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search stories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-afro-primary"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as any);
                      setPage(1);
                    }}
                    className="bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-afro-primary"
                    title="Filter by status"
                  >
                    <option value="ALL">All</option>
                    <option value="DRAFT">Drafts</option>
                    <option value="IN_REVIEW">In review</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      setEditingPost(null);
                      setImagePreview(null);
                      setNewPost({
                        title: "",
                        category: "Music",
                        excerpt: "",
                        content: "",
                        imageUrl: "https://picsum.photos/seed/new/800/600",
                        featured: false,
                        status: "DRAFT",
                        publishAt: "",
                        tags: "",
                        metaTitle: "",
                        metaDescription: "",
                        canonicalUrl: "",
                        ogImageUrl: "",
                      });
                      setIsModalOpen(true);
                    }}
                    className="bg-afro-primary hover:bg-white text-black font-bold px-4 lg:px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-afro-primary/10 text-sm lg:text-base"
                  >
                    <Plus size={18} className="lg:w-5 lg:h-5" />{" "}
                    <span className="hidden sm:inline">New Article</span>
                    <span className="sm:hidden">New</span>
                  </button>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-800/50 border-b border-gray-800">
                        <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-widest">
                          Story
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-widest">
                          Category
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-widest">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-widest">
                          Author
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-widest">
                          Date
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-widest text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {posts.map((post) => (
                        <tr
                          key={post.id}
                          className="hover:bg-gray-800/30 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800 border border-gray-700">
                                <img
                                  src={post.imageUrl}
                                  className="w-full h-full object-cover opacity-80"
                                  alt=""
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-white font-bold group-hover:text-afro-primary transition-colors truncate">
                                  {post.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">
                                  /{post.slug}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded uppercase tracking-wider">
                              {post.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-gray-300 bg-gray-800 px-2 py-1 rounded uppercase tracking-wider">
                              {(post.status as any) || "DRAFT"}
                            </span>
                            {(post.status as any) === "PUBLISHED" && post.publishAt && new Date(post.publishAt as any) > new Date() && (
                              <span className="ml-2 text-xs font-bold text-purple-300 bg-purple-500/10 px-2 py-1 rounded uppercase tracking-wider">
                                Scheduled
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300 font-medium">
                            {post.author.name || "Admin"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                            {formatDate(post.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openRevisions(post)}
                                className="p-2 text-gray-500 hover:text-afro-primary transition-colors"
                                title="Revisions"
                              >
                                <Clock size={18} />
                              </button>
                              <button
                                onClick={() => handleEdit(post)}
                                className="p-2 text-gray-500 hover:text-white transition-colors"
                                title="Edit"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button
                                onClick={() => deletePost(post.id)}
                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="p-2 text-gray-500 hover:text-afro-primary transition-colors"
                                title="Preview Live"
                              >
                                <ExternalLink size={18} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {posts.length === 0 && !loading && (
                  <div className="py-20 text-center">
                    <p className="text-gray-500 font-medium">
                      No posts found for the selected filters.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 text-sm">
                  <div className="text-gray-500">
                    Page <span className="text-gray-200 font-bold">{page}</span> of{" "}
                    <span className="text-gray-200 font-bold">{totalPages}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700"
                    >
                      Prev
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                  >
                    <div className="flex gap-4 mb-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800 border border-gray-700">
                        <img
                          src={post.imageUrl}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          /{post.slug}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded uppercase">
                            {post.category}
                          </span>
                          <span className="text-xs font-bold text-gray-300 bg-gray-800 px-2 py-0.5 rounded uppercase">
                            {(post.status as any) || "DRAFT"}
                          </span>
                          {post.featured && (
                            <span className="text-xs font-bold text-afro-primary bg-afro-primary/10 px-2 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="text-xs text-gray-400">
                        <p>{post.author.name || "Admin"}</p>
                        <p className="font-mono">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openRevisions(post)}
                          className="p-2 text-gray-500 hover:text-afro-primary bg-gray-800 rounded-lg transition-colors"
                          title="Revisions"
                        >
                          <Clock size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 text-gray-500 hover:text-white bg-gray-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-gray-500 hover:text-red-500 bg-gray-800 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-gray-500 hover:text-afro-primary bg-gray-800 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <ExternalLink size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {posts.length === 0 && !loading && (
                  <div className="py-12 text-center bg-gray-900 border border-gray-800 rounded-xl">
                    <p className="text-gray-500 font-medium">
                      No posts found for the selected filters.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between px-2 py-2 text-sm">
                  <div className="text-gray-500">
                    Page <span className="text-gray-200 font-bold">{page}</span> of{" "}
                    <span className="text-gray-200 font-bold">{totalPages}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Prev
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Comments Moderation Tab (Admin) */}
          {activeTab === "comments" && user.role === "ADMIN" && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl lg:text-2xl font-display font-bold text-white">
                    Comment Moderation
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Approve, reject, or mark spam before comments go live.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={commentsTabStatus}
                    onChange={(e) => {
                      setCommentsTabStatus(e.target.value as any);
                      setCommentsPage(1);
                    }}
                    className="bg-gray-950 border border-gray-700 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-afro-primary"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="SPAM">Spam</option>
                  </select>
                </div>
              </div>

              {commentsLoading ? (
                <div className="py-10 text-center text-gray-400">Loading comments...</div>
              ) : moderationQueue.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No comments in this queue.
                </div>
              ) : (
                <div className="space-y-4">
                  {moderationQueue.map((c) => (
                    <div
                      key={c.id}
                      className="bg-gray-950 border border-gray-800 rounded-xl p-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-white font-bold">{c.author}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(c.createdAt).toLocaleString()}
                            </span>
                            {c.post?.slug && (
                              <Link
                                href={`/blog/${c.post.slug}`}
                                target="_blank"
                                className="text-xs font-bold text-afro-primary hover:underline"
                              >
                                View post
                              </Link>
                            )}
                          </div>
                          {c.post?.title && (
                            <div className="text-xs text-gray-500 mb-2">
                              On: <span className="text-gray-300">{c.post.title}</span>
                            </div>
                          )}
                          <div className="text-gray-300 text-sm leading-relaxed">
                            {c.content}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {commentsTabStatus !== "APPROVED" && (
                            <button
                              onClick={() => moderateComment(c.id, "APPROVED")}
                              className="px-3 py-2 rounded-lg bg-green-500/15 text-green-200 border border-green-500/30 hover:bg-green-500/25 text-sm font-bold"
                            >
                              Approve
                            </button>
                          )}
                          {commentsTabStatus !== "REJECTED" && (
                            <button
                              onClick={() => moderateComment(c.id, "REJECTED")}
                              className="px-3 py-2 rounded-lg bg-yellow-500/15 text-yellow-200 border border-yellow-500/30 hover:bg-yellow-500/25 text-sm font-bold"
                            >
                              Remove
                            </button>
                          )}
                          {commentsTabStatus !== "SPAM" && (
                            <button
                              onClick={() => moderateComment(c.id, "SPAM")}
                              className="px-3 py-2 rounded-lg bg-red-500/15 text-red-200 border border-red-500/30 hover:bg-red-500/25 text-sm font-bold"
                            >
                              Spam
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-6 text-sm">
                <div className="text-gray-500">
                  Page <span className="text-gray-200 font-bold">{commentsPage}</span> of{" "}
                  <span className="text-gray-200 font-bold">{commentsTotalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={commentsPage <= 1}
                    onClick={() => setCommentsPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <button
                    disabled={commentsPage >= commentsTotalPages}
                    onClick={() => setCommentsPage((p) => Math.min(commentsTotalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Polls Tab (Admin) */}
          {activeTab === "polls" && user.role === "ADMIN" && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl lg:text-2xl font-display font-bold text-white">
                    Polls
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Create a Poll of the Week and activate exactly one.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={openCreatePoll}
                    className="bg-afro-primary text-black font-bold px-4 py-2 rounded-xl hover:bg-white transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} /> New Poll
                  </button>
                </div>
              </div>

              {pollsLoading ? (
                <div className="py-10 text-center text-gray-400">Loading polls...</div>
              ) : polls.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No polls yet. Create one to start.
                </div>
              ) : (
                <div className="space-y-3">
                  {polls.map((p) => (
                    <div
                      key={p.id}
                      className="bg-gray-950 border border-gray-800 rounded-xl p-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-white font-bold truncate">{p.question}</span>
                            {p.active && (
                              <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-500/15 text-green-200 border border-green-500/30">
                                Active
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              Votes: <span className="text-gray-300 font-bold">{p.totalVotes ?? 0}</span>
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Updated:{" "}
                            <span className="text-gray-300">
                              {new Date(p.updatedAt as any).toLocaleString()}
                            </span>
                          </div>
                          {(p.startsAt || p.endsAt) && (
                            <div className="text-xs text-gray-500 mt-1">
                              Window:{" "}
                              <span className="text-gray-300">
                                {p.startsAt ? new Date(p.startsAt as any).toLocaleString() : "Anytime"}{" "}
                                → {p.endsAt ? new Date(p.endsAt as any).toLocaleString() : "No end"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!p.active && (
                            <button
                              onClick={() => activatePoll(p.id)}
                              className="px-3 py-2 rounded-lg bg-green-500/15 text-green-200 border border-green-500/30 hover:bg-green-500/25 text-sm font-bold"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              await openEditPoll(p);
                              await loadPollResults(p.id);
                            }}
                            className="px-3 py-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 text-sm font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => loadPollResults(p.id)}
                            className="px-3 py-2 rounded-lg bg-blue-500/15 text-blue-200 border border-blue-500/30 hover:bg-blue-500/25 text-sm font-bold"
                          >
                            Results
                          </button>
                          <button
                            onClick={() => deletePoll(p.id)}
                            className="px-3 py-2 rounded-lg bg-red-500/15 text-red-200 border border-red-500/30 hover:bg-red-500/25 text-sm font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                    {/* Inline results drawer */}
                    {pollResultsLoading && pollResultsForId === p.id && (
                      <div className="mt-3 rounded-2xl border border-gray-800 bg-gray-900/40 p-4 text-sm text-gray-300">
                        Loading results...
                      </div>
                    )}
                    {!pollResultsLoading && pollResults?.id === p.id && (
                      <div className="mt-3 rounded-2xl border border-gray-800 bg-gray-950 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-white font-bold">Results</div>
                          <div className="text-xs text-gray-500">
                            Total votes:{" "}
                            <span className="text-gray-200 font-bold">{pollResults.totalVotes ?? 0}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {(pollResults.options || []).map((o: any) => (
                            <div key={o.id} className="rounded-xl border border-gray-800 bg-gray-900/40 p-3">
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-gray-200 font-bold">{o.text}</div>
                                <div className="text-xs text-gray-400">
                                  {o.votes} votes • {o.percent}%
                                </div>
                              </div>
                              <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden">
                                <div className="h-full bg-afro-primary" style={{ width: `${o.percent}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                Analytics Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-green-400" size={24} />
                    <h3 className="text-lg font-bold text-white">
                      Top Performing Posts
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {posts.slice(0, 5).map((post, idx) => (
                      <div key={post.id} className="flex items-center gap-3">
                        <span className="text-2xl font-display font-bold text-gray-600 w-8">
                          #{idx + 1}
                        </span>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-medium text-sm truncate">
                            {post.title}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {post.category}
                          </p>
                        </div>
                        <span className="text-green-400 text-sm font-bold">
                          +{Math.floor(Math.random() * 20 + 10)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="text-blue-400" size={24} />
                    <h3 className="text-lg font-bold text-white">
                      Engagement Metrics
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400 text-sm">
                          Total Views
                        </span>
                        <span className="text-white font-bold">1.2M</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400 text-sm">Comments</span>
                        <span className="text-white font-bold">4.5K</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400 text-sm">Shares</span>
                        <span className="text-white font-bold">12.3K</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Poll Modal */}
          {isPollModalOpen && user?.role === "ADMIN" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-display font-bold text-xl">
                      {editingPoll ? "Edit Poll" : "New Poll"}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">This powers the homepage Poll of the Week.</p>
                  </div>
                  <button
                    onClick={() => setIsPollModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                    aria-label="Close"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Question</label>
                    <input
                      value={pollDraft.question}
                      onChange={(e) => setPollDraft((p) => ({ ...p, question: e.target.value }))}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary"
                      placeholder="Who should win Artist of the Year?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Options</label>
                    <div className="space-y-2">
                      {pollDraft.options.map((o, idx) => (
                        <div key={o.id} className="flex items-center gap-2">
                          <input
                            value={o.text}
                            onChange={(e) =>
                              setPollDraft((p) => ({
                                ...p,
                                options: p.options.map((x) => (x.id === o.id ? { ...x, text: e.target.value } : x)),
                              }))
                            }
                            className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-afro-primary"
                            placeholder={`Option ${idx + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPollDraft((p) => ({
                                ...p,
                                options: p.options.length <= 2 ? p.options : p.options.filter((x) => x.id !== o.id),
                              }))
                            }
                            disabled={pollDraft.options.length <= 2}
                            className="px-3 py-2.5 rounded-xl bg-gray-800 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Remove option"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPollDraft((p) => ({
                          ...p,
                          options: [
                            ...p.options,
                            { id: `opt_${p.options.length + 1}`, text: "" },
                          ],
                        }))
                      }
                      className="mt-3 px-4 py-2 rounded-xl bg-gray-800 text-gray-200 hover:bg-gray-700 font-bold"
                    >
                      + Add option
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Starts at (optional)</label>
                      <input
                        type="datetime-local"
                        value={pollDraft.startsAt}
                        onChange={(e) => setPollDraft((p) => ({ ...p, startsAt: e.target.value }))}
                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-afro-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Ends at (optional)</label>
                      <input
                        type="datetime-local"
                        value={pollDraft.endsAt}
                        onChange={(e) => setPollDraft((p) => ({ ...p, endsAt: e.target.value }))}
                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-afro-primary"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={pollDraft.active}
                      onChange={(e) => setPollDraft((p) => ({ ...p, active: e.target.checked }))}
                    />
                    Make this the active poll (deactivates others)
                  </label>

                  {pollResults?.id && pollResults.id === editingPoll?.id && (
                    <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-950 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-white font-bold">Live Results</div>
                        <div className="text-xs text-gray-500">
                          Total votes: <span className="text-gray-200 font-bold">{pollResults.totalVotes ?? 0}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {(pollResults.options || []).map((o: any) => (
                          <div key={o.id} className="rounded-xl border border-gray-800 bg-gray-900/40 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-gray-200 font-bold">{o.text}</div>
                              <div className="text-xs text-gray-400">
                                {o.votes} votes • {o.percent}%
                              </div>
                            </div>
                            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden">
                              <div className="h-full bg-afro-primary" style={{ width: `${o.percent}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-gray-800 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setIsPollModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-200 hover:bg-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={savePoll}
                    disabled={pollSaving}
                    className="px-5 py-2.5 rounded-xl bg-afro-primary text-black font-bold hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Save size={18} />
                    {pollSaving ? "Saving..." : "Save Poll"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                Video Management
              </h2>
              <div className="text-center py-12">
                <VideoIcon className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400 font-medium">
                  Video management coming soon...
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* New/Edit Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl lg:rounded-3xl w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-300 my-4">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 lg:p-6 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-display font-bold text-white">
                    {isEditMode ? "Edit Story" : "Create New Story"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Crafting the next big trend on 100AFRO.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setEditingPost(null);
                    setImagePreview(null);
                  }}
                  className="text-gray-500 hover:text-white transition-colors p-2 -mr-2"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-4 lg:p-8">
              <form onSubmit={handleCreatePost} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                      Main Headline
                    </label>
                    <input
                      type="text"
                      required
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary text-sm lg:text-base"
                      placeholder="Ex: Burna Boy Secures Historic Collaboration"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                      Category
                    </label>
                    <select
                      value={newPost.category}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          category: e.target.value as BlogCategory,
                        })
                      }
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary text-sm lg:text-base"
                    >
                      <option value="Music">Music</option>
                      <option value="Culture">Culture</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="News">News</option>
                      <option value="Industry">Industry</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 tracking-widest cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPost.featured}
                        onChange={(e) =>
                          setNewPost({ ...newPost, featured: e.target.checked })
                        }
                        disabled={user.role !== "ADMIN"}
                        className="w-4 h-4 rounded border-gray-700 bg-gray-950 text-afro-primary focus:ring-afro-primary"
                      />
                      Featured Post
                    </label>
                    {user.role !== "ADMIN" && (
                      <span className="ml-3 text-xs text-gray-500">
                        (Admins only)
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                      Status
                    </label>
                    <select
                      value={newPost.status}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          status: e.target.value as any,
                        })
                      }
                      disabled={user.role !== "ADMIN" && user.role !== "AUTHOR"}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary text-sm lg:text-base"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="IN_REVIEW">In review</option>
                      {user.role === "ADMIN" && (
                        <>
                          <option value="PUBLISHED">Published</option>
                          <option value="ARCHIVED">Archived</option>
                        </>
                      )}
                    </select>
                  </div>

                  {user.role === "ADMIN" && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                        Schedule Publish (optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={newPost.publishAt}
                        onChange={(e) =>
                          setNewPost({ ...newPost, publishAt: e.target.value })
                        }
                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary text-sm lg:text-base"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        If status is <span className="text-gray-200 font-bold">Published</span> and this is set in the future, the post will be scheduled.
                      </p>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newPost.tags}
                      onChange={(e) =>
                        setNewPost({ ...newPost, tags: e.target.value })
                      }
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary text-sm lg:text-base"
                      placeholder="afrobeats, music, culture"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                      Cover Image
                    </label>

                    {/* Upload Area */}
                    <div className="mb-4">
                      <label
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                          isDragging
                            ? "border-afro-primary bg-afro-primary/10"
                            : "border-gray-700 bg-gray-950 hover:bg-gray-900 hover:border-afro-primary"
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const file = e.dataTransfer.files[0];
                          if (file && file.type.startsWith("image/")) {
                            if (file.size > 10 * 1024 * 1024) {
                              showToast("error", "File size must be less than 10MB");
                              return;
                            }
                            handleImageUpload(file);
                          }
                        }}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadingImage ? (
                            <>
                              <div className="w-8 h-8 border-4 border-afro-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                              <p className="text-sm text-gray-400">
                                Uploading to Cloudinary...
                              </p>
                            </>
                          ) : (
                            <>
                              <ImageIcon
                                className="w-8 h-8 mb-2 text-gray-500"
                                size={32}
                              />
                              <p className="mb-2 text-sm text-gray-400">
                                <span className="font-semibold text-afro-primary">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 10 * 1024 * 1024) {
                                showToast("error", "File size must be less than 10MB");
                                return;
                              }
                              handleImageUpload(file);
                            }
                          }}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>

                    {/* Or use URL */}
                    <div className="relative">
                      <ImageIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                        size={18}
                      />
                      <input
                        type="url"
                        value={newPost.imageUrl}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-afro-primary text-sm lg:text-base"
                        placeholder="Or paste image URL here..."
                      />
                    </div>

                    {/* Preview */}
                    {(newPost.imageUrl || imagePreview) && (
                      <div className="mt-4 w-full h-48 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                        <img
                          src={imagePreview || newPost.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                      Summary Excerpt
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newPost.excerpt}
                      onChange={(e) =>
                        setNewPost({ ...newPost, excerpt: e.target.value })
                      }
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary resize-none text-sm lg:text-base"
                      placeholder="A brief hook for the article list view..."
                    ></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                      Story Content
                    </label>
                    <textarea
                      rows={10}
                      required
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary resize-none text-sm lg:text-base font-mono"
                      placeholder="Write your story here..."
                    ></textarea>
                  </div>
                </div>

                {/* SEO (optional) */}
                <div className="mt-2 bg-gray-950 border border-gray-800 rounded-2xl p-4 lg:p-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
                    SEO (optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={newPost.metaTitle}
                        onChange={(e) =>
                          setNewPost({ ...newPost, metaTitle: e.target.value })
                        }
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary text-sm"
                        placeholder="Optional SEO title (defaults to headline)"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                        Meta Description
                      </label>
                      <textarea
                        rows={3}
                        value={newPost.metaDescription}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            metaDescription: e.target.value,
                          })
                        }
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary resize-none text-sm"
                        placeholder="Optional SEO description (defaults to excerpt)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                        Canonical URL
                      </label>
                      <input
                        type="url"
                        value={newPost.canonicalUrl}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            canonicalUrl: e.target.value,
                          })
                        }
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                        OG Image URL
                      </label>
                      <input
                        type="url"
                        value={newPost.ogImageUrl}
                        onChange={(e) =>
                          setNewPost({ ...newPost, ogImageUrl: e.target.value })
                        }
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-afro-primary text-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditMode(false);
                      setEditingPost(null);
                      setImagePreview(null);
                    }}
                    className="flex-1 border border-gray-700 text-gray-400 hover:bg-gray-800 font-bold py-3 lg:py-4 rounded-xl transition-all text-sm lg:text-base"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-afro-primary text-black font-bold py-3 lg:py-4 rounded-xl hover:bg-white transition-all shadow-xl shadow-afro-primary/20 flex items-center justify-center gap-2 text-sm lg:text-base"
                  >
                    {isEditMode ? (
                      <>
                        <Save size={18} /> Update Story
                      </>
                    ) : (
                      <>
                        <Plus size={18} /> Save Story
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Revisions Modal */}
      {isRevisionsOpen && revisionsPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative my-4">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 lg:p-6 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl lg:text-2xl font-display font-bold text-white">
                    Revisions
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {revisionsPost.title}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsRevisionsOpen(false);
                    setRevisionsPost(null);
                    setRevisions([]);
                  }}
                  className="text-gray-500 hover:text-white transition-colors p-2 -mr-2"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-4 lg:p-6">
              {revisionsLoading ? (
                <div className="py-10 text-center text-gray-400">
                  Loading revisions...
                </div>
              ) : revisions.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No revisions yet. Updates will start creating revisions automatically.
                </div>
              ) : (
                <div className="space-y-3">
                  {revisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="text-white font-bold truncate">
                          {rev.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(rev.createdAt).toLocaleString()}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="text-xs font-bold text-gray-300 bg-gray-800 px-2 py-1 rounded uppercase tracking-wider">
                            {rev.status}
                          </span>
                          <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded uppercase tracking-wider">
                            {rev.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => restoreRevision(rev.id)}
                          className="px-3 py-2 rounded-lg bg-afro-primary text-black font-bold hover:bg-white transition-colors text-sm"
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
