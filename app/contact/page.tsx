import React from 'react';

export const metadata = {
  title: 'Contact Us | 100AFRO',
  description: 'Get in touch with the 100AFRO team.',
};

export default function ContactPage() {
  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">Contact Us</h1>
        <div className="bg-gray-800 rounded-2xl p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Name</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
              <input type="email" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Message</label>
              <textarea rows={6} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" required></textarea>
            </div>
            <button type="submit" className="bg-afro-primary text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

