import React, { useEffect } from 'react';

const CookiePolicy: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-gray-900 min-h-screen pt-20 pb-24 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-8 border-b border-gray-800">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-sm text-gray-500">Last Updated: January 15, 2024</p>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <p>
            This Cookie Policy explains how 100AFRO Media Group ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website at https://100afro.com. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>

          <h2 className="text-white font-bold mt-8 mb-4">1. What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>

          <h2 className="text-white font-bold mt-8 mb-4">2. Why do we use cookies?</h2>
          <p>
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes.
          </p>

          <h2 className="text-white font-bold mt-8 mb-4">3. Types of Cookies We Use</h2>
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-white font-bold text-lg mb-2">Essential Website Cookies</h3>
              <p className="text-sm">These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-white font-bold text-lg mb-2">Performance and Functionality Cookies</h3>
              <p className="text-sm">These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-white font-bold text-lg mb-2">Analytics and Customization Cookies</h3>
              <p className="text-sm">These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-white font-bold text-lg mb-2">Advertising Cookies</h3>
              <p className="text-sm">These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</p>
            </div>
          </div>

          <h2 className="text-white font-bold mt-8 mb-4">4. How can I control cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. In addition, most advertising networks offer you a way to opt out of targeted advertising.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;