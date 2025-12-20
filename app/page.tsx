import React from 'react';
import Link from 'next/link';
import { ArrowRight, PlayCircle, Clock, TrendingUp, BarChart3, Star, Hash, Calendar } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import BlogPostCard from './components/BlogPostCard';
import VideoCard from './components/VideoCard';

async function getHomeData() {
  // Initialize with empty data
  let featuredPost = null;
  let subFeaturedPosts: any[] = [];
  let industryPosts: any[] = [];
  let latestVideos: any[] = [];
  let trendingPosts: any[] = [];
  let featuredArtists: any[] = [];
  let trendingTopics: any[] = [];
  let currentPoll = null;

  // Try to fetch data if DATABASE_URL and prisma are available
  try {
    if (process.env.DATABASE_URL && prisma !== null) {
      const prismaClient = prisma; // Type guard
      const [fetchedFeaturedPost, fetchedSubFeaturedPosts, fetchedIndustryPosts, fetchedLatestVideos, fetchedTrendingPosts, fetchedFeaturedArtists, fetchedTrendingTopics, fetchedCurrentPoll] = await Promise.all([
        prismaClient.blogPost.findFirst({
          where: { featured: true },
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        }),
        prismaClient.blogPost.findMany({
          where: { featured: false },
          include: { author: { select: { name: true } } },
          take: 2,
          orderBy: { createdAt: 'desc' },
        }),
        prismaClient.blogPost.findMany({
          where: { category: 'Industry' },
          include: { author: { select: { name: true } } },
          take: 3,
          orderBy: { createdAt: 'desc' },
        }),
        prismaClient.video.findMany({
          take: 4,
          orderBy: { createdAt: 'desc' },
        }),
        prismaClient.blogPost.findMany({
          take: 4,
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        }),
        prismaClient.artist.findMany({
          take: 6,
        }),
        prismaClient.trendingTopic.findMany({
          take: 5,
        }),
        prismaClient.poll.findFirst({
          where: { active: true },
        }),
      ]);

      featuredPost = fetchedFeaturedPost;
      subFeaturedPosts = fetchedSubFeaturedPosts;
      industryPosts = fetchedIndustryPosts;
      latestVideos = fetchedLatestVideos;
      trendingPosts = fetchedTrendingPosts;
      featuredArtists = fetchedFeaturedArtists;
      trendingTopics = fetchedTrendingTopics;
      currentPoll = fetchedCurrentPoll;
    }
  } catch (error) {
    console.error('Error fetching home data:', error);
    // Continue with empty data
  }

  // Get featured video
  let featuredVideo = null;
  if (latestVideos.length > 0) {
    if (prisma !== null) {
      try {
        featuredVideo = await prisma.video.findFirst({
          where: { featured: true },
        }) || latestVideos[0];
      } catch (error) {
        console.error('Error fetching featured video:', error);
        featuredVideo = latestVideos[0];
      }
    } else {
      featuredVideo = latestVideos[0];
    }
  }

  return {
    featuredPost: featuredPost || (subFeaturedPosts.length > 0 ? subFeaturedPosts[0] : null),
    subFeaturedPosts: subFeaturedPosts.slice(0, 2),
    industryPosts,
    latestVideos,
    trendingPosts,
    featuredVideo,
    featuredArtists,
    trendingTopics,
    currentPoll,
  };
}

export default async function Home() {
  const data = await getHomeData();
  const featuredPost = data.featuredPost;
  const subFeaturedPosts = data.subFeaturedPosts;
  const industryPosts = data.industryPosts;
  const latestVideos = data.latestVideos;
  const trendingPosts = data.trendingPosts;
  const featuredVideo = data.featuredVideo;
  const featuredArtists = data.featuredArtists;
  const trendingTopics = data.trendingTopics;
  const currentPoll = data.currentPoll;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      
      {/* Magazine Hero Section */}
      <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
          
          {/* Main Featured Article (Left - 8 columns) */}
          {featuredPost && (
            <div className="lg:col-span-8 h-[500px] lg:h-auto relative rounded-2xl overflow-hidden group border border-gray-800">
              <Link href={`/blog/${featuredPost.slug}`} className="block h-full w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent z-10"></div>
                <img 
                  src={featuredPost.imageUrl} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute bottom-0 left-0 p-6 md:p-10 z-20 w-full md:w-4/5">
                  <span className="inline-block px-3 py-1 bg-afro-primary text-black text-xs font-bold uppercase tracking-wider rounded-sm mb-3">
                    Cover Story
                  </span>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight group-hover:text-afro-primary transition-colors drop-shadow-lg">
                    {featuredPost.title}
                  </h1>
                  <p className="text-gray-200 text-lg line-clamp-2 mb-4 hidden md:block drop-shadow-md">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-300 font-medium gap-4">
                    <span>{featuredPost.author.name || 'Author'}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {formatDate(featuredPost.createdAt)}</span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Sub Featured (Right - 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-auto">
            {subFeaturedPosts.map((post) => (
              <div key={post.id} className="flex-1 relative rounded-2xl overflow-hidden group min-h-[250px] border border-gray-800">
                 <Link href={`/blog/${post.slug}`} className="block h-full w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10"></div>
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute bottom-0 left-0 p-6 z-20">
                    <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block rounded">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight group-hover:underline decoration-2 decoration-afro-primary underline-offset-4 drop-shadow-lg">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Bar */}
      <div className="border-y border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-6 overflow-hidden whitespace-nowrap">
           <span className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs tracking-widest shrink-0 animate-pulse">
             <TrendingUp size={16} /> Breaking News
           </span>
           <div className="flex gap-12 text-sm text-gray-400 font-medium animate-marquee">
             {trendingPosts.map(p => (
               <Link key={p.id} href={`/blog/${p.slug}`} className="hover:text-white transition-colors flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span> {p.title}
               </Link>
             ))}
           </div>
        </div>
      </div>

       {/* Industry & Business Section */}
       {industryPosts.length > 0 && (
         <section className="py-20 bg-gray-900 border-b border-gray-800">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-900/20 text-blue-500 rounded-lg">
                  <BarChart3 size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-display font-bold text-white">Business of Entertainment</h2>
                   <p className="text-sm text-gray-400">Analysis, numbers, and deals shaping the industry.</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {industryPosts.map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <div className="h-48 rounded-xl overflow-hidden mb-4 relative">
                       <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                       <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Analysis</div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-snug">{post.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>
                  </Link>
                ))}
             </div>
           </div>
         </section>
       )}

      {/* Latest Videos Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Latest Visuals</h2>
          </div>
          <Link href="/videos" className="text-afro-primary hover:text-white transition-colors flex items-center font-bold text-sm uppercase tracking-wide">
            View Gallery <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      {/* Trending Topics of the Month */}
      {trendingTopics.length > 0 && (
        <section className="py-20 bg-gray-950 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-10">
                  <div className="p-2 bg-pink-900/20 text-pink-500 rounded-lg">
                    <Hash size={24} />
                  </div>
                  <div>
                     <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Trending Topics of the Month</h2>
                     <p className="text-sm text-gray-400">What the culture is talking about right now.</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {trendingTopics.map((topic) => (
                      <Link key={topic.id} href={`/search?q=${encodeURIComponent(topic.name)}`} className="group relative h-40 rounded-xl overflow-hidden border border-gray-800">
                          <img src={topic.imageUrl} alt={topic.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-80" />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-4">
                              <h3 className="text-white font-bold text-lg leading-none mb-1">#{topic.name}</h3>
                              <p className="text-xs text-afro-primary font-bold uppercase tracking-wider">{topic.count}</p>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
        </section>
      )}

      {/* Featured Video Large Section */}
      {featuredVideo && (
        <section className="py-24 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-afro-primary/5 radial-gradient"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <span className="inline-block bg-red-600 text-white px-3 py-1 font-bold uppercase tracking-widest text-xs mb-6 rounded-sm">Video of the Week</span>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-none">
                  {featuredVideo.title}
                </h2>
                <p className="text-gray-400 text-xl mb-8 leading-relaxed">
                  Experience the energy and creativity of the latest viral sensation taking over the internet. Watch the full performance now exclusively on 100AFRO.
                </p>
                <Link href="/videos" className="inline-flex items-center gap-3 bg-white text-black hover:bg-afro-primary font-bold py-4 px-10 rounded-full transition-colors text-lg shadow-xl shadow-white/5">
                  <PlayCircle size={24} /> Watch Now
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                 <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800 rotate-1 group hover:rotate-0 transition-all duration-500 scale-105">
                    <VideoCard video={featuredVideo} />
                 </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Artists Section */}
      {featuredArtists.length > 0 && (
        <section className="py-20 bg-gray-950 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-afro-primary mb-2">
                 <Star size={16} fill="currentColor" />
                 <span className="font-bold uppercase tracking-widest text-xs">The Stars</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Featured Artists</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {featuredArtists.map((artist) => (
                <a key={artist.id} href={artist.socialLink || '#'} target="_blank" rel="noreferrer" className="group flex flex-col items-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 border-2 border-gray-700 group-hover:border-afro-primary transition-colors duration-300 mb-4 relative">
                     <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <h3 className="text-white font-bold text-lg group-hover:text-afro-primary transition-colors text-center">{artist.name}</h3>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{artist.genre}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Editor's Picks / Blog Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-900 border-b border-gray-800">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-afro-primary font-bold uppercase tracking-widest text-xs mb-2 block">Curated For You</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Editor&apos;s Picks</h2>
          </div>
          <Link href="/blog" className="hidden md:flex text-gray-400 hover:text-white transition-colors items-center font-bold text-sm uppercase tracking-wide">
            Read All Articles <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingPosts.map(post => (
             <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
         <div className="mt-12 text-center md:hidden">
            <Link href="/blog" className="inline-block border border-gray-600 text-white px-8 py-3 rounded-full font-bold uppercase text-sm">
                View All Posts
            </Link>
        </div>
      </section>

      {/* Community Pulse: Poll & History */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Poll of the Week */}
                {currentPoll && (
                  <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
                      <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-afro-primary/20 text-afro-primary rounded-lg"><BarChart3 size={24} /></div>
                          <h3 className="text-2xl font-bold font-display text-white">Poll of the Week</h3>
                      </div>
                      
                      <h4 className="text-xl font-bold text-white mb-6">{currentPoll.question}</h4>
                      
                      <p className="text-gray-400 text-sm">Vote on the blog page</p>
                  </div>
                )}

                {/* On This Day in History */}
                <div className="bg-gray-950 rounded-2xl p-8 border border-gray-800 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Calendar size={120} className="text-white" />
                    </div>
                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-purple-900/30 text-purple-400 text-xs font-bold uppercase tracking-widest rounded-sm mb-4">
                            On This Day in History
                        </span>
                        <div className="text-6xl font-display font-bold text-white mb-4 opacity-20">2012</div>
                        <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                            &quot;Oliver Twist by D&apos;banj enters the UK Top 10 Charts, marking a pivotal moment for Afrobeats global crossover.&quot;
                        </p>
                        <div className="mt-8 pt-6 border-t border-gray-800 flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-wider">
                            <Clock size={16} /> Daily Fact
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 relative overflow-hidden border-t border-gray-800">
        <div className="absolute inset-0 bg-gray-950"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tighter">
            JOIN THE INNER CIRCLE
          </h2>
          <p className="text-gray-400 text-xl mb-10 font-medium max-w-2xl mx-auto">
            Get exclusive access to behind-the-scenes content, industry analysis, and the hottest playlists delivered to your inbox weekly.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto" action="/api/newsletter" method="POST">
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="px-6 py-4 rounded-full border border-gray-700 bg-gray-900 focus:ring-2 focus:ring-afro-primary focus:border-transparent text-white w-full font-medium placeholder-gray-500 shadow-xl"
              required
            />
            <button type="submit" className="bg-afro-primary text-black font-bold py-4 px-10 rounded-full hover:bg-white transition-colors shadow-xl whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-gray-600 text-xs mt-6 font-bold uppercase tracking-widest">Join 500,000+ Subscribers</p>
        </div>
      </section>
    </div>
  );
}

