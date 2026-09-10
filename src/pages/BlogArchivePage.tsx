import React, { useState, useMemo } from 'react';
import { useBlog } from '../context/BlogContext';
import { BlogCard } from '../components/blog/BlogCard';
import { NewsletterBox } from '../components/blog/NewsletterBox';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';

export const BlogArchivePage: React.FC = () => {
  const { publishedPosts, categories } = useBlog();
  
  // Read initial query params from URL search string
  const queryParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialCategory = queryParams.get('category') || 'all';
  const initialTag = queryParams.get('tag') || 'all';
  const initialQuery = queryParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedTag, setSelectedTag] = useState<string>(initialTag);
  const [searchTerm, setSearchTerm] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'views'>('latest');
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    publishedPosts.forEach(post => {
      post.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [publishedPosts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    return publishedPosts.filter(post => {
      // Category filter
      if (selectedCategory !== 'all' && post.categoryId !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (selectedTag !== 'all' && !post.tags?.includes(selectedTag)) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const titleMatch = post.title.toLowerCase().includes(query);
        const excerptMatch = post.excerpt.toLowerCase().includes(query);
        const tagMatch = post.tags?.some(t => t.toLowerCase().includes(query));
        if (!titleMatch && !excerptMatch && !tagMatch) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.savesCount || 0) - (a.savesCount || 0);
      }
      if (sortBy === 'views') {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      // Default: latest published date
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [publishedPosts, selectedCategory, selectedTag, searchTerm, sortBy]);

  const featuredSpotlight = filteredPosts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 pb-24 text-[#242522]">
      {/* Editorial Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#A68B6A]">
          The Complete Journal Archive
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#242522] tracking-tight">
          Curated Stories, Masterclasses & Guides
        </h1>
        <p className="text-base sm:text-lg text-[#5A534B] leading-relaxed">
          Explore our extensive catalog of warm interior inspiration, pantry systems, DIY transformations, non-toxic cleaning, and slow culinary rituals.
        </p>
      </div>

      {/* Control Bar: Search, Category Pills, Sort */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#E5DED2] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#2F3A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword or topic..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs sm:text-sm text-[#242522] placeholder-[#8A857B] focus:outline-none focus:border-[#2F3A32]"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-[#2F3A32]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#5A534B]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs font-semibold text-[#242522] focus:outline-none focus:border-[#2F3A32] cursor-pointer"
            >
              <option value="latest">Latest Published</option>
              <option value="popular">Most Pinned / Saved</option>
              <option value="views">Most Read Stories</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-[#EFEAE1] pt-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#2F3A32] text-white shadow-xs'
                : 'bg-[#F7F4EE] text-[#5A534B] hover:bg-[#EFEAE1]'
            }`}
          >
            All Categories ({publishedPosts.length})
          </button>
          {categories.map(cat => {
            const count = publishedPosts.filter(p => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#2F3A32] text-white shadow-xs'
                    : 'bg-[#F7F4EE] text-[#5A534B] hover:bg-[#EFEAE1]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Tag Cloud Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#7A7369]">
              Filter Tag:
            </span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                selectedTag === 'all' ? 'bg-[#2F3A32] text-white' : 'bg-[#F7F4EE] text-[#5A534B] hover:bg-[#EFEAE1]'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  selectedTag === tag ? 'bg-[#2F3A32] text-white' : 'bg-[#F7F4EE] text-[#5A534B] hover:bg-[#EFEAE1]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count Info */}
      <div className="flex items-center justify-between text-xs text-[#7A7369]">
        <span>Showing <strong>{filteredPosts.length}</strong> matching articles</span>
        {(selectedCategory !== 'all' || selectedTag !== 'all' || searchTerm) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag('all');
              setSearchTerm('');
            }}
            className="text-[#2F3A32] underline hover:text-[#A68B6A] cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid of Results */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-[#E5DED2]">
          <BookOpen className="w-10 h-10 text-[#A68B6A] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#242522]">No articles matched your criteria</h3>
          <p className="text-xs sm:text-sm text-[#5A534B]">Try searching for other interior design topics, pantry ideas, or resetting your filter tags.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.slice(0, visibleCount).map(post => (
            <BlogCard key={post.id} post={post} variant="standard" />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredPosts.length > visibleCount && (
        <div className="text-center pt-8">
          <button
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="px-8 py-3.5 bg-white hover:bg-[#EFEAE1] text-[#242522] border border-[#E5DED2] rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:border-[#2F3A32]"
          >
            Load More Articles ({filteredPosts.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* Bottom Newsletter */}
      <div className="pt-8">
        <NewsletterBox />
      </div>
    </div>
  );
};
