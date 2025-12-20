import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS, COMMENTS } from '../data';
import { 
  ArrowLeft, Calendar, User, Tag, 
  Facebook, Twitter, Linkedin, Link as LinkIcon, 
  Clock, Share2, Send, ThumbsUp, MessageSquare, Heart, Check
} from 'lucide-react';
import BlogPostCard from '../components/BlogPostCard';
import { Comment } from '../types';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const relatedPosts = BLOG_POSTS.filter(p => p.category === post?.category && p.id !== post?.id).slice(0, 3);
  const trendingPosts = BLOG_POSTS.slice(0, 4);

  // Interaction State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [likes, setLikes] = useState(124); // Simulated initial likes
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Reading Progress Bar Logic
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Comments
  useEffect(() => {
    if (post) {
      const postComments = COMMENTS.filter(c => c.postId === post.id);
      setComments(postComments);
    }
  }, [post]);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim()) return;

    const newCommentObj: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      postId: post?.id || '',
      author: commentName,
      content: newComment,
      date: 'Just now',
      likes: 0
    };

    setComments(prev => [newCommentObj, ...prev]);
    setNewComment('');
    // setCommentName(''); // Keep name for convenience
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
    if (!post) return;
    
    const currentUrl = window.location.href;
    const shareTitle = post.title;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(currentUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Post not found</h2>
            <Link to="/blog" className="text-afro-primary hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      
      {/* Reading Progress Bar */}
      <div className="fixed top-20 left-0 w-full h-1.5 bg-gray-800 z-40">
        <div 
          className="h-full bg-afro-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
        <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 sm:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-4xl">
                    <Link to="/blog" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors font-bold text-sm tracking-wide">
                        <ArrowLeft size={16} className="mr-2" /> BACK TO BLOG
                    </Link>
                    
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-afro-primary text-black text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                            {post.category}
                        </span>
                        <span className="text-gray-300 text-sm flex items-center gap-1 font-medium">
                            <Clock size={14} /> 5 MIN READ
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-6 text-sm text-gray-300 border-l-2 border-afro-primary pl-4">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                 <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} alt={post.author} />
                             </div>
                             <div>
                                 <p className="text-white font-bold">{post.author}</p>
                                 <p className="text-xs text-gray-400">Senior Editor</p>
                             </div>
                        </div>
                        <div className="h-8 w-px bg-gray-600"></div>
                        <span className="flex items-center gap-2"><Calendar size={16}/> {post.date}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Sidebar (Share) - Sticky Desktop */}
            <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-28 flex flex-col gap-4 items-center">
                    <span className="text-gray-500 text-xs font-bold uppercase rotate-180 mb-2 writing-mode-vertical">Share</span>
                    <button 
                        onClick={() => handleShare('facebook')}
                        className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-[#1877F2] hover:text-white transition-colors shadow-lg group relative"
                        title="Share on Facebook"
                    >
                        <Facebook size={20} />
                    </button>
                    <button 
                        onClick={() => handleShare('twitter')}
                        className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-[#1DA1F2] hover:text-white transition-colors shadow-lg group relative"
                        title="Share on Twitter"
                    >
                        <Twitter size={20} />
                    </button>
                    <button 
                        onClick={() => handleShare('linkedin')}
                        className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-[#0A66C2] hover:text-white transition-colors shadow-lg group relative"
                        title="Share on LinkedIn"
                    >
                        <Linkedin size={20} />
                    </button>
                    <button 
                        onClick={() => handleShare('copy')}
                        className={`p-3 rounded-full transition-colors shadow-lg group relative ${isCopied ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-afro-primary hover:text-black'}`}
                        title="Copy Link"
                    >
                        {isCopied ? <Check size={20} /> : <LinkIcon size={20} />}
                    </button>
                    
                    <div className="h-px w-8 bg-gray-700 my-2"></div>
                    
                    <button 
                        onClick={handleLike}
                        className={`p-3 rounded-full transition-all shadow-lg flex flex-col items-center gap-1 ${hasLiked ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-red-500'}`}
                        title="Like this post"
                    >
                        <Heart size={20} fill={hasLiked ? "currentColor" : "none"} />
                    </button>
                    <span className="text-xs font-bold text-gray-400">{likes}</span>
                </div>
            </div>

            {/* Main Content */}
            <article className="lg:col-span-7">
                {/* Mobile Share Bar */}
                <div className="lg:hidden flex flex-wrap justify-between items-center mb-8 gap-4">
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <button onClick={() => handleShare('facebook')} className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
                            <Facebook size={16} /> Share
                        </button>
                        <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
                            <Twitter size={16} /> Tweet
                        </button>
                         <button onClick={() => handleShare('copy')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors ${isCopied ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                            {isCopied ? <Check size={16} /> : <LinkIcon size={16} />} {isCopied ? 'Copied' : 'Link'}
                        </button>
                    </div>
                    <button 
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors ${hasLiked ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                    >
                        <Heart size={16} fill={hasLiked ? "currentColor" : "none"} /> {likes}
                    </button>
                </div>

                <div className="prose prose-lg prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-afro-primary prose-img:rounded-2xl prose-blockquote:border-afro-primary prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic">
                    <p className="lead text-2xl text-gray-200 font-serif leading-relaxed mb-8">
                        {post.excerpt}
                    </p>
                    
                    {/* Simulated Content */}
                    <p>{post.content}</p>
                    <p>
                        Africa's influence on global pop culture is undeniable. From the rhythmic beats of Afrobeats dominating charts in the UK and US to the vibrant fashion statements seen on runways in Paris and Milan, the continent is roaring. This isn't just a trend; it's a cultural shift.
                    </p>
                    
                    <figure>
                        <img src={`https://picsum.photos/seed/${post.slug}1/800/400`} alt="Concert Crowd" className="w-full" />
                        <figcaption className="text-center text-gray-500 text-sm mt-2">The energy at the latest Lagos concert was unmatched.</figcaption>
                    </figure>

                    <h2>The Cultural Impact</h2>
                    <p>
                        Music acts like Burna Boy, Wizkid, and Davido have paved the way, but the movement is larger than just a few names. It includes dancers, visual artists, and storytellers who are reshaping the narrative of what it means to be African in the 21st century.
                    </p>
                    
                    <blockquote>
                        <p className="text-xl font-medium text-white">"We are not just making music; we are documenting our history and exporting our joy."</p>
                        <cite className="block mt-2 text-sm text-afro-primary not-italic font-bold">— Industry Insider</cite>
                    </blockquote>

                    <h3>Looking Forward</h3>
                    <p>
                        As we move into the next year, expect more collaborations, more festivals, and a deeper integration of traditional sounds with modern production. The world is listening, and Africa has a lot more to say.
                    </p>

                    <div className="bg-gray-800 p-6 rounded-xl border-l-4 border-afro-primary my-8">
                        <h4 className="text-white font-bold text-lg mb-2 mt-0">Key Takeaways</h4>
                        <ul className="mb-0 text-gray-300">
                            <li>Afrobeats is now a global mainstream genre.</li>
                            <li>Fashion and dance are integral parts of the movement.</li>
                            <li>Digital platforms are democratizing access for new artists.</li>
                        </ul>
                    </div>
                </div>

                {/* Hype/Like Section (Bottom) */}
                <div className="my-12 py-8 border-y border-gray-800 flex flex-col items-center">
                    <p className="text-gray-400 mb-4 font-bold uppercase tracking-widest text-sm">Did you enjoy this article?</p>
                    <button 
                        onClick={handleLike}
                        className={`group relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${hasLiked ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] scale-110' : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                         <Heart 
                            size={32} 
                            className={`transition-all duration-300 ${hasLiked ? 'text-white fill-current scale-110' : 'text-gray-400 group-hover:text-red-500'}`} 
                         />
                         {hasLiked && (
                             <span className="absolute -top-8 text-red-500 font-bold animate-bounce">+1</span>
                         )}
                    </button>
                    <span className="mt-4 text-white font-bold text-lg">{likes} Hypes</span>
                </div>

                {/* Tags */}
                <div className="mb-12">
                    <h4 className="text-sm font-bold uppercase text-gray-500 mb-4">Related Topics</h4>
                    <div className="flex flex-wrap gap-2">
                        {['Afrobeats', 'Culture', 'Music', 'Trending', 'Africa', 'Entertainment'].map(tag => (
                            <Link key={tag} to={`/search?q=${tag}`} className="text-sm bg-gray-800 text-gray-300 px-4 py-2 rounded-full hover:bg-afro-primary hover:text-black transition-colors font-medium">
                                #{tag}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Author Box */}
                <div className="mb-16 bg-gray-800 rounded-2xl p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left border border-gray-700">
                    <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden flex-shrink-0 border-2 border-afro-primary">
                        <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} alt={post.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">About {post.author}</h3>
                        <p className="text-gray-400 text-sm mt-2 mb-4">
                            Senior Editor at 100AFRO. Passionate about African music, culture, and digital storytelling. Covering the pulse of the continent one story at a time.
                        </p>
                        <div className="flex justify-center sm:justify-start gap-4">
                            <button className="text-gray-400 hover:text-afro-primary"><Twitter size={18} /></button>
                            <button className="text-gray-400 hover:text-afro-primary"><Linkedin size={18} /></button>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
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
                                                <span className="text-xs text-gray-500">{comment.date}</span>
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

            </article>

            {/* Right Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
                
                {/* Newsletter Widget */}
                <div className="bg-afro-primary text-black p-8 rounded-2xl text-center">
                    <h3 className="font-display font-bold text-2xl mb-2">Don't Miss a Beat</h3>
                    <p className="text-sm font-medium mb-6 opacity-80">Get the latest African entertainment news delivered straight to your inbox.</p>
                    <input type="email" placeholder="Your email address" className="w-full px-4 py-3 rounded-lg mb-3 bg-white/90 border-0 placeholder-gray-500 focus:ring-2 focus:ring-black" />
                    <button className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors uppercase text-sm tracking-wide">
                        Subscribe Now
                    </button>
                </div>

                {/* Trending Posts Widget */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                        <h3 className="font-bold text-white uppercase tracking-wider text-sm">Trending Now</h3>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {trendingPosts.map((p, idx) => (
                            <Link key={p.id} to={`/blog/${p.slug}`} className="flex gap-4 p-4 hover:bg-gray-700/50 transition-colors group">
                                <span className="text-2xl font-display font-bold text-gray-600 group-hover:text-afro-primary">0{idx + 1}</span>
                                <div>
                                    <h4 className="text-white font-bold text-sm leading-snug group-hover:underline decoration-afro-primary underline-offset-2">{p.title}</h4>
                                    <span className="text-xs text-gray-500 mt-1 block">{p.category}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Ad Placeholder */}
                <div className="bg-gray-800 rounded-2xl h-64 flex items-center justify-center border border-gray-700 border-dashed">
                    <span className="text-gray-600 font-bold uppercase tracking-widest text-xs">Advertisement</span>
                </div>

            </aside>
        </div>

        {/* Read Next Section */}
        <section className="mt-24 pt-12 border-t border-gray-800">
             <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">More from {post.category}</h2>
                <Link to="/blog" className="text-afro-primary text-sm font-bold hover:underline">View All</Link>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {relatedPosts.length > 0 ? (
                     relatedPosts.map(p => (
                         <BlogPostCard key={p.id} post={p} />
                     ))
                 ) : (
                     <p className="text-gray-500">No related posts found.</p>
                 )}
             </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetail;