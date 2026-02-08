import React from 'react';
import Link from 'next/link';
import { Shield, Eye, Lock, User, Globe, Mail, FileText, AlertCircle, Database, Users } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | 100AFRO',
  description: 'Learn about how 100AFRO collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-afro-primary" size={32} />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Introduction</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Welcome to 100AFRO ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
            </p>
            <p className="text-gray-300 leading-relaxed">
              By using our website and services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">Information We Collect</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              We collect information that you provide directly to us and information that is automatically collected when you use our services:
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-afro-primary pl-4">
                <h3 className="text-xl font-bold text-white mb-3">Information You Provide</h3>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li><strong>Account Information:</strong> Name, email address, username, and password when you create an account</li>
                  <li><strong>Profile Information:</strong> Profile picture, bio, and other information you choose to share</li>
                  <li><strong>Content:</strong> Comments, posts, articles, and other content you submit</li>
                  <li><strong>Newsletter Subscriptions:</strong> Email address and preferences when you subscribe to our newsletter</li>
                  <li><strong>Contact Information:</strong> Information you provide when contacting us for support or inquiries</li>
                  <li><strong>Survey Responses:</strong> Information you provide when participating in polls, surveys, or contests</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-bold text-white mb-3">Automatically Collected Information</h3>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, search queries</li>
                  <li><strong>Location Data:</strong> General location information based on IP address</li>
                  <li><strong>Cookies and Tracking:</strong> Information collected through cookies and similar technologies (see our <Link href="/cookie-policy" className="text-afro-primary hover:underline">Cookie Policy</Link>)</li>
                  <li><strong>Log Files:</strong> Server logs containing access information, error logs, and system events</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-xl font-bold text-white mb-3">Third-Party Information</h3>
                <p className="text-gray-300 mb-2">
                  We may receive information about you from third-party services:
                </p>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>Social media platforms if you connect your account</li>
                  <li>Analytics providers (e.g., Google Analytics)</li>
                  <li>Authentication services if you sign in through third parties</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">How We Use Your Information</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              We use the information we collect for various purposes, including:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <User className="text-afro-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-300"><strong className="text-white">Service Delivery:</strong> To provide, maintain, and improve our services, process transactions, and respond to your requests</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-afro-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-300"><strong className="text-white">Communication:</strong> To send you updates, newsletters, marketing communications (with your consent), and respond to inquiries</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="text-afro-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-300"><strong className="text-white">Personalization:</strong> To personalize your experience, show relevant content, and remember your preferences</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="text-afro-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-300"><strong className="text-white">Analytics:</strong> To analyze usage patterns, improve our website, and understand user behavior</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="text-afro-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-300"><strong className="text-white">Security:</strong> To detect, prevent, and address fraud, security issues, and technical problems</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="text-afro-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-300"><strong className="text-white">Legal Compliance:</strong> To comply with legal obligations, enforce our terms, and protect our rights</p>
                </div>
              </div>
            </div>
          </section>

          {/* Information Sharing and Disclosure */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Information Sharing and Disclosure</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="text-gray-300 space-y-3 list-disc list-inside mb-4">
              <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf (e.g., hosting, analytics, email delivery, payment processing)</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale of assets, or acquisition, your information may be transferred to the acquiring entity</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation, or to protect our rights, property, or safety</li>
              <li><strong>With Your Consent:</strong> We may share information with third parties when you explicitly consent to such sharing</li>
              <li><strong>Public Information:</strong> Information you post publicly (e.g., comments, articles) may be visible to other users and the general public</li>
            </ul>
            <div className="bg-gray-900 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-400 mb-2"><strong>Third-Party Services:</strong></p>
              <p className="text-sm text-gray-300">
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">Data Security</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
              <li>Encryption of data in transit using SSL/TLS protocols</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security assessments and updates</li>
              <li>Limited access to personal information on a need-to-know basis</li>
              <li>Secure data storage and backup procedures</li>
            </ul>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                <p className="text-sm text-gray-300">
                  <strong className="text-yellow-400">Important:</strong> While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to protecting your data to the best of our ability.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">Your Rights and Choices</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Access and Portability</h3>
                <p className="text-gray-300 text-sm">You have the right to access and receive a copy of your personal information in a structured, commonly used format.</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Correction</h3>
                <p className="text-gray-300 text-sm">You can update or correct inaccurate or incomplete information through your account settings or by contacting us.</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Deletion</h3>
                <p className="text-gray-300 text-sm">You may request deletion of your personal information, subject to certain legal and operational requirements.</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Opt-Out</h3>
                <p className="text-gray-300 text-sm">You can opt-out of marketing communications by clicking unsubscribe links in emails or adjusting your preferences in your account settings.</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Cookie Preferences</h3>
                <p className="text-gray-300 text-sm">You can manage your cookie preferences at any time. See our <Link href="/cookie-policy" className="text-afro-primary hover:underline">Cookie Policy</Link> for more information.</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Data Processing Objection</h3>
                <p className="text-gray-300 text-sm">You may object to certain types of data processing, such as direct marketing or processing based on legitimate interests.</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-6">
              To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our services are not intended for individuals under the age of 13 (or the minimum age required in your jurisdiction). We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
            </p>
            <p className="text-gray-300 leading-relaxed">
              If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately so we can take appropriate action.
            </p>
          </section>

          {/* Data Retention */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it. Account information is typically retained until you delete your account or request deletion, subject to legal and operational requirements.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">International Data Transfers</h2>
            <p className="text-gray-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our services, you consent to the transfer of your information to these countries. We take appropriate safeguards to ensure your information receives adequate protection in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will:
            </p>
            <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
              <li>Update the "Last updated" date at the top of this page</li>
              <li>Notify you of material changes via email or prominent notice on our website</li>
              <li>Obtain your consent where required by applicable law</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">Contact Us</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-900 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">Email:</p>
                <a href="mailto:privacy@contact.100afro.com" className="text-afro-primary hover:underline text-lg">
                  privacy@contact.100afro.com
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">General Inquiries:</p>
                <Link href="/contact" className="text-afro-primary hover:underline text-lg">
                  Contact Page
                </Link>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">Data Protection Officer:</p>
                <p className="text-gray-300">For privacy-related concerns, please use the email above with "Data Protection" in the subject line.</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-6">
              We will respond to your inquiry within a reasonable timeframe and in accordance with applicable data protection laws.
            </p>
          </section>

          {/* Related Policies */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Related Policies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              For more information about how we handle your data, please review our related policies:
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cookie-policy"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 rounded-lg text-afro-primary font-bold transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 rounded-lg text-afro-primary font-bold transition-colors"
              >
                Terms of Service
              </Link>
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

