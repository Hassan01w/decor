import React from 'react';
import { useBlog } from '../../context/BlogContext';
import { X, Bookmark, ArrowRight, Trash2, Share2 } from 'lucide-react';
import { getPinterestShareUrl } from '../../utils/seo';

interface SavedPostsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedPostsDrawer: React.FC<SavedPostsDrawerProps> = ({ isOpen, onClose }) => {
  const { savedPostIds, posts, toggleSavePost, navigate } = useBlog();

  if (!isOpen) return null;

  const savedPosts = posts.filter(p => savedPostIds.includes(p.id));

  const handleOpenPost = (slug: string) => {
    onClose();
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-[#E8DFD5] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E8DFD5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EFE9E1] flex items-center justify-center text-[#8C6D53]">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2D2A26]">Saved Moodboard</h3>
              <p className="text-xs text-[#8A7E73]">{savedPosts.length} pinned inspiration articles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8A7E73] hover:text-[#2D2A26] hover:bg-[#EFE9E1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Saved Posts */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedPosts.length > 0 ? (
            savedPosts.map(post => {
              const pinUrl = getPinterestShareUrl(
                window.location.origin + `/blog/${post.slug}`,
                post.featuredImage,
                post.title
              );

              return (
                <div
                  key={post.id}
                  className="group p-3 rounded-2xl bg-white border border-[#E8DFD5] hover:border-[#8C6D53] hover:shadow-md transition-all flex gap-3 relative"
                >
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer"
                    onClick={() => handleOpenPost(post.slug)}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4
                        onClick={() => handleOpenPost(post.slug)}
                        className="font-serif text-sm font-bold text-[#2D2A26] group-hover:text-[#8C6D53] transition-colors line-clamp-2 cursor-pointer"
                      >
                        {post.title}
                      </h4>
                      <p className="text-[11px] text-[#8A7E73] mt-1">{post.readingTimeMinutes} min read</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F0EBE6]">
                      <a
                        href={pinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-[#E60023] hover:underline flex items-center gap-1"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Pin to Pinterest</span>
                      </a>
                      <button
                        onClick={() => toggleSavePost(post.id)}
                        className="text-[#B3A89D] hover:text-red-600 transition-colors p-1"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center space-y-4">
              <Bookmark className="w-12 h-12 text-[#D6CBC1] mx-auto" />
              <h4 className="font-serif text-lg text-[#2D2A26]">Your board is empty</h4>
              <p className="text-xs text-[#8A7E73] max-w-xs mx-auto leading-relaxed">
                Click the bookmark icon on any article card or reader view to save styling inspirations to this board.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {savedPosts.length > 0 && (
          <div className="p-6 border-t border-[#E8DFD5] bg-white space-y-2">
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-[#E60023] hover:bg-[#C9001D] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Export All to Pinterest</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
