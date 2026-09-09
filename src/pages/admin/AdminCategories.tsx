import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Category } from '../../types';
import { slugify } from '../../utils/seo';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  FolderTree, 
  X, 
  Check, 
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, publishedPosts, saveCategory, deleteCategory, navigate, showToast } = useBlog();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [accentColor, setAccentColor] = useState('#8C6D53');

  const openCreateModal = () => {
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80');
    setAccentColor('#8C6D53');
    setEditingCategory(null);
    setIsCreating(true);
  };

  const openEditModal = (cat: Category) => {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setAccentColor(cat.accentColor || '#8C6D53');
    setEditingCategory(cat);
    setIsCreating(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a category name.', 'error');
      return;
    }

    const categoryData: Category = {
      id: editingCategory?.id || `cat-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      accentColor,
      displayOrder: editingCategory?.displayOrder || categories.length + 1
    };

    saveCategory(categoryData);
    setIsCreating(false);
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D53]">
            Taxonomy & Navigation
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#211E1B] tracking-tight">
            Manage Categories ({categories.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7E73] mt-1">
            Configure lifestyle topic categories, custom images, slug routes, and editorial descriptions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => {
          const postCount = publishedPosts.filter(p => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-[#E8DFD5] shadow-xs overflow-hidden flex flex-col justify-between group hover:border-[#8C6D53] hover:shadow-md transition-all"
            >
              <div>
                <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold uppercase tracking-wider text-white">
                    {postCount} Published Stories
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#2D2A26]">
                      {cat.name}
                    </h3>
                    <code className="text-[11px] bg-[#FAF8F5] px-2 py-0.5 rounded border text-[#8C6D53]">
                      /category/{cat.slug}
                    </code>
                  </div>
                  <p className="text-xs text-[#6B635B] line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-[#FAF8F5] border-t border-[#E8DFD5] flex items-center justify-between">
                <button
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className="text-xs font-semibold text-[#8C6D53] hover:underline flex items-center gap-1"
                >
                  <span>View Page</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg bg-white border border-[#E8DFD5] hover:bg-[#EFE9E1] text-[#2D2A26] transition-colors"
                    title="Edit Category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(cat.id)}
                    className="p-1.5 rounded-lg bg-white border border-[#E8DFD5] hover:bg-red-50 text-stone-500 hover:text-red-600 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Category Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-[#E8DFD5] animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#211E1B]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 rounded-full hover:bg-[#EFE9E1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Home Decor, DIY & Crafts..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-sm focus:outline-none focus:border-[#8C6D53]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="home-decor"
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Curated interior styling, warm textures, and living room inspirations..."
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  Card Cover Image URL
                </label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EBE6]">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#6B635B] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#E8DFD5]">
            <h4 className="font-serif text-lg font-bold text-[#2D2A26]">Confirm Category Delete</h4>
            <p className="text-xs text-[#6B635B]">
              Are you sure you want to delete this category? Articles assigned to this category will remain safe.
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
