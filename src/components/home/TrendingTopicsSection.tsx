import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Hash, 
  Check, 
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  Search,
  Play,
  Pause
} from 'lucide-react';

interface TrendingTopicsSectionProps {
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const TrendingTopicsSection: React.FC<TrendingTopicsSectionProps> = ({
  activeTag,
  onSelectTag
}) => {
  const { publishedPosts, categories, navigate } = useBlog();
  const [activeTab, setActiveTab] = useState<'all' | 'rooms' | 'materials' | 'rituals'>('all');
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [tagSearchQuery, setTagSearchQuery] = useState<string>('');
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Compute tag frequencies from real published posts
  const tagStats = useMemo(() => {
    const counts: Record<string, number> = {};
    
    publishedPosts.forEach(post => {
      post.tags?.forEach(t => {
        const trimmed = t.trim();
        if (trimmed) {
          counts[trimmed] = (counts[trimmed] || 0) + 1;
        }
      });
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        isHot: count >= 2,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      }))
      .sort((a, b) => b.count - a.count);
  }, [publishedPosts]);

  // Curated classification for tabs
  const roomTags = ['Living Room', 'Small Spaces', 'Bedroom Design', 'Open Shelving', 'Kitchen Organization'];
  const materialTags = ['Limewash', 'Paint Transformation', 'Woodworking', 'Reclaimed Timber', 'Ceramics', 'Linen Care'];
  const ritualTags = ['Warm Minimalism', 'Slow Living', 'Kitchen Rituals', 'Non-Toxic Living', 'Plant Styling', 'Natural Cleaning', 'Sustainable Living'];

  const filteredTags = useMemo(() => {
    let list = tagStats;

    if (activeTab === 'rooms') {
      list = tagStats.filter(t => roomTags.some(rt => rt.toLowerCase() === t.name.toLowerCase()) || t.name.toLowerCase().includes('room') || t.name.toLowerCase().includes('space'));
    } else if (activeTab === 'materials') {
      list = tagStats.filter(t => materialTags.some(mt => mt.toLowerCase() === t.name.toLowerCase()) || t.name.toLowerCase().includes('diy') || t.name.toLowerCase().includes('timber') || t.name.toLowerCase().includes('paint'));
    } else if (activeTab === 'rituals') {
      list = tagStats.filter(t => ritualTags.some(rt => rt.toLowerCase() === t.name.toLowerCase()) || t.name.toLowerCase().includes('living') || t.name.toLowerCase().includes('clean') || t.name.toLowerCase().includes('plant'));
    }

    if (tagSearchQuery.trim()) {
      const q = tagSearchQuery.toLowerCase().trim();
      list = list.filter(t => t.name.toLowerCase().includes(q));
    }

    return list;
  }, [tagStats, activeTab, tagSearchQuery]);

  // Group tags into columns of 2 for a neatly aligned 2-row horizontal slider track
  const tagColumns = useMemo(() => {
    const cols: typeof filteredTags[] = [];
    for (let i = 0; i < filteredTags.length; i += 2) {
      cols.push(filteredTags.slice(i, i + 2));
    }
    return cols;
  }, [filteredTags]);

  // Handle scroll progress and arrow states
  const updateScrollState = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    } else {
      setScrollProgress(0);
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [filteredTags, viewMode]);

  // Auto-play timer when enabled and not hovered
  useEffect(() => {
    if (!isAutoPlay || isHovered || isMouseDown || viewMode !== 'slider') return;
    const interval = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 25) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, 3600);
    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered, isMouseDown, viewMode]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const distance = sliderRef.current.clientWidth > 640 ? 460 : 300;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth'
    });
  };

  // Mouse Drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  // Find top trending article for spotlight
  const breakoutPost = useMemo(() => {
    return publishedPosts.find(p => p.tags?.some(t => t.toLowerCase().includes('minimalism') || t.toLowerCase().includes('limewash'))) || publishedPosts[0];
  }, [publishedPosts]);

  return (
    <section id="trending-topics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5DED2] pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Trend Radar & Topic Pulse</span>
            </span>
            <span className="text-xs text-[#7A7369] font-medium hidden sm:inline">
              Updated Live from Published Journal Editions
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#242522]">
            Trending Topics & Popular Tags
          </h2>
          <p className="text-xs sm:text-sm text-[#5A534B] max-w-2xl leading-relaxed">
            Discover what our editors, interior architects, and readers are styling, saving, and debating this season. Filter stories instantly by selecting any topic.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#EFEAE1] p-1 rounded-full border border-[#E5DED2] self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#2F3A32] text-white shadow-xs'
                : 'text-[#5A534B] hover:text-[#242522]'
            }`}
          >
            All Topics ({tagStats.length})
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'rooms'
                ? 'bg-[#2F3A32] text-white shadow-xs'
                : 'text-[#5A534B] hover:text-[#242522]'
            }`}
          >
            Rooms & Spaces
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'materials'
                ? 'bg-[#2F3A32] text-white shadow-xs'
                : 'text-[#5A534B] hover:text-[#242522]'
            }`}
          >
            Materials & DIY
          </button>
          <button
            onClick={() => setActiveTab('rituals')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'rituals'
                ? 'bg-[#2F3A32] text-white shadow-xs'
                : 'text-[#5A534B] hover:text-[#242522]'
            }`}
          >
            Rituals & Slow Living
          </button>
        </div>
      </div>

      {/* Main Grid: Tags Slider & Breakout Topic Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Interactive Tags Slider / Matrix */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-[#E5DED2] shadow-xs space-y-5">
          
          {/* Slider Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFEAE1]">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#C8A97E]" />
              <span className="text-xs uppercase font-bold tracking-widest text-[#242522]">
                Explore by Tag ({filteredTags.length} Active Tags)
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {/* Filter / Search within tags */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#A89F95] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter tags..."
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  className="pl-8 pr-6 py-1 text-xs rounded-full bg-[#F7F4EE] border border-[#E5DED2] text-[#242522] placeholder-[#A89F95] focus:outline-none focus:border-[#2F3A32] w-28 sm:w-36 transition-all"
                />
                {tagSearchQuery && (
                  <button
                    onClick={() => setTagSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A89F95] hover:text-[#242522]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Auto-Slide Toggle */}
              {viewMode === 'slider' && (
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border cursor-pointer ${
                    isAutoPlay
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                      : 'bg-[#F7F4EE] hover:bg-[#EFEAE1] text-[#7A7369] border-[#E5DED2]'
                  }`}
                  title={isAutoPlay ? "Pause auto-slide" : "Start auto-slide"}
                >
                  {isAutoPlay ? (
                    <>
                      <Pause className="w-3 h-3 text-amber-700" />
                      <span className="hidden sm:inline">Auto</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-[#7A7369]" />
                      <span className="hidden sm:inline">Play</span>
                    </>
                  )}
                </button>
              )}

              {/* View Mode Toggle: Slider vs Grid */}
              <div className="flex items-center bg-[#F7F4EE] rounded-full p-0.5 border border-[#E5DED2]">
                <button
                  onClick={() => setViewMode('slider')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    viewMode === 'slider' 
                      ? 'bg-[#2F3A32] text-white shadow-2xs' 
                      : 'text-[#7A7369] hover:text-[#242522]'
                  }`}
                  title="Interactive Horizontal Slider"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    viewMode === 'grid' 
                      ? 'bg-[#2F3A32] text-white shadow-2xs' 
                      : 'text-[#7A7369] hover:text-[#242522]'
                  }`}
                  title="Expand All in Grid"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Slider Arrow Controls */}
              {viewMode === 'slider' && (
                <div className="flex items-center gap-1 ml-1">
                  <button
                    onClick={() => handleScroll('left')}
                    disabled={!canScrollLeft}
                    className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                      canScrollLeft
                        ? 'bg-[#F7F4EE] hover:bg-[#2F3A32] hover:text-white text-[#242522] border-[#E5DED2] shadow-2xs'
                        : 'bg-[#FAF8F5] text-[#D0C7BC] border-transparent cursor-not-allowed opacity-50'
                    }`}
                    aria-label="Previous Tags"
                    title="Slide left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleScroll('right')}
                    disabled={!canScrollRight}
                    className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                      canScrollRight
                        ? 'bg-[#F7F4EE] hover:bg-[#2F3A32] hover:text-white text-[#242522] border-[#E5DED2] shadow-2xs'
                        : 'bg-[#FAF8F5] text-[#D0C7BC] border-transparent cursor-not-allowed opacity-50'
                    }`}
                    aria-label="Next Tags"
                    title="Slide right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Active tag reset button */}
              {activeTag && (
                <button
                  onClick={() => onSelectTag(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full border border-red-200 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>
          </div>

          {/* SLIDER / GRID VIEW CONTAINER */}
          {filteredTags.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-xs text-[#7A7369]">No tags match your search filter.</p>
              <button
                onClick={() => setTagSearchQuery('')}
                className="text-xs font-bold text-[#2F3A32] underline hover:text-[#C8A97E]"
              >
                Clear Search
              </button>
            </div>
          ) : viewMode === 'slider' ? (
            <div 
              className="relative group/slider"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                handleMouseUpOrLeave();
              }}
            >
              {/* Floating Left Arrow */}
              {canScrollLeft && (
                <button
                  onClick={() => handleScroll('left')}
                  className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-[#242522] hover:bg-[#2F3A32] hover:text-white shadow-lg border border-[#E5DED2] items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Previous Tags"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Floating Right Arrow */}
              {canScrollRight && (
                <button
                  onClick={() => handleScroll('right')}
                  className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-[#242522] hover:bg-[#2F3A32] hover:text-white shadow-lg border border-[#E5DED2] items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Next Tags"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Left Gradient Mask */}
              {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
              )}
              {/* Right Gradient Mask */}
              {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
              )}

              {/* High-Performance 2-Row Chunked Horizontal Scrollable Track */}
              <div
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                className={`flex gap-3 overflow-x-auto scroll-smooth py-2.5 px-1 select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x ${
                  isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{ scrollbarWidth: 'none' }}
              >
                {tagColumns.map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-2.5 shrink-0 snap-start">
                    {col.map((tag) => {
                      const isSelected = activeTag?.toLowerCase() === tag.name.toLowerCase();

                      return (
                        <button
                          key={tag.name}
                          onClick={() => onSelectTag(isSelected ? null : tag.name)}
                          className={`group/btn relative inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all duration-200 cursor-pointer border whitespace-nowrap shadow-2xs ${
                            isSelected
                              ? 'bg-[#2F3A32] text-white border-[#2F3A32] shadow-sm scale-102 ring-2 ring-[#C8A97E]/40'
                              : 'bg-[#F7F4EE] hover:bg-white text-[#33302E] border-[#E5DED2] hover:border-[#C8A97E] hover:shadow-xs'
                          }`}
                          title={`Filter articles tagged with #${tag.name}`}
                        >
                          <span className="text-[#C8A97E] font-bold group-hover/btn:scale-110 transition-transform">#</span>
                          <span className="font-semibold">{tag.name}</span>
                          
                          {tag.isHot && !isSelected && (
                            <Flame className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" />
                          )}

                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-[#E5DED2]/60 text-[#7A7369] group-hover/btn:bg-[#EFEAE1]'
                          }`}>
                            {tag.count}
                          </span>

                          {isSelected && (
                            <Check className="w-3 h-3 text-[#C8A97E] ml-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Visual Slider Scroll Progress Bar */}
              <div className="pt-2 flex items-center justify-between gap-3 text-[10px] text-[#7A7369]">
                <span className="hidden sm:inline">
                  Slide or drag horizontally with touch &larr; &rarr; ({filteredTags.length} active tags)
                </span>
                <div className="flex-1 max-w-xs sm:max-w-md h-1.5 bg-[#EFEAE1] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2F3A32] transition-all duration-150 rounded-full"
                    style={{ width: `${Math.max(15, scrollProgress)}%` }}
                  />
                </div>
                <span className="font-mono font-semibold">
                  {Math.round(scrollProgress)}%
                </span>
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="flex flex-wrap gap-2.5 max-h-80 overflow-y-auto pr-1">
              {filteredTags.map((tag) => {
                const isSelected = activeTag?.toLowerCase() === tag.name.toLowerCase();

                return (
                  <button
                    key={tag.name}
                    onClick={() => onSelectTag(isSelected ? null : tag.name)}
                    className={`group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#2F3A32] text-white border-[#2F3A32] shadow-sm scale-102 ring-2 ring-[#C8A97E]/40'
                        : 'bg-[#F7F4EE] hover:bg-white text-[#33302E] border-[#E5DED2] hover:border-[#C8A97E] hover:shadow-xs'
                    }`}
                    title={`Filter articles tagged with #${tag.name}`}
                  >
                    <span className="text-[#C8A97E] font-bold group-hover:scale-110 transition-transform">#</span>
                    <span className="font-semibold">{tag.name}</span>
                    
                    {tag.isHot && !isSelected && (
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-400" />
                    )}

                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E5DED2]/60 text-[#7A7369] group-hover:bg-[#EFEAE1]'
                    }`}>
                      {tag.count}
                    </span>

                    {isSelected && (
                      <Check className="w-3 h-3 text-[#C8A97E] ml-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Tag Status & Prompt */}
          {activeTag ? (
            <div className="p-4 rounded-2xl bg-[#F7F4EE] border border-[#E5DED2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-[#242522]">
                  Currently filtering Latest Articles for <strong>#{activeTag}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = document.querySelector('#latest-articles') || document.querySelector('#categories');
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#2F3A32] underline hover:text-[#C8A97E] cursor-pointer"
                >
                  Jump to Filtered Articles &darr;
                </button>
                <button
                  onClick={() => onSelectTag(null)}
                  className="text-xs font-semibold text-[#7A7369] hover:text-[#242522] cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#7A7369] italic">
              Tip: Click or slide across any tag above to instantly isolate matching guides and masterclasses across our journal.
            </p>
          )}

          {/* Category Quick Matrix Bar */}
          <div className="pt-4 border-t border-[#EFEAE1]">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#7A7369] block mb-3">
              Direct Category Gateways
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.slice(0, 4).map(cat => {
                const count = publishedPosts.filter(p => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    className="p-2.5 rounded-xl bg-[#F7F4EE] hover:bg-[#EFEAE1] border border-[#E5DED2] text-left transition-all group cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#242522] block group-hover:text-[#2F3A32]">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-[#7A7369]">
                        {count} {count === 1 ? 'guide' : 'guides'}
                      </span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#A68B6A] group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Spotlight Breakout Trend Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#242522] to-[#1B1C1A] text-white rounded-3xl p-6 sm:p-7 border border-[#3A3B36] shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C8A97E]/20 text-[#C8A97E] text-[10px] font-bold uppercase tracking-widest border border-[#C8A97E]/30">
                <Sparkles className="w-3 h-3 text-[#C8A97E]" />
                <span>Breakout of the Month</span>
              </span>
              <span className="text-[11px] text-white/60 font-mono">+184% Saves</span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug text-white">
              Tactile Warmth: Limewash & Raw Minerals
            </h3>

            <p className="text-xs text-[#D5CCC0] leading-relaxed">
              Designers are steering away from glossy, sterile whites. This season’s most viral trend pairs breathable Roman clay and limewash textures with honed travertine slabs and linen upholstery.
            </p>

            {/* Quick Styling Principles List */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <div className="flex items-start gap-2 text-xs text-[#E5DDD5]">
                <span className="text-[#C8A97E] font-bold">•</span>
                <span><strong>No Flat Sheens:</strong> Layer matte, cloudy mineral washes on feature walls.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-[#E5DDD5]">
                <span className="text-[#C8A97E] font-bold">•</span>
                <span><strong>Earth Accents:</strong> Anchor rooms with sculptural beige travertine coffee tables.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-[#E5DDD5]">
                <span className="text-[#C8A97E] font-bold">•</span>
                <span><strong>Tactile Softness:</strong> Pair cold stone surfaces with heavy Belgian unbleached linen.</span>
              </div>
            </div>
          </div>

          {/* Lead Post Link */}
          {breakoutPost && (
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => navigate(`/blog/${breakoutPost.slug}`)}
                className="w-full py-3 px-4 rounded-2xl bg-[#C8A97E] hover:bg-[#B8986D] text-[#242522] font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all shadow-md group cursor-pointer"
              >
                <span>Read Feature: {breakoutPost.title.slice(0, 24)}...</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
