import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  Search, 
  Bookmark, 
  Menu, 
  X, 
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  onOpenSavedDrawer: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenSavedDrawer,
  isMobileMenuOpen: externalMenuOpen,
  setIsMobileMenuOpen: setExternalMenuOpen
}) => {
  const { 
    navigation, 
    siteSettings, 
    currentPath, 
    navigate, 
    setIsSearchOpen, 
    savedPostIds, 
    isAdminAuthenticated
  } = useBlog();

  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  
  // Support both controlled and uncontrolled mobile menu state
  const isMenuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen;
  const setMenuOpen = (val: boolean) => {
    if (setExternalMenuOpen) {
      setExternalMenuOpen(val);
    } else {
      setInternalMenuOpen(val);
    }
  };

  const activeNavItems = navigation
    .filter(item => item.isEnabled)
    .sort((a, b) => a.order - b.order);

  const handleNavClick = (url: string) => {
    setMenuOpen(false);
    if (url.startsWith('#')) {
      const el = document.querySelector(url);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(url);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#E5DED2] transition-all">
      {/* Optional Top Announcement Bar */}
      {siteSettings.headerAnnouncement?.enabled && (
        <div className="bg-[#2F3A32] text-[#F7F4EE] py-2 px-3 sm:px-4 text-[11px] sm:text-xs font-medium text-center tracking-wide flex items-center justify-center gap-2">
          <span className="truncate">{siteSettings.headerAnnouncement.text}</span>
          {siteSettings.headerAnnouncement.linkText && (
            <a 
              href={siteSettings.headerAnnouncement.linkUrl}
              onClick={(e) => {
                if (siteSettings.headerAnnouncement.linkUrl.startsWith('#')) {
                  e.preventDefault();
                  const target = document.querySelector(siteSettings.headerAnnouncement.linkUrl);
                  target?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="underline decoration-[#C8A97E] hover:text-[#C8A97E] font-semibold shrink-0 cursor-pointer transition-colors"
            >
              {siteSettings.headerAnnouncement.linkText} &rarr;
            </a>
          )}
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Left: Mobile Menu Trigger & Search */}
          <div className="flex items-center gap-1 sm:gap-3 lg:w-1/4">
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#242522] hover:bg-[#EFEAE1] transition-colors cursor-pointer"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              title="Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-medium text-[#7A7369] bg-white hover:bg-[#EFEAE1] transition-all hover:text-[#242522] border border-[#E5DED2] shadow-2xs cursor-pointer"
              title="Search Articles (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2F3A32]" />
              <span className="hidden sm:inline">Search journal...</span>
            </button>
          </div>

          {/* Center: Editorial Brand Logo */}
          <div 
            className="text-center flex flex-col items-center cursor-pointer select-none py-1 overflow-hidden" 
            onClick={() => navigate('/')}
          >
            <span className="font-serif text-lg sm:text-2xl md:text-3xl font-bold tracking-[0.14em] sm:tracking-[0.18em] text-[#242522] uppercase hover:text-[#2F3A32] transition-colors truncate max-w-[210px] sm:max-w-none">
              {siteSettings.logoText && !siteSettings.logoText.toUpperCase().includes('HAVEN')
                ? siteSettings.logoText
                : 'THE DECOR DIARY'}
            </span>
            <span className="text-[7.5px] sm:text-[9.5px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#A68B6A] font-bold -mt-0.5 whitespace-nowrap">
              {siteSettings.logoSubtext && !siteSettings.logoSubtext.toUpperCase().includes('HAVEN') && !siteSettings.logoSubtext.toUpperCase().includes('LIFESTYLE JOURNAL')
                ? siteSettings.logoSubtext
                : 'ONLINE HOME DECOR STORE'}
            </span>
          </div>

          {/* Right: Actions (Saved Inspiration + Admin Badge if logged in) */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3 lg:w-1/4">
            {isAdminAuthenticated && (
              <button
                onClick={() => navigate('/admin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2F3A32] hover:bg-[#202722] text-white text-[10px] font-bold uppercase tracking-wider transition-colors border border-[#445248]"
                title="Go to Admin CMS Dashboard"
              >
                <ShieldCheck className="w-3 h-3 text-[#C8A97E]" />
                <span className="hidden md:inline">Admin CMS</span>
              </button>
            )}

            <button
              onClick={onOpenSavedDrawer}
              className="relative p-2 sm:p-2.5 rounded-full text-[#242522] hover:bg-[#EFEAE1] transition-colors group cursor-pointer"
              title="Saved Inspiration Pins"
              aria-label="View Saved Articles"
            >
              <Bookmark className="w-4.5 h-4.5 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform text-[#7A7369] group-hover:text-[#2F3A32]" />
              {savedPostIds.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#2F3A32] text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {savedPostIds.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Editorial Category Navigation Bar */}
        <nav className="hidden lg:flex items-center justify-center border-t border-[#E5DED2] py-3 gap-8">
          {activeNavItems.map((item) => {
            const isActive = currentPath === item.url || (item.url !== '/' && currentPath.startsWith(item.url));
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.url)}
                className={`text-xs uppercase tracking-[0.16em] font-medium transition-all relative py-1 hover:text-[#2F3A32] cursor-pointer ${
                  isActive ? 'text-[#2F3A32] font-bold' : 'text-[#5A534B]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2F3A32] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
