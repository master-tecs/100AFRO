'use client'

import React, { useState, useRef } from 'react';
import { VideoCategory } from '@prisma/client';
import { Play, Volume2, VolumeX, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { track } from '@/lib/mixpanel';

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl?: string | null;
  duration: string;
  views: string;
  date: string;
  category: VideoCategory;
  featured?: boolean;
  tags: string[];
}

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Use the provided custom thumbnail, or fallback to YouTube's high-res default
  const displayThumbnail = video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Send postMessage command to YouTube IFrame API
      const func = newMutedState ? 'mute' : 'unMute';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: func, args: [] }),
        '*'
      );
    }
  };

  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-700 flex flex-col h-full">
      <div className="relative aspect-video bg-black group-card">
        {!isPlaying ? (
          <div className="relative w-full h-full">
            {/* Thumbnail - Clickable link to YouTube */}
            <Link
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full relative"
              aria-label={`Watch ${video.title} on YouTube`}
            >
              <img
                src={displayThumbnail}
                alt={video.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                onError={(e) => {
                  // Fallback if maxresdefault doesn't exist (some videos only have hqdefault)
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes('maxresdefault')) {
                      target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                  }
                }}
              />
            </Link>
            
            {/* Play Button Overlay - Plays inline */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPlaying(true);
                track('Video Played', { youtubeId: video.youtubeId, title: video.title });
              }}
              className="absolute inset-0 flex items-center justify-center z-10"
              aria-label={`Play video: ${video.title}`}
            >
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform hover:bg-red-700">
                <Play className="text-white ml-1" size={24} fill="currentColor" />
              </div>
            </button>
            
            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded z-10">
              {video.duration}
            </div>
            
            {/* YouTube Badge */}
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 z-10">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full animate-in fade-in duration-300">
            <iframe
              ref={iframeRef}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&enablejsapi=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
            
            {/* Custom Mute Control Overlay */}
            <button
              onClick={toggleMute}
              className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-md transition-all duration-200 transform hover:scale-105 border border-white/10"
              aria-label={isMuted ? "Unmute" : "Mute"}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-2 group-hover:text-afro-primary transition-colors">
          {video.title}
        </h3>
        
        {/* Tags Row */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
             {video.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] bg-gray-700/50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-600">
                    #{tag}
                </span>
             ))}
          </div>
        )}

        <div className="flex justify-between items-center text-gray-400 text-xs mt-auto">
          <span>{video.views} views</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-gray-300">
            {video.category.replace('_', ' ')}
          </span>
          <span>{video.date}</span>
        </div>
        
        {/* Watch on YouTube Button */}
        <Link
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('Video Opened on YouTube', { youtubeId: video.youtubeId, title: video.title })}
          className="mt-3 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <ExternalLink size={16} />
          Watch on YouTube
        </Link>
      </div>
    </div>
  );
};

export default VideoCard;

