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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim()) return;

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
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment('');
        // Keep name for convenience
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
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
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Display Name</label>
          <input 
            type="text" 
            value={commentName}
            onChange={(e) => setCommentName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary"
            placeholder="Enter your name"
            required
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
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-afro-primary transition-colors flex items-center gap-2">
            <Send size={16} /> Post Comment
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
                  <button className="text-xs text-gray-500 font-bold hover:text-white flex items-center gap-1">
                    <ThumbsUp size={12} /> Like ({comment.likes})
                  </button>
                  <button className="text-xs text-gray-500 font-bold hover:text-white">Reply</button>
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

