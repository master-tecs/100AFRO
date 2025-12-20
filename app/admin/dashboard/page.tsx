"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
  Calendar,
  Save,
} from "lucide-react";
import { BlogCategory } from "@prisma/client";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  featured: boolean;
  imageUrl: string;
  author: {
    name: string | null;
  };
  createdAt: Date;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"posts" | "stats" | "videos">(
    "posts"
  );
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // New Post Form State
  const [newPost, setNewPost] = useState({
    title: "",
    category: "Music" as BlogCategory,
    excerpt: "",
    content: "",
    imageUrl: "https://picsum.photos/seed/new/800/600",
    featured: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (
      status === "authenticated" &&
      (session?.user as any)?.role !== "ADMIN"
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      (session?.user as any)?.role === "ADMIN"
    ) {
      fetchPosts();
    }
  }, [status, session]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/blog");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
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
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const post = await response.json();
        if (isEditMode) {
          setPosts(posts.map((p) => (p.id === editingPost!.id ? post : p)));
        } else {
          setPosts([post, ...posts]);
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
        });
      } else {
        const error = await response.json();
        alert(
          error.error || `Failed to ${isEditMode ? "update" : "create"} post`
        );
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} post:`,
        error
      );
      alert(`Failed to ${isEditMode ? "update" : "create"} post`);
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
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const deletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
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
        alert(error.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
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

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-afro-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white font-medium">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    (session?.user as any)?.role !== "ADMIN"
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex font-sans">
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
        w-64 bg-gray-900 border-r border-gray-800 
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
          <div className="h-px bg-gray-800 my-4 mx-2"></div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="mb-3 px-4 py-2 text-xs text-gray-500">
            <p className="font-bold">{session?.user?.name || "Admin"}</p>
            <p className="text-gray-600">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} /> Exit CMS
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow lg:ml-64 min-h-screen">
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
                      {filteredPosts.map((post) => (
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
                          <td className="px-6 py-4 text-sm text-gray-300 font-medium">
                            {post.author.name || "Admin"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                            {formatDate(post.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
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

                {filteredPosts.length === 0 && !loading && (
                  <div className="py-20 text-center">
                    <p className="text-gray-500 font-medium">
                      No matches found for your search.
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredPosts.map((post) => (
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

                {filteredPosts.length === 0 && !loading && (
                  <div className="py-12 text-center bg-gray-900 border border-gray-800 rounded-xl">
                    <p className="text-gray-500 font-medium">
                      No matches found for your search.
                    </p>
                  </div>
                )}
              </div>
            </>
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
                        className="w-4 h-4 rounded border-gray-700 bg-gray-950 text-afro-primary focus:ring-afro-primary"
                      />
                      Featured Post
                    </label>
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
                              alert("File size must be less than 10MB");
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
                                alert("File size must be less than 10MB");
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
                        <Plus size={18} /> Publish Story
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
