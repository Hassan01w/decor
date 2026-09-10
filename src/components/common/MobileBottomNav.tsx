import React, { useState, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  Home, 
  Compass, 
  Flame, 
  Bookmark, 
  Menu, 
  Search,
  BookOpen
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
  onOpenSavedDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenMenu,
  onOpenSavedDrawer
}) => {
  const { 
    currentPath, 
    navigate, 
    savedPostIds, 
    setIsSearchOpen 
  } = useBlog();

  const [activeHash, setActiveHash] = useState<string>(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Don't render on admin dashboard pages to prevent UI clash
  if (currentPath.startsWith('/admin')) {
    return null;
  }

  const isHome = currentPath === '/' && activeHash !== '#trending-topics';
  const isJournal = currentPath === '/blog' || currentPath.startsWith('/category/') || currentPath.startsWith('/post/');
  const isTopics = activeHash === '#trending-topics';

  const handleHomeClick = () => {
    setActiveHash('');
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJournalClick = () => {
    setActiveHash('');
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrendingClick = () => {
    setActiveHash('#trending-topics');
    if (currentPath !== '/') {
      navigate('/#trending-topics');
      setTimeout(() => {
        const el = document.getElementById('trending-topics');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    } else {
      const el = document.getElementById('trending-topics');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/#trending-topics');
      }
    }
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation Bar" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F7F4EE]/96 backdrop-blur-lg border-t border-[#E5DED2] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-3 pt-2 pb-[max(env(safe-area-inset-bottom),10px)] transition-all"
    >
      <div className="flex items-center justify-between max-w-md mx-auto">
        
        {/* 1. Home */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer min-w-[58px] active:scale-90 ${
            isHome 
              ? 'text-[#2F3A32] font-bold' 
              : 'text-[#7A7369] hover:text-[#242522]'
          }`}
          aria-label="Home"
          aria-current={isHome ? 'page' : undefined}
        >
          <div className={`p-1.5 rounded-xl transition-all duration-200 ${
            isHome 
              ? 'bg-[#E5DED2]/80 text-[#2F3A32] shadow-2xs scale-105' 
              : 'hover:bg-[#EFEAE1]'
          }`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">Home</span>
          {isHome && (
            <span className="w-1 h-1 rounded-full bg-[#2F3A32] mt-0.5" />
          )}
        </button>

        {/* 2. Journal / Explore */}
        <button
          onClick={handleJournalClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer min-w-[58px] active:scale-90 ${
            isJournal 
              ? 'text-[#2F3A32] font-bold' 
              : 'text-[#7A7369] hover:text-[#242522]'
          }`}
          aria-label="Journal Articles"
          aria-current={isJournal ? 'page' : undefined}
        >
          <div className={`p-1.5 rounded-xl transition-all duration-200 ${
            isJournal 
              ? 'bg-[#E5DED2]/80 text-[#2F3A32] shadow-2xs scale-105' 
              : 'hover:bg-[#EFEAE1]'
          }`}>
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">Journal</span>
          {isJournal && (
            <span className="w-1 h-1 rounded-full bg-[#2F3A32] mt-0.5" />
          )}
        </button>

        {/* 3. Topics / Slider (Trending Themes) */}
        <button
          onClick={handleTrendingClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer min-w-[58px] active:scale-90 ${
            isTopics 
              ? 'text-amber-900 font-bold' 
              : 'text-[#7A7369] hover:text-[#242522]'
          }`}
          aria-label="Trending Topics Slider"
        >
          <div className={`p-1.5 rounded-xl transition-all duration-200 relative ${
            isTopics 
              ? 'bg-amber-100 text-amber-700 border border-amber-300 shadow-2xs scale-105' 
              : 'bg-amber-50/70 border border-amber-200/50 hover:bg-amber-100'
          }`}>
            <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-semibold text-amber-950">Topics</span>
          {isTopics && (
            <span className="w-1 h-1 rounded-full bg-amber-600 mt-0.5" />
          )}
        </button>

        {/* 4. Saved Inspiration */}
        <button
          onClick={onOpenSavedDrawer}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-[#7A7369] hover:text-[#242522] transition-all cursor-pointer min-w-[58px] active:scale-90 relative"
          aria-label="Saved Pins"
        >
          <div className="p-1.5 rounded-xl hover:bg-[#EFEAE1] transition-all relative">
            <Bookmark className="w-5 h-5" />
            {savedPostIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#2F3A32] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs border border-white">
                {savedPostIds.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">Saved</span>
        </button>

        {/* 5. Menu Drawer */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-[#7A7369] hover:text-[#242522] transition-all cursor-pointer min-w-[58px] active:scale-90"
          aria-label="Open Navigation Menu"
        >
          <div className="p-1.5 rounded-xl hover:bg-[#EFEAE1] transition-all">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">Menu</span>
        </button>

      </div>
    </nav>
  );
};
