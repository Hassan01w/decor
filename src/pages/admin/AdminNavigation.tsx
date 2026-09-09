import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { NavigationItem } from '../../types';
import { 
  Compass, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Save, 
  Eye, 
  EyeOff, 
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { INITIAL_NAVIGATION } from '../../services/initialData';

export const AdminNavigation: React.FC = () => {
  const { navigation, saveNavigation, showToast } = useBlog();
  const [items, setItems] = useState<NavigationItem[]>(navigation);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const next = [...items];
    const target = direction === 'up' ? index - 1 : index + 1;
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;

    // update orders
    const reordered = next.map((item, i) => ({ ...item, order: i + 1 }));
    setItems(reordered);
  };

  const toggleEnabled = (id: string) => {
    const next = items.map(item => {
      if (item.id === id) {
        return { ...item, isEnabled: !item.isEnabled };
      }
      return item;
    });
    setItems(next);
  };

  const deleteItem = (id: string) => {
    const next = items.filter(item => item.id !== id);
    setItems(next);
  };

  const updateItem = (id: string, updates: Partial<NavigationItem>) => {
    const next = items.map(item => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      return item;
    });
    setItems(next);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newUrl.trim()) return;

    const newItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      label: newLabel.trim(),
      url: newUrl.trim(),
      order: items.length + 1,
      isEnabled: true
    };

    setItems([...items, newItem]);
    setNewLabel('');
    setNewUrl('');
  };

  const handleSave = () => {
    saveNavigation(items);
  };

  const handleResetDefaults = () => {
    setItems(INITIAL_NAVIGATION);
    saveNavigation(INITIAL_NAVIGATION);
    showToast('Reset navigation menu to default topics.', 'info');
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D53]">
            Header Menu Architecture
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#211E1B] tracking-tight">
            Navigation Management
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7E73] mt-1">
            Configure header menu items, customize destination URLs, reorder tabs, and toggle visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-white hover:bg-[#EFE9E1] text-[#6B635B] border border-[#D9CFC4] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Menu</span>
          </button>
        </div>
      </div>

      {/* Add Menu Item Form */}
      <form onSubmit={addItem} className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFD5] shadow-xs space-y-3">
        <h4 className="font-serif text-base font-bold text-[#211E1B]">
          Add New Menu Item
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
              Menu Label
            </label>
            <input
              type="text"
              required
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Living Room, Recipes"
              className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
            />
          </div>
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
              Destination URL
            </label>
            <input
              type="text"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="/category/home-decor or /blog"
              className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#8C6D53] hover:bg-[#A07D62] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tab</span>
            </button>
          </div>
        </div>
      </form>

      {/* Menu Items List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-4">
        <h4 className="font-serif text-lg font-bold text-[#211E1B] border-b border-[#F0EBE6] pb-3">
          Active Header Tabs ({items.length})
        </h4>

        <div className="space-y-2.5">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.isEnabled
                  ? 'bg-white border-[#E8DFD5]'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="font-serif text-xs font-bold text-[#8C6D53] w-5">
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(item.id, { label: e.target.value })}
                  className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs font-bold text-[#2D2A26] w-36"
                />
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => updateItem(item.id, { url: e.target.value })}
                  className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs text-[#6B635B] flex-1 max-w-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#2D2A26] disabled:opacity-30"
                  title="Move Tab Left/Up"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === items.length - 1}
                  className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#2D2A26] disabled:opacity-30"
                  title="Move Tab Right/Down"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleEnabled(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    item.isEnabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {item.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{item.isEnabled ? 'Enabled' : 'Hidden'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
