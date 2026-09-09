import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  Search, 
  Bookmark, 
  Menu, 
  X, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  onOpenSavedDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSavedDrawer }) => {
  const { 
    navigation, 
    siteSettings, 
    currentPath, 
    navigate, 
    setIsSearchOpen, 
    savedPostIds, 
    isAdmin 
  } = useBlog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeNavItems = navigation
    .filter(item => item.isEnabled)
    .sort((a, b) => a.order - b.order);

  const handleNavClick = (url: string) => {
    setMobileMenuOpen(false);
    navigate(url);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#E5DED2] transition-all">
      {/* Optional Top Announcement Bar */}
      {siteSettings.headerAnnouncement?.enabled && (
        <div className="bg-[#2F3A32] text-[#F7F4EE] py-2 px-4 text-xs font-medium text-center tracking-wide flex items-center justify-center gap-2">
          <span>{siteSettings.headerAnnouncement.text}</span>
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
              className="underline decoration-[#C8A97E] hover:text-[#C8A97E] font-semibold ml-1 cursor-pointer transition-colors"
            >
              {siteSettings.headerAnnouncement.linkText} &rarr;
            </a>
          )}
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile Menu Trigger & Search */}
          <div className="flex items-center gap-3 md:w-1/4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#242522] hover:bg-[#EFEAE1] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium text-[#7A7369] bg-white hover:bg-[#EFEAE1] transition-all hover:text-[#242522] border border-[#E5DED2] shadow-2xs cursor-pointer"
              title="Search Articles (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-[#2F3A32]" />
              <span className="hidden sm:inline">Search journal...</span>
            </button>
          </div>

          {/* Center: Editorial Brand Logo */}
          <div className="text-center flex flex-col items-center cursor-pointer select-none" onClick={() => navigate('/')}>
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.18em] text-[#242522] uppercase hover:text-[#2F3A32] transition-colors">
              {siteSettings.logoText && !siteSettings.logoText.toUpperCase().includes('HAVEN')
                ? siteSettings.logoText
                : 'THE DECOR DIARY'}
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#A68B6A] font-bold -mt-0.5">
              {siteSettings.logoSubtext && !siteSettings.logoSubtext.toUpperCase().includes('HAVEN') && !siteSettings.logoSubtext.toUpperCase().includes('LIFESTYLE JOURNAL')
                ? siteSettings.logoSubtext
                : 'ONLINE HOME DECOR STORE'}
            </span>
          </div>

          {/* Right: Actions (Saved Inspiration) */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 md:w-1/4">
            <button
              onClick={onOpenSavedDrawer}
              className="relative p-2.5 rounded-full text-[#242522] hover:bg-[#EFEAE1] transition-colors group cursor-pointer"
              title="Saved Inspiration Pins"
            >
              <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform text-[#7A7369] group-hover:text-[#2F3A32]" />
              {savedPostIds.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#2F3A32] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5DED2] bg-[#F7F4EE] px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="text-xs uppercase tracking-widest text-[#2F3A32] font-bold">Categories & Pages</div>
          <div className="flex flex-col space-y-2 divide-y divide-[#E5DED2]">
            {activeNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.url)}
                className="flex items-center justify-between text-left py-2.5 text-base font-medium text-[#242522] hover:text-[#2F3A32] transition-colors"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-[#A89F95]" />
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
