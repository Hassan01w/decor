import React, { useEffect } from 'react';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F7F4EE] text-[#242522] min-h-screen pt-12 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#E5DED2] shadow-xs">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-xs text-[#8A7E73] mb-8 uppercase tracking-widest font-bold">Last updated: August 2026</p>
          
          <div className="prose prose-stone lg:prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#2D2A26] prose-p:text-[#4A423B]">
            <p>Welcome to <strong>The Decor Diary</strong>. We value your privacy and are committed to protecting your personal information.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">1. Information We Collect (E-commerce)</h3>
            <p>When you subscribe to our newsletter, place an order, or contact us, we collect necessary data such as your name, email address, shipping address, and payment information to fulfill your requests and process your orders.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">2. How We Use Information</h3>
            <p>We use your information exclusively to deliver orders, provide customer support, and personalize your shopping experience. We never sell your personal data to third parties.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">3. Google AdSense & Third-Party Advertising</h3>
            <p>We partner with third-party advertising companies, including <strong>Google AdSense</strong>, to serve advertisements when you visit our website (<code>thedecordiary.store</code>).</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites across the Internet.</li>
              <li>Google's use of advertising cookies (such as DoubleClick DART cookies) enables it and its partners to serve targeted ads to you based on your visit to our site and/or other sites on the World Wide Web.</li>
              <li>You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#8C6D53] underline font-semibold">Google Ads Settings</a>.</li>
              <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#8C6D53] underline font-semibold">aboutads.info</a>.</li>
            </ul>
            
            <h3 className="text-xl font-bold mt-8 mb-4">4. Cookies, Web Beacons & Analytics</h3>
            <p>We use standard cookies and anonymous web analytics to analyze readership patterns, verify site performance, and improve your browsing experience. You can choose to disable cookies through your browser options at any time.</p>

            <h3 className="text-xl font-bold mt-8 mb-4">5. User Rights (GDPR & CCPA)</h3>
            <p>Under applicable data privacy regulations, you have the right to request access to, update, or delete any personal information we hold about you. To submit a request, contact our editorial desk at <a href="mailto:thedecordiarystore@gmail.com" className="text-[#8C6D53] underline font-semibold">thedecordiarystore@gmail.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
