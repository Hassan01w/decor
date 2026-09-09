import React from 'react';
import { BlogPost, Category } from '../../types';
import { useBlog } from '../../context/BlogContext';
import { Clock, Bookmark, ArrowUpRight, Share2 } from 'lucide-react';
import { getPinterestShareUrl } from '../../utils/seo';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'featured' | 'standard' | 'compact' | 'horizontal';
  showCategory?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ 
  post, 
  variant = 'standard',
  showCategory = true 
}) => {
  const { categories, navigate, savedPostIds, toggleSavePost } = useBlog();
  const category = categories.find(c => c.id === post.categoryId);
  const isSaved = savedPostIds.includes(post.id);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const pinUrl = getPinterestShareUrl(
    window.location.origin + `/blog/${post.slug}`,
    post.featuredImage,
    `${post.title} — ${post.excerpt}`
  );

  const handleCardClick = () => {
    navigate(`/blog/${post.slug}`);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavePost(post.id);
  };

  // Horizontal variant (for featured right stack / archive)
  if (variant === 'horizontal') {
    return (
      <article 
        onClick={handleCardClick}
        className="group bg-white rounded-2xl overflow-hidden border border-[#E5DED2] hover:border-[#2F3A32] hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row cursor-pointer shadow-xs"
      >
        <div className="sm:w-2/5 relative overflow-hidden aspect-16/10 sm:aspect-auto min-h-[170px] bg-[#EFEAE1]">
          <img
            src={post.featuredImage}
            alt={post.imageAlt || post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Pinterest Pin Overlay Button */}
          <a
            href={pinUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 left-3 bg-[#E60023] hover:bg-[#C9001D] text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="Save to Pinterest"
          >
            <Share2 className="w-3 h-3" />
            <span>Pin</span>
          </a>

          {/* Bookmark Button */}
          <button
            onClick={handleSaveClick}
            className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all ${
              isSaved 
                ? 'bg-[#2F3A32] text-[#C8A97E]' 
                : 'bg-black/35 hover:bg-black/60 text-white'
            }`}
            title={isSaved ? 'Saved' : 'Save to board'}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="sm:w-3/5 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] mb-2">
              {showCategory && category && (
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/category/${category.slug}`);
                  }}
                  className="font-bold tracking-widest uppercase text-[#2F3A32] hover:text-[#A68B6A] hover:underline"
                >
                  {category.name}
                </span>
              )}
              <span className="text-[#C8A97E]">•</span>
              <span className="text-[#7A7369]">{formattedDate}</span>
              <span className="text-[#C8A97E]">•</span>
              <span className="text-[#7A7369] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#A68B6A]" />
                {post.readingTimeMinutes}m
              </span>
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#242522] group-hover:text-[#2F3A32] transition-colors leading-snug mb-2">
              {post.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#5A534B] leading-relaxed line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#EFEAE1]">
            <div className="flex items-center gap-2">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E5DED2]"
              />
              <span className="text-xs font-semibold text-[#242522]">{post.author.name}</span>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2F3A32] group-hover:text-[#A68B6A] group-hover:translate-x-1 transition-all">
              <span>Read</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Featured variant (Hero lead card)
  if (variant === 'featured') {
    return (
      <article 
        onClick={handleCardClick}
        className="group bg-white rounded-3xl overflow-hidden border border-[#E5DED2] hover:border-[#2F3A32] hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer shadow-sm"
      >
        <div className="relative aspect-16/10 overflow-hidden bg-[#EFEAE1]">
          <img
            src={post.featuredImage}
            alt={post.imageAlt || post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Category Badge */}
          {category && (
            <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#2F3A32] shadow-sm border border-[#E5DED2]">
              {category.name}
            </span>
          )}

          {/* Pinterest Pin Button */}
          <a
            href={pinUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 left-4 bg-[#E60023] hover:bg-[#C9001D] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
            title="Save to Pinterest"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Pin Image</span>
          </a>

          {/* Save Bookmark */}
          <button
            onClick={handleSaveClick}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              isSaved 
                ? 'bg-[#2F3A32] text-[#C8A97E]' 
                : 'bg-white/90 hover:bg-white text-[#242522]'
            }`}
            title={isSaved ? 'Saved to board' : 'Save to board'}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2.5 text-xs text-[#7A7369] mb-3">
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#A68B6A]" />
                {post.readingTimeMinutes} min read
              </span>
              <span>•</span>
              <span className="text-[#2F3A32] font-bold uppercase tracking-wider text-[10px] bg-[#2F3A32]/10 px-2 py-0.5 rounded-full">Lead Feature</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl lg:text-[28px] font-bold text-[#242522] group-hover:text-[#2F3A32] transition-colors leading-tight mb-3">
              {post.title}
            </h3>

            <p className="text-sm sm:text-base text-[#5A534B] leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#EFEAE1]">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#F7F4EE]"
              />
              <div>
                <span className="text-xs font-bold text-[#242522] block">{post.author.name}</span>
                <span className="text-[11px] text-[#7A7369]">{post.author.role.split('&')[0]}</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2F3A32] group-hover:text-[#A68B6A] transition-colors">
              <span>Read Full Article</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Compact variant (3-column grid / sidebar)
  if (variant === 'compact') {
    return (
      <article 
        onClick={handleCardClick}
        className="group bg-white rounded-2xl overflow-hidden border border-[#E5DED2] hover:border-[#2F3A32] hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer shadow-2xs"
      >
        <div className="relative aspect-16/10 overflow-hidden bg-[#EFEAE1]">
          <img
            src={post.featuredImage}
            alt={post.imageAlt || post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {showCategory && category && (
            <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#2F3A32]">
              {category.name}
            </span>
          )}
        </div>
        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-[#7A7369] mb-1">
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{post.readingTimeMinutes}m read</span>
            </div>
            <h4 className="font-serif text-sm font-bold text-[#242522] group-hover:text-[#2F3A32] line-clamp-2 transition-colors">
              {post.title}
            </h4>
          </div>
          <div className="pt-2 border-t border-[#EFEAE1] flex items-center justify-between text-[11px] text-[#2F3A32] font-semibold">
            <span>{post.author.name}</span>
            <span className="text-[#A68B6A] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </div>
        </div>
      </article>
    );
  }

  // Standard vertical card (Grid layout)
  return (
    <article 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E5DED2] hover:border-[#2F3A32] hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer shadow-xs"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-[#EFEAE1]">
        <img
          src={post.featuredImage}
          alt={post.imageAlt || post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Category Badge */}
        {showCategory && category && (
          <span 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/category/${category.slug}`);
            }}
            className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#242522] hover:bg-[#2F3A32] hover:text-white transition-colors shadow-2xs border border-[#E5DED2]"
          >
            {category.name}
          </span>
        )}

        {/* Pinterest Pin Button */}
        <a
          href={pinUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 left-3 bg-[#E60023] hover:bg-[#C9001D] text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="Save to Pinterest"
        >
          <Share2 className="w-3 h-3" />
          <span>Pin</span>
        </a>

        {/* Save Bookmark */}
        <button
          onClick={handleSaveClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
            isSaved 
              ? 'bg-[#2F3A32] text-[#C8A97E]' 
              : 'bg-white/85 hover:bg-white text-[#242522]'
          }`}
          title={isSaved ? 'Saved to board' : 'Save to board'}
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#7A7369] mb-2.5">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#A68B6A]" />
              {post.readingTimeMinutes} min read
            </span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#242522] group-hover:text-[#2F3A32] transition-colors leading-snug mb-2.5">
            {post.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#5A534B] leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3.5 border-t border-[#EFEAE1]">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E5DED2]"
            />
            <span className="text-xs font-semibold text-[#242522]">{post.author.name}</span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2F3A32] group-hover:text-[#A68B6A] group-hover:translate-x-1 transition-all">
            <span>Read</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
