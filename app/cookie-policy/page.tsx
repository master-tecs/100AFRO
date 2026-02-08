import React from 'react';
import Link from 'next/link';
import { Cookie, Shield, BarChart, Megaphone, Settings, Zap } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | 100AFRO',
  description: 'Learn about how 100AFRO uses cookies and how to manage your preferences.',
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">What Are Cookies?</h2>
            <p className="text-gray-300 leading-relaxed">
              Cookies are small text files that are placed on your device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to 
              the website owners. Cookies allow a website to recognize your device and remember 
              information about your visit.
            </p>
          </section>

          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-6">How We Use Cookies</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              100AFRO uses cookies to enhance your browsing experience, analyze site traffic, and 
              personalize content. We categorize cookies based on their purpose:
            </p>

            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="text-green-400" size={24} />
                  <h3 className="text-xl font-bold text-white">Essential Cookies</h3>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">
                    Always Active
                  </span>
                </div>
                <p className="text-gray-300 mb-3">
                  These cookies are necessary for the website to function properly. They enable core 
                  functionality such as security, network management, and accessibility.
                </p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-400 font-bold mb-2">Cookies we use:</p>
                  <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                    <li><code className="text-afro-primary">auth-token</code> - Authentication and session management</li>
                    <li><code className="text-afro-primary">consent-session-id</code> - Cookie consent preferences</li>
                    <li><code className="text-afro-primary">poll-guest-id</code> - Poll voting preferences</li>
                    <li><code className="text-afro-primary">pv_*</code> - Article view tracking (24h deduplication)</li>
                  </ul>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart className="text-blue-400" size={24} />
                  <h3 className="text-xl font-bold text-white">Analytics Cookies</h3>
                </div>
                <p className="text-gray-300 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. This helps us improve our website and user experience.
                </p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-400 font-bold mb-2">Cookies we use:</p>
                  <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                    <li><code className="text-afro-primary">_ga</code> - Google Analytics (distinguishes users)</li>
                    <li><code className="text-afro-primary">_ga_*</code> - Google Analytics (stores session state)</li>
                    <li><code className="text-afro-primary">_gid</code> - Google Analytics (distinguishes users)</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-3">
                    We track: page views, scroll depth, time on page, click events, and form interactions.
                  </p>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <Megaphone className="text-purple-400" size={24} />
                  <h3 className="text-xl font-bold text-white">Marketing Cookies</h3>
                </div>
                <p className="text-gray-300 mb-3">
                  These cookies are used to deliver advertisements that are more relevant to you and your 
                  interests. They may also be used to limit the number of times you see an advertisement.
                </p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-400 font-bold mb-2">Currently:</p>
                  <p className="text-sm text-gray-300">
                    We do not currently use marketing cookies, but this category is available for future 
                    advertising partnerships.
                  </p>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="text-yellow-400" size={24} />
                  <h3 className="text-xl font-bold text-white">Functional Cookies</h3>
                </div>
                <p className="text-gray-300 mb-3">
                  These cookies enable enhanced functionality and personalization, such as remembering 
                  your preferences and settings to provide a more personalized experience.
                </p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-400 font-bold mb-2">Currently:</p>
                  <p className="text-sm text-gray-300">
                    We use functional cookies to remember your cookie consent preferences and other 
                    user settings.
                  </p>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="text-orange-400" size={24} />
                  <h3 className="text-xl font-bold text-white">Performance Cookies</h3>
                </div>
                <p className="text-gray-300 mb-3">
                  These cookies help us understand how well our website performs and identify areas for 
                  improvement. They collect information about how you use our site, such as which pages 
                  you visit most often.
                </p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-400 font-bold mb-2">Currently:</p>
                  <p className="text-sm text-gray-300">
                    Performance tracking is integrated with our analytics cookies. We may add dedicated 
                    performance monitoring tools in the future.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You can manage your cookie preferences at any time by:
            </p>
            <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
              <li>Clicking the cookie settings icon (if available) in the bottom corner of the page</li>
              <li>Visiting this Cookie Policy page and adjusting your preferences</li>
              <li>Clearing your browser cookies (note: this will reset all preferences)</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              Please note that disabling certain cookies may impact your experience on our website. 
              Essential cookies cannot be disabled as they are necessary for the website to function.
            </p>
          </section>

          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Third-Party Cookies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Some cookies are placed by third-party services that appear on our pages. We use the following 
              third-party services:
            </p>
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              <li><strong>Google Analytics</strong> - Web analytics service (only if you consent to Analytics cookies)</li>
              <li><strong>Future services</strong> - We may add additional third-party services in the future, 
                which will be listed here and require your consent.</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Cookie Duration</h2>
            <p className="text-gray-300 leading-relaxed">
              Cookies can be either "session" cookies or "persistent" cookies. Session cookies are temporary 
              and are deleted when you close your browser. Persistent cookies remain on your device for a set 
              period or until you delete them. Our consent session cookie is stored for 1 year, while 
              authentication cookies are session-based.
            </p>
          </section>

          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Under data protection laws, you have the right to:
            </p>
            <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
              <li>Be informed about how we use cookies</li>
              <li>Access information about cookies we use</li>
              <li>Withdraw your consent at any time</li>
              <li>Request deletion of your cookie data</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              To exercise these rights, please contact us using the information provided in our{' '}
              <Link href="/privacy-policy" className="text-afro-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Updates to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or 
              for other operational, legal, or regulatory reasons. When we make changes, we will update 
              the "Last updated" date at the top of this page. If we make material changes, we will 
              notify you by displaying a notice on our website or by other means.
            </p>
          </section>

          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-300">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@contact.100afro.com" className="text-afro-primary hover:underline">
                  privacy@contact.100afro.com
                </a>
              </p>
              <p className="text-gray-300 mt-2">
                <strong>Website:</strong>{' '}
                <Link href="/contact" className="text-afro-primary hover:underline">
                  Contact Page
                </Link>
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-afro-primary hover:text-white font-bold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
