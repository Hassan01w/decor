import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBlog } from '../../context/BlogContext';
import { 
  Search, 
  Bookmark, 
  X, 
  ChevronRight, 
  Flame, 
  Compass, 
  Home, 
  BookOpen, 
  Layers, 
  LayoutDashboard, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Mail,
  Info
} from 'lucide-react';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSavedDrawer: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSavedDrawer
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

  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavClick = (url: string) => {
    onClose();
    if (url.startsWith('#')) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(`/${url}`);
      }
    } else {
      navigate(url);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onClose();
      navigate(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    } else {
      onClose();
      setIsSearchOpen(true);
    }
  };

  const activeNavItems = navigation && navigation.length > 0 
    ? navigation.filter(item => item.isEnabled).sort((a, b) => a.order - b.order)
    : [
        { id: '1', label: 'Home', url: '/', isEnabled: true, order: 1 },
        { id: '2', label: 'Journal', url: '/blog', isEnabled: true, order: 2 },
        { id: '3', label: 'About', url: '/about', isEnabled: true, order: 3 },
        { id: '4', label: 'Contact', url: '/contact', isEnabled: true, order: 4 },
      ];

  const drawerContent = (
    <div 
      className="fixed inset-0 z-[70] flex" 
      role="dialog" 
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Backdrop with Blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div 
        className="relative w-[85vw] max-w-sm sm:max-w-md bg-[#F7F4EE] h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-[#E5DED2] z-10 animate-in slide-in-from-left duration-300"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Top Header */}
        <div>
          <div className="p-4 sm:p-5 border-b border-[#E5DED2] flex items-center justify-between bg-white/70 sticky top-0 z-20 backdrop-blur-sm">
            <div>
              <span className="font-serif text-lg font-bold tracking-wider text-[#242522] block uppercase">
                {siteSettings.logoText || 'THE DECOR DIARY'}
              </span>
              <span className="text-[8.5px] uppercase tracking-widest text-[#A68B6A] font-bold block">
                {siteSettings.logoSubtext || 'Navigation & Discovery'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full hover:bg-[#EFEAE1] text-[#242522] transition-colors cursor-pointer border border-[#E5DED2] flex items-center justify-center min-w-[40px] min-h-[40px]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="p-4 border-b border-[#E5DED2] bg-white">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search articles, rooms, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#E5DED2] text-xs text-[#242522] placeholder-[#7A7369] focus:outline-none focus:border-[#2F3A32]"
              />
              <Search className="w-4 h-4 text-[#7A7369] absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7369] hover:text-[#242522] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsSearchOpen(true);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold bg-[#EFEAE1] text-[#7A7369] px-1.5 py-0.5 rounded border border-[#E5DED2]"
                  title="Press Ctrl+K for search modal"
                >
                  Ctrl+K
                </button>
              )}
            </form>
          </div>

          {/* Feature Quick Links */}
          <div className="p-4 grid grid-cols-2 gap-2 border-b border-[#E5DED2]">
            <button
              onClick={() => {
                onClose();
                const el = document.getElementById('trending-topics');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/#trending-topics');
                }
              }}
              className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-left transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-amber-950 block truncate">Tag Slider</span>
                <span className="text-[10px] text-amber-800 block">33+ Topics</span>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenSavedDrawer();
              }}
              className="p-3 rounded-xl bg-white hover:bg-[#EFEAE1] border border-[#E5DED2] text-left transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#EFEAE1] flex items-center justify-center shrink-0">
                <Bookmark className="w-4 h-4 text-[#2F3A32]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#242522] block truncate">Saved Pins</span>
                <span className="text-[10px] text-[#7A7369] block font-mono">{savedPostIds.length} saved</span>
              </div>
            </button>
          </div>

          {/* Primary Navigation Links */}
          <div className="p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7369] px-2 block mb-2">
              Primary Navigation
            </span>
            {activeNavItems.map((item) => {
              const isActive = currentPath === item.url || (item.url !== '/' && currentPath.startsWith(item.url));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.url)}
                  className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#2F3A32] text-white shadow-xs'
                      : 'text-[#33302E] hover:bg-white'
                  }`}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#C8A97E]' : 'text-[#A89F95]'}`} />
                </button>
              );
            })}
          </div>

          {/* Room Categories Matrix */}
          <div className="p-4 border-t border-[#E5DED2] space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7369] block">
                Browse Rooms & Categories
              </span>
              <button
                onClick={() => {
                  onClose();
                  navigate('/blog');
                }}
                className="text-[10px] text-[#A68B6A] hover:underline font-bold"
              >
                View All &rarr;
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const count = publishedPosts.filter(p => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onClose();
                      navigate(`/category/${cat.slug}`);
                    }}
                    className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-left text-xs font-medium text-[#242522] border border-[#E5DED2] hover:border-[#8C6D53] transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <span className="truncate group-hover:text-[#8C6D53] font-medium">{cat.name}</span>
                    <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-[#F7F4EE] text-[#7A7369] font-mono ml-1 shrink-0">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Design Archetypes Quick Jumps */}
          <div className="p-4 border-t border-[#E5DED2] space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7369] px-2 block">
              Featured Archetypes
            </span>
            <div className="flex flex-wrap gap-1.5 px-1">
              {[
                { name: 'Warm Minimalism', tag: 'Minimalism' },
                { name: 'Japandi Harmony', tag: 'Japandi' },
                { name: 'Organic Modern', tag: 'Modern' },
                { name: 'Parisian Touch', tag: 'Luxury' },
                { name: 'Biophilic Living', tag: 'Indoor Plants' },
                { name: 'Wabi-Sabi Texture', tag: 'Wabi-Sabi' }
              ].map((arch) => (
                <button
                  key={arch.name}
                  onClick={() => {
                    onClose();
                    navigate(`/blog?search=${encodeURIComponent(arch.tag)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/70 hover:bg-[#2F3A32] hover:text-white border border-[#E5DED2] text-[11px] text-[#4A453E] transition-colors cursor-pointer"
                >
                  #{arch.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer: Admin Access & Copyright */}
        <div className="p-4 border-t border-[#E5DED2] bg-white/70 space-y-3 pb-8 mt-4">
          {isAdminAuthenticated ? (
            <div className="space-y-2 p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DFD5]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#242522] truncate">
                  {currentUser?.name || 'Administrator'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider">
                  {currentUser?.role || 'Admin'}
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate('/admin');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#2F3A32] hover:bg-[#202722] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-[#C8A97E]" />
                <span>Open Admin CMS Dashboard</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                navigate('/admin/login');
              }}
              className="w-full py-2.5 text-center text-xs font-medium text-[#7A7369] hover:text-[#242522] transition-colors border border-dashed border-[#D9CFC4] hover:border-[#8C6D53] rounded-xl bg-white/50 cursor-pointer"
            >
              Author & Editorial CMS Portal &rarr;
            </button>
          )}

          <div className="text-center space-y-1">
            <p className="text-[10px] text-[#A89F95]">
              &copy; {new Date().getFullYear()} {siteSettings.siteName || siteSettings.logoText || 'The Decor Diary'}. All rights reserved.
            </p>
            <p className="text-[9px] text-[#8C6D53] uppercase tracking-widest font-semibold">
              Curated Editorial & Home Aesthetics
            </p>
          </div>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(drawerContent, document.body) : null;
};
