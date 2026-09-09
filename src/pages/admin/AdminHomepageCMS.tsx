import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { HomepageConfig, HomepageSectionConfig } from '../../types';
import { 
  Home, 
  Save, 
  MoveUp, 
  MoveDown, 
  Eye, 
  EyeOff, 
  Sparkles, 
  SlidersHorizontal,
  Image as ImageIcon,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { INITIAL_HOMEPAGE_CONFIG } from '../../services/initialData';

export const AdminHomepageCMS: React.FC = () => {
  const { homepageConfig, saveHomepageConfig, navigate, showToast } = useBlog();

  // Local state for homepage editing
  const [hero, setHero] = useState(homepageConfig.hero);
  const [sectionTitles, setSectionTitles] = useState(homepageConfig.sectionTitles);
  const [sectionsOrder, setSectionsOrder] = useState<HomepageSectionConfig[]>(homepageConfig.sectionsOrder);
  const [pinterestBanner, setPinterestBanner] = useState(homepageConfig.pinterestBanner);

  // Section reordering
  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sectionsOrder.length - 1) return;

    const next = [...sectionsOrder];
    const target = direction === 'up' ? index - 1 : index + 1;
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setSectionsOrder(next);
  };

  const toggleSectionEnabled = (id: string) => {
    const next = sectionsOrder.map(s => {
      if (s.id === id) {
        return { ...s, enabled: !s.enabled };
      }
      return s;
    });
    setSectionsOrder(next);
  };

  const handleSave = () => {
    const updatedConfig: HomepageConfig = {
      hero,
      sectionTitles,
      sectionsOrder,
      pinterestBanner
    };

    saveHomepageConfig(updatedConfig);
  };

  const handleResetDefaults = () => {
    setHero(INITIAL_HOMEPAGE_CONFIG.hero);
    setSectionTitles(INITIAL_HOMEPAGE_CONFIG.sectionTitles);
    setSectionsOrder(INITIAL_HOMEPAGE_CONFIG.sectionsOrder);
    setPinterestBanner(INITIAL_HOMEPAGE_CONFIG.pinterestBanner);
    showToast('Reset homepage fields to default template values.', 'info');
  };

  return (
    <div className="p-6 sm:p-10 space-y-10 max-w-7xl mx-auto pb-28">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D53]">
            Frontend Layout & Sections
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#211E1B] tracking-tight">
            Homepage CMS Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7E73] mt-1">
            Customize the editorial hero banner, reorder sections, toggle visibility, and update section headlines in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-white hover:bg-[#EFE9E1] text-[#6B635B] border border-[#D9CFC4] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Changes</span>
          </button>
        </div>
      </div>

      {/* 1. SECTIONS ORDER & VISIBILITY CONTROLLER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#211E1B]">
              Homepage Layout & Section Ordering
            </h3>
            <p className="text-xs text-[#8A7E73]">
              Drag or use arrows to rearrange the order of sections on your homepage, or toggle visibility on/off.
            </p>
          </div>
          <span className="text-xs font-bold text-[#8C6D53] bg-[#FAF8F5] px-3 py-1 rounded-full border">
            {sectionsOrder.filter(s => s.enabled).length} of {sectionsOrder.length} Active
          </span>
        </div>

        <div className="space-y-2.5">
          {sectionsOrder.map((section, idx) => (
            <div
              key={section.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                section.enabled
                  ? 'bg-white border-[#E8DFD5] shadow-xs'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="font-serif text-xs font-bold text-[#8C6D53] w-5">
                  #{idx + 1}
                </span>
                <span className="font-serif text-sm font-bold text-[#2D2A26]">
                  {section.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveSection(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#2D2A26] disabled:opacity-30"
                  title="Move Section Up"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(idx, 'down')}
                  disabled={idx === sectionsOrder.length - 1}
                  className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#2D2A26] disabled:opacity-30"
                  title="Move Section Down"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleSectionEnabled(section.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    section.enabled
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{section.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. EDITORIAL HERO BANNER CMS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-6">
        <div className="border-b border-[#F0EBE6] pb-3">
          <h3 className="font-serif text-xl font-bold text-[#211E1B]">
            Editorial Hero Banner Content
          </h3>
          <p className="text-xs text-[#8A7E73]">
            Update the headline, italic focal word, subheadline description, call-to-action buttons, and featured imagery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                Top Badge Text
              </label>
              <input
                type="text"
                value={hero.badge}
                onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                placeholder="Curated Living & Modern Interiors"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                placeholder="Creating Spaces of Quiet Beauty, Comfort &"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-sm font-serif font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                Highlight Word (Italic Serif)
              </label>
              <input
                type="text"
                value={hero.highlightWord}
                onChange={(e) => setHero({ ...hero, highlightWord: e.target.value })}
                placeholder="Intentional Living"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-sm italic font-serif text-[#8C6D53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                Subtitle Description
              </label>
              <textarea
                rows={3}
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs leading-relaxed"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                Hero Featured Image URL
              </label>
              <input
                type="text"
                value={hero.imageUrl}
                onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
              />
            </div>

            {hero.imageUrl && (
              <div className="aspect-16/9 max-h-40 rounded-xl overflow-hidden bg-stone-100 border border-[#E8DFD5]">
                <img src={hero.imageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                Image Caption / Overlay Tag
              </label>
              <input
                type="text"
                value={hero.imageCaption}
                onChange={(e) => setHero({ ...hero, imageCaption: e.target.value })}
                placeholder="Featured: The Art of Warm Minimalism"
                className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  value={hero.ctaText}
                  onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  Primary CTA Link
                </label>
                <input
                  type="text"
                  value={hero.ctaLink}
                  onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION HEADLINES & SUBTITLES CMS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-6">
        <div className="border-b border-[#F0EBE6] pb-3">
          <h3 className="font-serif text-xl font-bold text-[#211E1B]">
            Section Headlines & Subtitles
          </h3>
          <p className="text-xs text-[#8A7E73]">
            Customize every section heading and editorial subheading throughout the homepage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Featured */}
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD5] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">Featured Section</span>
            <input
              type="text"
              value={sectionTitles.featuredTitle}
              onChange={(e) => setSectionTitles({ ...sectionTitles, featuredTitle: e.target.value })}
              placeholder="Featured Editorial Stories"
              className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs font-serif font-bold"
            />
            <textarea
              rows={2}
              value={sectionTitles.featuredSubtitle}
              onChange={(e) => setSectionTitles({ ...sectionTitles, featuredSubtitle: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs"
            />
          </div>

          {/* Latest */}
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD5] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">Latest Articles Section</span>
            <input
              type="text"
              value={sectionTitles.latestTitle}
              onChange={(e) => setSectionTitles({ ...sectionTitles, latestTitle: e.target.value })}
              placeholder="Latest From The Journal"
              className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs font-serif font-bold"
            />
            <textarea
              rows={2}
              value={sectionTitles.latestSubtitle}
              onChange={(e) => setSectionTitles({ ...sectionTitles, latestSubtitle: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs"
            />
          </div>

          {/* Categories */}
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD5] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">Categories Section</span>
            <input
              type="text"
              value={sectionTitles.categoriesTitle}
              onChange={(e) => setSectionTitles({ ...sectionTitles, categoriesTitle: e.target.value })}
              placeholder="Browse by Lifestyle Category"
              className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs font-serif font-bold"
            />
            <textarea
              rows={2}
              value={sectionTitles.categoriesSubtitle}
              onChange={(e) => setSectionTitles({ ...sectionTitles, categoriesSubtitle: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs"
            />
          </div>

          {/* Pinterest Banner */}
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD5] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E60023]">Pinterest Section</span>
            <input
              type="text"
              value={pinterestBanner.title}
              onChange={(e) => setPinterestBanner({ ...pinterestBanner, title: e.target.value })}
              placeholder="Save & Pin For Later Inspiration"
              className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs font-serif font-bold"
            />
            <input
              type="text"
              value={pinterestBanner.handle}
              onChange={(e) => setPinterestBanner({ ...pinterestBanner, handle: e.target.value })}
              placeholder="@thedecordiary"
              className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
