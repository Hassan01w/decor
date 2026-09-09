import React, { useState, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { ShieldCheck, X } from 'lucide-react';

export const CookieConsentBanner: React.FC = () => {
  const { navigate } = useBlog();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('decordiary_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('decordiary_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-[#211E1B]/95 backdrop-blur-md text-[#FAF8F5] border-t border-[#3E3A35] shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-[#8C6D53] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-white text-base">
              Privacy & Cookie Transparency
            </h4>
            <p className="text-[#A89F95] text-xs leading-relaxed max-w-3xl">
              We use cookies to analyze site traffic, personalize content, and serve relevant advertisements through Google AdSense. By continuing to browse The Decor Diary, you consent to our use of cookies in accordance with our{' '}
              <button
                onClick={() => navigate('/privacy')}
                className="text-[#8C6D53] hover:underline font-semibold cursor-pointer"
              >
                Privacy Policy
              </button>{' '}
              and{' '}
              <button
                onClick={() => navigate('/terms')}
                className="text-[#8C6D53] hover:underline font-semibold cursor-pointer"
              >
                Terms of Service
              </button>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleAccept}
            className="px-6 py-2.5 bg-[#8C6D53] hover:bg-[#735742] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            Accept & Continue
          </button>
          <button
            onClick={handleAccept}
            className="p-2 text-[#A89F95] hover:text-white transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
