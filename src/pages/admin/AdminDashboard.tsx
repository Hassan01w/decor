import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  FileText, 
  Eye, 
  Bookmark, 
  FolderTree, 
  Users, 
  Plus, 
  ArrowUpRight, 
  Sparkles, 
  Edit3, 
  SlidersHorizontal,
  Download,
  Flame,
  Clock,
  Globe,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Search,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    posts, 
    categories, 
    subscribers, 
    navigate, 
    savePost, 
    exportDatabase, 
    showToast,
    siteSettings 
  } = useBlog();

  const [searchQuery, setSearchQuery] = useState('');

  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const draftPosts = posts.filter(p => p.status === 'draft');
  const totalViews = posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalSaves = posts.reduce((sum, p) => sum + (p.savesCount || 0), 0);

  // Filtered recent posts
  const filteredRecentPosts = [...posts]
    .filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  // Top performing articles
  const topArticles = [...posts]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 4);

  const handleToggleStatus = (post: any) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    savePost({ ...post, status: newStatus });
    showToast(`Article status updated to ${newStatus}`, 'success');
  };

  const handlePublishScheduledNow = (post: any) => {
    savePost({ ...post, status: 'published', publishedAt: new Date().toISOString() });
    showToast(`"${post.title}" is now published live!`, 'success');
  };

  const handleToggleFeatured = (post: any) => {
    savePost({ ...post, isFeatured: !post.isFeatured });
    showToast(post.isFeatured ? 'Removed from featured spotlight' : 'Marked as featured on homepage', 'success');
  };

  const handleExportBackup = () => {
    const json = exportDatabase();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-decor-diary-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('The Decor Diary CMS database exported successfully!', 'success');
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D53]">
              Store & Editorial Overview
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#211E1B] tracking-tight mt-1">
            The Decor Diary Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7E73] mt-0.5">
            Central administration hub for thedecordiary.store — managing content, SEO, scheduled posts, and catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-white hover:bg-[#EFE9E1] text-[#2D2A26] border border-[#D9CFC4] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            title="Download full CMS JSON backup"
          >
            <Download className="w-4 h-4 text-[#8C6D53]" />
            <span>Export Backup</span>
          </button>

          <button
            onClick={() => navigate('/admin/posts/new')}
            className="px-5 py-2.5 bg-[#8C6D53] hover:bg-[#735842] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Store Identity & Live Configuration Bar */}
      <div className="bg-gradient-to-r from-[#1C1917] to-[#2E2925] text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#3E3833]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                The Decor Diary
              </h2>
              <a
                href="https://thedecordiary.store"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-xs font-mono text-[#E5DDD5] transition-colors"
              >
                <Globe className="w-3 h-3 text-[#C4A482]" />
                <span>https://thedecordiary.store</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </div>
            <p className="text-xs text-[#B8B1A5] max-w-2xl leading-relaxed">
              Online home decor store delivering aesthetic room accessories, modern interior design trends, and minimalist furniture.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#D9CFC4]">
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C4A482]" />
              <span>Admins: <strong>MBI</strong> & <strong>Samavia Khan</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C4A482]" />
              <span>03364585863</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#C4A482]" />
              <span>thedecordiarystore@gmail.com</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C4A482]" />
              <span>Sargodha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Articles', val: totalPosts, icon: FileText, color: 'text-[#8C6D53]', bg: 'bg-[#FAF8F5]' },
          { label: 'Published Live', val: publishedPosts.length, icon: Sparkles, color: 'text-emerald-700', bg: 'bg-emerald-50/50' },
          { label: 'Scheduled', val: scheduledPosts.length, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50/50' },
          { label: 'Drafts', val: draftPosts.length, icon: Edit3, color: 'text-stone-700', bg: 'bg-stone-50' },
          { label: 'Total Reads', val: totalViews.toLocaleString(), icon: Eye, color: 'text-blue-700', bg: 'bg-blue-50/50' },
          { label: 'Subscribers', val: subscribers.length, icon: Users, color: 'text-purple-700', bg: 'bg-purple-50/50' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={`p-4 sm:p-5 rounded-2xl border border-[#E8DFD5] shadow-xs space-y-2 ${item.bg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7E73]">
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#211E1B]">
                {item.val}
              </p>
            </div>
          );
        })}
      </div>

      {/* Scheduled Releases Spotlight (if any posts are scheduled) */}
      {scheduledPosts.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Upcoming Scheduled Releases ({scheduledPosts.length})</span>
            </div>
            <span className="text-[11px] text-amber-800 font-medium">Auto-publishes at target time</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl p-4 border border-amber-200/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-11 h-11 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 
                      onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                      className="font-serif text-xs font-bold text-[#211E1B] truncate hover:text-[#8C6D53] cursor-pointer"
                    >
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium mt-0.5">
                      <Calendar className="w-3 h-3 text-amber-700" />
                      <span>{post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : 'Date pending'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#F0EBE6]">
                  <button
                    onClick={() => handlePublishScheduledNow(post)}
                    className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Publish Now
                  </button>
                  <button
                    onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                    className="text-xs text-[#8C6D53] hover:underline font-medium"
                  >
                    Edit &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Launch Control Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => navigate('/admin/posts/new')}
          className="p-5 rounded-2xl bg-white border border-[#E8DFD5] hover:border-[#8C6D53] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EFE9E1] text-[#8C6D53] flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#2D2A26] group-hover:text-[#8C6D53]">
                Create New Post
              </h4>
              <p className="text-xs text-[#8A7E73]">Rich block editor & SEO preview</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#A89F95] group-hover:text-[#8C6D53]" />
        </div>

        <div 
          onClick={() => navigate('/admin/homepage')}
          className="p-5 rounded-2xl bg-white border border-[#E8DFD5] hover:border-[#8C6D53] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EFE9E1] text-[#8C6D53] flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#2D2A26] group-hover:text-[#8C6D53]">
                Edit Homepage CMS
              </h4>
              <p className="text-xs text-[#8A7E73]">Hero banner, layout & sections</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#A89F95] group-hover:text-[#8C6D53]" />
        </div>

        <div 
          onClick={() => navigate('/admin/categories')}
          className="p-5 rounded-2xl bg-white border border-[#E8DFD5] hover:border-[#8C6D53] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EFE9E1] text-[#8C6D53] flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#2D2A26] group-hover:text-[#8C6D53]">
                Manage Categories
              </h4>
              <p className="text-xs text-[#8A7E73]">Decor, DIY, Kitchen & Lifestyle</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#A89F95] group-hover:text-[#8C6D53]" />
        </div>
      </div>

      {/* Main Grid: Recent Posts & Top Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Recent Posts */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#211E1B]">
                Articles Manager
              </h3>
              <p className="text-xs text-[#8A7E73]">Instant status toggle, editing & public previews</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#211E1B] placeholder-[#A89F95] w-40 sm:w-48 focus:outline-none focus:border-[#8C6D53]"
                />
                <Search className="w-3.5 h-3.5 text-[#A89F95] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={() => navigate('/admin/posts')}
                className="text-xs uppercase font-bold tracking-wider text-[#8C6D53] hover:underline whitespace-nowrap"
              >
                View All ({posts.length}) &rarr;
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-xs overflow-hidden">
            <div className="divide-y divide-[#F0EBE6]">
              {filteredRecentPosts.map(post => {
                const category = categories.find(c => c.id === post.categoryId);

                return (
                  <div key={post.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs mb-0.5">
                          <span className="font-bold text-[#8C6D53]">{category?.name || 'Decor'}</span>
                          <span className="text-[#A89F95]">•</span>
                          <span className="text-[#8A7E73]">{post.readingTimeMinutes} min read</span>
                          <span className="text-[#A89F95]">•</span>
                          <span className="text-[#8A7E73]">{post.viewsCount || 0} views</span>
                        </div>
                        <h4 
                          onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                          className="font-serif text-sm font-bold text-[#2D2A26] truncate cursor-pointer hover:text-[#8C6D53]"
                        >
                          {post.title}
                        </h4>
                      </div>
                    </div>

                    {/* Quick Toggles & Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status Toggle Button */}
                      <button
                        onClick={() => handleToggleStatus(post)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : post.status === 'scheduled'
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                        title="Click to toggle between published and draft"
                      >
                        {post.status === 'scheduled' && <Clock className="w-3 h-3 text-amber-700" />}
                        {post.status === 'published' && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                        <span>{post.status}</span>
                      </button>

                      {/* Featured Toggle Button */}
                      <button
                        onClick={() => handleToggleFeatured(post)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          post.isFeatured
                            ? 'bg-[#8C6D53] text-white shadow-2xs'
                            : 'bg-[#F4EFEA] text-[#8A7E73] hover:bg-[#E8DFD5]'
                        }`}
                        title={post.isFeatured ? 'Featured on Homepage (Click to unfeature)' : 'Mark as Featured on Homepage'}
                      >
                        ★
                      </button>

                      {/* View on public site */}
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#6B635B] border border-[#E8DFD5] transition-colors"
                        title="View article on public store"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {/* Edit Button */}
                      <button
                        onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                        className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#2D2A26] border border-[#E8DFD5] transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Top Performing Articles & Activity */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D53]">
              <Flame className="w-4 h-4 text-[#8C6D53]" />
              <span>Top Viewed & Saved</span>
            </div>

            <div className="space-y-3">
              {topArticles.map((post, idx) => (
                <div 
                  key={post.id} 
                  onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                  className="p-2.5 rounded-xl hover:bg-[#FAF8F5] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-serif text-xs font-bold text-[#8C6D53] w-4">
                      0{idx + 1}
                    </span>
                    <p className="font-serif text-xs font-bold text-[#2D2A26] group-hover:text-[#8C6D53] truncate">
                      {post.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#8A7E73] shrink-0 font-medium">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3 text-[#8C6D53]" />
                      {post.viewsCount || 0}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Bookmark className="w-3 h-3 text-[#E60023]" />
                      {post.savesCount || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Infrastructure & SEO Status */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8DFD5] space-y-3 text-xs">
            <h5 className="font-serif font-bold text-[#2D2A26] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Store SEO & Security Health</span>
            </h5>
            <div className="space-y-2 text-[#5A534B]">
              <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-1.5">
                <span>Canonical Domain</span>
                <span className="font-mono font-bold text-[#211E1B]">thedecordiary.store</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-1.5">
                <span>Google AdSense</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Configured
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-1.5">
                <span>JSON-LD Schema</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pinterest Rich Pins</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Enabled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
