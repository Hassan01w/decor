import React, { useEffect, useState, useMemo } from 'react';
import { useBlog } from '../context/BlogContext';
import { RichContentRenderer } from '../components/blog/RichContentRenderer';
import { SocialShareBar } from '../components/blog/SocialShareBar';
import { FloatingShareBar } from '../components/blog/FloatingShareBar';
import { CommentsSection } from '../components/blog/CommentsSection';
import { NewsletterBox } from '../components/blog/NewsletterBox';
import { BlogCard } from '../components/blog/BlogCard';
import { 
  Clock, 
  Share2, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  RefreshCw, 
  Tag, 
  FileText, 
  Timer, 
  Info 
} from 'lucide-react';
import { 
  getPinterestShareUrl, 
  generateArticleJsonLd, 
  calculateReadingTime 
} from '../utils/seo';

interface ArticleDetailPageProps {
  slug: string;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug }) => {
  const { 
    posts, 
    publishedPosts, 
    categories, 
    siteSettings, 
    navigate, 
    savedPostIds, 
    toggleSavePost, 
    incrementViews 
  } = useBlog();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingPace, setReadingPace] = useState<200 | 160 | 250>(200);
  const [showPaceDropdown, setShowPaceDropdown] = useState(false);

  const post = posts.find(p => p.slug === slug || p.id === slug);

  // Dynamically calculate accurate word count and reading time from article content
  const readingStats = useMemo(() => {
    if (!post) {
      return {
        minutes: 1,
        seconds: 60,
        wordCount: 0,
        wordsPerMinute: 200,
        formattedTime: '1 min read',
        formattedBadge: '1 min read • 0 words',
        detailText: 'Calculated at ~200 words/min'
      };
    }
    return calculateReadingTime(post, readingPace);
  }, [post, readingPace]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Increment views count on load
  useEffect(() => {
    if (post) {
      incrementViews(post.id);
      
      // Dynamic SEO metadata tags
      const pageTitle = `${post.seo?.seoTitle || post.title} — The Decor Diary`;
      document.title = pageTitle;

      const pageDesc = post.seo?.metaDescription || post.excerpt;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', pageDesc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', pageTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', pageDesc);

      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute('content', post.seo?.ogImage || post.featuredImage);

      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) canonicalLink.setAttribute('href', `https://thedecordiary.store/blog/${post.slug}`);
    }
  }, [post?.id, post?.slug, post?.title]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="font-serif text-3xl font-bold text-[#242522]">Article Not Found</h1>
        <p className="text-sm text-[#5A534B]">The article you are searching for does not exist, is in draft mode, or has been archived.</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-6 py-3 bg-[#2F3A32] text-white rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer hover:bg-[#A68B6A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Articles</span>
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id === post.categoryId);
  const isSaved = savedPostIds.includes(post.id);

  // JSON-LD structured data for Google SEO
  const jsonLd = generateArticleJsonLd(post, siteSettings, window.location.href);

  // Related articles (same category or popular)
  const relatedPosts = publishedPosts
    .filter(p => p.id !== post.id && (p.categoryId === post.categoryId || p.isPopular))
    .slice(0, 3);

  // Prev / Next posts
  const currentIndex = publishedPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null;

  const formattedPublishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedUpdatedDate = post.updatedAt ? new Date(post.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : null;

  const pinUrl = getPinterestShareUrl(
    window.location.href,
    post.featuredImage,
    `${post.title} — ${post.excerpt}`
  );

  // Remaining time estimate based on scroll progress
  const remainingMinutes = Math.max(1, Math.ceil((readingStats.minutes * (100 - scrollProgress)) / 100));

  return (
    <>
      {/* JSON-LD Script tag for Google SEO & Pinterest Rich Pins */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Floating & Sticky Social Share Bar */}
      <FloatingShareBar 
        url={window.location.href} 
        title={post.title} 
        excerpt={post.excerpt} 
        imageUrl={post.featuredImage} 
      />

      {/* Reading Progress Indicator Bar with dynamic remaining time badge */}
      <div className="fixed top-20 left-0 right-0 z-50 pointer-events-none">
        <div 
          className="h-1 bg-linear-to-r from-[#2F3A32] via-[#A68B6A] to-[#C8A97E] transition-all duration-75 shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
        {scrollProgress > 5 && scrollProgress < 98 && (
          <div className="hidden md:flex absolute top-2 right-6 items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#202722]/90 backdrop-blur-md text-[#F7F4EE] text-[11px] font-medium shadow-md border border-[#3E4D42]">
            <Timer className="w-3 h-3 text-[#C8A97E]" />
            <span>~{remainingMinutes}m remaining ({Math.round(scrollProgress)}%)</span>
          </div>
        )}
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 text-[#242522]">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#7A7369] mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#2F3A32] transition-colors cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#A68B6A]" />
          <button onClick={() => navigate('/blog')} className="hover:text-[#2F3A32] transition-colors cursor-pointer">
            Journal
          </button>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#A68B6A]" />
              <button 
                onClick={() => navigate(`/category/${category.slug}`)} 
                className="hover:text-[#2F3A32] transition-colors text-[#2F3A32] font-bold cursor-pointer"
              >
                {category.name}
              </button>
            </>
          )}
        </nav>

        {/* Draft Notice if previewed */}
        {post.status !== 'published' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <span className="font-semibold">⚠️ You are previewing a {post.status.toUpperCase()} article.</span>
            <button 
              onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
              className="underline font-bold cursor-pointer"
            >
              Edit in CMS &rarr;
            </button>
          </div>
        )}

        {/* Article Header */}
        <header className="space-y-6 text-center sm:text-left">
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            {category && (
              <button
                onClick={() => navigate(`/category/${category.slug}`)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2F3A32] text-[#F7F4EE] text-xs font-bold uppercase tracking-widest hover:bg-[#A68B6A] transition-colors shadow-xs cursor-pointer"
              >
                <span>{category.name}</span>
              </button>
            )}

            {/* Quick reading summary badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#5A534B] text-xs font-semibold border border-[#E5DED2] shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#2F3A32]" />
              <span>{readingStats.formattedTime}</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold tracking-tight text-[#242522] leading-[1.16]">
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-[#5A534B] font-serif italic leading-relaxed">
            {post.excerpt}
          </p>

          {/* ======================================================== */}
          {/* PROMINENT AUTHOR, DATE & AUTOMATED READING TIME ROW */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#E5DED2] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:border-[#2F3A32]/50">
            {/* Left: Author Profile */}
            <div className="flex items-center gap-3.5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#F7F4EE] shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base font-bold text-[#242522] block">
                    {post.author.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#F7F4EE] text-[#2F3A32] border border-[#E5DED2]">
                    Author
                  </span>
                </div>
                <span className="text-xs text-[#7A7369] block mt-0.5">
                  {post.author.role}
                </span>
              </div>
            </div>

            {/* Middle: Published Date & Updates */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A534B] lg:border-l lg:border-[#E5DED2] lg:pl-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#2F3A32]" />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A68B6A] block">Published</span>
                  <span className="font-medium text-[#242522]">{formattedPublishedDate}</span>
                </div>
              </div>

              {formattedUpdatedDate && formattedUpdatedDate !== formattedPublishedDate && (
                <div className="flex items-center gap-1.5 pl-3 border-l border-[#E5DED2]">
                  <RefreshCw className="w-3.5 h-3.5 text-[#2F3A32]" />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A68B6A] block">Updated</span>
                    <span className="font-medium text-[#242522]">{formattedUpdatedDate}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: PROMINENT AUTOMATED READING TIME & WORD COUNT BADGE */}
            <div className="relative lg:border-l lg:border-[#E5DED2] lg:pl-6">
              <div className="bg-gradient-to-br from-[#F7F4EE] to-[#EFEAE1] border border-[#E5DED2] rounded-2xl p-3 sm:px-4 sm:py-2.5 flex items-center justify-between sm:justify-start gap-4 shadow-2xs">
                {/* Reading Time Icon & Primary Metric */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2F3A32] text-[#C8A97E] flex items-center justify-center shadow-xs shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm sm:text-base font-bold text-[#242522] tracking-tight">
                        {readingStats.formattedTime}
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#2F3A32]/10 text-[#2F3A32]">
                        Auto
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#7A7369] mt-0.5">
                      <FileText className="w-3 h-3 text-[#2F3A32]" />
                      <span className="font-medium text-[#242522]">
                        {readingStats.wordCount.toLocaleString()} words
                      </span>
                      <span>•</span>
                      <span>~{readingPace} wpm</span>
                    </div>
                  </div>
                </div>

                {/* Pace Adjustment Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowPaceDropdown(!showPaceDropdown)}
                    className="p-1.5 rounded-lg text-[#7A7369] hover:text-[#242522] hover:bg-white/80 transition-colors cursor-pointer"
                    title="Adjust reading speed calculation"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  {showPaceDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E5DED2] p-3 z-30 space-y-2 text-xs">
                      <div className="font-bold text-[#242522] border-b border-[#EFEAE1] pb-1.5 flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-[#2F3A32]" />
                        <span>Reading Speed Pace</span>
                      </div>
                      <p className="text-[11px] text-[#5A534B]">
                        Total post length: <strong>{readingStats.wordCount.toLocaleString()} words</strong>
                      </p>
                      <div className="space-y-1 pt-1">
                        {[
                          { label: 'Relaxed (160 WPM)', val: 160 },
                          { label: 'Standard (200 WPM)', val: 200 },
                          { label: 'Quick Skim (250 WPM)', val: 250 }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => {
                              setReadingPace(opt.val as any);
                              setShowPaceDropdown(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                              readingPace === opt.val
                                ? 'bg-[#2F3A32] text-[#F7F4EE] font-bold'
                                : 'hover:bg-[#F7F4EE] text-[#242522]'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {readingPace === opt.val && <span className="text-[#C8A97E]">✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image with Pinterest Button */}
        <div className="my-8 space-y-2 group">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E5DED2] aspect-16/10 bg-[#EFEAE1]">
            <img
              src={post.featuredImage}
              alt={post.imageAlt || post.title}
              className="w-full h-full object-cover"
            />
            {/* Pinterest Pin Button Overlay */}
            <a
              href={pinUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute top-4 left-4 bg-[#E60023] hover:bg-[#C9001D] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl transition-all hover:scale-105"
              title="Pin this image to Pinterest"
            >
              <Share2 className="w-4 h-4" />
              <span>Save to Pinterest</span>
            </a>
          </div>
          {post.imageCaption && (
            <p className="text-xs sm:text-sm text-[#7A7369] italic text-center pt-1">
              {post.imageCaption}
            </p>
          )}
        </div>

        {/* Social Share Bar */}
        <div className="flex items-center justify-between py-2 border-b border-[#E5DED2] mb-8">
          <SocialShareBar
            url={window.location.href}
            title={post.title}
            media={post.featuredImage}
            excerpt={post.excerpt}
            savesCount={post.savesCount || 0}
            isSaved={isSaved}
            onToggleSave={() => toggleSavePost(post.id)}
          />
        </div>

        {/* Main Editorial Content */}
        <div className="prose prose-stone max-w-none">
          <RichContentRenderer 
            blocks={post.contentBlocks} 
            articleTitle={post.title} 
          />
        </div>

        {/* Article Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#E5DED2] flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#7A7369] flex items-center gap-1 mr-2">
              <Tag className="w-3.5 h-3.5 text-[#2F3A32]" />
              Tagged in:
            </span>
            {post.tags.map(tag => (
              <button
                key={tag}
                onClick={() => navigate('/blog')}
                className="px-3.5 py-1.5 bg-white hover:bg-[#2F3A32] hover:text-white border border-[#E5DED2] rounded-full text-xs font-semibold text-[#242522] transition-colors cursor-pointer shadow-2xs"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Mid-Article Editorial Newsletter Box */}
        <div className="my-14">
          <NewsletterBox 
            variant="compact"
            title="Enjoyed this sanctuary guide?"
            subtitle="Get our latest room transformations, printables, and DIY blueprints sent straight to your inbox every Sunday morning."
            source={`Article: ${post.title}`}
          />
        </div>

        {/* Author Bio Box */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E5DED2] flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xs my-10">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-[#F7F4EE] shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h4 className="font-serif text-lg font-bold text-[#242522]">
                About {post.author.name}
              </h4>
              <span className="text-xs text-[#A68B6A] font-semibold">
                {post.author.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5A534B] leading-relaxed">
              {post.author.bio}
            </p>
          </div>
        </div>

        {/* Previous / Next Post Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-6 border-t border-[#E5DED2]">
          {prevPost ? (
            <div
              onClick={() => navigate(`/blog/${prevPost.slug}`)}
              className="p-4 rounded-2xl bg-white border border-[#E5DED2] hover:border-[#2F3A32] hover:shadow-md transition-all cursor-pointer space-y-1 group shadow-2xs"
            >
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#7A7369] flex items-center gap-1 group-hover:text-[#2F3A32]">
                <ArrowLeft className="w-3 h-3" />
                Previous Story
              </span>
              <h5 className="font-serif text-sm font-bold text-[#242522] line-clamp-1 group-hover:text-[#2F3A32]">
                {prevPost.title}
              </h5>
            </div>
          ) : <div />}

          {nextPost ? (
            <div
              onClick={() => navigate(`/blog/${nextPost.slug}`)}
              className="p-4 rounded-2xl bg-white border border-[#E5DED2] hover:border-[#2F3A32] hover:shadow-md transition-all cursor-pointer space-y-1 text-right group shadow-2xs"
            >
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#7A7369] flex items-center justify-end gap-1 group-hover:text-[#2F3A32]">
                Next Story
                <ArrowRight className="w-3 h-3" />
              </span>
              <h5 className="font-serif text-sm font-bold text-[#242522] line-clamp-1 group-hover:text-[#2F3A32]">
                {nextPost.title}
              </h5>
            </div>
          ) : <div />}
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="my-16 space-y-6 pt-10 border-t border-[#E5DED2]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-[#242522]">
                You May Also Love
              </h3>
              <button
                onClick={() => navigate('/blog')}
                className="text-xs uppercase font-bold tracking-wider text-[#2F3A32] hover:text-[#A68B6A] hover:underline cursor-pointer"
              >
                View all articles &rarr;
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map(rel => (
                <BlogCard key={rel.id} post={rel} variant="compact" />
              ))}
            </div>
          </section>
        )}

        {/* Reader Comments Section */}
        <CommentsSection postId={post.id} />
      </article>
    </>
  );
};
