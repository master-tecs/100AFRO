import React from 'react';

export const metadata = {
  title: 'About Us | 100AFRO',
  description: 'Learn about 100AFRO, the world\'s leading destination for African entertainment.',
};

export default function AboutPage() {
  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">About 100AFRO</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 text-lg leading-relaxed">
            100AFRO is the world&apos;s leading destination for African entertainment, bridging the gap between the continent and the diaspora.
          </p>
        </div>
      </div>
    </div>
  );
}

