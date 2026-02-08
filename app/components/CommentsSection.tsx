'use client'

import React, { useState, useEffect } from 'react';
import { Send, ThumbsUp } from 'lucide-react';
import { MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  likes: number;
  createdAt: Date;
}

interface CommentsSectionProps {
  postId: string;
  initialComments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, initialComments }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeType, setNoticeType] = useState<'success' | 'warning' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [likingCommentId, setLikingCommentId] = useState<string | null>(null);

  // Load liked comments from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('likedComments');
        if (stored) {
          const likedArray = JSON.parse(stored) as string[];
          setLikedComments(new Set(likedArray));
        }
      } catch (error) {
        console.error('Error loading liked comments from localStorage:', error);
      }
    }
  }, []);

  // Save liked comments to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && likedComments.size > 0) {
      try {
        localStorage.setItem('likedComments', JSON.stringify(Array.from(likedComments)));
      } catch (error) {
        console.error('Error saving liked comments to localStorage:', error);
      }
    }
  }, [likedComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim()) return;
    setNotice(null);
    setNoticeType('success');
    setSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          author: commentName,
          content: newComment,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setNotice(result.message || 'Thanks! Your comment was submitted.');
        setNoticeType(result?.pending ? 'warning' : 'success');
        if (!result?.pending && result?.comment) {
          setComments((prev) => [result.comment, ...prev]);
        }
        setNewComment('');
        // Keep name for convenience
      } else {
        const err = await response.json().catch(() => ({}));
        setNotice(err.error || 'Failed to submit comment. Please try again.');
        setNoticeType('error');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setNotice('Failed to submit comment. Please try again.');
      setNoticeType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    // Prevent duplicate likes
    if (likedComments.has(commentId) || likingCommentId === commentId) {
      return;
    }

    setLikingCommentId(commentId);

    // Optimistic update
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );

    // Add to liked comments set
    setLikedComments((prev) => new Set([...prev, commentId]));

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, likes: Math.max(0, comment.likes - 1) }
              : comment
          )
        );
        setLikedComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
        console.error('Failed to like comment');
      }
    } catch (error) {
      // Revert optimistic update on error
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: Math.max(0, comment.likes - 1) }
            : comment
        )
      );
      setLikedComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      console.error('Error liking comment:', error);
    } finally {
      setLikingCommentId(null);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  };

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare size={28} className="text-afro-primary" />
        <h3 className="text-2xl font-bold text-white">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-10">
        {notice && (
          <div
            className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium border ${
              noticeType === 'success'
                ? 'border-green-500/30 bg-green-500/10 text-green-200'
                : noticeType === 'warning'
                  ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-200'
                  : 'border-red-500/30 bg-red-500/10 text-red-200'
            }`}
          >
            {notice}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Display Name</label>
          <input 
            type="text" 
            value={commentName}
            onChange={(e) => setCommentName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary"
            placeholder="Enter your name"
            required
            disabled={submitting}
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Message</label>
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary resize-none"
            placeholder="Join the discussion..."
            required
            disabled={submitting}
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-afro-primary transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            <Send size={16} /> {submitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${comment.author}&background=random`} alt={comment.author} />
              </div>
              <div className="flex-grow">
                <div className="bg-gray-800/50 p-4 rounded-xl rounded-tl-none border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white text-sm">{comment.author}</h4>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                </div>
                <div className="flex gap-4 mt-2 ml-2">
                  <button
                    onClick={() => handleLike(comment.id)}
                    disabled={likedComments.has(comment.id) || likingCommentId === comment.id}
                    className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                      likedComments.has(comment.id)
                        ? 'text-afro-primary cursor-not-allowed'
                        : 'text-gray-500 hover:text-white cursor-pointer'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <ThumbsUp
                      size={12}
                      className={likedComments.has(comment.id) ? 'fill-current' : ''}
                    />
                    {likingCommentId === comment.id ? 'Liking...' : `Like (${comment.likes})`}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center italic">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;

