import React, { useEffect } from 'react';

export const DisclaimerPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F7F4EE] text-[#242522] min-h-screen pt-12 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#E5DED2] shadow-xs">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Affiliate & Ad Disclaimer</h1>
          <p className="text-xs text-[#8A7E73] mb-8 uppercase tracking-widest font-bold">Last updated: August 2026</p>
          
          <div className="prose prose-stone lg:prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#2D2A26] prose-p:text-[#4A423B]">
            <h3 className="text-xl font-bold mt-8 mb-4">Affiliate Links & Advertising Disclaimer</h3>
            <p>The Decor Diary participates in curated affiliate marketing programs and utilizes digital advertising networks. This means we may earn a small commission on products recommended in our articles at no additional cost to you, and we display ads to support our site.</p>
            <p>We only feature homeware and decor that aligns with our aesthetic and commitment to quality. Our editorial integrity is paramount, and any sponsored content or affiliate links are clearly integrated without compromising our authentic recommendations.</p>

            <h3 className="text-xl font-bold mt-8 mb-4">DIY & Renovation Safety</h3>
            <p>All DIY guides (such as limewashing, carpentry, or non-toxic cleaning recipes) are presented for educational purposes. Always wear appropriate personal protective gear (dust masks, goggles) and follow manufacturer safety guidelines. The Decor Diary is not liable for any damages or injuries resulting from attempting the projects showcased.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
