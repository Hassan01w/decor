import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { BlogCard } from '../components/blog/BlogCard';
import { NewsletterBox } from '../components/blog/NewsletterBox';
import { 
  ArrowRight, 
  Sparkles, 
  Share2, 
  TrendingUp, 
  Flame, 
  Heart, 
  Headphones,
  Clock
} from 'lucide-react';
import { getPinterestShareUrl } from '../utils/seo';

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
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const hero = homepageConfig.hero;
  const sectionTitles = homepageConfig.sectionTitles;
  const sectionsOrder = homepageConfig.sectionsOrder;

  // Filtered latest posts
  const filteredLatestPosts = publishedPosts.filter(p => {
    if (selectedCategoryFilter === 'all') return true;
    return p.categoryId === selectedCategoryFilter;
  });

  const featuredPosts = publishedPosts.filter(p => p.isFeatured);
  const spotlightPost = publishedPosts[0];

  const isSectionEnabled = (id: string) => {
    const sec = sectionsOrder.find(s => s.id === id);
    return sec ? sec.enabled : true;
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-[#F7F4EE] text-[#242522]">
      {/* 1. HERO SECTION */}
      {isSectionEnabled('hero') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
          <div className="bg-white rounded-3xl sm:rounded-[36px] border border-[#E5DED2] p-6 sm:p-10 lg:p-14 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              {hero.badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F4EE] text-[#2F3A32] text-xs font-bold uppercase tracking-widest border border-[#E5DED2]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A97E]" />
                  <span>{hero.badge}</span>
                </div>
              )}

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#242522] leading-[1.12]">
                {hero.title}{' '}
                <span className="italic font-normal font-display text-[#2F3A32] underline decoration-[#C8A97E] decoration-2 underline-offset-8">
                  {hero.highlightWord}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#5A534B] leading-relaxed max-w-xl">
                {hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate(hero.ctaLink || '/blog')}
                  className="px-7 py-4 bg-[#2F3A32] hover:bg-[#202722] text-[#F7F4EE] rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all hover:scale-102 shadow-md cursor-pointer border border-[#2F3A32]"
                >
                  <span>{hero.ctaText || 'Explore Articles'}</span>
                  <ArrowRight className="w-4 h-4 text-[#C8A97E]" />
                </button>

                {hero.secondaryCtaText && (
                  <button
                    onClick={() => {
                      if (hero.secondaryCtaLink?.startsWith('#')) {
                        document.querySelector(hero.secondaryCtaLink)?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate(hero.secondaryCtaLink || '/');
                      }
                    }}
                    className="px-6 py-4 bg-[#F7F4EE] hover:bg-[#EFEAE1] text-[#242522] border border-[#E5DED2] rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {hero.secondaryCtaText}
                  </button>
                )}
              </div>
            </div>

            {/* Right Large Editorial Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-4/3 sm:aspect-16/11 shadow-xl border-4 border-white">
                <img
                  src={hero.imageUrl}
                  alt={hero.imageCaption || 'Hero Home Inspiration'}
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                {/* Hero Pinterest Button */}
                <a
                  href={getPinterestShareUrl(
                    window.location.origin,
                    hero.imageUrl,
                    hero.title
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-4 right-4 bg-[#E60023] hover:bg-[#C9001D] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Pin Hero</span>
                </a>

                {hero.imageCaption && (
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-serif italic backdrop-blur-xs bg-black/35 p-3 rounded-xl border border-white/20">
                    {hero.imageCaption}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. TRENDING TOPICS TICKER */}
      {isSectionEnabled('trending_bar') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white border border-[#E5DED2] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#2F3A32]">
              <Flame className="w-4 h-4 text-[#A68B6A]" />
              <span>Trending Themes:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {[
                { label: 'Warm Minimalism', query: 'warm-minimalism' },
                { label: 'Walk-In Pantries', query: 'organization' },
                { label: 'Limewash Walls', query: 'diy' },
                { label: 'Non-Toxic Living', query: 'cleaning' },
                { label: 'Sourdough Rituals', query: 'kitchen' },
                { label: 'Indoor Foliage', query: 'gardening' }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => navigate('/blog')}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#F7F4EE] hover:bg-[#2F3A32] hover:text-white border border-[#E5DED2] text-[#242522] transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED EDITORIAL STORIES (BALANCED & FULL HEIGHT) */}
      {isSectionEnabled('featured') && featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5DED2] pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#A68B6A] block mb-1">
                Curated Spotlight
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#242522]">
                {sectionTitles.featuredTitle || 'Featured Editorial Stories'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#7A7369] max-w-md">
              {sectionTitles.featuredSubtitle}
            </p>
          </div>

          {/* Fully Balanced Magazine Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Main Lead Article + Sub-Features to fill space */}
            <div className="lg:col-span-7 space-y-6">
              {/* Primary Lead Feature */}
              <BlogCard post={featuredPosts[0]} variant="featured" />

              {/* Sub-features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                {publishedPosts[3] && (
                  <div 
                    onClick={() => navigate(`/blog/${publishedPosts[3].slug}`)}
                    className="group bg-white rounded-2xl p-4 sm:p-5 border border-[#E5DED2] hover:border-[#2F3A32] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-[#EFEAE1]">
                        <img 
                          src={publishedPosts[3].featuredImage} 
                          alt={publishedPosts[3].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#2F3A32] shadow-xs">
                          {categories.find(c => c.id === publishedPosts[3].categoryId)?.name || 'Editorial'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-[#7A7369] mb-1.5">
                          <span>{publishedPosts[3].readingTimeMinutes} min read</span>
                          <span>•</span>
                          <span>By {publishedPosts[3].author.name}</span>
                        </div>
                        <h4 className="font-serif text-base sm:text-lg font-bold text-[#242522] group-hover:text-[#2F3A32] transition-colors leading-snug line-clamp-2">
                          {publishedPosts[3].title}
                        </h4>
                      </div>
                    </div>

                    <div className="pt-3.5 mt-3 border-t border-[#EFEAE1] flex items-center justify-between text-xs font-bold text-[#2F3A32]">
                      <span className="text-[11px] uppercase tracking-wider">Read Full Story</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#A68B6A]" />
                    </div>
                  </div>
                )}

                {/* Editorial Philosophy & Slow Living Capsule */}
                <div className="bg-gradient-to-br from-white via-[#F7F4EE] to-[#EFEAE1] rounded-2xl p-5 sm:p-6 border border-[#E5DED2] flex flex-col justify-between shadow-xs">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#2F3A32] text-[10px] font-bold uppercase tracking-widest border border-[#E5DED2]">
                        <Sparkles className="w-3 h-3 text-[#C8A97E]" />
                        <span>Living Philosophy</span>
                      </span>
                      <span className="text-[10px] text-[#7A7369] uppercase font-bold tracking-wider">Issue Nº 48</span>
                    </div>

                    <blockquote className="font-serif italic text-sm sm:text-base text-[#242522] leading-relaxed">
                      "Have nothing in your houses that you do not know to be useful or believe to be beautiful."
                    </blockquote>

                    <p className="text-xs text-[#5A534B] leading-relaxed">
                      Curated timeless textures, warm earth tones, and slow morning rituals for the intentional home.
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
                      className="text-xs font-bold text-[#2F3A32] hover:text-[#A68B6A] uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Stacked Secondary Features + Sunday Digest */}
            <div className="lg:col-span-5 space-y-6">
              {featuredPosts.slice(1, 3).map(post => (
                <BlogCard key={post.id} post={post} variant="horizontal" />
              ))}

              {/* Sunday Digest & Audio Guide Module */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5DED2] shadow-xs space-y-4 hover:border-[#2F3A32] transition-colors">
                <div className="flex items-center justify-between border-b border-[#EFEAE1] pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2F3A32]">
                    <Headphones className="w-4 h-4 text-[#A68B6A]" />
                    <span>The Sunday Decor Digest</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7F4EE] text-[#2F3A32] font-bold border border-[#E5DED2]">
                    65k+ Readers
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#5A534B] leading-relaxed">
                  Join our weekly community for curated pantry organization guides, seasonal color recipes, and low-waste interior styling formulas.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Limewash Paint', 'Ceramics', 'Linen Layering', 'Aromatherapy'].map(tag => (
                    <span key={tag} className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F7F4EE] text-[#5A534B] font-medium border border-[#E5DED2]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3 bg-[#2F3A32] hover:bg-[#202722] text-[#F7F4EE] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer border border-[#2F3A32]"
                  >
                    <span>Receive Sunday Issue</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C8A97E]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. POPULAR CATEGORIES */}
      {isSectionEnabled('categories') && (
        <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#A68B6A]">
              Curated Living
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#242522]">
              {sectionTitles.categoriesTitle || 'Browse by Lifestyle Category'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7369]">
              {sectionTitles.categoriesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map(category => {
              const count = publishedPosts.filter(p => p.categoryId === category.id).length;

              return (
                <div
                  key={category.id}
                  onClick={() => navigate(`/category/${category.slug}`)}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-4/5 cursor-pointer shadow-xs hover:shadow-2xl transition-all duration-300 border border-[#E5DED2]"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-all" />

                  <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white">
                    <span className="text-[11px] font-semibold text-[#E5DED2] uppercase tracking-wider mb-1">
                      {count} {count === 1 ? 'Article' : 'Articles'}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold group-hover:text-[#C8A97E] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-[11px] text-[#D5CCC0] line-clamp-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. CURATED SPOTLIGHT (THE DECOR DIARY PICKS) */}
      {isSectionEnabled('curated_spotlight') && spotlightPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5DED2] relative overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2F3A32]">
                  <TrendingUp className="w-4 h-4 text-[#A68B6A]" />
                  <span>{sectionTitles.curatedTitle || 'The Curated Decor Spotlight'}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#242522] leading-snug">
                  {spotlightPost.title}
                </h3>

                <p className="text-sm text-[#5A534B] leading-relaxed">
                  {spotlightPost.excerpt}
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={() => navigate(`/blog/${spotlightPost.slug}`)}
                    className="px-6 py-3.5 bg-[#2F3A32] hover:bg-[#202722] text-[#F7F4EE] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer border border-[#2F3A32]"
                  >
                    <span>Read Masterclass</span>
                    <ArrowRight className="w-4 h-4 text-[#C8A97E]" />
                  </button>

                  <button
                    onClick={() => toggleSavePost(spotlightPost.id)}
                    className="p-3 bg-[#F7F4EE] border border-[#E5DED2] hover:bg-[#EFEAE1] rounded-full text-[#242522] transition-colors cursor-pointer"
                    title="Save story"
                  >
                    <Heart className={`w-4 h-4 ${savedPostIds.includes(spotlightPost.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-xl aspect-16/10 border-2 border-[#E5DED2]">
                <img
                  src={spotlightPost.featuredImage}
                  alt={spotlightPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. LATEST ARTICLES FEED */}
      {isSectionEnabled('latest') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5DED2] pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#A68B6A] block mb-1">
                The Journal
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#242522]">
                {sectionTitles.latestTitle || 'Latest Articles'}
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
                All Stories
              </button>
              {categories.slice(0, 5).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-[#2F3A32] text-[#F7F4EE] shadow-xs'
                      : 'bg-white text-[#5A534B] border border-[#E5DED2] hover:bg-[#EFEAE1]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredLatestPosts.slice(0, visibleCount).map(post => (
              <BlogCard key={post.id} post={post} variant="standard" />
            ))}
          </div>

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

      {/* 7. PINTEREST INSPIRATION & MOODBOARD SECTION */}
      {isSectionEnabled('pinterest_grid') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5DED2] space-y-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
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

            {/* Pinterest Mosaic Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {homepageConfig.pinterestBanner.boardImages.map((imgUrl, i) => (
                <div 
                  key={i} 
                  className="group relative rounded-2xl overflow-hidden aspect-3/4 shadow-2xs border border-[#E5DED2] cursor-pointer"
                >
                  <img
                    src={imgUrl}
                    alt={`Moodboard Pin ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
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

      {/* 8. THE DECOR DIARY SEO CONTENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-12 mb-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#E5DED2] shadow-xs">
          <div className="max-w-4xl mx-auto prose prose-stone lg:prose-lg prose-headings:font-serif prose-headings:text-[#242522] prose-p:text-[#5A534B] prose-a:text-[#C8A97E] prose-strong:text-[#2F3A32]">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">Welcome to The Decor Diary – Elevate Your Living Spaces</h1>
            <p>
              Transforming a house into a home requires more than just filling it with furniture; it demands a curated touch, an eye for detail, and a deep understanding of aesthetics. At <strong>The Decor Diary</strong>, we believe that your living space should be a reflection of your personality—a sanctuary where comfort meets impeccable style. As your premier <strong>online home decor store</strong>, we curate collections that blend timeless elegance with <strong>modern interior design</strong> trends, helping you create spaces you truly love to live in.
            </p>
            <p>
              Whether you are completely remodeling your living room or simply looking for that perfect statement piece to complete your bedroom, our handpicked selections offer unparalleled quality and design. Dive into our exclusive collections and let us inspire your next home transformation.
            </p>

            <h2 className="text-2xl lg:text-3xl font-bold mt-12 mb-6">Trending Wall Art</h2>
            <p>
              Blank walls are like empty canvases waiting for a story. Our <strong>trending wall art</strong> collection features everything from minimalist line drawings to bold, abstract canvases that command attention. Choosing the right art can instantly shift the mood of a room, adding depth, texture, and a focal point that ties your entire decor scheme together. Explore our gallery to find pieces that resonate with your unique artistic vision.
            </p>

            <h2 className="text-2xl lg:text-3xl font-bold mt-12 mb-6">Minimalist Furniture</h2>
            <p>
              In modern interior design, less is often more. Our <strong>minimalist furniture</strong> range embraces clean lines, functional forms, and neutral palettes that bring a sense of calm and order to your home. Crafted from high-quality, sustainable materials, these pieces aren't just beautiful—they are built to last. From sleek coffee tables to understated seating, our furniture selections provide the perfect foundation for a clutter-free, serene environment.
            </p>

            <h2 className="text-2xl lg:text-3xl font-bold mt-12 mb-6">Aesthetic Room Accessories</h2>
            <p>
              It’s the little details that make the biggest impact. Our <strong>aesthetic room accessories</strong>—ranging from artisan-crafted ceramics and textured throw pillows to elegant sculptural vases—are designed to add personality and warmth to any corner. Layering these accents is the secret to achieving that coveted, magazine-ready look without compromising on comfort.
            </p>

            <h2 className="text-2xl lg:text-3xl font-bold mt-12 mb-6">Styling Tips & Buying Guide</h2>
            <p>
              Navigating the world of home decor can be overwhelming, but styling your home should be a joyful experience. When selecting pieces for your space, consider these expert tips:
            </p>
            <ul className="space-y-3 my-6 list-disc pl-6">
              <li><strong>Start with a Neutral Base:</strong> Invest in high-quality, neutral minimalist furniture. This allows you to easily update your room's look seasonally by simply swapping out smaller accessories.</li>
              <li><strong>Play with Texture:</strong> Mix materials like linen, ceramic, wood, and brass. Textural contrast adds warmth and visual interest to an otherwise flat space.</li>
              <li><strong>Rule of Three:</strong> When arranging decorative items on a shelf or coffee table, group them in odd numbers (usually threes). This creates an asymmetrical balance that is highly pleasing to the eye.</li>
              <li><strong>Lighting is Everything:</strong> Don't rely solely on overhead lighting. Use floor lamps, table lamps, and wall sconces to create layers of light that add ambiance and coziness.</li>
            </ul>

            <h2 className="text-2xl lg:text-3xl font-bold mt-12 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-8 mt-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#2F3A32]">How do I choose the right aesthetic room accessories for my space?</h3>
                <p className="m-0">Start by identifying your core color palette and the mood you want to create. Select accessories that complement your larger furniture pieces while introducing a pop of contrast through texture or a subtle accent color.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#2F3A32]">What defines modern interior design?</h3>
                <p className="m-0">Modern interior design emphasizes simplicity, functionality, and clean lines. It often features open floor plans, natural light, and a neutral color palette accented with bold, intentional art or accessories.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#2F3A32]">Are your minimalist furniture pieces durable?</h3>
                <p className="m-0">Absolutely. We source our minimalist furniture from skilled artisans and trusted manufacturers who prioritize high-quality, sustainable materials to ensure longevity and everyday usability.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#2F3A32]">Do you offer styling advice for small apartments?</h3>
                <p className="m-0">Yes! For smaller spaces, we recommend multi-functional furniture, strategic use of mirrors to bounce light, and utilizing vertical space with taller shelving units and trending wall art.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER SUBSCRIPTION SECTION */}
      {isSectionEnabled('newsletter') && (
        <section id="newsletter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <NewsletterBox />
        </section>
      )}
    </div>
  );
};
