import React, { useEffect } from 'react';

const TermsOfService: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-gray-900 min-h-screen pt-20 pb-24 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-8 border-b border-gray-800">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last Updated: January 15, 2024</p>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <p>
            Welcome to 100AFRO! These terms and conditions outline the rules and regulations for the use of 100AFRO Media Group's Website, located at https://100afro.com.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use 100AFRO if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-white font-bold mt-8 mb-4">1. License</h2>
          <p>
            Unless otherwise stated, 100AFRO Media Group and/or its licensors own the intellectual property rights for all material on 100AFRO. All intellectual property rights are reserved. You may access this from 100AFRO for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Republish material from 100AFRO</li>
            <li>Sell, rent or sub-license material from 100AFRO</li>
            <li>Reproduce, duplicate or copy material from 100AFRO</li>
            <li>Redistribute content from 100AFRO</li>
          </ul>

          <h2 className="text-white font-bold mt-8 mb-4">2. User Comments</h2>
          <p>
            Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. 100AFRO Media Group does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of 100AFRO Media Group,its agents and/or affiliates.
          </p>

          <h2 className="text-white font-bold mt-8 mb-4">3. Content Liability</h2>
          <p>
            We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
          </p>

          <h2 className="text-white font-bold mt-8 mb-4">4. Reservation of Rights</h2>
          <p>
            We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
          </p>

          <h2 className="text-white font-bold mt-8 mb-4">5. Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;