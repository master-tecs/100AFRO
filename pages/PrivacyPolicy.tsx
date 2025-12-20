import React, { useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-gray-900 min-h-screen pt-20 pb-24 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-8 border-b border-gray-800">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last Updated: January 15, 2024</p>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <p>
            At 100AFRO Media Group ("we", "us", or "our"), we are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at privacy@100afro.com.
          </p>

          <h2 className="text-white font-bold mt-8 mb-4">1. What Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website (such as posting messages in our online forums or entering competitions, contests or giveaways) or otherwise when you contact us.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Information Provided by You:</strong> Names, phone numbers, email addresses, mailing addresses, usernames, passwords, contact preferences.</li>
            <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument.</li>
          </ul>

          <h2 className="text-white font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To facilitate account creation and logon process.</li>
            <li>To post testimonials.</li>
            <li>To request feedback.</li>
            <li>To manage user accounts.</li>
            <li>To send administrative information to you.</li>
            <li>To protect our Services.</li>
          </ul>

          <h2 className="text-white font-bold mt-8 mb-4">3. Will Your Information Be Shared With Anyone?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
            <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
          </ul>

          <h2 className="text-white font-bold mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.
          </p>

          <h2 className="text-white font-bold mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions or comments about this notice, you may email us at privacy@100afro.com or by post to:
          </p>
          <address className="not-italic bg-gray-800 p-6 rounded-lg border border-gray-700 mt-4">
            <strong>100AFRO Media Group</strong><br />
            123 Oxford Street<br />
            London, W1D 1LP<br />
            United Kingdom
          </address>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;