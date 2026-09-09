import React from 'react';
import { useBlog } from '../../context/BlogContext';

interface AdSenseBannerProps {
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
  slot?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({ 
  format = 'auto', 
  className = '',
  slot = 'decor-diary-ad-slot'
}) => {
  const { siteSettings } = useBlog();
  const publisherId = siteSettings.googleAdsenseId || 'ca-pub-2818671808304288';

  return (
    <div className={`my-8 p-4 bg-[#FAF8F5] border border-[#E5DED2] rounded-2xl text-center space-y-1.5 shadow-2xs ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D53]">
        Advertisement • Sponsored
      </span>
      <div className="min-h-[90px] flex items-center justify-center bg-white rounded-xl border border-dashed border-[#D9CFC4] p-4">
        <div className="text-xs text-[#8A7E73] space-y-1">
          <p className="font-serif italic text-sm text-[#2D2A26]">
            Curated Home Decor Inspiration
          </p>
          <p className="text-[11px] opacity-75">
            AdSense Publisher: <code className="font-mono text-[#8C6D53]">{publisherId}</code> (Slot: {slot})
          </p>
        </div>
      </div>
    </div>
  );
};
