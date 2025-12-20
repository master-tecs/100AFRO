'use client'

import React, { useState, useRef } from 'react';
import { VideoCategory } from '@prisma/client';
import { Play, Volume2, VolumeX } from 'lucide-react';

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

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-700 flex flex-col h-full">
      <div className="relative aspect-video bg-black group-card">
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="w-full h-full relative cursor-pointer group block"
            aria-label={`Play video: ${video.title}`}
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <Play className="text-white ml-1" size={24} fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          </button>
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
      </div>
    </div>
  );
};

export default VideoCard;

