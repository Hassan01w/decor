import React, { useState, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  Search, 
  Bookmark, 
  Menu, 
  X, 
  ChevronRight,
  Flame,
  Compass,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Grid
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
    categories,
    publishedPosts,
    isAdminAuthenticated,
    currentUser
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

  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

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

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      setMenuOpen(false);
      navigate(`/blog?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchQuery('');
    } else {
      setIsSearchOpen(true);
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

      {/* LUXURY MOBILE SLIDE-OVER DRAWER WITH BACKDROP */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#F7F4EE] h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-[#E5DED2] z-10 animate-in slide-in-from-left duration-300">
            
            {/* Drawer Header */}
            <div>
              <div className="p-4 sm:p-5 border-b border-[#E5DED2] flex items-center justify-between bg-white/50">
                <div>
                  <span className="font-serif text-lg font-bold tracking-wider text-[#242522] block">
                    {siteSettings.logoText || 'THE DECOR DIARY'}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-[#A68B6A] font-bold block">
                    Navigation & Discovery
                  </span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-[#EFEAE1] text-[#242522] transition-colors cursor-pointer border border-[#E5DED2]"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Quick Search Bar */}
              <div className="p-4 border-b border-[#E5DED2] bg-white">
                <form onSubmit={handleMobileSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search journal guides, rooms..."
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#E5DED2] text-xs text-[#242522] placeholder-[#7A7369] focus:outline-none focus:border-[#2F3A32]"
                  />
                  <Search className="w-4 h-4 text-[#7A7369] absolute left-3 top-1/2 -translate-y-1/2" />
                  {mobileSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setMobileSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7369] hover:text-[#242522]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>
              </div>

              {/* Quick Feature Buttons */}
              <div className="p-4 grid grid-cols-2 gap-2 border-b border-[#E5DED2]">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    const el = document.getElementById('trending-topics');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/#trending-topics');
                    }
                  }}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">Tag Slider</span>
                    <span className="text-[9px] text-amber-800">33+ Topics</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenSavedDrawer();
                  }}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#EFEAE1] border border-[#E5DED2] text-left transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 text-[#2F3A32] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-[#242522] block">Saved Pins</span>
                    <span className="text-[9px] text-[#7A7369]">{savedPostIds.length} saved</span>
                  </div>
                </button>
              </div>

              {/* Main Navigation Links */}
              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7369] px-2 block mb-2">
                  Primary Pages
                </span>
                {activeNavItems.map((item) => {
                  const isActive = currentPath === item.url;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.url)}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#2F3A32] text-white'
                          : 'text-[#33302E] hover:bg-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#C8A97E]' : 'text-[#A89F95]'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Room Categories Matrix */}
              <div className="p-4 border-t border-[#E5DED2] space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7369] px-2 block">
                  Browse by Room & Category
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.slice(0, 6).map((cat) => {
                    const count = publishedPosts.filter(p => p.categoryId === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setMenuOpen(false);
                          navigate(`/category/${cat.slug}`);
                        }}
                        className="p-2 rounded-lg bg-white/70 hover:bg-white text-left text-xs font-medium text-[#242522] border border-[#E5DED2] transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[9px] text-[#7A7369] font-mono ml-1">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer: Admin Access & Copyright */}
            <div className="p-4 border-t border-[#E5DED2] bg-white/50 space-y-3 pb-8">
              {isAdminAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#242522]">Logged in as {currentUser?.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                      {currentUser?.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/admin');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#2F3A32] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#C8A97E]" />
                    <span>Open Admin CMS Dashboard</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/admin/login');
                  }}
                  className="w-full py-2 text-center text-xs text-[#7A7369] hover:text-[#242522] transition-colors"
                >
                  Editor & Author Portal &rarr;
                </button>
              )}

              <p className="text-[10px] text-center text-[#A89F95]">
                &copy; {new Date().getFullYear()} {siteSettings.siteName || siteSettings.logoText || 'The Decor Diary'}. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
