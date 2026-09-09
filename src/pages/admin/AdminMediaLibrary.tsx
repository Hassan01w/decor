import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { MediaItem } from '../../types';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Plus, 
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const AdminMediaLibrary: React.FC = () => {
  const { mediaLibrary, addMediaItem, deleteMediaItem, showToast } = useBlog();

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form state
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [newCategory, setNewCategory] = useState('Decor');

  const filteredMedia = mediaLibrary.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.alt.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q);
  });

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Image URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewUrl(event.target.result as string);
        if (!newName) setNewName(file.name.replace(/\.[^/.]+$/, ""));
        if (!newAlt) setNewAlt(file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const item: MediaItem = {
      id: `media-${Date.now()}`,
      url: newUrl.trim(),
      name: newName.trim() || 'Lifestyle Photo',
      alt: newAlt.trim() || newName.trim() || 'Home decor inspiration',
      category: newCategory,
      createdAt: new Date().toISOString()
    };

    addMediaItem(item);
    setShowUploadModal(false);
    setNewUrl('');
    setNewName('');
    setNewAlt('');
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto pb-28">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D53]">
            Digital Assets & Photography
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#211E1B] tracking-tight">
            Media Library ({mediaLibrary.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7E73] mt-1">
            Store and organize high-resolution editorial photos for Pinterest rich cards, article headers, and story blocks.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-3 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Add New Image</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DFD5] shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#8C6D53] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by title or alt text..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs focus:outline-none focus:border-[#8C6D53]"
          />
        </div>
        <span className="text-xs text-[#8A7E73] font-semibold hidden sm:inline">
          Showing {filteredMedia.length} assets
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredMedia.map(item => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-[#E8DFD5] hover:border-[#8C6D53] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
              <img
                src={item.url}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {item.category && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase">
                  {item.category}
                </span>
              )}
            </div>

            <div className="p-3.5 space-y-2">
              <h5 className="font-serif text-xs font-bold text-[#2D2A26] truncate" title={item.name}>
                {item.name}
              </h5>
              <p className="text-[11px] text-[#8A7E73] truncate" title={item.alt}>
                Alt: {item.alt}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-[#F0EBE6]">
                <button
                  onClick={() => handleCopy(item.id, item.url)}
                  className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#2D2A26] border border-[#E8DFD5] rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#8C6D53]" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteMediaItem(item.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Image Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-[#E8DFD5]">
            <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#211E1B]">
                Upload or Add Image Asset
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-full hover:bg-[#EFE9E1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-4">
              {/* Local File Upload Picker */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#D9CFC4] text-center space-y-2">
                <Upload className="w-6 h-6 text-[#8C6D53] mx-auto" />
                <p className="text-xs text-[#6B635B] font-medium">
                  Select a photo from your computer or device
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-[#8A7E73] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#8C6D53] file:text-white hover:file:bg-[#A07D62]"
                />
              </div>

              <div className="text-center text-xs uppercase font-bold text-[#A89F95]">
                — OR ENTER DIRECT WEB URL —
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
                />
              </div>

              {newUrl && (
                <div className="aspect-16/9 max-h-36 rounded-xl overflow-hidden bg-stone-100 border border-[#E8DFD5]">
                  <img src={newUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                    Image Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Warm Linen Bedding"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                    Category Tag
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs font-semibold"
                  >
                    <option value="Decor">Decor</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="DIY">DIY</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Organization">Organization</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  Alt Text (for SEO & Pinterest Rich Pins)
                </label>
                <input
                  type="text"
                  value={newAlt}
                  onChange={(e) => setNewAlt(e.target.value)}
                  placeholder="Warm minimal bedroom with layered linen and clay vase"
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EBE6]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#6B635B] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Save to Media Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
