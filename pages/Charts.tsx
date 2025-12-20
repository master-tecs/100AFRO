import React, { useState, useEffect, useRef } from 'react';
import { CHART_DATA } from '../data';
import { ChartEntry } from '../types';
import { Play, TrendingUp, TrendingDown, Minus, Calendar, Share2, Disc, Pause, MoreHorizontal, Music, X, Check } from 'lucide-react';

// Simple Icons for DSPs
const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#1DB954]">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#FA243C]">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 17.765a.853.853 0 110-1.706.853.853 0 010 1.706zm4.853-4.647h-1.637l-1.069-2.225-2.078 2.225h-1.618l2.912-3.049-2.843-2.922h1.637l1.049 2.157 2.059-2.157h1.618l-2.882 2.97 2.853 3zm-4.853 2.941a.853.853 0 110-1.706.853.853 0 010 1.706z"/>
  </svg>
);

const Charts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'songs' | 'albums'>('songs');
  const [playingRank, setPlayingRank] = useState<number | null>(null);
  const [openDropdownRank, setOpenDropdownRank] = useState<number | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle Play/Pause
  const togglePlay = (url: string | undefined, rank: number) => {
    if (!url) return;

    if (playingRank === rank) {
      audioRef.current?.pause();
      setPlayingRank(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setPlayingRank(rank);
      
      audioRef.current.onended = () => {
        setPlayingRank(null);
      };
    }
  };

  const toggleDropdown = (rank: number) => {
    setOpenDropdownRank(openDropdownRank === rank ? null : rank);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const data = CHART_DATA[activeTab];
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const getTrendIcon = (trend: ChartEntry['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} className="text-green-500" />;
      case 'down': return <TrendingDown size={16} className="text-red-500" />;
      case 'same': return <Minus size={16} className="text-gray-500" />;
      case 'new': return <div className="bg-afro-primary text-black text-[10px] font-bold px-1 rounded uppercase">New</div>;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen pt-20 pb-24 text-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-gray-950 to-gray-900 pb-12 border-b border-gray-800">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-afro-primary font-bold tracking-widest text-xs uppercase">The Industry Standard</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-2">
                        Official Charts
                    </h1>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-2"><Calendar size={16} /> Week of {currentDate}</span>
                        <span>•</span>
                        <span>Updated Weekly</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleShare}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-all text-sm font-bold ${isCopied ? 'bg-green-600 border-green-600 text-white' : 'border-gray-700 hover:bg-gray-800 text-white'}`}
                    >
                        {isCopied ? <Check size={16} /> : <Share2 size={16} />} 
                        {isCopied ? 'Copied' : 'Share Chart'}
                    </button>
                </div>
             </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            <button 
                onClick={() => { setActiveTab('songs'); setPlayingRank(null); audioRef.current?.pause(); }}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center gap-2 whitespace-nowrap ${activeTab === 'songs' ? 'bg-afro-primary text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
                <Music size={20} /> Top 50 Songs
            </button>
            <button 
                onClick={() => { setActiveTab('albums'); setPlayingRank(null); audioRef.current?.pause(); }}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center gap-2 whitespace-nowrap ${activeTab === 'albums' ? 'bg-afro-primary text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
                <Disc size={20} /> Top 20 Albums
            </button>
        </div>

        {/* Chart Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest px-6 pb-4 border-b border-gray-800">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-2 text-center">Trend</div>
            <div className="col-span-1 text-center">Peak</div>
            <div className="col-span-1 text-center">Weeks</div>
            <div className="col-span-1"></div>
        </div>

        {/* Chart List */}
        <div className="space-y-4 md:space-y-0">
            {data.map((item) => {
                const isPlaying = playingRank === item.rank;
                const isDropdownOpen = openDropdownRank === item.rank;

                return (
                <div key={item.rank} className={`group md:grid md:grid-cols-12 md:gap-4 items-center rounded-xl md:rounded-none md:border-b border-gray-800 p-4 md:px-6 md:py-4 transition-all duration-200 relative overflow-visible ${isPlaying ? 'bg-gray-800 ring-1 ring-afro-primary' : 'bg-gray-800/30 hover:bg-gray-800'}`}>
                    
                    {/* Rank Number (Mobile & Desktop) */}
                    <div className="col-span-1 flex items-center justify-between md:justify-center gap-4 mb-4 md:mb-0">
                        <span className={`text-2xl font-display font-bold ${item.rank === 1 ? 'text-afro-primary text-4xl' : 'text-white'}`}>
                            {item.rank}
                        </span>
                        <div className="md:hidden">
                             {getTrendIcon(item.trend)}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="col-span-6 flex items-center gap-4">
                        <div className="relative w-16 h-16 md:w-14 md:h-14 flex-shrink-0 shadow-lg rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
                            <img src={item.coverUrl} alt={item.title} className={`w-full h-full object-cover transition-opacity ${isPlaying ? 'opacity-50' : ''}`} />
                            
                            {/* Play Button Overlay */}
                            {activeTab === 'songs' && item.previewUrl && (
                                <button 
                                    onClick={() => togglePlay(item.previewUrl, item.rank)}
                                    className={`absolute inset-0 flex items-center justify-center bg-black/40 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                                >
                                    {isPlaying ? (
                                        <Pause size={24} className="text-afro-primary fill-current" />
                                    ) : (
                                        <Play size={24} className="text-white fill-white" />
                                    )}
                                </button>
                            )}
                            
                            {/* Visual Equalizer if playing */}
                            {isPlaying && (
                                <div className="absolute bottom-1 right-1 flex items-end gap-0.5 h-3">
                                    <div className="w-1 bg-afro-primary animate-pulse h-full"></div>
                                    <div className="w-1 bg-afro-primary animate-pulse h-2/3 delay-75"></div>
                                    <div className="w-1 bg-afro-primary animate-pulse h-1/2 delay-150"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <h3 className={`font-bold text-lg md:text-base leading-tight cursor-pointer ${isPlaying ? 'text-afro-primary' : 'text-white group-hover:text-afro-primary'} transition-colors`}>{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.artist}</p>
                            
                            {/* Mobile Streaming Links */}
                            <div className="md:hidden flex gap-3 mt-3">
                                {item.externalLinks?.spotify && (
                                    <a href={item.externalLinks.spotify} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-green-500">
                                        <SpotifyIcon /> Spotify
                                    </a>
                                )}
                                {item.externalLinks?.appleMusic && (
                                    <a href={item.externalLinks.appleMusic} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-500">
                                        <AppleMusicIcon /> Apple
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats (Desktop Only) */}
                    <div className="hidden md:flex col-span-2 justify-center flex-col items-center">
                        {getTrendIcon(item.trend)}
                        {item.lastWeek && <span className="text-xs text-gray-600 mt-1">Last: {item.lastWeek}</span>}
                    </div>
                    
                    <div className="hidden md:flex col-span-1 justify-center font-mono text-gray-400">
                        {item.peak}
                    </div>
                    
                    <div className="hidden md:flex col-span-1 justify-center font-mono text-gray-400">
                        {item.weeksOnChart}
                    </div>
                    
                    {/* Streaming Actions (Desktop) */}
                    <div className="hidden md:flex col-span-1 justify-end relative">
                        <button 
                            onClick={() => toggleDropdown(item.rank)}
                            className={`p-2 rounded-full transition-colors ${isDropdownOpen ? 'bg-afro-primary text-black' : 'text-gray-500 hover:text-white hover:bg-gray-700'}`}
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 top-10 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-2 border-b border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2">Stream On</div>
                                {item.externalLinks?.spotify ? (
                                    <a href={item.externalLinks.spotify} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-sm font-bold text-gray-200">
                                        <SpotifyIcon /> Spotify
                                    </a>
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-600 cursor-not-allowed flex items-center gap-3"><SpotifyIcon /> Not Available</div>
                                )}
                                {item.externalLinks?.appleMusic ? (
                                    <a href={item.externalLinks.appleMusic} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-sm font-bold text-gray-200">
                                        <AppleMusicIcon /> Apple Music
                                    </a>
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-600 cursor-not-allowed flex items-center gap-3"><AppleMusicIcon /> Not Available</div>
                                )}
                            </div>
                        )}
                        
                        {/* Overlay to close dropdown when clicking outside */}
                        {isDropdownOpen && (
                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownRank(null)}></div>
                        )}
                    </div>

                    {/* Mobile Stats Row */}
                    <div className="md:hidden flex justify-between items-center mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400">
                        <div className="flex gap-4">
                            <span>Peak: <span className="text-white font-bold">{item.peak}</span></span>
                            <span>Weeks: <span className="text-white font-bold">{item.weeksOnChart}</span></span>
                        </div>
                    </div>

                </div>
                );
            })}
        </div>

        <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">Chart methodology reflects sales and streaming data from major DSPs across Africa and the Diaspora.</p>
            <button 
                onClick={() => setIsMethodologyOpen(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
                View Methodology
            </button>
        </div>

      </div>

      {/* Methodology Modal */}
      {isMethodologyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="text-afro-primary font-bold uppercase tracking-widest text-xs mb-2 block">Transparency Report</span>
                            <h2 className="text-3xl font-display font-bold text-white">Chart Methodology</h2>
                        </div>
                        <button onClick={() => setIsMethodologyOpen(false)} className="text-gray-500 hover:text-white p-2">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300">
                        <p>
                            The 100AFRO Official Charts are the recognized standard for music popularity in Africa and the diaspora. Our charts are compiled weekly based on a comprehensive formula that aggregates sales and streaming data.
                        </p>
                        
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-afro-primary rounded-full"></span> Data Sources
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div> Spotify</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div> Apple Music</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div> Boomplay</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div> Audiomack</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div> YouTube (Official Video + Art Tracks)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">Weighting System</h3>
                            <p>To ensure a fair representation of popularity, we utilize a tiered weighting system:</p>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                                <li><strong>Paid Streams:</strong> 1 unit = 150 streams</li>
                                <li><strong>Ad-Supported Streams:</strong> 1 unit = 600 streams</li>
                                <li><strong>Video Streams:</strong> 1 unit = 300 streams</li>
                                <li><strong>Digital Downloads:</strong> 1 unit = 1 sale</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">Tracking Period</h3>
                            <p>
                                The tracking week runs from <strong>Friday (00:00 GMT)</strong> to <strong>Thursday (23:59 GMT)</strong>. Charts are updated and published every Monday at 12:00 PM GMT.
                            </p>
                        </div>
                        
                         <div className="border-t border-gray-800 pt-6 mt-6">
                            <p className="text-xs text-gray-500 italic">
                                * Data is verified by an independent third-party audit firm to ensure accuracy and integrity.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 p-4 border-t border-gray-700 flex justify-end">
                    <button 
                        onClick={() => setIsMethodologyOpen(false)}
                        className="bg-white text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Charts;