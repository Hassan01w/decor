import React, { useState, useEffect, useMemo } from 'react';
import { useBlog } from '../../context/BlogContext';
import { BlogPost, ContentBlock, BlockType, Author } from '../../types';
import { AUTHORS } from '../../services/initialData';
import { slugify, estimateReadingTime, calculateReadingTime, calculatePostWordCount } from '../../utils/seo';
import { RichContentRenderer } from '../../components/blog/RichContentRenderer';
import { canEditPost } from '../../utils/permissions';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Image as ImageIcon, 
  Heading1, 
  Heading2, 
  Quote, 
  List, 
  ListOrdered, 
  Lightbulb, 
  ExternalLink, 
  Film, 
  Minus, 
  Search, 
  Sparkles, 
  X, 
  Check, 
  Globe, 
  Share2,
  Calendar,
  Clock,
  Laptop,
  Tablet,
  Smartphone,
  Copy,
  AlertCircle,
  Lock,
  Tag,
  FileText,
  Timer,
  ShoppingBag
} from 'lucide-react';

interface AdminPostEditorProps {
  postId?: string;
}

export const AdminPostEditor: React.FC<AdminPostEditorProps> = ({ postId }) => {
  const { posts, categories, mediaLibrary, currentUser, savePost, navigate, showToast, setPreviewPostData } = useBlog();

  const cleanPostId = useMemo(() => {
    if (!postId) return '';
    try {
      return decodeURIComponent(postId).trim().replace(/\/+$/, '');
    } catch {
      return postId.trim().replace(/\/+$/, '');
    }
  }, [postId]);

  const existingPost = useMemo(() => {
    if (!cleanPostId) return undefined;
    const lower = cleanPostId.toLowerCase();
    return posts.find(p => 
      p.id === cleanPostId || 
      p.slug === cleanPostId || 
      p.id?.toLowerCase() === lower || 
      p.slug?.toLowerCase() === lower
    );
  }, [posts, cleanPostId]);

  // Permission check
  const isAuthorized = canEditPost(currentUser, existingPost);

  // Post form state
  const [title, setTitle] = useState(existingPost?.title || '');
  const [slug, setSlug] = useState(existingPost?.slug || '');
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || '');
  const [categoryId, setCategoryId] = useState(existingPost?.categoryId || categories[0]?.id || 'decor');
  const [tagsInput, setTagsInput] = useState(() => {
    if (Array.isArray(existingPost?.tags)) {
      return existingPost.tags.join(', ');
    }
    if (typeof existingPost?.tags === 'string') {
      return existingPost.tags;
    }
    return 'Home Decor, Modern Living';
  });
  
  // Set author: if author role, default to their profile
  const defaultAuthor = currentUser?.authorId 
    ? (AUTHORS.find(a => a.id === currentUser.authorId) || AUTHORS[0])
    : AUTHORS[0];
  const [authorId, setAuthorId] = useState(existingPost?.author?.id || defaultAuthor.id);

  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>(existingPost?.status || 'published');
  const [isFeatured, setIsFeatured] = useState(existingPost?.isFeatured || false);
  const [isPopular, setIsPopular] = useState(existingPost?.isPopular || false);
  const [featuredImage, setFeaturedImage] = useState(
    existingPost?.featuredImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80'
  );
  const [imageCaption, setImageCaption] = useState(existingPost?.imageCaption || '');
  const [imageAlt, setImageAlt] = useState(existingPost?.imageAlt || '');
  const [scheduledAt, setScheduledAt] = useState(
    existingPost?.scheduledAt || new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16)
  );

  // SEO state
  const [seoTitle, setSeoTitle] = useState(existingPost?.seo?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(existingPost?.seo?.metaDescription || '');
  const [focusKeyword, setFocusKeyword] = useState(existingPost?.seo?.focusKeyword || '');
  const [canonicalUrl, setCanonicalUrl] = useState(existingPost?.seo?.canonicalUrl || '');
  const [ogImage, setOgImage] = useState(existingPost?.seo?.ogImage || '');

  // Content Blocks
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    if (existingPost?.contentBlocks && Array.isArray(existingPost.contentBlocks) && existingPost.contentBlocks.length > 0) {
      return existingPost.contentBlocks.map((b, idx) => ({
        id: b.id || `block-${idx}-${Date.now()}`,
        type: b.type || 'paragraph',
        content: b.content || { text: '' }
      }));
    }
    return [
      {
        id: 'block-1',
        type: 'paragraph',
        content: { text: 'Start writing your inspiring home and lifestyle story here...' }
      }
    ];
  });

  // Modals & Preview viewport states
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showMediaPicker, setShowMediaPicker] = useState<number | 'featured' | null>(null);

  // Auto-generate slug and SEO title if creating new post
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!existingPost) {
      setSlug(slugify(newTitle));
      if (!seoTitle) setSeoTitle(newTitle);
    }
  };

  const handleExcerptChange = (newExcerpt: string) => {
    setExcerpt(newExcerpt);
    if (!existingPost && !metaDescription) {
      setMetaDescription(newExcerpt);
    }
  };

  // Preset Scheduling Helper
  const setSchedulePreset = (daysFromNow: number, hour: number = 9) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysFromNow);
    targetDate.setHours(hour, 0, 0, 0);
    setScheduledAt(targetDate.toISOString().slice(0, 16));
    setStatus('scheduled');
    showToast(`Scheduled for ${targetDate.toLocaleDateString()} at ${hour}:00 AM`, 'info');
  };

  // Block management
  const addBlock = (type: BlockType, index?: number) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      content: {
        text: type === 'heading2' ? 'New Section Heading' : type === 'quote' ? 'Add inspirational quote here...' : '',
        url: type === 'image' ? 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80' : '',
        items: type === 'bullet_list' || type === 'number_list' ? ['First actionable styling tip', 'Second recommendation', 'Third design detail'] : undefined,
        calloutType: 'tip',
        calloutTitle: 'Editorial Styling Tip',
        author: 'Elena Vance',
        images: type === 'gallery' ? [
          { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', caption: 'Image 1' },
          { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80', caption: 'Image 2' }
        ] : undefined,
        productTitle: type === 'shoppable_product' ? 'Linen Duvet Cover' : undefined,
        productPrice: type === 'shoppable_product' ? '$245' : undefined,
        productBrand: type === 'shoppable_product' ? 'CULTIVER' : undefined,
        productLink: type === 'shoppable_product' ? 'https://example.com/product' : undefined,
        productImage: type === 'shoppable_product' ? 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80' : undefined
      }
    };

    if (typeof index === 'number') {
      const next = [...blocks];
      next.splice(index + 1, 0, newBlock);
      setBlocks(next);
    } else {
      setBlocks([...blocks, newBlock]);
    }
  };

  const updateBlockContent = (index: number, newContent: Partial<ContentBlock['content']>) => {
    const updated = [...blocks];
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        content: { ...(updated[index].content || {}), ...newContent }
      };
      setBlocks(updated);
    }
  };

  const removeBlock = (index: number) => {
    if (blocks.length === 1) {
      showToast('Article must contain at least one content block.', 'error');
      return;
    }
    const updated = blocks.filter((_, idx) => idx !== index);
    setBlocks(updated);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBlocks(updated);
  };

  // Live automated reading stats based on word count
  const liveReadingStats = calculateReadingTime({
    title,
    excerpt,
    contentBlocks: blocks
  });

  // Save logic
  const handleSavePost = (overrideStatus?: 'published' | 'draft' | 'scheduled') => {
    if (!title.trim()) {
      showToast('Please provide an article title.', 'error');
      return;
    }

    const currentAuthor = AUTHORS.find(a => a.id === authorId) || AUTHORS[0];
    const cleanTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const readingTime = liveReadingStats.minutes;
    const finalStatus = overrideStatus || status;

    const postData: BlogPost = {
      id: existingPost?.id || `post-${Date.now()}`,
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim(),
      contentBlocks: blocks,
      featuredImage: featuredImage.trim(),
      imageCaption: imageCaption.trim(),
      imageAlt: imageAlt.trim() || title,
      categoryId,
      tags: cleanTags,
      author: currentAuthor,
      publishedAt: existingPost?.publishedAt || (finalStatus === 'scheduled' ? new Date(scheduledAt).toISOString() : new Date().toISOString()),
      updatedAt: new Date().toISOString(),
      scheduledAt: finalStatus === 'scheduled' ? new Date(scheduledAt).toISOString() : undefined,
      readingTimeMinutes: readingTime,
      status: finalStatus,
      isFeatured,
      isPopular,
      viewsCount: existingPost?.viewsCount || 0,
      savesCount: existingPost?.savesCount || 0,
      seo: {
        seoTitle: seoTitle.trim() || title,
        metaDescription: metaDescription.trim() || excerpt,
        focusKeyword: focusKeyword.trim(),
        canonicalUrl: canonicalUrl.trim() || `https://thedecordiary.store/blog/${slug}`,
        ogImage: ogImage.trim() || featuredImage,
      }
    };

    savePost(postData);
    navigate('/admin/posts');
  };

  // Build current temporary post object for preview
  const currentAuthor = AUTHORS.find(a => a.id === authorId) || AUTHORS[0];
  const selectedCategory = categories.find(c => c.id === categoryId);
  const previewPost: BlogPost = {
    id: existingPost?.id || 'preview-temp',
    title: title || 'Untitled Lifestyle Story',
    slug: slug || 'preview-story',
    excerpt: excerpt || 'An exploration into warm textural sanctuaries and intentional slow living at home.',
    contentBlocks: blocks,
    featuredImage: featuredImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    imageCaption: imageCaption || 'Curated editorial styling and natural textures.',
    imageAlt: imageAlt || title,
    categoryId,
    tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    author: currentAuthor,
    publishedAt: status === 'scheduled' && scheduledAt ? new Date(scheduledAt).toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scheduledAt: status === 'scheduled' ? new Date(scheduledAt).toISOString() : undefined,
    readingTimeMinutes: liveReadingStats.minutes,
    status: status,
    isFeatured,
    isPopular,
    viewsCount: existingPost?.viewsCount || 1420,
    savesCount: existingPost?.savesCount || 86,
    seo: {
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || excerpt,
      focusKeyword: focusKeyword || 'home decor',
      canonicalUrl: `https://thedecordiary.store/blog/${slug}`,
      ogImage: featuredImage
    }
  };

  const handleOpenPreviewModal = () => {
    setPreviewPostData(previewPost);
    setShowPreviewModal(true);
  };

  const copyUnlistedPreviewLink = () => {
    const previewUrl = `${window.location.origin}${window.location.pathname}#/blog/${previewPost.slug}?preview=true`;
    navigator.clipboard.writeText(previewUrl);
    showToast('Temporary unlisted preview URL copied to clipboard!', 'success');
  };

  // If postId was passed but post was not found in CMS
  if (cleanPostId && !existingPost) {
    return (
      <div className="p-8 sm:p-16 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-2xl font-bold font-serif">
          ?
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211E1B]">
          Article Not Found
        </h2>
        <p className="text-sm text-[#7D7368] leading-relaxed">
          The requested article (ID or slug: <code className="px-2 py-0.5 bg-stone-100 rounded font-mono text-xs font-semibold">{cleanPostId}</code>) could not be found in your database. It may have been deleted or the link is invalid.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/admin/posts')}
            className="px-6 py-2.5 bg-[#8C6D53] hover:bg-[#735842] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            &larr; Back to All Articles
          </button>
          <button
            onClick={() => navigate('/admin/posts/new')}
            className="px-6 py-2.5 bg-white border border-[#D9CFC4] hover:bg-[#F7F4EE] text-[#211E1B] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            + Create New Article
          </button>
        </div>
      </div>
    );
  }

  // If user is restricted
  if (existingPost && !isAuthorized) {
    return (
      <div className="p-6 sm:p-12 max-w-3xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#211E1B]">Access Restricted</h2>
        <p className="text-sm text-[#6B635B] max-w-md mx-auto leading-relaxed">
          As an <strong>Author ({currentUser?.name})</strong>, you are restricted to creating new articles and modifying only your own posts. This article was written by <strong>{existingPost.author?.name}</strong>.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/admin/posts')}
            className="px-5 py-2.5 bg-[#2D2A26] text-white text-xs font-bold uppercase tracking-wider rounded-xl"
          >
            &larr; Back to My Articles
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="px-5 py-2.5 bg-white border border-[#E8DFD5] text-[#2D2A26] text-xs font-bold rounded-xl"
          >
            Switch to Administrator Role
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto pb-32">
      {/* Top Sticky Header Toolbar */}
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md py-4 border-b border-[#E8DFD5] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/posts')}
            className="p-2 rounded-xl bg-white hover:bg-[#EFE9E1] border border-[#E8DFD5] text-[#2D2A26] transition-colors"
            title="Back to All Articles"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6D53]">
              {existingPost ? 'Editorial Revision' : 'New Article Draft'}
            </span>
            <h2 className="font-serif text-xl font-bold text-[#211E1B] truncate max-w-md">
              {title || 'Untitled Article'}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleOpenPreviewModal}
            className="px-4 py-2.5 bg-white hover:bg-[#EFE9E1] text-[#2D2A26] border border-[#D9CFC4] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            title="Preview how article renders on frontend"
          >
            <Eye className="w-4 h-4 text-[#8C6D53]" />
            <span>Preview Post</span>
          </button>

          <button
            type="button"
            onClick={() => handleSavePost('draft')}
            className="px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#4A423B] border border-[#D9CFC4] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Save Draft
          </button>

          {/* Dedicated Schedule Button */}
          <button
            type="button"
            onClick={() => {
              setStatus('scheduled');
              setShowScheduleModal(true);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs border ${
              status === 'scheduled'
                ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                : 'bg-white hover:bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title="Schedule this post for future automated release"
          >
            <Clock className="w-4 h-4 text-amber-700" />
            <span>{status === 'scheduled' ? 'Scheduled 🕒' : 'Schedule Post'}</span>
          </button>

          {status === 'scheduled' ? (
            <button
              type="button"
              onClick={() => handleSavePost('scheduled')}
              className="px-5 py-2.5 bg-[#8C6D53] hover:bg-[#725740] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
            >
              <Clock className="w-4 h-4" />
              <span>Save & Schedule</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSavePost('published')}
              className="px-5 py-2.5 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Publish Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Gutenberg Block Canvas (8 Cols) vs Right Metadata/SEO (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Article Title, Excerpt & Rich Blocks (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Title & Excerpt Box */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E73] mb-1">
                Article Title (H1) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. The Art of Warm Minimalism: How to Create a Cozy Sanctuary..."
                className="w-full text-2xl sm:text-3xl font-serif font-bold text-[#211E1B] placeholder:text-stone-300 focus:outline-none border-b border-transparent focus:border-[#8C6D53] pb-2 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E73] mb-1">
                Editorial Excerpt / Hook (Used in Cards & Search Snippets)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => handleExcerptChange(e.target.value)}
                placeholder="A compelling 1-2 sentence preview hook that draws readers in..."
                className="w-full text-sm font-serif italic text-[#4A423B] placeholder:text-stone-300 focus:outline-none border border-[#E8DFD5] rounded-xl p-3 bg-[#FAF8F5]/50 leading-relaxed"
              />
            </div>
          </div>

          {/* Block Builder Canvas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#211E1B]">
                Story Content Blocks ({blocks.length})
              </h3>
              <span className="text-xs text-[#8A7E73]">
                Estimated Read: ~{estimateReadingTime(blocks)} min
              </span>
            </div>

            {/* Rendered Block Editors */}
            <div className="space-y-4">
              {blocks.map((block, idx) => {
                const blockContent = block.content || {};
                return (
                <div
                  key={block.id || `blk-${idx}`}
                  className="bg-white rounded-2xl p-5 border border-[#E8DFD5] shadow-xs group hover:border-[#8C6D53] transition-all relative"
                >
                  {/* Block Header & Reorder Toolbar */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F0EBE6] text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#8C6D53] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#EFE9E1] text-[#8C6D53] flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      {block.type?.replace?.('_', ' ') || block.type}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-[#EFE9E1] text-[#8A7E73] disabled:opacity-30"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 'down')}
                        disabled={idx === blocks.length - 1}
                        className="p-1 rounded hover:bg-[#EFE9E1] text-[#8A7E73] disabled:opacity-30"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(idx)}
                        className="p-1 rounded hover:bg-red-50 text-[#8A7E73] hover:text-red-600 ml-2"
                        title="Delete Block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block Content Inputs Based on Type */}
                  {block.type === 'paragraph' && (
                    <textarea
                      rows={4}
                      value={blockContent.text || ''}
                      onChange={(e) => updateBlockContent(idx, { text: e.target.value })}
                      placeholder="Write your paragraph content..."
                      className="w-full text-sm sm:text-base leading-relaxed text-[#2D2A26] focus:outline-none bg-transparent"
                    />
                  )}

                  {block.type === 'heading2' && (
                    <input
                      type="text"
                      value={blockContent.text || ''}
                      onChange={(e) => updateBlockContent(idx, { text: e.target.value })}
                      placeholder="Section Heading (H2)..."
                      className="w-full font-serif text-xl sm:text-2xl font-bold text-[#211E1B] focus:outline-none bg-transparent"
                    />
                  )}

                  {block.type === 'heading3' && (
                    <input
                      type="text"
                      value={blockContent.text || ''}
                      onChange={(e) => updateBlockContent(idx, { text: e.target.value })}
                      placeholder="Subheading (H3)..."
                      className="w-full font-serif text-lg font-bold text-[#211E1B] focus:outline-none bg-transparent"
                    />
                  )}

                  {block.type === 'quote' && (
                    <div className="space-y-2 p-3 bg-[#FAF8F5] rounded-xl border-l-4 border-[#8C6D53]">
                      <textarea
                        rows={2}
                        value={blockContent.text || ''}
                        onChange={(e) => updateBlockContent(idx, { text: e.target.value })}
                        placeholder="Inspirational pull quote text..."
                        className="w-full text-base font-serif italic text-[#2D2A26] focus:outline-none bg-transparent"
                      />
                      <input
                        type="text"
                        value={blockContent.author || ''}
                        onChange={(e) => updateBlockContent(idx, { author: e.target.value })}
                        placeholder="Quote attribution (e.g. William Morris)"
                        className="w-full text-xs font-semibold text-[#8C6D53] focus:outline-none bg-transparent"
                      />
                    </div>
                  )}

                  {block.type === 'image' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={blockContent.url || ''}
                          onChange={(e) => updateBlockContent(idx, { url: e.target.value })}
                          placeholder="Image URL (https://images.unsplash.com/...)"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowMediaPicker(idx)}
                          className="px-3 py-2 bg-[#EFE9E1] hover:bg-[#8C6D53] hover:text-white rounded-xl text-xs font-bold whitespace-nowrap transition-colors"
                        >
                          Media Library
                        </button>
                      </div>

                      {blockContent.url && (
                        <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-stone-100 max-h-56">
                          <img src={blockContent.url} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={blockContent.caption || ''}
                          onChange={(e) => updateBlockContent(idx, { caption: e.target.value })}
                          placeholder="Editorial caption shown under image..."
                          className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={blockContent.alt || ''}
                          onChange={(e) => updateBlockContent(idx, { alt: e.target.value })}
                          placeholder="Image SEO Alt text..."
                          className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {block.type === 'gallery' && (
                    <div className="space-y-4">
                      <p className="text-xs text-[#8A7E73] font-bold">Manage Gallery Images (2-3 recommended)</p>
                      {blockContent.images?.map((img, imgIdx) => (
                        <div key={imgIdx} className="space-y-2 p-3 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl relative">
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...(blockContent.images || [])];
                              newImages.splice(imgIdx, 1);
                              updateBlockContent(idx, { images: newImages });
                            }}
                            className="absolute top-2 right-2 p-1 bg-white hover:bg-red-50 text-red-500 rounded text-xs border border-[#E8DFD5]"
                          >
                            Remove
                          </button>
                          <div className="flex flex-col sm:flex-row gap-3">
                            {img.url && (
                              <img src={img.url} alt="preview" className="w-16 h-16 object-cover rounded-lg bg-stone-100" />
                            )}
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={img.url || ''}
                                onChange={(e) => {
                                  const newImages = [...(blockContent.images || [])];
                                  newImages[imgIdx] = { ...img, url: e.target.value };
                                  updateBlockContent(idx, { images: newImages });
                                }}
                                placeholder="Image URL..."
                                className="w-full px-3 py-1.5 bg-white border border-[#E8DFD5] rounded-lg text-xs"
                              />
                              <input
                                type="text"
                                value={img.caption || ''}
                                onChange={(e) => {
                                  const newImages = [...(blockContent.images || [])];
                                  newImages[imgIdx] = { ...img, caption: e.target.value };
                                  updateBlockContent(idx, { images: newImages });
                                }}
                                placeholder="Caption (optional)..."
                                className="w-full px-3 py-1.5 bg-white border border-[#E8DFD5] rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...(blockContent.images || []), { url: '', caption: '' }];
                          updateBlockContent(idx, { images: newImages });
                        }}
                        className="w-full py-2 bg-white border border-dashed border-[#D9CFC4] hover:border-[#8C6D53] text-[#8C6D53] rounded-xl text-xs font-bold transition-colors"
                      >
                        + Add Image
                      </button>
                    </div>
                  )}

                  {block.type === 'callout' && (
                    <div className="space-y-2 p-4 bg-[#F4EFEA] rounded-xl border border-[#E8DFD5]">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={blockContent.calloutTitle || 'Styling Tip'}
                          onChange={(e) => updateBlockContent(idx, { calloutTitle: e.target.value })}
                          className="font-serif text-sm font-bold text-[#8C6D53] bg-transparent focus:outline-none"
                        />
                        <select
                          value={blockContent.calloutType || 'tip'}
                          onChange={(e) => updateBlockContent(idx, { calloutType: e.target.value as any })}
                          className="text-xs bg-white px-2 py-1 rounded border border-[#E8DFD5]"
                        >
                          <option value="tip">💡 Tip / Blueprint</option>
                          <option value="info">ℹ️ Note / Resource</option>
                          <option value="warning">⚠️ Caution</option>
                        </select>
                      </div>
                      <textarea
                        rows={3}
                        value={blockContent.text || ''}
                        onChange={(e) => updateBlockContent(idx, { text: e.target.value })}
                        placeholder="Key recommendation or DIY formula..."
                        className="w-full text-xs sm:text-sm text-[#2D2A26] bg-transparent focus:outline-none leading-relaxed"
                      />
                    </div>
                  )}

                  {(block.type === 'bullet_list' || block.type === 'number_list') && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-[#8A7E73]">Enter list items separated by newlines:</p>
                      <textarea
                        rows={4}
                        value={blockContent.items?.join('\n') || ''}
                        onChange={(e) => updateBlockContent(idx, { items: e.target.value.split('\n').filter(Boolean) })}
                        placeholder="Item 1&#10;Item 2&#10;Item 3"
                        className="w-full text-sm p-3 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl leading-relaxed"
                      />
                    </div>
                  )}

                  {block.type === 'shoppable_product' && (
                    <div className="p-4 bg-white rounded-xl border border-[#E8DFD5] shadow-xs space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={blockContent.productTitle || ''}
                          onChange={(e) => updateBlockContent(idx, { productTitle: e.target.value })}
                          placeholder="Product Title"
                          className="px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs font-bold text-[#211E1B]"
                        />
                        <input
                          type="text"
                          value={blockContent.productBrand || ''}
                          onChange={(e) => updateBlockContent(idx, { productBrand: e.target.value })}
                          placeholder="Brand Name"
                          className="px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={blockContent.productPrice || ''}
                          onChange={(e) => updateBlockContent(idx, { productPrice: e.target.value })}
                          placeholder="Price (e.g. $129)"
                          className="px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={blockContent.productLink || ''}
                          onChange={(e) => updateBlockContent(idx, { productLink: e.target.value })}
                          placeholder="Affiliate or Product Link"
                          className="px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        {blockContent.productImage && (
                          <img src={blockContent.productImage} alt="product" className="w-12 h-12 rounded object-cover border border-[#E8DFD5]" />
                        )}
                        <input
                          type="text"
                          value={blockContent.productImage || ''}
                          onChange={(e) => updateBlockContent(idx, { productImage: e.target.value })}
                          placeholder="Product Image URL"
                          className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {block.type === 'divider' && (
                    <div className="py-2 flex items-center justify-center text-xs text-[#8A7E73] italic">
                      <span>— Editorial Section Divider —</span>
                    </div>
                  )}

                  {block.type === 'button' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DFD5]">
                      <input
                        type="text"
                        value={blockContent.buttonText || ''}
                        onChange={(e) => updateBlockContent(idx, { buttonText: e.target.value })}
                        placeholder="Button Text (e.g. Shop the Look)"
                        className="px-3 py-2 bg-white border border-[#E8DFD5] rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={blockContent.buttonUrl || ''}
                        onChange={(e) => updateBlockContent(idx, { buttonUrl: e.target.value })}
                        placeholder="Destination Link URL"
                        className="px-3 py-2 bg-white border border-[#E8DFD5] rounded-lg text-xs"
                      />
                    </div>
                  )}
                </div>
                );
              })}
            </div>

            {/* Add Block Bar */}
            <div className="p-4 bg-[#F4EFEA] rounded-2xl border border-dashed border-[#D9CFC4] space-y-3 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">
                + Insert Gutenberg Content Block
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { type: 'paragraph' as BlockType, label: 'Paragraph', icon: Minus },
                  { type: 'heading2' as BlockType, label: 'Heading (H2)', icon: Heading1 },
                  { type: 'heading3' as BlockType, label: 'Subhead (H3)', icon: Heading2 },
                  { type: 'image' as BlockType, label: 'Photo Block', icon: ImageIcon },
                  { type: 'gallery' as BlockType, label: 'Image Gallery', icon: ImageIcon },
                  { type: 'quote' as BlockType, label: 'Pull Quote', icon: Quote },
                  { type: 'bullet_list' as BlockType, label: 'Bullet List', icon: List },
                  { type: 'number_list' as BlockType, label: 'Numbered Steps', icon: ListOrdered },
                  { type: 'callout' as BlockType, label: 'Styling Tip Box', icon: Lightbulb },
                  { type: 'shoppable_product' as BlockType, label: 'Shoppable Product', icon: ShoppingBag },
                  { type: 'divider' as BlockType, label: 'Divider', icon: Minus },
                  { type: 'button' as BlockType, label: 'CTA Button', icon: ExternalLink },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => addBlock(item.type)}
                      className="px-3 py-2 bg-white hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#8C6D53] group-hover:text-white" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Publishing Controls, Content Scheduling, Featured Image, SEO Optimizer (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Automated Reading Time & Content Metrics Card */}
          <div className="bg-gradient-to-br from-white to-[#FAF7F2] rounded-2xl p-5 border border-[#E8DFD5] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9E5835] flex items-center gap-1.5">
                <Timer className="w-4 h-4" />
                Reading Time Calculator
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#9E5835]/10 text-[#9E5835] text-[10px] font-bold">
                Auto-calculated
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-[#E8DFD5] shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#8A7E73] block">Est. Reading Time</span>
                <span className="text-lg font-serif font-bold text-[#211E1B] block mt-0.5">
                  {liveReadingStats.formattedTime}
                </span>
                <span className="text-[10px] text-[#8A7E73]">@ 200 WPM</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8DFD5] shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#8A7E73] block">Total Word Count</span>
                <span className="text-lg font-serif font-bold text-[#211E1B] block mt-0.5">
                  {liveReadingStats.wordCount.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#8A7E73]">{blocks.length} content blocks</span>
              </div>
            </div>

            <p className="text-[11px] text-[#6B635B] leading-relaxed italic bg-white/70 p-2.5 rounded-lg border border-[#EFE9E1]">
              💡 <strong>SEO Recommendation:</strong> Detailed home styling and DIY guides between 800 - 1,500 words achieve optimal Pinterest and Google Search engagement.
            </p>
          </div>

          {/* Publication & Scheduling Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFD5] shadow-xs space-y-4">
            <h4 className="font-serif text-base font-bold text-[#211E1B] border-b border-[#F0EBE6] pb-2 flex items-center justify-between">
              <span>Publishing & Scheduling</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                status === 'published' ? 'bg-green-100 text-green-800' :
                status === 'scheduled' ? 'bg-[#EFE9E1] text-[#8C6D53]' : 'bg-amber-100 text-amber-800'
              }`}>
                {status}
              </span>
            </h4>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1.5">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs font-bold text-[#211E1B]"
              >
                <option value="published">🟢 Live / Published Immediately</option>
                <option value="scheduled">🕒 Scheduled Future Publication</option>
                <option value="draft">🟡 Draft (Hidden from visitors)</option>
              </select>
            </div>

            {status !== 'scheduled' && (
              <button
                type="button"
                onClick={() => {
                  setStatus('scheduled');
                  setShowScheduleModal(true);
                }}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Schedule for Future Release</span>
              </button>
            )}

            {/* Scheduling Date & Time Picker */}
            {status === 'scheduled' && (
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DFD5] space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-bold text-[#8C6D53]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Set Publication Release Time</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(true)}
                    className="text-[10px] text-[#8C6D53] hover:underline font-bold"
                  >
                    Open Modal &rarr;
                  </button>
                </div>

                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs font-medium text-[#211E1B]"
                />

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A7E73]">Quick Presets:</span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setSchedulePreset(1, 9)}
                      className="px-2 py-1.5 bg-white hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-lg text-[11px] font-medium transition-colors"
                    >
                      Tomorrow 9am
                    </button>
                    <button
                      type="button"
                      onClick={() => setSchedulePreset(3, 10)}
                      className="px-2 py-1.5 bg-white hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-lg text-[11px] font-medium transition-colors"
                    >
                      In 3 Days 10am
                    </button>
                    <button
                      type="button"
                      onClick={() => setSchedulePreset(7, 9)}
                      className="px-2 py-1.5 bg-white hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-lg text-[11px] font-medium transition-colors"
                    >
                      Next Week
                    </button>
                    <button
                      type="button"
                      onClick={() => setSchedulePreset(14, 9)}
                      className="px-2 py-1.5 bg-white hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-lg text-[11px] font-medium transition-colors"
                    >
                      In 2 Weeks
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-[#8A7E73] italic">
                  Post will remain hidden on public views until the release timestamp passes.
                </p>
              </div>
            )}

            {/* Featured & Popular Toggles */}
            <div className="space-y-2 pt-2 border-t border-[#F0EBE6]">
              <label className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xl cursor-pointer hover:bg-[#EFE9E1] transition-colors">
                <span className="text-xs font-bold text-[#2D2A26]">Featured on Homepage Hero</span>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#8C6D53] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xl cursor-pointer hover:bg-[#EFE9E1] transition-colors">
                <span className="text-xs font-bold text-[#2D2A26]">Mark as Popular Story</span>
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 text-[#8C6D53] rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Category & Author Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFD5] shadow-xs space-y-4">
            <h4 className="font-serif text-base font-bold text-[#211E1B] border-b border-[#F0EBE6] pb-2">
              Taxonomy & Bylines
            </h4>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs font-semibold"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                Article Author
              </label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs font-semibold"
              >
                {AUTHORS.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Warm Minimalism, Living Room, DIY..."
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Featured Image & Pinterest Cover Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFD5] shadow-xs space-y-4">
            <h4 className="font-serif text-base font-bold text-[#211E1B] border-b border-[#F0EBE6] pb-2 flex items-center justify-between">
              <span>Featured Photo (Pinterest)</span>
              <span className="text-[10px] text-[#8A7E73] font-bold">16:9 / 2:3 Pin</span>
            </h4>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowMediaPicker('featured')}
                  className="px-3 py-2 bg-[#EFE9E1] hover:bg-[#8C6D53] hover:text-white rounded-xl text-xs font-bold whitespace-nowrap transition-colors"
                >
                  Pick
                </button>
              </div>

              {featuredImage && (
                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-stone-100 shadow-sm border border-[#E8DFD5]">
                  <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                </div>
              )}

              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Image caption under photo..."
                className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs"
              />
            </div>
          </div>

          {/* SEO & Meta Tags Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFD5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-2">
              <h4 className="font-serif text-base font-bold text-[#211E1B] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#8C6D53]" />
                <span>SEO & Google Preview</span>
              </h4>
            </div>

            {/* Google SERP Snippet Preview */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DFD5] space-y-1">
              <span className="text-[11px] text-[#8A7E73] block truncate">
                https://thedecordiary.store &rsaquo; blog &rsaquo; {slug || 'article-slug'}
              </span>
              <h5 className="font-serif text-sm font-bold text-blue-800 line-clamp-1">
                {seoTitle || title || 'Article Title'}
              </h5>
              <p className="text-xs text-[#555] line-clamp-2 leading-relaxed">
                {metaDescription || excerpt || 'Article description will appear in Google search results and Pinterest pin rich snippets.'}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  Focus SEO Keyword
                </label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="e.g. warm minimalism living room"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  SEO Title Tag
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Custom SEO Title Tag..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Up to 155 characters for search engines..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Fledged Live Preview Modal with Device Switcher */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex flex-col items-center justify-start p-2 sm:p-6 animate-in fade-in duration-200">
          {/* Top Preview Control Header */}
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-[#E8DFD5] p-3 sm:p-4 mb-4 flex flex-wrap items-center justify-between gap-3 sticky top-2 z-20">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-md text-xs font-bold uppercase tracking-wider">
                Unlisted Preview Mode
              </span>
              <span className="text-xs text-[#8A7E73] hidden md:inline">
                Realtime rendered simulation as seen by readers
              </span>
            </div>

            {/* Device Viewport Switcher */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E8DFD5]">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  previewDevice === 'desktop' ? 'bg-[#8C6D53] text-white shadow-xs' : 'text-[#8A7E73] hover:text-[#2D2A26]'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop (100%)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  previewDevice === 'tablet' ? 'bg-[#8C6D53] text-white shadow-xs' : 'text-[#8A7E73] hover:text-[#2D2A26]'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet (768px)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  previewDevice === 'mobile' ? 'bg-[#8C6D53] text-white shadow-xs' : 'text-[#8A7E73] hover:text-[#2D2A26]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile (375px)</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyUnlistedPreviewLink}
                className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#2D2A26] border border-[#E8DFD5] rounded-xl text-xs font-bold flex items-center gap-1.5"
                title="Copy shareable preview URL"
              >
                <Copy className="w-3.5 h-3.5 text-[#8C6D53]" />
                <span className="hidden sm:inline">Copy Link</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-xl text-[#8A7E73] hover:text-[#2D2A26] hover:bg-[#EFE9E1]"
                title="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview Container Container */}
          <div className="w-full flex justify-center pb-12">
            <div
              className={`bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E8DFD5] overflow-hidden transition-all duration-300 ${
                previewDevice === 'desktop' ? 'w-full max-w-4xl' :
                previewDevice === 'tablet' ? 'w-[768px] max-w-full' : 'w-[390px] max-w-full'
              }`}
            >
              {/* Unlisted Article Notification */}
              <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-900 flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Viewing temporary unlisted draft preview
                </span>
                <span className="text-[11px] uppercase font-bold text-amber-700">Status: {status}</span>
              </div>

              {/* Article Render Canvas */}
              <div className="p-6 sm:p-12 space-y-8">
                {/* Category & Title */}
                <div className="space-y-4 text-center sm:text-left">
                  {selectedCategory && (
                    <span className="inline-block px-3.5 py-1 rounded-full bg-[#EFE9E1] text-[#8C6D53] text-xs font-bold uppercase tracking-widest">
                      {selectedCategory.name}
                    </span>
                  )}
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1F1C19] leading-tight">
                    {previewPost.title}
                  </h1>
                  <p className="text-base sm:text-xl text-[#6B635B] font-serif italic leading-relaxed">
                    {previewPost.excerpt}
                  </p>

                  {/* Author Meta Row */}
                  <div className="flex items-center gap-3 py-4 border-y border-[#E8DFD5] text-xs text-[#8A7E73]">
                    <img
                      src={currentAuthor.avatar}
                      alt={currentAuthor.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                    />
                    <div>
                      <span className="font-serif text-sm font-bold text-[#2D2A26] block">
                        Written by {currentAuthor.name}
                      </span>
                      <span>{currentAuthor.role} • ~{previewPost.readingTimeMinutes} min read</span>
                    </div>
                  </div>
                </div>

                {/* Featured Photo */}
                {previewPost.featuredImage && (
                  <div className="space-y-2">
                    <div className="relative rounded-3xl overflow-hidden aspect-16/10 shadow-lg border border-[#E8DFD5]">
                      <img
                        src={previewPost.featuredImage}
                        alt={previewPost.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-[#E60023] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Save Pin</span>
                      </div>
                    </div>
                    {previewPost.imageCaption && (
                      <p className="text-xs text-[#8A7E73] italic text-center">
                        {previewPost.imageCaption}
                      </p>
                    )}
                  </div>
                )}

                {/* Rich Content Blocks */}
                <div className="prose prose-stone max-w-none pt-4">
                  <RichContentRenderer blocks={previewPost.contentBlocks} articleTitle={previewPost.title} />
                </div>

                {/* Tags */}
                {previewPost.tags && previewPost.tags.length > 0 && (
                  <div className="pt-6 border-t border-[#E8DFD5] flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-widest text-[#8A7E73] flex items-center gap-1 mr-1">
                      <Tag className="w-3 h-3" />
                      Tags:
                    </span>
                    {previewPost.tags.map(t => (
                      <span key={t} className="px-3 py-1 bg-white border border-[#E8DFD5] rounded-full text-xs font-medium text-[#4A423B]">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author Bio Card */}
                <div className="p-6 bg-white rounded-2xl border border-[#E8DFD5] flex items-center gap-4 shadow-xs">
                  <img
                    src={currentAuthor.avatar}
                    alt={currentAuthor.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#2D2A26]">About {currentAuthor.name}</h4>
                    <p className="text-xs text-[#6B635B] mt-0.5">{currentAuthor.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {showMediaPicker !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-[#E8DFD5] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h4 className="font-serif text-lg font-bold text-[#2D2A26]">
                Select Image from Media Library
              </h4>
              <button
                type="button"
                onClick={() => setShowMediaPicker(null)}
                className="p-1 rounded-full hover:bg-[#EFE9E1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto p-1">
              {mediaLibrary.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (showMediaPicker === 'featured') {
                      setFeaturedImage(item.url);
                    } else if (typeof showMediaPicker === 'number') {
                      updateBlockContent(showMediaPicker, { url: item.url, alt: item.alt });
                    }
                    setShowMediaPicker(null);
                  }}
                  className="group relative aspect-16/10 rounded-xl overflow-hidden cursor-pointer border border-[#E8DFD5] hover:border-[#8C6D53] transition-all"
                >
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    Select
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Publication Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-6 shadow-2xl border border-[#E8DFD5]">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#211E1B]">
                    Schedule Post Release
                  </h3>
                  <p className="text-xs text-[#8A7E73]">
                    Set automated publication date & time
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="p-1.5 rounded-full hover:bg-[#EFE9E1] text-[#8A7E73] hover:text-[#211E1B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-2">
                  Select Release Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => {
                    setScheduledAt(e.target.value);
                    setStatus('scheduled');
                  }}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-sm font-semibold text-[#211E1B] focus:outline-none focus:border-[#8C6D53]"
                />
              </div>

              {/* Quick Timing Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7E73]">
                  Quick Timing Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSchedulePreset(1, 9)}
                    className="px-3 py-2 bg-[#FAF8F5] hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#2D2A26] transition-colors text-left flex items-center justify-between"
                  >
                    <span>Tomorrow</span>
                    <span className="text-[11px] opacity-75">9:00 AM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchedulePreset(3, 10)}
                    className="px-3 py-2 bg-[#FAF8F5] hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#2D2A26] transition-colors text-left flex items-center justify-between"
                  >
                    <span>In 3 Days</span>
                    <span className="text-[11px] opacity-75">10:00 AM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchedulePreset(7, 9)}
                    className="px-3 py-2 bg-[#FAF8F5] hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#2D2A26] transition-colors text-left flex items-center justify-between"
                  >
                    <span>Next Week</span>
                    <span className="text-[11px] opacity-75">9:00 AM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchedulePreset(14, 9)}
                    className="px-3 py-2 bg-[#FAF8F5] hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#2D2A26] transition-colors text-left flex items-center justify-between"
                  >
                    <span>In 2 Weeks</span>
                    <span className="text-[11px] opacity-75">9:00 AM</span>
                  </button>
                </div>
              </div>

              {/* Status information banner */}
              <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold">
                    Target: {new Date(scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  <p className="mt-0.5 text-amber-800/90">
                    This article will remain in "Scheduled" status until the designated time, after which it will automatically be visible to all visitors.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-[#E8DFD5]">
              <button
                type="button"
                onClick={() => {
                  setStatus('draft');
                  setShowScheduleModal(false);
                  showToast('Scheduled status removed. Reverted to Draft.', 'info');
                }}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-[#8A7E73] hover:text-red-600 transition-colors"
              >
                Revert to Draft
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus('scheduled');
                  setShowScheduleModal(false);
                  showToast(`Schedule saved for ${new Date(scheduledAt).toLocaleString()}`, 'success');
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#D9CFC4] hover:bg-[#EFE9E1] text-[#2D2A26] rounded-xl text-xs font-bold transition-colors"
              >
                Apply & Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSavePost('scheduled');
                  setShowScheduleModal(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#8C6D53] hover:bg-[#725740] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Clock className="w-4 h-4" />
                <span>Confirm & Schedule Post</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
