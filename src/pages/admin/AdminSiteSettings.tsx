import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { SiteSettings } from '../../types';
import { generateSitemapXml, generateRobotsTxt } from '../../utils/seo';
import { 
  Settings, 
  Save, 
  Globe, 
  Share2, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  FileCode, 
  Check, 
  Copy, 
  AlertTriangle, 
  Megaphone 
} from 'lucide-react';

export const AdminSiteSettings: React.FC = () => {
  const { 
    siteSettings, 
    saveSiteSettings, 
    exportDatabase, 
    importDatabase, 
    resetDatabase, 
    publishedPosts, 
    categories, 
    showToast 
  } = useBlog();

  const [settings, setSettings] = useState<SiteSettings>(siteSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'social' | 'sitemap' | 'backup'>('general');
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const xmlSitemap = generateSitemapXml(publishedPosts, categories, settings.siteUrl || 'https://thedecordiary.store');
  const robotsTxt = generateRobotsTxt(settings.siteUrl || 'https://thedecordiary.store');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteSettings(settings);
    showToast('The Decor Diary settings saved successfully!', 'success');
  };

  const handleExportBackup = () => {
    const json = exportDatabase();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decor-diary-full-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Full CMS backup exported successfully!', 'success');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = evt.target?.result as string;
        const res = importDatabase(json);
        if (res) {
          showToast('Database restored successfully!', 'success');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast('Failed to import database snapshot.', 'error');
        }
      } catch (err) {
        showToast('Invalid JSON backup file format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(xmlSitemap);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2000);
  };

  const handleCopyRobots = () => {
    navigator.clipboard.writeText(robotsTxt);
    setCopiedRobots(true);
    setTimeout(() => setCopiedRobots(false), 2000);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DED2] pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#A68B6A]">
            System Architecture & SEO
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#242522] tracking-tight">
            Site Settings & SEO Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#5A534B] mt-1">
            Configure global website branding, SEO tags, analytics IDs, sitemaps, and full database backups.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#2F3A32] hover:bg-[#202722] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'general', label: 'General & Branding', icon: Settings },
          { id: 'seo', label: 'SEO & Webmasters', icon: Globe },
          { id: 'social', label: 'Social Channels', icon: Share2 },
          { id: 'sitemap', label: 'Sitemap & Robots.txt', icon: FileCode },
          { id: 'backup', label: 'Backup & Restore', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2F3A32] text-white shadow-xs'
                  : 'bg-white text-[#5A534B] border border-[#E5DED2] hover:bg-[#EFEAE1]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. GENERAL TAB */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DED2] shadow-xs space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#242522] border-b border-[#EFEAE1] pb-3">
            Brand Identity & Global Text
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Website Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-sm font-serif font-bold text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Site Tagline
              </label>
              <input
                type="text"
                value={settings.siteTagline}
                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-sm text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Header & Footer Logo Text
              </label>
              <input
                type="text"
                value={settings.logoText || 'THE DECOR DIARY'}
                onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                placeholder="THE DECOR DIARY"
                className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-sm font-serif font-bold text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Header & Footer Logo Subtext
              </label>
              <input
                type="text"
                value={settings.logoSubtext || 'ONLINE HOME DECOR STORE'}
                onChange={(e) => setSettings({ ...settings, logoSubtext: e.target.value })}
                placeholder="ONLINE HOME DECOR STORE"
                className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-sm uppercase tracking-widest text-[#242522]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Site Description (SEO & Open Graph)
              </label>
              <textarea
                rows={3}
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs leading-relaxed text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Store Website URL
              </label>
              <input
                type="url"
                value={settings.siteUrl || 'https://thedecordiary.store/'}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                placeholder="https://thedecordiary.store/"
                className="w-full px-3.5 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs font-mono text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={settings.contactPhone || '03364585863'}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                placeholder="03364585863"
                className="w-full px-3.5 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs font-mono text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Store Physical Address
              </label>
              <input
                type="text"
                value={settings.contactAddress || 'Sargodha'}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                placeholder="Sargodha"
                className="w-full px-3.5 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Contact & Support Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Footer Copyright Notice
              </label>
              <input
                type="text"
                value={settings.copyrightNotice}
                onChange={(e) => setSettings({ ...settings, copyrightNotice: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs text-[#242522]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Footer Brand Mission Statement
              </label>
              <textarea
                rows={2}
                value={settings.footerAbout}
                onChange={(e) => setSettings({ ...settings, footerAbout: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs leading-relaxed text-[#242522]"
              />
            </div>
          </div>

          {/* Top Announcement Bar */}
          <div className="pt-6 border-t border-[#EFEAE1] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A68B6A]">
              <Megaphone className="w-4 h-4" />
              <span>Top Header Announcement Ribbon</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.headerAnnouncement?.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  headerAnnouncement: {
                    ...settings.headerAnnouncement,
                    enabled: e.target.checked,
                    text: settings.headerAnnouncement?.text || 'Explore our latest Sunday masterclass',
                    linkText: settings.headerAnnouncement?.linkText || 'Read Story',
                    linkUrl: settings.headerAnnouncement?.linkUrl || '/blog'
                  }
                })}
                className="w-4 h-4 rounded text-[#2F3A32]"
              />
              <span className="text-xs font-bold text-[#242522]">Enable Top Header Announcement Bar</span>
            </label>

            {settings.headerAnnouncement?.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <input
                  type="text"
                  value={settings.headerAnnouncement.text}
                  onChange={(e) => setSettings({
                    ...settings,
                    headerAnnouncement: { ...settings.headerAnnouncement, text: e.target.value }
                  })}
                  placeholder="Ribbon message text..."
                  className="px-3.5 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs text-[#242522]"
                />
                <input
                  type="text"
                  value={settings.headerAnnouncement.linkText}
                  onChange={(e) => setSettings({
                    ...settings,
                    headerAnnouncement: { ...settings.headerAnnouncement, linkText: e.target.value }
                  })}
                  placeholder="Button label (e.g. Read Story)"
                  className="px-3.5 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs text-[#242522]"
                />
                <input
                  type="text"
                  value={settings.headerAnnouncement.linkUrl}
                  onChange={(e) => setSettings({
                    ...settings,
                    headerAnnouncement: { ...settings.headerAnnouncement, linkUrl: e.target.value }
                  })}
                  placeholder="Link URL (e.g. /blog)"
                  className="px-3.5 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs text-[#242522]"
                />
              </div>
            )}
          </div>
        </form>
      )}

      {/* 2. SEO TAB */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DED2] shadow-xs space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#242522] border-b border-[#EFEAE1] pb-3">
            Search Engine Optimization & Google Tools
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                value={settings.googleAnalyticsId || ''}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs font-mono text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Google Search Console Verification Tag
              </label>
              <input
                type="text"
                value={settings.googleSiteVerification || ''}
                onChange={(e) => setSettings({ ...settings, googleSiteVerification: e.target.value })}
                placeholder="google-site-verification-code..."
                className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs font-mono text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                Pinterest Domain Verification Tag
              </label>
              <input
                type="text"
                value={settings.pinterestVerification || ''}
                onChange={(e) => setSettings({ ...settings, pinterestVerification: e.target.value })}
                placeholder="p:domain_verify code..."
                className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs font-mono text-[#242522]"
              />
            </div>
          </div>

          <div className="p-5 bg-[#F7F4EE] rounded-2xl border border-[#E5DED2] space-y-3 text-xs text-[#5A534B]">
            <div className="flex items-center justify-between">
              <h5 className="font-serif font-bold text-[#242522] flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Google AdSense Verification</span>
              </h5>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                CLIENT CONFIGURED
              </span>
            </div>
            <p>
              AdSense integration script is active in site head with Client ID: <code className="font-mono bg-white px-2 py-0.5 rounded border border-[#E5DED2] text-[#242522] font-bold">ca-pub-2818671808304288</code>. All visitor-facing ad keywords are cleaned to maintain editorial aesthetics.
            </p>
          </div>

          <div className="p-4 bg-[#F7F4EE] rounded-2xl border border-[#E5DED2] space-y-2 text-xs text-[#5A534B]">
            <h5 className="font-serif font-bold text-[#242522]">⚡ Automated Core Web Vitals & Schema.org</h5>
            <p>
              The Decor Diary automatically embeds <code className="font-mono text-[#2F3A32]">HomeGoodsStore</code>, <code className="font-mono text-[#2F3A32]">Article</code>, and <code className="font-mono text-[#2F3A32]">BreadcrumbList</code> JSON-LD structured metadata on every page for instant Google Rich Results and Pinterest Rich Pins.
            </p>
          </div>
        </div>
      )}

      {/* 3. SOCIAL TAB */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DED2] shadow-xs space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#242522] border-b border-[#EFEAE1] pb-3">
            Social Media Channels & Profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E60023] mb-1">
                Pinterest Profile URL
              </label>
              <input
                type="text"
                value={settings.socialLinks?.pinterest || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, pinterest: e.target.value }
                })}
                placeholder="https://pinterest.com/..."
                className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E1306C] mb-1">
                Instagram Profile URL
              </label>
              <input
                type="text"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                })}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1877F2] mb-1">
                Facebook Page URL
              </label>
              <input
                type="text"
                value={settings.socialLinks?.facebook || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                })}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                TikTok Profile URL
              </label>
              <input
                type="text"
                value={settings.socialLinks?.tiktok || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, tiktok: e.target.value }
                })}
                placeholder="https://tiktok.com/@..."
                className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs text-[#242522]"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. SITEMAP TAB */}
      {activeTab === 'sitemap' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DED2] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#EFEAE1] pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#242522]">
                XML Sitemap & Robots.txt Generator
              </h3>
              <p className="text-xs text-[#7A7369]">
                Dynamic standard XML sitemap generated dynamically from all {publishedPosts.length} published articles and {categories.length} categories.
              </p>
            </div>

            <button
              onClick={handleCopySitemap}
              className="px-3.5 py-2 bg-[#F7F4EE] hover:bg-[#EFEAE1] text-[#242522] border border-[#E5DED2] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSitemap ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-[#2F3A32]" />}
              <span>{copiedSitemap ? 'Copied XML' : 'Copy Sitemap'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A68B6A]">
              Generated sitemap.xml
            </h4>
            <div className="bg-[#202722] text-[#A8D5BA] p-4 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-60">
              <pre>{xmlSitemap}</pre>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#EFEAE1]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A68B6A]">
                Generated robots.txt
              </h4>
              <button
                onClick={handleCopyRobots}
                className="px-3 py-1 bg-[#F7F4EE] hover:bg-[#EFEAE1] text-[#242522] border border-[#E5DED2] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedRobots ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-[#2F3A32]" />}
                <span>{copiedRobots ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-[#202722] text-[#E5DDD5] p-4 rounded-2xl font-mono text-[11px] overflow-x-auto">
              <pre>{robotsTxt}</pre>
            </div>
          </div>
        </div>
      )}

      {/* 5. DATABASE BACKUP & RESTORE TAB */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DED2] shadow-xs space-y-8">
          <div className="border-b border-[#EFEAE1] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#242522]">
              Database Persistence & JSON Backup
            </h3>
            <p className="text-xs text-[#7A7369]">
              Export all your articles, categories, homepage configuration, and subscribers to a portable JSON file, or restore a backup.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Export */}
            <div className="p-6 rounded-2xl bg-[#F7F4EE] border border-[#E5DED2] space-y-4">
              <div className="flex items-center gap-2 font-serif text-base font-bold text-[#242522]">
                <Download className="w-5 h-5 text-[#2F3A32]" />
                <span>Export Full CMS Database</span>
              </div>
              <p className="text-xs text-[#5A534B] leading-relaxed">
                Creates an immediate snapshot of your articles, content blocks, categories, images, and subscriber leads.
              </p>
              <button
                onClick={handleExportBackup}
                className="w-full py-3 bg-[#2F3A32] hover:bg-[#202722] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download JSON Backup</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-6 rounded-2xl bg-[#F7F4EE] border border-[#E5DED2] space-y-4">
              <div className="flex items-center gap-2 font-serif text-base font-bold text-[#242522]">
                <Upload className="w-5 h-5 text-[#2F3A32]" />
                <span>Restore from JSON Backup</span>
              </div>
              <p className="text-xs text-[#5A534B] leading-relaxed">
                Upload a previously saved <code className="font-mono text-[#2F3A32]">.json</code> database snapshot to restore your content.
              </p>
              <label className="w-full py-3 bg-white hover:bg-[#EFEAE1] text-[#242522] border border-[#E5DED2] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer text-center">
                <Upload className="w-4 h-4" />
                <span>Select JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset to Factory Defaults */}
          <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200 space-y-4">
            <div className="flex items-center gap-2 font-serif text-base font-bold text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Reset to Sample Editorial Content</span>
            </div>
            <p className="text-xs text-red-800 leading-relaxed">
              Caution: This replaces all local changes with the initial Decor Diary seed articles, photography, and layout structure.
            </p>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Factory Reset CMS Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#E5DED2]">
            <h4 className="font-serif text-lg font-bold text-red-900">Confirm Reset</h4>
            <p className="text-xs text-[#5A534B]">
              Are you sure you want to reset all posts and categories back to the fresh starter template?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-[#F7F4EE] text-[#5A534B] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDatabase();
                  setShowResetConfirm(false);
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
