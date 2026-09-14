import React, { useRef, useState, useEffect } from 'react';
import { BlogPost } from '../../types';
import { useBlog } from '../../context/BlogContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  Bookmark, 
  Share2, 
  Flame, 
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { getPinterestShareUrl } from '../../utils/seo';

interface BlogSectionSliderProps {
  id?: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  posts: BlogPost[];
  viewAllUrl?: string;
  showRank?: boolean;
  accentBadgeColor?: string;
}

export const BlogSectionSlider: React.FC<BlogSectionSliderProps> = ({
  id,
  title,
  subtitle,
  badgeText,
  badgeIcon,
  posts,
  viewAllUrl = '/blog',
  showRank = false,
  accentBadgeColor = '#C8A97E'
}) => {
  const { categories, navigate, savedPostIds, toggleSavePost } = useBlog();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollability, { passive: true });
      window.addEventListener('resize', checkScrollability);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [posts]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.min(el.clientWidth * 0.75, 420);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Mouse Drag to Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsMouseDown(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftPos(el.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const el = scrollContainerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftPos - walk;
  };

  if (!posts || posts.length === 0) return null;

  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 scroll-mt-24">
      {/* Slider Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5DED2] pb-3.5">
        <div>
          {badgeText && (
            <span 
              className="text-[11px] uppercase font-bold tracking-[0.2em] flex items-center gap-1.5 mb-1"
              style={{ color: accentBadgeColor }}
            >
              {badgeIcon}
              <span>{badgeText}</span>
            </span>
          )}
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#242522]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#7A7369] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {viewAllUrl && (
            <button
              onClick={() => navigate(viewAllUrl)}
              className="text-xs font-bold text-[#2F3A32] hover:text-[#C8A97E] transition-colors flex items-center gap-1 uppercase tracking-wider cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label={`Scroll left ${title}`}
              className={`p-2 sm:p-2.5 rounded-full border border-[#E5DED2] transition-all cursor-pointer ${
                canScrollLeft 
                  ? 'bg-white text-[#242522] hover:bg-[#2F3A32] hover:text-white shadow-xs' 
                  : 'bg-[#F7F4EE] text-[#A89F95] cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label={`Scroll right ${title}`}
              className={`p-2 sm:p-2.5 rounded-full border border-[#E5DED2] transition-all cursor-pointer ${
                canScrollRight 
                  ? 'bg-white text-[#242522] hover:bg-[#2F3A32] hover:text-white shadow-xs' 
                : 'bg-[#F7F4EE] text-[#A89F95] cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory ${
          isMouseDown ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {posts.map((post, idx) => {
          const category = categories.find(c => c.id === post.categoryId);
          const isSaved = savedPostIds.includes(post.id);
          const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });

          const pinUrl = getPinterestShareUrl(
            window.location.origin + `/blog/${post.slug}`,
            post.featuredImage,
            `${post.title} — ${post.excerpt}`
          );

          return (
            <article
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="snap-start shrink-0 w-[275px] sm:w-[320px] md:w-[340px] group bg-white rounded-3xl overflow-hidden border border-[#E5DED2] hover:border-[#2F3A32] hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xs"
            >
              {/* Image Box */}
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-[#EFEAE1]">
                  <img
                    src={post.featuredImage}
                    alt={post.imageAlt || post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-600 ease-out"
                  />

                  {/* Rank Badge (e.g., #01, #02) */}
                  {showRank && (
                    <div className="absolute top-3 left-3 bg-[#242522] text-[#C8A97E] text-xs font-mono font-bold px-2.5 py-1 rounded-xl shadow-md border border-[#C8A97E]/30 flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-[#C8A97E] text-[#C8A97E]" />
                      <span>#{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                  )}

                  {/* Category Pill (if not showRank or placed adjacent) */}
                  {!showRank && category && (
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/category/${category.slug}`);
                      }}
                      className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#242522] hover:bg-[#2F3A32] hover:text-white transition-colors shadow-2xs border border-[#E5DED2]"
                    >
                      {category.name}
                    </span>
                  )}

                  {/* Save to Pinterest */}
                  <a
                    href={pinUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-3 left-3 bg-[#E60023] hover:bg-[#C9001D] text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Save Pin"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Pin</span>
                  </a>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavePost(post.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
                      isSaved 
                        ? 'bg-[#2F3A32] text-[#C8A97E]' 
                        : 'bg-white/85 hover:bg-white text-[#242522]'
                    }`}
                    title={isSaved ? 'Saved' : 'Save to board'}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Article Info */}
                <div className="p-4 sm:p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#7A7369]">
                    {showRank && category && (
                      <span className="font-bold text-[#2F3A32] uppercase tracking-wider text-[10px]">
                        {category.name} •
                      </span>
                    )}
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#A68B6A]" />
                      {post.readingTimeMinutes}m read
                    </span>
                    {post.viewsCount > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <Eye className="w-3 h-3" />
                          {post.viewsCount.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#242522] group-hover:text-[#2F3A32] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#5A534B] leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Author & Read Link Footer */}
              <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-[#EFEAE1] flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E5DED2]"
                  />
                  <span className="text-xs font-semibold text-[#242522] truncate max-w-[110px]">
                    {post.author.name}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2F3A32] group-hover:text-[#A68B6A] transition-colors">
                  <span>Read</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
