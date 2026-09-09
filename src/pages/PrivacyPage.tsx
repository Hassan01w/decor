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
            
            <h3 className="text-xl font-bold mt-8 mb-4">3. Third-Party Advertising</h3>
            <p>We use third-party advertising companies to serve ads when you visit our website. These companies may use cookies to serve ads based on your prior visits to our website or other websites.</p>
            <p>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet. You may opt out of personalized advertising by visiting Ads Settings.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">4. Cookies & Analytics</h3>
            <p>We use anonymous cookies to analyze reader engagement patterns and improve page load performance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
