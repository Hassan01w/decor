import React, { useEffect, useRef } from 'react';
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
  const adRef = useRef<HTMLModElement>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    // Only attempt push if in production domain and not already pushed
    if (!isPushed.current && typeof window !== 'undefined') {
      try {
        const isCustomDomain = window.location.hostname.includes('thedecordiary.store');
        if (isCustomDomain && (window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          isPushed.current = true;
        }
      } catch (err) {
        // Suppress unapproved domain / adblock errors gracefully
        console.debug('AdSense notice: ad serving initialized or domain verification pending.');
      }
    }
  }, [publisherId, slot]);

  return (
    <div className={`my-8 p-4 bg-[#FAF8F5] border border-[#E5DED2] rounded-2xl text-center space-y-1.5 shadow-2xs ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D53]">
        Advertisement • Sponsored
      </span>
      <div className="min-h-[90px] flex items-center justify-center bg-white rounded-xl border border-dashed border-[#D9CFC4] p-4 overflow-hidden">
        {/* AdSense Unit */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '250px' }}
          data-ad-client={publisherId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        {/* Fallback label when waiting for approval / crawler */}
        <div className="text-xs text-[#8A7E73] space-y-1 py-1">
          <p className="font-serif italic text-sm text-[#2D2A26]">
            Curated Home Decor Inspiration
          </p>
          <p className="text-[11px] opacity-75">
            AdSense Partner: <code className="font-mono text-[#8C6D53]">{publisherId}</code>
          </p>
        </div>
      </div>
    </div>
  );
};
