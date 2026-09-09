import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { MessageSquare, Send, User } from 'lucide-react';

interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const { comments, addComment } = useBlog();
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postComments = comments.filter(c => c.postId === postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    setIsSubmitting(true);
    addComment({
      postId,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      content: content.trim(),
    });

    setContent('');
    setIsSubmitting(false);
  };

  return (
    <section className="mt-16 pt-12 border-t border-[#E8DFD5] space-y-8">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-5 h-5 text-[#8C6D53]" />
        <h3 className="font-serif text-2xl font-bold text-[#2D2A26]">
          Reader Discussion ({postComments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 bg-white rounded-2xl border border-[#E8DFD5] space-y-4 shadow-xs">
        <h4 className="font-serif text-lg font-bold text-[#2D2A26]">Leave a Reflection</h4>
        <p className="text-xs text-[#6B635B]">
          Your email address will not be published. Required fields are marked *
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Claire S."
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-sm focus:outline-none focus:border-[#8C6D53]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder="claire@example.com"
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-sm focus:outline-none focus:border-[#8C6D53]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
            Comment *
          </label>
          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience, styling tips, or questions with the community..."
            className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-sm focus:outline-none focus:border-[#8C6D53]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post Comment</span>
        </button>
      </form>

      {/* List of comments */}
      <div className="space-y-4">
        {postComments.length > 0 ? (
          postComments.map((comment) => (
            <div key={comment.id} className="p-5 rounded-2xl bg-white border border-[#E8DFD5] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#EFE9E1] text-[#8C6D53] flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-serif text-sm font-bold text-[#2D2A26]">{comment.authorName}</span>
                </div>
                <span className="text-[11px] text-[#A89F95]">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-sm text-[#4A423B] leading-relaxed pl-9">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-[#8A7E73] bg-[#F4EFEA]/50 rounded-2xl border border-dashed border-[#D9CFC4]">
            Be the first to share your thoughts on this story.
          </div>
        )}
      </div>
    </section>
  );
};
