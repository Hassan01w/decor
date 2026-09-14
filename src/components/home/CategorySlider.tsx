import React, { useRef, useState, useEffect } from 'react';
import { Category } from '../../types';
import { useBlog } from '../../context/BlogContext';
import { ChevronLeft, ChevronRight, Compass, ArrowRight } from 'lucide-react';

interface CategorySliderProps {
  categories: Category[];
}

export const CategorySlider: React.FC<CategorySliderProps> = ({ categories }) => {
  const { publishedPosts, navigate } = useBlog();
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
  }, [categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.min(el.clientWidth * 0.8, 380);
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
    const walk = (x - startX) * 1.6;
    el.scrollLeft = scrollLeftPos - walk;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      {/* Slider Header */}
      <div className="flex items-end justify-between gap-4 border-b border-[#E5DED2] pb-3.5">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#C8A97E] flex items-center gap-1.5 mb-1">
            <Compass className="w-3.5 h-3.5 text-[#C8A97E]" />
            <span>Room By Room & Lifestyle</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#242522]">
            Explore Lifestyle Categories
          </h2>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left categories"
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
            aria-label="Scroll right categories"
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

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory ${
          isMouseDown ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => {
          const count = publishedPosts.filter(p => p.categoryId === category.id).length;

          return (
            <div
              key={category.id}
              onClick={() => navigate(`/category/${category.slug}`)}
              className="snap-start shrink-0 w-[240px] sm:w-[280px] group relative rounded-3xl overflow-hidden aspect-4/5 cursor-pointer shadow-xs hover:shadow-2xl transition-all duration-300 border border-[#E5DED2]"
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent group-hover:from-black/90 transition-all" />

              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold text-[#E5DED2] uppercase tracking-widest mb-1 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full w-fit">
                  {count} {count === 1 ? 'Article' : 'Articles'}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold group-hover:text-[#C8A97E] transition-colors leading-snug">
                  {category.name}
                </h3>
                <p className="text-[11px] text-[#D5CCC0] line-clamp-2 mt-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  {category.description}
                </p>

                <div className="pt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-[#C8A97E] group-hover:translate-x-1 transition-transform">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
