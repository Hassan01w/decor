import React from 'react';
import { useBlog } from '../context/BlogContext';
import { BlogCard } from '../components/blog/BlogCard';
import { NewsletterBox } from '../components/blog/NewsletterBox';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface CategoryPageProps {
  slug: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug }) => {
  const { categories, publishedPosts, navigate } = useBlog();
  const category = categories.find(c => c.slug === slug || c.id === slug);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="font-serif text-3xl font-bold text-[#2D2A26]">Category Not Found</h1>
        <p className="text-sm text-[#6B635B]">The lifestyle category you are looking for does not exist or has been moved.</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-6 py-3 bg-[#8C6D53] text-white rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Articles</span>
        </button>
      </div>
    );
  }

  const posts = publishedPosts.filter(p => p.categoryId === category.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 pb-24">
      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#E8DFD5] bg-[#2D2A26] text-white min-h-[300px] flex items-end p-6 sm:p-12">
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1C19] via-[#1F1C19]/60 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/blog')}
              className="text-xs uppercase font-bold tracking-widest text-[#D4C8BC] hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </button>
            <span className="text-[#8C6D53]">•</span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C4A482]">
              {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {category.name}
          </h1>

          <p className="text-sm sm:text-base text-[#D4C8BC] leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} variant="standard" showCategory={false} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-[#E8DFD5]">
          <BookOpen className="w-12 h-12 text-[#C4B5A5] mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-[#2D2A26]">No Articles in {category.name} Yet</h3>
          <p className="text-sm text-[#6B635B] max-w-sm mx-auto">
            Our editorial team is currently preparing new masterclasses for this category. Check back soon!
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-2.5 bg-[#8C6D53] text-white rounded-full text-xs font-bold uppercase tracking-wider"
          >
            Explore Other Stories
          </button>
        </div>
      )}

      {/* Category Newsletter */}
      <NewsletterBox 
        title={`Get Weekly ${category.name} Inspiration`}
        subtitle={`Subscribe for curated ${category.name.toLowerCase()} essays, step-by-step room guides, and design checklists delivered each Sunday.`}
        source={`Category: ${category.name}`}
      />
    </div>
  );
};
