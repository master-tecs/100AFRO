import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sitemap: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sections = [
    {
      title: "Main",
      links: [
        { name: "Home", path: "/" },
        { name: "Charts", path: "/charts" },
        { name: "Videos", path: "/videos" },
        { name: "Blog", path: "/blog" },
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contact" },
      ]
    },
    {
      title: "Content Categories",
      links: [
        { name: "News", path: "/search?q=News" },
        { name: "Music", path: "/search?q=Music" },
        { name: "Culture", path: "/search?q=Culture" },
        { name: "Lifestyle", path: "/search?q=Lifestyle" },
        { name: "Industry", path: "/search?q=Industry" },
      ]
    },
    {
      title: "Video Collections",
      links: [
        { name: "Music Videos", path: "/videos" },
        { name: "Dance Challenges", path: "/videos" },
        { name: "Interviews", path: "/videos" },
        { name: "Live Performances", path: "/videos" },
      ]
    },
    {
      title: "Legal & Corporate",
      links: [
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms of Service", path: "/terms-of-service" },
        { name: "Cookie Policy", path: "/cookie-policy" },
        { name: "Advertising", path: "/contact" },
        { name: "Press", path: "/contact" },
      ]
    }
  ];

  return (
    <div className="bg-gray-900 min-h-screen pt-20 pb-24 text-gray-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-8 border-b border-gray-800">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Sitemap</h1>
          <p className="text-gray-400">An index of all pages available on 100AFRO.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-gray-600 pb-2">{section.title}</h2>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link to={link.path} className="text-gray-400 hover:text-afro-primary transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sitemap;