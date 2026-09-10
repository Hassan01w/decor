import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { BlogCard } from '../components/blog/BlogCard';
import { NewsletterBox } from '../components/blog/NewsletterBox';
import { TrendingTopicsSection } from '../components/home/TrendingTopicsSection';
import { 
  ArrowRight, 
  Sparkles, 
  Share2, 
  TrendingUp, 
  Flame, 
  Heart, 
  Headphones, 
  Clock, 
  Bookmark, 
  Compass, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Palette, 
  Home, 
  BookOpen, 
  Star,
  Check
} from 'lucide-react';
import { getPinterestShareUrl } from '../utils/seo';

// Style Finder profiles
interface StyleProfile {
  id: string;
  name: string;
  badge: string;
  palette: string[];
  materials: string[];
  description: string;
  keyRule: string;
  categoryQuery: string;
}

const STYLE_PROFILES: StyleProfile[] = [
  {
    id: 'warm-minimalism',
    name: 'Warm Minimalism',
    badge: 'Trending Worldwide',
    palette: ['#EFEAE1', '#D5CCC0', '#8C6D53', '#2F3A32'],
    materials: ['Limewash walls', 'Bouclé fabric', 'Bleached oak', 'Raw travertine'],
    description: 'Clean lines stripped of clutter, softened with warm earthy textures, tactile linens, and sculptural organic silhouettes.',
    keyRule: 'Every object must have purpose and breathability.',
    categoryQuery: 'minimalist'
  },
  {
    id: 'japandi',
    name: 'Japandi Harmony',
    badge: 'Editor Pick',
    palette: ['#F7F4EE', '#C8A97E', '#4A4A45', '#1F2421'],
    materials: ['Shoji paper', 'Dark walnut', 'Bespoke stoneware', 'Cast iron accents'],
    description: 'The poetic union of Scandinavian functionality and Japanese wabi-sabi philosophy, honoring impermanence and artisanal craftsmanship.',
    keyRule: 'Embrace natural imperfections and low-slung profiles.',
    categoryQuery: 'styling'
  },
  {
    id: 'organic-modern',
    name: 'Organic Modern',
    badge: 'Most Loved',
    palette: ['#FAF7F2', '#A68B6A', '#606C5D', '#2B2D2F'],
    materials: ['Fluted wood', 'Hand-poured concrete', 'Monstera foliage', 'Matte brass'],
    description: 'Crisp contemporary architecture blended seamlessly with live-edge woods, verdant greenery, and textured handwoven rugs.',
    keyRule: 'Bring nature inside with organic curvatures and sunlight.',
    categoryQuery: 'plants'
  },
  {
    id: 'french-coastal',
    name: 'Provence & Parisian Touch',
    badge: 'Timeless Luxury',
    palette: ['#FDFBF7', '#B39B82', '#7D8471', '#33302E'],
    materials: ['Antique gilded mirrors', 'Belgian linen', 'Herringbone parquet', 'Marble tops'],
    description: 'Effortless vintage romance featuring ornate crown moldings, curated market antiques, and fresh olive branches in stoneware urns.',
    keyRule: 'Blend old-world patina with effortless relaxed comfort.',
    categoryQuery: 'furniture'
  }
];

export const HomePage: React.FC = () => {
  const { 
    homepageConfig, 
    publishedPosts, 
    categories, 
    navigate, 
    savedPostIds, 
    toggleSavePost 
  } = useBlog();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [activeStyleTab, setActiveStyleTab] = useState<string>('warm-minimalism');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const hero = homepageConfig.hero;
  const sectionTitles = homepageConfig.sectionTitles;
  const sectionsOrder = homepageConfig.sectionsOrder;

  // Filtered latest posts supporting both category and trending tag filtering
  const filteredLatestPosts = publishedPosts.filter(p => {
    if (activeTagFilter) {
      const match = p.tags?.some(t => t.toLowerCase() === activeTagFilter.toLowerCase());
      if (!match) return false;
    }
    if (selectedCategoryFilter !== 'all') {
      if (p.categoryId !== selectedCategoryFilter) return false;
    }
    return true;
  });

  const featuredPosts = publishedPosts.filter(p => p.isFeatured);
  const primaryFeatured = featuredPosts[0] || publishedPosts[0];
  const secondaryFeatured1 = featuredPosts[1] || publishedPosts[1];
  const secondaryFeatured2 = featuredPosts[2] || publishedPosts[2];
  const spotlightPost = publishedPosts[3] || publishedPosts[0];

  const isSectionEnabled = (id: string) => {
    const sec = sectionsOrder.find(s => s.id === id);
    return sec ? sec.enabled : true;
  };

  const activeStyle = STYLE_PROFILES.find(s => s.id === activeStyleTab) || STYLE_PROFILES[0];

  const faqs = [
    {
      q: 'How do I choose the right aesthetic room accessories for my space?',
      a: 'Start by identifying your core 3-color palette and the atmosphere you want to evoke. Select accessories that complement your larger furniture pieces while introducing contrast through tactile textures like unglazed ceramic, raw linen, or antiqued brass.'
    },
    {
      q: 'What defines modern interior design in 2026?',
      a: 'Contemporary interior design emphasizes intentionality, warm tactile neutrals, open floor plans with designated intimate zones, and natural sustainable materials over cold synthetic finishes. It pairs minimalist cabinetry with character-rich artisan pieces.'
    },
    {
      q: 'Are your minimalist furniture selections durable for everyday family living?',
      a: 'Absolutely. We curate and recommend pieces crafted from solid hardwoods (such as white oak and kiln-dried walnut), high-performance stain-resistant fabrics, and natural stones finished with protective sealants designed to age gracefully over decades.'
    },
    {
      q: 'Do you offer styling formulas for compact city apartments?',
      a: 'Yes! For smaller footprints, we champion multi-functional heirloom furniture, strategic oversized mirrors that double perceived light, floating wall-mounted shelving, and continuous unbroken floor rugs that visually expand room boundaries.'
    },
    {
      q: 'How often are new interior design masterclasses published?',
      a: 'We publish new curated editorial deep dives and masterclasses every Tuesday and Friday, alongside our signature Sunday Decor Digest delivered straight to over 65,000 subscribers worldwide.'
    }
  ];

  return (
    <div className="bg-[#F7F4EE] text-[#242522] min-h-screen">
      
      {/* 1. TOP EDITORIAL TICKER & TRENDING ANNOUNCEMENT */}
      <aside aria-label="Editorial Trends & Announcements" className="bg-[#242522] text-[#F7F4EE] border-b border-[#3A3B36] py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-[#C8A97E] text-[#242522] text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
              Issue Nº 24
            </span>
            <span className="hidden sm:inline text-[#D5CCC0]">
              The Decor Diary • Curated Interior Design, Slow Living & Styling Masterclasses
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#D5CCC0]">
            <span className="hidden md:inline flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A97E]" />
              <span>65,000+ Design Enthusiasts</span>
            </span>
            <span className="text-[#5A534B]">•</span>
            <button 
              onClick={() => navigate('/blog')}
              className="text-[#C8A97E] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>

      <div className="space-y-12 sm:space-y-16 pb-20 pt-6">

        {/* 2. GRAND BENTO HERO SECTION (ZERO EMPTY SPACE) */}
        {isSectionEnabled('hero') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Main Hero Card (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5DED2] p-6 sm:p-10 lg:p-12 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-6 relative z-10">
                  <div className="flex flex-wrap items-center gap-3">
                    {hero.badge && (
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F4EE] text-[#2F3A32] text-xs font-bold uppercase tracking-widest border border-[#E5DED2]">
                        <Sparkles className="w-3.5 h-3.5 text-[#C8A97E]" />
                        <span>{hero.badge}</span>
                      </span>
                    )}
                    <span className="text-xs text-[#7A7369] font-medium tracking-wide">
                      Updated Weekly by Architectural Stylists
                    </span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight text-[#242522] leading-[1.14]">
                    {hero.title}{' '}
                    <span className="italic font-normal font-display text-[#2F3A32] underline decoration-[#C8A97E] decoration-2 underline-offset-8">
                      {hero.highlightWord}
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-[#5A534B] leading-relaxed max-w-2xl">
                    {hero.subtitle}
                  </p>

                  {/* CTAs & Quick Metrics */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => navigate(hero.ctaLink || '/blog')}
                      className="px-8 py-4 bg-[#2F3A32] hover:bg-[#202722] text-[#F7F4EE] rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-md cursor-pointer border border-[#2F3A32] hover:scale-102"
                    >
                      <span>{hero.ctaText || 'Explore Curated Articles'}</span>
                      <ArrowRight className="w-4 h-4 text-[#C8A97E]" />
                    </button>

                    {hero.secondaryCtaText && (
                      <button
                        onClick={() => {
                          const target = document.getElementById('categories');
                          if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            navigate('/blog');
                          }
                        }}
                        className="px-6 py-4 bg-[#F7F4EE] hover:bg-[#EFEAE1] text-[#242522] border border-[#E5DED2] rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {hero.secondaryCtaText || 'Browse Lookbook'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Hero Showcase Image Box with Pin Button */}
                <div className="relative mt-8 rounded-2xl overflow-hidden aspect-16/9 sm:aspect-21/9 shadow-md border border-[#E5DED2] group">
                  <img
                    src={hero.imageUrl}
                    alt={hero.imageCaption || 'The Decor Diary Hero Showcase'}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                  <a
                    href={getPinterestShareUrl(window.location.origin, hero.imageUrl, hero.title)}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-3.5 right-3.5 bg-[#E60023] hover:bg-[#C9001D] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Pin Cover</span>
                  </a>

                  {hero.imageCaption && (
                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs sm:text-sm font-serif italic backdrop-blur-xs bg-black/40 px-3.5 py-2 rounded-xl border border-white/20">
                      {hero.imageCaption}
                    </div>
                  )}
                </div>

                {/* Trust & Review Strip */}
                <div className="pt-6 mt-6 border-t border-[#EFEAE1] flex flex-wrap items-center justify-between gap-4 text-xs text-[#7A7369]">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" 
                        alt="Editor Sam" 
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white" 
                      />
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" 
                        alt="Stylist Marcus" 
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white" 
                      />
                      <img 
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80" 
                        alt="Designer Elena" 
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white" 
                      />
                    </div>
                    <span className="font-semibold text-[#242522]">Curated by Certified Interior Designers</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#A68B6A]">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-[#242522]">4.95 / 5</span>
                    <span>(1,200+ Styling Reviews)</span>
                  </div>
                </div>
              </div>

              {/* Right Column Stack (4 cols) - Live Highlights & Digest */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* 1. Daily Spotlight Post Card */}
                {primaryFeatured && (
                  <div 
                    onClick={() => navigate(`/blog/${primaryFeatured.slug}`)}
                    className="bg-white rounded-3xl border border-[#E5DED2] p-5 shadow-sm hover:border-[#2F3A32] hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#2F3A32] bg-[#F7F4EE] px-2.5 py-1 rounded-full border border-[#E5DED2]">
                          <Flame className="w-3 h-3 text-[#C8A97E]" />
                          <span>Editor's Pick Today</span>
                        </span>
                        <span className="text-[11px] text-[#7A7369]">
                          {primaryFeatured.readingTimeMinutes} min read
                        </span>
                      </div>

                      <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-[#EFEAE1]">
                        <img 
                          src={primaryFeatured.featuredImage} 
                          alt={primaryFeatured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#242522] group-hover:text-[#2F3A32] transition-colors line-clamp-2 leading-snug">
                        {primaryFeatured.title}
                      </h3>

                      <p className="text-xs text-[#5A534B] line-clamp-2 leading-relaxed">
                        {primaryFeatured.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#EFEAE1] flex items-center justify-between text-xs font-bold text-[#2F3A32]">
                      <span className="text-[11px] uppercase tracking-wider">Read Full Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C8A97E]" />
                    </div>
                  </div>
                )}

                {/* 2. The Sunday Decor Digest Card */}
                <div className="bg-gradient-to-br from-[#2F3A32] to-[#1F2421] text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C8A97E] bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                        <Headphones className="w-3 h-3 text-[#C8A97E]" />
                        <span>Sunday Digest</span>
                      </span>
                      <span className="text-[10px] text-white/70">65k Readers</span>
                    </div>

                    <h4 className="font-serif text-xl font-bold text-white leading-snug">
                      The Weekly Slow Living Formula
                    </h4>

                    <p className="text-xs text-[#D5CCC0] leading-relaxed">
                      Every Sunday morning, receive color recipes, pantry organization formulas, and artisan sourcing directly in your inbox.
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Limewash Walls', 'Belgian Linen', 'Travertine'].map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3 bg-[#C8A97E] hover:bg-[#B8986D] text-[#242522] rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Receive Free Weekly Issue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </section>
        )}

        {/* 3. TRENDING THEMES & KEYWORD PILLS TICKER */}
        {isSectionEnabled('trending_bar') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-[#E5DED2] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#2F3A32]">
                <Flame className="w-4 h-4 text-[#C8A97E]" />
                <span>Trending Interior Aesthetics:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {[
                  { label: 'Warm Minimalism', query: 'minimalism' },
                  { label: 'Walk-In Pantries', query: 'organization' },
                  { label: 'Limewash Walls', query: 'diy' },
                  { label: 'Japandi Bedroom', query: 'bedroom' },
                  { label: 'Indoor Olive Trees', query: 'plants' },
                  { label: 'Travertine Coffee Tables', query: 'furniture' },
                  { label: 'Aesthetic Lighting', query: 'lighting' }
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => navigate('/blog')}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#F7F4EE] hover:bg-[#2F3A32] hover:text-white border border-[#E5DED2] text-[#242522] transition-all cursor-pointer shadow-2xs hover:scale-102"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. INTERACTIVE "FIND YOUR SIGNATURE AESTHETIC" STUDIO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#E5DED2] p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EFEAE1] pb-5">
              <div>
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C8A97E] block mb-1 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#C8A97E]" />
                  <span>Interactive Styling Studio</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#242522]">
                  Find Your Signature Interior Aesthetic
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#7A7369] max-w-md">
                Select an aesthetic archetype to explore color harmonies, authentic textures, and curated masterclasses.
              </p>
            </div>

            {/* Aesthetic Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {STYLE_PROFILES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setActiveStyleTab(style.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    activeStyleTab === style.id
                      ? 'bg-[#2F3A32] text-[#F7F4EE] border-[#2F3A32] shadow-md'
                      : 'bg-[#F7F4EE] text-[#242522] border-[#E5DED2] hover:bg-[#EFEAE1]'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full w-fit ${
                    activeStyleTab === style.id ? 'bg-[#C8A97E] text-[#242522]' : 'bg-white text-[#7A7369]'
                  }`}>
                    {style.badge}
                  </span>
                  <span className="font-serif text-sm sm:text-base font-bold block">
                    {style.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Style Details Banner */}
            <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E5DED2] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2F3A32]">Core Color Palette:</span>
                  <div className="flex items-center gap-1.5">
                    {activeStyle.palette.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-5 h-5 rounded-full border border-black/15 shadow-2xs"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#5A534B] leading-relaxed">
                  {activeStyle.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-[#242522]">Key Materials:</span>
                  {activeStyle.materials.map(mat => (
                    <span key={mat} className="text-xs px-2.5 py-1 rounded-full bg-white text-[#5A534B] border border-[#E5DED2]">
                      ✓ {mat}
                    </span>
                  ))}
                </div>

                <div className="pt-2 text-xs font-serif italic text-[#8C6D53]">
                  Golden Rule: "{activeStyle.keyRule}"
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-3 pt-2 lg:pt-0">
                <button
                  onClick={() => navigate('/blog')}
                  className="px-6 py-3 bg-[#2F3A32] hover:bg-[#202722] text-[#F7F4EE] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span>Explore {activeStyle.name} Guides</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C8A97E]" />
                </button>
                <span className="text-[11px] text-[#7A7369]">Updated with 2026 Architectural Forecasts</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4.5. TRENDING TOPICS & POPULAR TAGS */}
        <TrendingTopicsSection 
          activeTag={activeTagFilter} 
          onSelectTag={(tag) => {
            setActiveTagFilter(tag);
            if (tag) {
              setTimeout(() => {
                const el = document.getElementById('latest-articles');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }}
        />

        {/* 5. POPULAR CATEGORIES (ROOM BY ROOM & LIFESTYLE) */}
        {isSectionEnabled('categories') && (
          <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5DED2] pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C8A97E] block mb-1">
                  Spaces & Sanctuaries
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#242522]">
                  {sectionTitles.categoriesTitle || 'Browse by Lifestyle Category'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#7A7369] max-w-md">
                {sectionTitles.categoriesSubtitle || 'Explore dedicated design principles for every room in your home.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map(category => {
                const count = publishedPosts.filter(p => p.categoryId === category.id).length;

                return (
                  <div
                    key={category.id}
                    onClick={() => navigate(`/category/${category.slug}`)}
                    className="group relative rounded-3xl overflow-hidden aspect-4/5 cursor-pointer shadow-xs hover:shadow-2xl transition-all duration-300 border border-[#E5DED2]"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent group-hover:from-black/90 transition-all" />

                    <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white">
                      <span className="text-[11px] font-semibold text-[#E5DED2] uppercase tracking-wider mb-1">
                        {count} {count === 1 ? 'Article' : 'Articles'}
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-bold group-hover:text-[#C8A97E] transition-colors leading-snug">
                        {category.name}
                      </h3>
                      <p className="text-[11px] text-[#D5CCC0] line-clamp-2 mt-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        {category.description}
                      </p>
                      
                      <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#C8A97E] group-hover:translate-x-1 transition-transform">
                        <span>View Room Guide</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 6. FEATURED EDITORIAL STORIES (FULL BENTO MAGAZINE - NO GAPS) */}
        {isSectionEnabled('featured') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5DED2] pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C8A97E] block mb-1">
                  Curated Spotlight
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#242522]">
                  {sectionTitles.featuredTitle || 'Featured Editorial Stories'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#7A7369] max-w-md">
                {sectionTitles.featuredSubtitle || 'In-depth architectural tours, pantry makeovers, and seasonal moodboards.'}
              </p>
            </div>

            {/* Fully Balanced Magazine Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT COLUMN: Main Lead Article + Sub-feature capsule */}
              <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
                {primaryFeatured && (
                  <BlogCard post={primaryFeatured} variant="featured" />
                )}

                {/* Sub-feature 2-column strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {secondaryFeatured2 && (
                    <div 
                      onClick={() => navigate(`/blog/${secondaryFeatured2.slug}`)}
                      className="group bg-white rounded-3xl p-5 border border-[#E5DED2] hover:border-[#2F3A32] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs"
                    >
                      <div className="space-y-3">
                        <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-[#EFEAE1]">
                          <img 
                            src={secondaryFeatured2.featuredImage} 
                            alt={secondaryFeatured2.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-[#7A7369] mb-1.5">
                            <span>{secondaryFeatured2.readingTimeMinutes} min read</span>
                            <span>•</span>
                            <span>By {secondaryFeatured2.author.name}</span>
                          </div>
                          <h4 className="font-serif text-base font-bold text-[#242522] group-hover:text-[#2F3A32] transition-colors leading-snug line-clamp-2">
                            {secondaryFeatured2.title}
                          </h4>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#EFEAE1] flex items-center justify-between text-xs font-bold text-[#2F3A32]">
                        <span className="text-[11px] uppercase tracking-wider">Read Story</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C8A97E]" />
                      </div>
                    </div>
                  )}

                  {/* Philosophy & Craftsmanship Capsule */}
                  <div className="bg-gradient-to-br from-white via-[#F7F4EE] to-[#EFEAE1] rounded-3xl p-6 border border-[#E5DED2] flex flex-col justify-between shadow-xs">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#2F3A32] text-[10px] font-bold uppercase tracking-widest border border-[#E5DED2]">
                          <Sparkles className="w-3 h-3 text-[#C8A97E]" />
                          <span>Slow Living Motto</span>
                        </span>
                        <span className="text-[10px] text-[#7A7369] uppercase font-bold">Issue Nº 24</span>
                      </div>

                      <blockquote className="font-serif italic text-sm sm:text-base text-[#242522] leading-relaxed">
                        "Have nothing in your houses that you do not know to be useful or believe to be beautiful."
                      </blockquote>

                      <p className="text-xs text-[#5A534B] leading-relaxed">
                        Curated timeless textures, warm earth tones, and morning rituals for the peaceful sanctuary.
                      </p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-[#E5DED2] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                          alt="Sam" 
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-white" 
                        />
                        <div>
                          <span className="text-xs font-bold text-[#242522] block leading-tight">Sam</span>
                          <span className="text-[10px] text-[#7A7369] block leading-tight">Editor-in-Chief</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => navigate('/blog')}
                        className="text-xs font-bold text-[#2F3A32] hover:text-[#C8A97E] uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Stacked Horizontal Cards */}
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                {secondaryFeatured1 && (
                  <BlogCard post={secondaryFeatured1} variant="horizontal" />
                )}

                {spotlightPost && (
                  <BlogCard post={spotlightPost} variant="horizontal" />
                )}

                {/* 3 Quick Interior Rules Bento */}
                <div className="bg-white rounded-3xl p-6 border border-[#E5DED2] shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EFEAE1] pb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#2F3A32] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#C8A97E]" />
                      <span>Stylist's Rulebook</span>
                    </span>
                    <span className="text-[10px] text-[#7A7369]">Pro Principles</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#F7F4EE] text-[#2F3A32] text-xs font-bold flex items-center justify-center shrink-0 border border-[#E5DED2]">1</span>
                      <p className="text-xs text-[#5A534B]"><strong>Rule of Three:</strong> Group decorative ceramics and books in odd numbers to create dynamic visual harmony.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#F7F4EE] text-[#2F3A32] text-xs font-bold flex items-center justify-center shrink-0 border border-[#E5DED2]">2</span>
                      <p className="text-xs text-[#5A534B]"><strong>Layered Lighting:</strong> Never rely on a single ceiling pendant; layer task lamps and warm sconces at 2700K.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#F7F4EE] text-[#2F3A32] text-xs font-bold flex items-center justify-center shrink-0 border border-[#E5DED2]">3</span>
                      <p className="text-xs text-[#5A534B]"><strong>Tactile Contrast:</strong> Offset cold stone and mirrors with raw linen, bouclé, and unfinished timber.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/blog')}
                    className="w-full py-2.5 bg-[#F7F4EE] hover:bg-[#EFEAE1] text-[#242522] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-[#E5DED2] cursor-pointer"
                  >
                    <span>Read Full Decor Guides</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C8A97E]" />
                  </button>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* 7. LATEST ARTICLES FEED (RICH GRID & FILTER) */}
        {isSectionEnabled('latest') && (
          <section id="latest-articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5DED2] pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C8A97E] block mb-1">
                  The Curated Journal
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#242522]">
                  {sectionTitles.latestTitle || 'Latest Articles & Masterclasses'}
                </h2>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-[#2F3A32] text-[#F7F4EE] shadow-xs'
                      : 'bg-white text-[#5A534B] border border-[#E5DED2] hover:bg-[#EFEAE1]'
                  }`}
                >
                  All Stories ({publishedPosts.length})
                </button>
                {categories.slice(0, 6).map(cat => {
                  const catCount = publishedPosts.filter(p => p.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryFilter(cat.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategoryFilter === cat.id
                          ? 'bg-[#2F3A32] text-[#F7F4EE] shadow-xs'
                          : 'bg-white text-[#5A534B] border border-[#E5DED2] hover:bg-[#EFEAE1]'
                      }`}
                    >
                      {cat.name} ({catCount})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Tag Filter Notification Banner */}
            {activeTagFilter && (
              <div className="p-3.5 rounded-2xl bg-[#EFEAE1] border border-[#E5DED2] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#242522]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    Filtered by trending topic: <strong className="text-[#2F3A32]">#{activeTagFilter}</strong> ({filteredLatestPosts.length} {filteredLatestPosts.length === 1 ? 'article' : 'articles'} found)
                  </span>
                </div>
                <button
                  onClick={() => setActiveTagFilter(null)}
                  className="text-xs font-bold text-[#2F3A32] hover:underline cursor-pointer"
                >
                  Clear Tag Filter &times;
                </button>
              </div>
            )}

            {/* Articles Grid or Empty State */}
            {filteredLatestPosts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#E5DED2] p-8 space-y-4">
                <p className="font-serif text-xl font-bold text-[#242522]">
                  No articles currently match this combination
                </p>
                <p className="text-xs text-[#7A7369] max-w-md mx-auto">
                  Try clearing your tag or category filter to discover other masterclasses from our editorial team.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setActiveTagFilter(null);
                      setSelectedCategoryFilter('all');
                    }}
                    className="px-6 py-2.5 bg-[#2F3A32] hover:bg-[#202722] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredLatestPosts.slice(0, visibleCount).map(post => (
                  <BlogCard key={post.id} post={post} variant="standard" />
                ))}
              </div>
            )}

            {filteredLatestPosts.length > visibleCount && (
              <div className="text-center pt-6">
                <button
                  onClick={() => setVisibleCount(prev => prev + 3)}
                  className="px-8 py-3.5 bg-white hover:bg-[#EFEAE1] text-[#242522] border border-[#E5DED2] rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:border-[#2F3A32]"
                >
                  Load More Articles ({filteredLatestPosts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </section>
        )}

        {/* 8. PINTEREST INSPIRATION & MOODBOARD MOSAIC */}
        {isSectionEnabled('pinterest_grid') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E5DED2] space-y-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#EFEAE1] pb-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E60023]">
                    <span className="w-5 h-5 rounded-full bg-[#E60023] text-white flex items-center justify-center text-xs font-bold">P</span>
                    <span>Pinterest Inspiration Board</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#242522]">
                    {homepageConfig.pinterestBanner.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5A534B] max-w-xl">
                    {homepageConfig.pinterestBanner.description}
                  </p>
                </div>

                <a
                  href={homepageConfig.pinterestBanner.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-3.5 bg-[#E60023] hover:bg-[#C9001D] text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shrink-0 hover:scale-102"
                >
                  <span>Follow {homepageConfig.pinterestBanner.handle}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* 6-Item Masonry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {homepageConfig.pinterestBanner.boardImages.map((imgUrl, i) => (
                  <div 
                    key={i} 
                    className="group relative rounded-2xl overflow-hidden aspect-3/4 shadow-2xs border border-[#E5DED2] cursor-pointer"
                  >
                    <img
                      src={imgUrl}
                      alt={`Interior Moodboard ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                      <a
                        href={getPinterestShareUrl(window.location.origin, imgUrl, 'The Decor Diary Home Decor & Interior Inspiration')}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#E60023] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg hover:scale-105 transition-transform"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Save Pin</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 9. ELEVATED DECOR MASTERCLASS & INTERACTIVE FAQ ACCORDION (UPGRADED SEO SECTION) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5DED2] shadow-xs space-y-10">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C8A97E]">
                The Design Handbook
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#242522]">
                Welcome to The Decor Diary – Elevate Your Living Spaces
              </h2>
              <p className="text-sm sm:text-base text-[#5A534B] leading-relaxed">
                Transforming a house into a sanctuary demands a curated eye for organic materials, architectural proportion, and timeless comfort. As your premier <strong>online home decor store</strong> and styling resource, we explore the intersection of modern simplicity and slow living.
              </p>
            </div>

            {/* 3 Pro Styling Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5DED2] space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#2F3A32] text-[#F7F4EE] text-xs font-bold flex items-center justify-center">01</span>
                <h3 className="font-serif text-lg font-bold text-[#242522]">Trending Wall Art</h3>
                <p className="text-xs sm:text-sm text-[#5A534B] leading-relaxed">
                  Choosing oversized framed prints, textured plaster reliefs, and minimalist line artwork anchors empty wall space and dictates the color cadence for the entire room.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5DED2] space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#2F3A32] text-[#F7F4EE] text-xs font-bold flex items-center justify-center">02</span>
                <h3 className="font-serif text-lg font-bold text-[#242522]">Minimalist Furniture</h3>
                <p className="text-xs sm:text-sm text-[#5A534B] leading-relaxed">
                  Focus on sustainable, high-integrity hardwoods like white oak and walnut. Curved low-slung seating and floating consoles preserve airy sightlines and eliminate clutter.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5DED2] space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#2F3A32] text-[#F7F4EE] text-xs font-bold flex items-center justify-center">03</span>
                <h3 className="font-serif text-lg font-bold text-[#242522]">Aesthetic Room Accessories</h3>
                <p className="text-xs sm:text-sm text-[#5A534B] leading-relaxed">
                  Artisanal ceramic urns, hand-poured sculptural candles, and stonewashed Belgian linen cushion covers introduce tactile warmth without visual chaos.
                </p>
              </div>
            </div>

            {/* Interactive Expandable FAQs */}
            <div className="pt-6 border-t border-[#EFEAE1] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#242522]">
                  Frequently Asked Questions
                </h3>
                <span className="text-xs text-[#7A7369]">Click to expand answers</span>
              </div>

              <div className="divide-y divide-[#EFEAE1] border-y border-[#EFEAE1]">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="py-4">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                      >
                        <h4 className="font-serif text-base sm:text-lg font-bold text-[#242522] group-hover:text-[#C8A97E] transition-colors">
                          {faq.q}
                        </h4>
                        <span className="p-1.5 rounded-full bg-[#F7F4EE] group-hover:bg-[#EFEAE1] transition-colors text-[#2F3A32] shrink-0">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      {isOpen && (
                        <p className="mt-3 text-xs sm:text-sm text-[#5A534B] leading-relaxed max-w-3xl animate-in fade-in duration-200">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* 10. NEWSLETTER BOX */}
        {isSectionEnabled('newsletter') && (
          <section id="newsletter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
            <NewsletterBox />
          </section>
        )}

      </div>
    </div>
  );
};
