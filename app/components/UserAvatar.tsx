'use client';

import React from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 96,
};

export default function UserAvatar({ name, image, size = 'md', className = '' }: UserAvatarProps) {
  const sizePx = sizeMap[size];
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  if (image) {
    return (
      <div
        className={`rounded-full overflow-hidden bg-gray-700 flex-shrink-0 ${className}`}
        style={{ width: sizePx, height: sizePx }}
      >
        <Image
          src={image}
          alt={name || 'User'}
          width={sizePx}
          height={sizePx}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-br from-afro-primary to-yellow-600 flex items-center justify-center text-black font-bold flex-shrink-0 ${className}`}
      style={{ width: sizePx, height: sizePx, fontSize: sizePx * 0.4 }}
    >
      {initials}
    </div>
  );
}
