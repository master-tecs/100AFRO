'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/use-auth';
import Link from 'next/link';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Sparkles,
  Loader2,
  CheckSquare,
  Square,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Menu,
  X,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { BlogCategory } from '@prisma/client';

type ResearchTopicStatus = 'PENDING' | 'SELECTED' | 'REJECTED' | 'USED';

interface ResearchTopic {
  id: string;
  title: string;
  description: string;
  source: 'twitter' | 'rss' | 'google_news';
  sourceUrl?: string | null;
  category?: BlogCategory | null;
  relevanceScore: number;
  status: ResearchTopicStatus;
  discoveredAt: string;
  selectedAt?: string | null;
  usedAt?: string | null;
}

export default function TopicsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [topics, setTopics] = useState<ResearchTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ResearchTopicStatus | 'ALL'>('PENDING');
  const [categoryFilter, setCategoryFilter] = useState<BlogCategory | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [runningResearch, setRunningResearch] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchTopics();
    }
  }, [user, page, statusFilter, categoryFilter, searchQuery]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }
      if (categoryFilter !== 'ALL') {
        params.append('category', categoryFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/admin/topics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch topics');

      const data = await response.json();
      setTopics(data.topics || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setToast({ type: 'error', message: 'Failed to load topics' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = async (topicId: string) => {
    try {
      const response = await fetch(`/api/admin/topics/${topicId}/select`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to select topic');

      setToast({ type: 'success', message: 'Topic selected' });
      fetchTopics();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to select topic' });
    }
  };

  const handleRejectTopic = async (topicId: string) => {
    try {
      const response = await fetch(`/api/admin/topics/${topicId}/reject`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to reject topic');

      setToast({ type: 'success', message: 'Topic rejected' });
      fetchTopics();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to reject topic' });
    }
  };

  const handleBulkSelect = async () => {
    if (selectedTopics.size === 0) return;

    try {
      const response = await fetch('/api/admin/topics/bulk-select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicIds: Array.from(selectedTopics) }),
      });

      if (!response.ok) throw new Error('Failed to select topics');

      setToast({ type: 'success', message: `${selectedTopics.size} topics selected` });
      setSelectedTopics(new Set());
      fetchTopics();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to select topics' });
    }
  };

  const handleGenerateArticle = async (topicId: string) => {
    try {
      setGenerating(topicId);
      const response = await fetch('/api/admin/articles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to generate article');
      }

      const data = await response.json();
      setToast({ type: 'success', message: 'Article generated successfully!' });
      // Navigate to edit page where they can see and edit the draft
      router.push(`/admin/posts/${data.article.id}/edit`);
    } catch (error) {
      setToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to generate article',
      });
    } finally {
      setGenerating(null);
    }
  };

  const handleRunResearch = async () => {
    try {
      setRunningResearch(true);
      const response = await fetch('/api/admin/research/run', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to run research');

      const data = await response.json();
      setToast({
        type: 'success',
        message: `Research completed! Found ${data.topicsFound} topics`,
      });
      fetchTopics();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to run research' });
    } finally {
      setRunningResearch(false);
    }
  };

  const toggleTopicSelection = (topicId: string) => {
    const newSelected = new Set(selectedTopics);
    if (newSelected.has(topicId)) {
      newSelected.delete(topicId);
    } else {
      newSelected.add(topicId);
    }
    setSelectedTopics(newSelected);
  };

  const getStatusIcon = (status: ResearchTopicStatus) => {
    switch (status) {
      case 'SELECTED':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'USED':
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'twitter':
        return 'Twitter';
      case 'rss':
        return 'RSS';
      case 'google_news':
        return 'Google News';
      default:
        return source;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'twitter':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'rss':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'google_news':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category?: BlogCategory | null) => {
    switch (category) {
      case 'Music':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Culture':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'Lifestyle':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'News':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Industry':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-afro-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100]">
          <div
            className={`px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-sm ${
              toast.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-200'
                : 'bg-red-500/10 border-red-500/30 text-red-200'
            }`}
          >
            <div className="text-sm font-bold">{toast.message}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-white flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-afro-primary" />
                  Research Topics
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Discover and select trending topics for article generation
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRunResearch}
                disabled={runningResearch}
                className="flex items-center gap-2 px-4 py-2 bg-afro-primary hover:bg-afro-primary/90 disabled:bg-gray-800 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors"
              >
                {runningResearch ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Run Research
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-afro-primary focus:border-transparent transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ResearchTopicStatus | 'ALL');
                setPage(1);
              }}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-afro-primary focus:border-transparent transition-all"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
              <option value="USED">Used</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as BlogCategory | 'ALL');
                setPage(1);
              }}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-afro-primary focus:border-transparent transition-all"
            >
              <option value="ALL">All Categories</option>
              <option value="Music">Music</option>
              <option value="Culture">Culture</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="News">News</option>
              <option value="Industry">Industry</option>
            </select>
            {selectedTopics.size > 0 && (
              <button
                onClick={handleBulkSelect}
                className="px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/20 font-semibold transition-colors"
              >
                Select {selectedTopics.size} Topics
              </button>
            )}
          </div>
        </div>

        {/* Topics List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-afro-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="text-gray-400 font-medium">Loading topics...</div>
            </div>
          </div>
        ) : topics.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 lg:p-16 text-center">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No topics found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Run research to discover trending topics'}
            </p>
            {!searchQuery && statusFilter === 'ALL' && categoryFilter === 'ALL' && (
              <button
                onClick={handleRunResearch}
                className="px-6 py-3 bg-afro-primary hover:bg-afro-primary/90 text-black font-semibold rounded-xl transition-colors"
              >
                Run Research Now
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {statusFilter === 'PENDING' && (
                      <button
                        onClick={() => toggleTopicSelection(topic.id)}
                        className="mt-1 hover:opacity-80 transition-opacity"
                      >
                        {selectedTopics.has(topic.id) ? (
                          <CheckSquare className="w-5 h-5 text-afro-primary" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {getStatusIcon(topic.status)}
                          <h3 className="text-lg lg:text-xl font-bold text-white truncate">
                            {topic.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-lg border ${getSourceColor(
                              topic.source
                            )}`}
                          >
                            {getSourceLabel(topic.source)}
                          </span>
                          {topic.category && (
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-lg border ${getCategoryColor(
                                topic.category
                              )}`}
                            >
                              {topic.category}
                            </span>
                          )}
                          <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
                            {Math.round(topic.relevanceScore * 100)}% relevant
                          </span>
                        </div>
                        <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
                          {topic.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(topic.discoveredAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          {topic.sourceUrl && (
                            <a
                              href={topic.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-afro-primary hover:text-afro-primary/80 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Source
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex flex-col gap-2">
                        {topic.status === 'SELECTED' && (
                          <button
                            onClick={() => handleGenerateArticle(topic.id)}
                            disabled={generating === topic.id}
                            className="flex items-center gap-2 px-4 py-2 bg-afro-primary hover:bg-afro-primary/90 disabled:bg-gray-800 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors whitespace-nowrap"
                          >
                            {generating === topic.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" />
                                Generate Article
                              </>
                            )}
                          </button>
                        )}
                        {topic.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleSelectTopic(topic.id)}
                              className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/20 font-semibold transition-colors"
                            >
                              Select
                            </button>
                            {user?.role === 'ADMIN' && (
                              <button
                                onClick={() => handleRejectTopic(topic.id)}
                                className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 font-semibold transition-colors"
                              >
                                Reject
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              Previous
            </button>
            <span className="px-6 py-2 bg-gray-900 border border-gray-800 text-gray-300 rounded-xl font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
