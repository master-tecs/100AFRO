import React from 'react';
import Link from 'next/link';
import { FileText, AlertTriangle, Shield, Users, Ban, Copyright, Gavel, Mail, Globe, Lock, Eye } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | 100AFRO',
  description: 'Read the terms and conditions governing your use of 100AFRO services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-afro-primary" size={32} />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              Terms of Service
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Welcome to 100AFRO ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our website, services, and applications (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-300 leading-relaxed">
              If you do not agree to these Terms, please do not use our Service. We may update these Terms from time to time, and your continued use of the Service after such changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">2. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              By accessing, browsing, or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy-policy" className="text-afro-primary hover:underline">Privacy Policy</Link>. If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                <p className="text-sm text-gray-300">
                  <strong className="text-yellow-400">Important:</strong> You must be at least 13 years old (or the minimum age required in your jurisdiction) to use our Service. If you are under 18, you represent that you have your parent's or guardian's permission to use the Service.
                </p>
              </div>
            </div>
          </section>

          {/* Description of Service */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">3. Description of Service</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              100AFRO is an African entertainment hub that provides:
            </p>
            <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
              <li>News articles, blog posts, and editorial content about African entertainment</li>
              <li>Music charts, videos, and entertainment content</li>
              <li>User-generated content, comments, and community features</li>
              <li>Newsletter subscriptions and email communications</li>
              <li>Search functionality and content discovery tools</li>
              <li>Other features and services as we may add from time to time</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We are not liable to you or any third party for any modification, suspension, or discontinuation of the Service.
            </p>
          </section>

          {/* User Accounts */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">4. User Accounts</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Account Registration</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  Some features of our Service may require you to create an account. When creating an account, you agree to:
                </p>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Account Termination</h3>
                <p className="text-gray-300 text-sm">
                  We reserve the right to suspend or terminate your account at any time, with or without cause or notice, for any reason, including if you breach these Terms. You may also delete your account at any time through your account settings.
                </p>
              </div>
            </div>
          </section>

          {/* User Conduct */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">5. User Conduct and Prohibited Activities</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 space-y-2 mb-4">
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Violate any applicable laws, regulations, or third-party rights</li>
                <li>Post, upload, or transmit any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with any person or entity</li>
                <li>Post spam, unsolicited commercial messages, or engage in any form of automated data collection</li>
                <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                <li>Attempt to gain unauthorized access to any portion of the Service or any other accounts, systems, or networks</li>
                <li>Use the Service to transmit viruses, malware, or other harmful code</li>
                <li>Collect or store personal data about other users without their consent</li>
                <li>Engage in any activity that could damage, disable, or impair the Service</li>
                <li>Use automated systems (bots, scrapers, etc.) to access the Service without our express written permission</li>
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Ban className="text-red-400 flex-shrink-0 mt-1" size={20} />
                <p className="text-sm text-gray-300">
                  <strong className="text-red-400">Violation Consequences:</strong> Violation of these terms may result in immediate termination of your account and may subject you to legal action. We reserve the right to remove any content that violates these Terms at our sole discretion.
                </p>
              </div>
            </div>
          </section>

          {/* User Content */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">6. User-Generated Content</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Content Ownership</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  You retain ownership of any content you post, upload, or submit to the Service ("User Content"). However, by submitting User Content, you grant us a worldwide, non-exclusive, royalty-free, perpetual, irrevocable, and sublicensable license to:
                </p>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>Use, reproduce, modify, adapt, publish, translate, and distribute your User Content</li>
                  <li>Display and perform your User Content in connection with the Service</li>
                  <li>Use your User Content for promotional and marketing purposes</li>
                </ul>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Content Responsibility</h3>
                <p className="text-gray-300 text-sm mb-2">
                  You are solely responsible for your User Content. You represent and warrant that:
                </p>
                <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                  <li>You own or have the necessary rights to the User Content</li>
                  <li>Your User Content does not infringe any third-party rights</li>
                  <li>Your User Content complies with these Terms and applicable laws</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Content Moderation</h3>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right, but are not obligated, to review, edit, or remove any User Content at any time for any reason, including content that we determine violates these Terms or is otherwise objectionable. We do not guarantee that we will monitor or screen all User Content.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Copyright className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">7. Intellectual Property Rights</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Our Content</h3>
                <p className="text-gray-300 leading-relaxed">
                  The Service, including its original content, features, and functionality, is owned by 100AFRO and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor may you reverse engineer or attempt to extract the source code of that software.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Trademarks</h3>
                <p className="text-gray-300 text-sm">
                  The 100AFRO name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of 100AFRO or its affiliates. You must not use such marks without our prior written permission.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Copyright Infringement</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  We respect the intellectual property rights of others. If you believe that any content on our Service infringes your copyright, please contact us with the following information:
                </p>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>A description of the copyrighted work you claim has been infringed</li>
                  <li>The location of the allegedly infringing material on our Service</li>
                  <li>Your contact information</li>
                  <li>A statement that you have a good faith belief that the use is not authorized</li>
                  <li>A statement that the information is accurate and you are authorized to act on behalf of the copyright owner</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Links and Services */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">8. Third-Party Links and Services</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our Service may contain links to third-party websites, services, or resources that are not owned or controlled by 100AFRO. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="text-gray-300 leading-relaxed">
              You acknowledge and agree that 100AFRO shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">9. Disclaimers</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              We do not warrant that:
            </p>
            <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
              <li>The Service will be uninterrupted, secure, or error-free</li>
              <li>Any defects or errors will be corrected</li>
              <li>The Service is free of viruses or other harmful components</li>
              <li>The results obtained from using the Service will be accurate or reliable</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              You assume full responsibility for your use of the Service and any consequences thereof.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL 100AFRO, ITS AFFILIATES, AGENTS, DIRECTORS, EMPLOYEES, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our total liability to you for all claims arising from or related to the Service shall not exceed the amount you paid us, if any, for accessing the Service in the twelve (12) months prior to the event giving rise to the liability, or $100, whichever is greater.
            </p>
          </section>

          {/* Indemnification */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">11. Indemnification</h2>
            <p className="text-gray-300 leading-relaxed">
              You agree to defend, indemnify, and hold harmless 100AFRO and its affiliates, licensors, and service providers, and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service, including, but not limited to, your User Content, any use of the Service's content, services, and products other than as expressly authorized in these Terms.
            </p>
          </section>

          {/* Termination */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">12. Termination</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
            <p className="text-gray-300 leading-relaxed">
              All provisions of these Terms that by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          {/* Governing Law */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">13. Governing Law and Dispute Resolution</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Governing Law</h3>
                <p className="text-gray-300 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in [Your Jurisdiction].
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Dispute Resolution</h3>
                <p className="text-gray-300 text-sm">
                  Before filing a claim, you agree to try to resolve the dispute by contacting us. If we cannot resolve the dispute within 60 days, you agree to resolve any disputes through binding arbitration or small claims court, rather than in courts of general jurisdiction.
                </p>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">14. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-gray-300 leading-relaxed">
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>

          {/* Severability */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">15. Severability</h2>
            <p className="text-gray-300 leading-relaxed">
              If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have between us regarding the Service.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">16. Contact Information</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-900 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">Email:</p>
                <a href="mailto:legal@contact.100afro.com" className="text-afro-primary hover:underline text-lg">
                  legal@contact.100afro.com
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">General Inquiries:</p>
                <Link href="/contact" className="text-afro-primary hover:underline text-lg">
                  Contact Page
                </Link>
              </div>
            </div>
          </section>

          {/* Related Policies */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Related Policies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Please also review our other important policies:
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 rounded-lg text-afro-primary font-bold transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookie-policy"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 rounded-lg text-afro-primary font-bold transition-colors"
              >
                Cookie Policy
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

