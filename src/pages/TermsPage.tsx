import React, { useEffect } from 'react';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F7F4EE] text-[#242522] min-h-screen pt-12 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#E5DED2] shadow-xs">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-xs text-[#8A7E73] mb-8 uppercase tracking-widest font-bold">Last updated: August 2026</p>
          
          <div className="prose prose-stone lg:prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#2D2A26] prose-p:text-[#4A423B]">
            <p>By browsing and shopping on <strong>The Decor Diary</strong>, you agree to comply with our Terms of Service.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">1. E-commerce Operations</h3>
            <p>We strive to display our products as accurately as possible. Prices are subject to change without notice. We reserve the right to refuse or cancel any order placed for a product listed at the incorrect price.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">2. Copyright & Content</h3>
            <p>All photography, product descriptions, articles, design guides, and tutorials published on this website are protected by international copyright laws. Unauthorized duplication or scraping is strictly prohibited without written consent.</p>

            <h3 className="text-xl font-bold mt-8 mb-4">3. Pinterest Sharing</h3>
            <p>Readers are warmly encouraged to save and share original images directly to Pinterest boards for personal inspiration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
