import React, { useEffect, useRef } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Search, X, ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    searchQuery, 
    setSearchQuery, 
    publishedPosts, 
    categories, 
    navigate 
  } = useBlog();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const query = (searchQuery || '').trim().toLowerCase();

  // Search through titles, excerpts, tags, category names, and content blocks
  const matchedPosts = query ? (publishedPosts || []).filter(post => {
    if (!post) return false;
    const titleMatch = (post.title || '').toLowerCase().includes(query);
    const excerptMatch = (post.excerpt || '').toLowerCase().includes(query);
    const tagMatch = Array.isArray(post.tags) && post.tags.some(t => (t || '').toLowerCase().includes(query));
    const cat = categories.find(c => c.id === post.categoryId);
    const catMatch = (cat?.name || '').toLowerCase().includes(query);
    
    let contentMatch = false;
    if (Array.isArray(post.contentBlocks)) {
      contentMatch = post.contentBlocks.some(b => 
        (b?.content?.text || '').toLowerCase().includes(query) ||
        (b?.content?.caption || '').toLowerCase().includes(query)
      );
    }

    return titleMatch || excerptMatch || tagMatch || catMatch || contentMatch;
  }) : [];

  const handleSelectPost = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/blog/${slug}`);
  };

  const handleSelectCategory = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/category/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F5] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E5DED2] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="relative border-b border-[#E5DED2] p-4 sm:p-6 flex items-center gap-3 bg-white">
          <Search className="w-6 h-6 text-[#2F3A32] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search home decor, DIY guides, pantry organization, recipes..."
            className="w-full bg-transparent text-lg sm:text-xl font-serif text-[#242522] placeholder-[#A89F95] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full text-[#7A7369] hover:text-[#242522] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-3 py-1 bg-[#F7F4EE] hover:bg-[#EFEAE1] border border-[#E5DED2] text-[#7A7369] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!query ? (
            <div className="py-8 text-center space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-[#A68B6A]">
                Suggested Curated Categories
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className="px-3.5 py-1.5 bg-white hover:bg-[#2F3A32] hover:text-white border border-[#E5DED2] rounded-full text-xs font-medium text-[#242522] transition-colors cursor-pointer shadow-2xs"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          ) : matchedPosts.length > 0 ? (
            <div className="space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-[#7A7369] px-2">
                Found {matchedPosts.length} Matching {matchedPosts.length === 1 ? 'Article' : 'Articles'}
              </div>
              {matchedPosts.map(post => {
                const cat = categories.find(c => c.id === post.categoryId);
                return (
                  <div
                    key={post.id}
                    onClick={() => handleSelectPost(post.slug)}
                    className="group bg-white p-4 rounded-2xl border border-[#E5DED2] hover:border-[#2F3A32] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-14 h-14 rounded-xl object-cover ring-1 ring-[#E5DED2] shrink-0"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-[#7A7369]">
                          {cat && (
                            <span className="font-bold uppercase tracking-wider text-[#2F3A32]">
                              {cat.name}
                            </span>
                          )}
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#A68B6A]" />
                            {post.readingTimeMinutes} min read
                          </span>
                        </div>
                        <h4 className="font-serif text-sm sm:text-base font-bold text-[#242522] group-hover:text-[#2F3A32] truncate">
                          {post.title}
                        </h4>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#A68B6A] group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-[#A68B6A] mx-auto opacity-50" />
              <h3 className="font-serif text-lg font-bold text-[#242522]">No matching articles found</h3>
              <p className="text-xs text-[#7A7369]">
                Try adjusting your search keywords or browsing our lifestyle categories above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
