import React, { useState, useRef } from 'react';
import { useBlog } from '../../context/BlogContext';
import { canEditPost, canDeletePost } from '../../utils/permissions';
import { 
  Plus, 
  Search, 
  Edit3, 
  Copy, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Sparkles, 
  Star,
  Clock,
  Filter,
  Lock,
  Calendar,
  AlertCircle,
  Check,
  Download,
  Upload,
  X
} from 'lucide-react';

export const AdminPostsList: React.FC = () => {
  const { 
    posts, 
    categories, 
    currentUser,
    navigate, 
    savePost, 
    deletePost, 
    duplicatePost, 
    bulkUpdatePosts,
    bulkDeletePosts,
    showToast,
    exportDatabase,
    importDatabase,
    exportBlogs,
    importBlogs
  } = useBlog();

  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'scheduled' | 'draft' | 'my_posts' | 'featured' | 'popular'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [scheduleModalPost, setScheduleModalPost] = useState<any | null>(null);
  const [quickScheduledAt, setQuickScheduledAt] = useState<string>('');
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [bulkCategoryChoice, setBulkCategoryChoice] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blogFileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const jsonStr = exportDatabase();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `decor-diary-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Database exported successfully.', 'success');
    } catch (err) {
      showToast('Failed to export data.', 'error');
    }
  };

  const handleExportBlogsOnly = () => {
    try {
      const jsonStr = exportBlogs();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `decor-diary-blogs-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Custom blogs exported successfully!', 'success');
    } catch (err) {
      showToast('Failed to export blogs.', 'error');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportBlogsClick = () => {
    blogFileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const success = importDatabase(json);
        if (success) {
          showToast('Database imported successfully. The page will reload.', 'success');
          setTimeout(() => window.location.reload(), 1500);
        }
      } catch (err) {
        showToast('Invalid JSON file format.', 'error');
      }
    };
    reader.readAsText(file);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleBlogFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const success = importBlogs(json, 'merge');
        if (success) {
          showToast('Custom blogs imported and merged successfully!', 'success');
        }
      } catch (err) {
        showToast('Invalid JSON file format for blogs.', 'error');
      }
    };
    reader.readAsText(file);
    if (blogFileInputRef.current) blogFileInputRef.current.value = '';
  };

  const isAuthorRole = currentUser?.role === 'author';

  // Filter posts
  const filteredPosts = posts.filter(post => {
    // Tab filter
    if (activeFilter === 'published' && post.status !== 'published') return false;
    if (activeFilter === 'scheduled' && post.status !== 'scheduled') return false;
    if (activeFilter === 'draft' && post.status !== 'draft') return false;
    if (activeFilter === 'my_posts' && !canEditPost(currentUser, post)) return false;
    if (activeFilter === 'featured' && !post.isFeatured) return false;
    if (activeFilter === 'popular' && !post.isPopular) return false;

    // Category filter
    if (selectedCategory !== 'all' && post.categoryId !== selectedCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (post.title || '').toLowerCase().includes(q);
      const authorMatch = (post.author?.name || '').toLowerCase().includes(q);
      const tagMatch = post.tags?.some(t => (t || '').toLowerCase().includes(q));
      if (!titleMatch && !authorMatch && !tagMatch) return false;
    }

    return true;
  });

  const handleToggleStatus = (post: any) => {
    if (!canEditPost(currentUser, post)) {
      showToast(`Permission denied: You can only modify your own articles.`, 'error');
      return;
    }
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    savePost({ ...post, status: nextStatus });
  };

  const handlePublishScheduledNow = (post: any) => {
    if (!canEditPost(currentUser, post)) {
      showToast(`Permission denied: You can only modify your own articles.`, 'error');
      return;
    }
    savePost({
      ...post,
      status: 'published',
      publishedAt: new Date().toISOString()
    });
    showToast(`"${post.title.slice(0, 30)}..." published immediately!`, 'success');
  };

  const handleQuickSchedule = (post: any, targetTime: string) => {
    if (!canEditPost(currentUser, post)) {
      showToast(`Permission denied: You can only modify your own articles.`, 'error');
      return;
    }
    const isoTime = new Date(targetTime).toISOString();
    savePost({
      ...post,
      status: 'scheduled',
      scheduledAt: isoTime,
      publishedAt: isoTime
    });
    setScheduleModalPost(null);
    showToast(`"${post.title.slice(0, 30)}..." scheduled for ${new Date(targetTime).toLocaleString()}!`, 'success');
  };

  const handleCancelSchedule = (post: any) => {
    if (!canEditPost(currentUser, post)) {
      showToast(`Permission denied: You can only modify your own articles.`, 'error');
      return;
    }
    savePost({
      ...post,
      status: 'draft',
      scheduledAt: undefined
    });
    setScheduleModalPost(null);
    showToast(`Scheduled release cancelled. Reverted to Draft.`, 'info');
  };

  const handleToggleFeatured = (post: any) => {
    if (!canEditPost(currentUser, post)) {
      showToast(`Permission denied: You can only modify your own articles.`, 'error');
      return;
    }
    savePost({ ...post, isFeatured: !post.isFeatured });
  };

  const handleTogglePopular = (post: any) => {
    if (!canEditPost(currentUser, post)) {
      showToast(`Permission denied: You can only modify your own articles.`, 'error');
      return;
    }
    savePost({ ...post, isPopular: !post.isPopular });
  };

  const handleDelete = (id: string) => {
    const postToDelete = posts.find(p => p.id === id);
    if (!canDeletePost(currentUser, postToDelete)) {
      showToast(`Permission denied: You can only delete your own articles.`, 'error');
      setDeleteConfirmId(null);
      return;
    }
    deletePost(id);
    setDeleteConfirmId(null);
  };

  const toggleSelectAll = () => {
    if (selectedPostIds.length === filteredPosts.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(filteredPosts.map(p => p.id));
    }
  };

  const toggleSelectPost = (id: string) => {
    setSelectedPostIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = (status: 'published' | 'draft') => {
    if (selectedPostIds.length === 0) return;
    bulkUpdatePosts(selectedPostIds, { status });
    setSelectedPostIds([]);
  };

  const handleBulkFeature = (isFeatured: boolean) => {
    if (selectedPostIds.length === 0) return;
    bulkUpdatePosts(selectedPostIds, { isFeatured });
    setSelectedPostIds([]);
  };

  const handleBulkCategory = (categoryId: string) => {
    if (selectedPostIds.length === 0 || !categoryId) return;
    bulkUpdatePosts(selectedPostIds, { categoryId });
    setSelectedPostIds([]);
    setBulkCategoryChoice('');
  };

  const handleBulkDelete = () => {
    if (selectedPostIds.length === 0) return;
    if (window.confirm(`Are you sure you want to permanently delete ${selectedPostIds.length} selected articles?`)) {
      bulkDeletePosts(selectedPostIds);
      setSelectedPostIds([]);
    }
  };

  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const myPostsCount = posts.filter(p => canEditPost(currentUser, p)).length;

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Top Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D53]">
              Content Management
            </span>
            {isAuthorRole && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#6E7C69] text-white text-[10px] font-bold uppercase tracking-wider">
                Author Role
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#211E1B] tracking-tight">
            All Blog Articles ({posts.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7E73] mt-1">
            {isAuthorRole 
              ? `You have editorial rights to create and edit your own stories (${myPostsCount} total).`
              : 'Create, schedule, edit, duplicate, and manage the live publication of all magazine stories.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            type="file"
            accept=".json"
            ref={blogFileInputRef}
            className="hidden"
            onChange={handleBlogFileChange}
          />
          <button
            onClick={handleImportBlogsClick}
            className="px-3.5 py-3 bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#6B635B] hover:text-[#2D2A26] border border-[#E8DFD5] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Import Blogs JSON"
          >
            <Upload className="w-3.5 h-3.5 text-[#8C6D53]" />
            <span className="hidden lg:inline">Import Blogs</span>
          </button>
          <button
            onClick={handleExportBlogsOnly}
            className="px-3.5 py-3 bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#6B635B] hover:text-[#2D2A26] border border-[#E8DFD5] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Export Blogs JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#8C6D53]" />
            <span className="hidden lg:inline">Export Blogs</span>
          </button>
          <button
            onClick={handleImportClick}
            className="px-3 py-3 bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#6B635B] hover:text-[#2D2A26] border border-[#E8DFD5] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Import Full Database Backup"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import DB</span>
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-3 bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#6B635B] hover:text-[#2D2A26] border border-[#E8DFD5] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Export Full Database Backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export DB</span>
          </button>
          <button
            onClick={() => navigate('/admin/posts/new')}
            className="px-5 py-3 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Author Notice Banner if in Author Mode */}
      {isAuthorRole && (
        <div className="p-4 bg-stone-100 rounded-2xl border border-stone-300 flex items-center justify-between gap-3 text-xs text-stone-700">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#8C6D53] shrink-0" />
            <span>
              Logged in as <strong>{currentUser?.name}</strong>. Articles authored by other writers are displayed as read-only.
            </span>
          </div>
          <button
            onClick={() => setActiveFilter('my_posts')}
            className="font-bold underline text-[#8C6D53] whitespace-nowrap hover:text-[#2D2A26]"
          >
            Show My Articles Only ({myPostsCount})
          </button>
        </div>
      )}

      {/* Control Bar: Tabs, Search, Category Selector */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8DFD5] shadow-xs space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Articles', count: posts.length },
            { id: 'published', label: 'Published', count: posts.filter(p => p.status === 'published').length },
            { id: 'scheduled', label: 'Scheduled', count: scheduledCount },
            { id: 'draft', label: 'Drafts', count: posts.filter(p => p.status === 'draft').length },
            { id: 'my_posts', label: 'My Articles', count: myPostsCount },
            { id: 'featured', label: 'Featured', count: posts.filter(p => p.isFeatured).length },
            { id: 'popular', label: 'Popular', count: posts.filter(p => p.isPopular).length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#2D2A26] text-white shadow-sm'
                  : 'bg-[#FAF8F5] text-[#6B635B] hover:bg-[#EFE9E1]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#F0EBE6]">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8C6D53] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tag, or author..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs focus:outline-none focus:border-[#8C6D53]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#8C6D53]" />
            <span className="text-xs font-bold text-[#6B635B] uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#2D2A26] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-xs overflow-hidden">
        {filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8DFD5] text-[11px] font-bold uppercase tracking-wider text-[#8A7E73]">
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedPostIds.length === filteredPosts.length && filteredPosts.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded text-[#8C6D53] focus:ring-[#8C6D53] cursor-pointer"
                      title="Select all filtered articles"
                    />
                  </th>
                  <th className="py-3.5 px-4 sm:px-6">Article</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status & Release</th>
                  <th className="py-3.5 px-4">Badges</th>
                  <th className="py-3.5 px-4">Engagement</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE6]">
                {filteredPosts.map(post => {
                  const category = categories.find(c => c.id === post.categoryId);
                  const canEdit = canEditPost(currentUser, post);
                  const canDelete = canDeletePost(currentUser, post);
                  const isScheduled = post.status === 'scheduled';
                  const scheduledDate = post.scheduledAt ? new Date(post.scheduledAt) : null;
                  const isSelected = selectedPostIds.includes(post.id);

                  return (
                    <tr 
                      key={post.id} 
                      className={`hover:bg-[#FAF8F5]/80 transition-colors ${
                        isSelected ? 'bg-[#F7F2EB]' : ''
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <td className="py-4 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectPost(post.id)}
                          className="w-4 h-4 rounded text-[#8C6D53] focus:ring-[#8C6D53] cursor-pointer"
                        />
                      </td>

                      {/* Title & Image */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3 min-w-[240px]">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#E8DFD5]"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 
                                onClick={() => canEdit && navigate(`/admin/posts/edit/${post.id}`)}
                                className={`font-serif text-sm font-bold truncate ${
                                  canEdit ? 'text-[#2D2A26] hover:text-[#8C6D53] cursor-pointer' : 'text-stone-600'
                                }`}
                              >
                                {post.title}
                              </h4>
                              {!canEdit && (
                                <span title="Read-only: Authored by another team member" className="text-stone-400">
                                  <Lock className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#8A7E73] truncate max-w-xs">
                              {post.readingTimeMinutes} min read • {post.tags?.slice(0, 2).join(', ')}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                            alt={post.author?.name || 'Author'}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-semibold text-[#2D2A26]">
                            {post.author?.name || 'Editorial Team'}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-[#EFE9E1] text-[#8C6D53] rounded-md text-xs font-bold">
                          {category?.name || 'Lifestyle'}
                        </span>
                      </td>

                      {/* Status & Scheduled date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {isScheduled ? (
                            <div className="space-y-1">
                              <button
                                onClick={() => {
                                  if (!canEdit) return;
                                  setScheduleModalPost(post);
                                  setQuickScheduledAt(
                                    post.scheduledAt
                                      ? new Date(post.scheduledAt).toISOString().slice(0, 16)
                                      : new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16)
                                  );
                                }}
                                disabled={!canEdit}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
                                title={canEdit ? "Click to adjust scheduled timing" : "Scheduled post"}
                              >
                                <Clock className="w-3 h-3 text-amber-700" />
                                <span>Scheduled</span>
                              </button>
                              {scheduledDate && (
                                <p className="text-[10px] text-[#8A7E73] font-medium block">
                                  {scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                                  {scheduledDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                </p>
                              )}
                              {canEdit && (
                                <div className="flex items-center gap-2 pt-0.5">
                                  <button
                                    onClick={() => handlePublishScheduledNow(post)}
                                    className="text-[10px] font-bold text-[#8C6D53] hover:underline"
                                  >
                                    Publish Now &rarr;
                                  </button>
                                  <span className="text-[9px] text-[#D9CFC4]">•</span>
                                  <button
                                    onClick={() => {
                                      setScheduleModalPost(post);
                                      setQuickScheduledAt(
                                        post.scheduledAt
                                          ? new Date(post.scheduledAt).toISOString().slice(0, 16)
                                          : new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16)
                                      );
                                    }}
                                    className="text-[10px] font-semibold text-amber-800 hover:underline"
                                  >
                                    Change Time
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <button
                                onClick={() => handleToggleStatus(post)}
                                disabled={!canEdit}
                                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors ${
                                  post.status === 'published'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                } ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                                title={canEdit ? "Click to toggle publish status" : "Locked for other authors"}
                              >
                                {post.status}
                              </button>
                              {canEdit && (
                                <button
                                  onClick={() => {
                                    setScheduleModalPost(post);
                                    setQuickScheduledAt(
                                      new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16)
                                    );
                                  }}
                                  className="text-[10px] text-[#8C6D53] hover:text-[#725740] font-semibold flex items-center gap-1 hover:underline pt-0.5"
                                  title="Schedule this post for future release"
                                >
                                  <Clock className="w-2.5 h-2.5 text-amber-700" />
                                  <span>Schedule Post</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Badges (Featured & Popular) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleFeatured(post)}
                            disabled={!canEdit}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                              post.isFeatured
                                ? 'bg-[#8C6D53] text-white shadow-xs'
                                : 'bg-[#F4EFEA] text-[#A89F95] hover:text-[#2D2A26]'
                            } ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                            title={post.isFeatured ? 'Featured on Homepage (Click to disable)' : 'Mark as Featured'}
                          >
                            ★ Featured
                          </button>
                          <button
                            onClick={() => handleTogglePopular(post)}
                            disabled={!canEdit}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                              post.isPopular
                                ? 'bg-purple-700 text-white shadow-xs'
                                : 'bg-[#F4EFEA] text-[#A89F95] hover:text-[#2D2A26]'
                            } ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                            title={post.isPopular ? 'Marked Popular (Click to disable)' : 'Mark as Popular'}
                          >
                            ♥ Popular
                          </button>
                        </div>
                      </td>

                      {/* Views & Saves */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-[#6B635B]">
                        <div className="flex items-center gap-3">
                          <span title="Views">👁 {post.viewsCount || 0}</span>
                          <span title="Pinterest / Board Saves">📌 {post.savesCount || 0}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Live / Preview */}
                          <button
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            className="p-2 rounded-lg text-[#6B635B] hover:bg-[#EFE9E1] hover:text-[#2D2A26] transition-colors"
                            title="View on Frontend"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          {canEdit ? (
                            <button
                              onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                              className="p-2 rounded-lg text-[#8C6D53] hover:bg-[#EFE9E1] transition-colors"
                              title="Edit Full Article & Blocks"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="p-2 text-stone-300" title="Authored by another team member">
                              <Lock className="w-4 h-4" />
                            </div>
                          )}

                          {/* Quick Schedule Button */}
                          {canEdit && (
                            <button
                              onClick={() => {
                                setScheduleModalPost(post);
                                setQuickScheduledAt(
                                  post.scheduledAt
                                    ? new Date(post.scheduledAt).toISOString().slice(0, 16)
                                    : new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16)
                                );
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                post.status === 'scheduled'
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                  : 'text-[#8C6D53] hover:bg-[#EFE9E1]'
                              }`}
                              title={post.status === 'scheduled' ? "Manage Scheduled Timing" : "Schedule Publication"}
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}

                          {/* Duplicate */}
                          <button
                            onClick={() => duplicatePost(post.id)}
                            className="p-2 rounded-lg text-[#6B635B] hover:bg-[#EFE9E1] transition-colors"
                            title="Duplicate as Draft"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          {canDelete && (
                            <button
                              onClick={() => setDeleteConfirmId(post.id)}
                              className="p-2 rounded-lg text-[#A89F95] hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <p className="font-serif text-lg font-bold text-[#2D2A26]">No articles match your current filter</p>
            <p className="text-xs text-[#8A7E73]">Try switching tabs or clearing your search keywords.</p>
          </div>
        )}
      </div>

      {/* Floating Bulk Actions Toolbar */}
      {selectedPostIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1A1816] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#38332E] flex flex-wrap items-center justify-between gap-4 max-w-3xl w-[92%] animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#8C6D53] text-white font-bold text-xs flex items-center justify-center">
              {selectedPostIds.length}
            </span>
            <span className="text-xs font-semibold text-[#D9CFC4]">
              {selectedPostIds.length === 1 ? '1 article selected' : `${selectedPostIds.length} articles selected`}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkStatus('published')}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Publish All</span>
            </button>

            <button
              onClick={() => handleBulkStatus('draft')}
              className="px-3 py-1.5 bg-[#2E2925] hover:bg-[#3D3732] text-[#D9CFC4] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Set as Draft</span>
            </button>

            <button
              onClick={() => handleBulkFeature(true)}
              className="px-3 py-1.5 bg-[#2E2925] hover:bg-[#3D3732] text-[#D9CFC4] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Feature</span>
            </button>

            {/* Bulk Category Selector */}
            <select
              value={bulkCategoryChoice}
              onChange={(e) => handleBulkCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-[#2E2925] text-white text-xs rounded-xl border border-[#3E3832] focus:outline-none cursor-pointer"
            >
              <option value="">Move Category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-900/80 hover:bg-red-800 text-red-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => setSelectedPostIds([])}
              className="p-1.5 text-[#A89F95] hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#E8DFD5]">
            <h4 className="font-serif text-lg font-bold text-[#2D2A26]">Confirm Deletion</h4>
            <p className="text-xs text-[#6B635B]">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-[#FAF8F5] text-[#6B635B] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Schedule Modal */}
      {scheduleModalPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-6 shadow-2xl border border-[#E8DFD5]">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#211E1B]">
                    Schedule Publication
                  </h3>
                  <p className="text-xs text-[#8A7E73] truncate max-w-xs">
                    {scheduleModalPost.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScheduleModalPost(null)}
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
                  value={quickScheduledAt}
                  onChange={(e) => setQuickScheduledAt(e.target.value)}
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
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 1);
                      d.setHours(9, 0, 0, 0);
                      setQuickScheduledAt(d.toISOString().slice(0, 16));
                    }}
                    className="px-3 py-2 bg-[#FAF8F5] hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#2D2A26] transition-colors text-left flex items-center justify-between"
                  >
                    <span>Tomorrow</span>
                    <span className="text-[11px] opacity-75">9:00 AM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 3);
                      d.setHours(10, 0, 0, 0);
                      setQuickScheduledAt(d.toISOString().slice(0, 16));
                    }}
                    className="px-3 py-2 bg-[#FAF8F5] hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#2D2A26] transition-colors text-left flex items-center justify-between"
                  >
                    <span>In 3 Days</span>
                    <span className="text-[11px] opacity-75">10:00 AM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 7);
                      d.setHours(9, 0, 0, 0);
                      setQuickScheduledAt(d.toISOString().slice(0, 16));
                    }}
                    className="px-3 py-2 bg-[#FAF8F5] hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#2D2A26] transition-colors text-left flex items-center justify-between"
                  >
                    <span>Next Week</span>
                    <span className="text-[11px] opacity-75">9:00 AM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 14);
                      d.setHours(9, 0, 0, 0);
                      setQuickScheduledAt(d.toISOString().slice(0, 16));
                    }}
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
                    Target: {new Date(quickScheduledAt || Date.now()).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(quickScheduledAt || Date.now()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  <p className="mt-0.5 text-amber-800/90">
                    This article will be marked as "Scheduled" and become live to all readers once this date and time arrives.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-[#E8DFD5]">
              {scheduleModalPost.status === 'scheduled' && (
                <button
                  type="button"
                  onClick={() => handleCancelSchedule(scheduleModalPost)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-[#8A7E73] hover:text-red-600 transition-colors"
                >
                  Cancel Schedule (Draft)
                </button>
              )}
              <button
                type="button"
                onClick={() => setScheduleModalPost(null)}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#FAF8F5] text-[#6B635B] rounded-xl text-xs font-semibold hover:bg-[#EFE9E1]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleQuickSchedule(scheduleModalPost, quickScheduledAt)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#8C6D53] hover:bg-[#725740] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Clock className="w-4 h-4" />
                <span>Confirm & Schedule</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
