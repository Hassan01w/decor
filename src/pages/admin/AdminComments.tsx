import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Search, 
  Filter, 
  ExternalLink, 
  User, 
  Mail, 
  Calendar, 
  Sparkles,
  CornerDownRight,
  Send,
  AlertCircle
} from 'lucide-react';

export const AdminComments: React.FC = () => {
  const { 
    comments, 
    posts, 
    approveComment, 
    deleteComment, 
    addComment, 
    navigate, 
    showToast 
  } = useBlog();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const postsMap = new Map(posts.map(p => [p.id, p]));

  const filteredComments = comments.filter(c => {
    if (activeFilter === 'pending' && c.approved) return false;
    if (activeFilter === 'approved' && !c.approved) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const postTitle = postsMap.get(c.postId)?.title.toLowerCase() || '';
      return (
        c.authorName.toLowerCase().includes(q) ||
        c.authorEmail.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        postTitle.includes(q)
      );
    }
    return true;
  });

  const pendingCount = comments.filter(c => !c.approved).length;
  const approvedCount = comments.filter(c => c.approved).length;

  const handleSendReply = (parentComment: any) => {
    if (!replyText.trim()) return;
    addComment({
      postId: parentComment.postId,
      authorName: 'The Decor Diary Editorial Team',
      authorEmail: 'thedecordiarystore@gmail.com',
      content: `@${parentComment.authorName} ${replyText.trim()}`
    });
    setReplyText('');
    setReplyingCommentId(null);
    showToast(`Reply posted for ${parentComment.authorName}!`, 'success');
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D53]">
              Community & Engagement
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300">
                {pendingCount} Pending Moderation
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#211E1B] tracking-tight mt-1">
            Comments & Reader Reviews
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7E73] mt-0.5">
            Moderate questions, styling inquiries, and decor feedback across your articles.
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-white rounded-xl border border-[#E8DFD5] shadow-2xs text-center">
            <span className="text-[10px] uppercase font-bold text-[#8A7E73] block">Total</span>
            <span className="text-base font-bold text-[#2D2A26]">{comments.length}</span>
          </div>
          <div className="px-3.5 py-2 bg-emerald-50 rounded-xl border border-emerald-200 shadow-2xs text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Approved</span>
            <span className="text-base font-bold text-emerald-800">{approvedCount}</span>
          </div>
          <div className="px-3.5 py-2 bg-amber-50 rounded-xl border border-amber-200 shadow-2xs text-center">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Pending</span>
            <span className="text-base font-bold text-amber-800">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8DFD5] shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#2D2A26] text-white'
                : 'bg-[#F7F4EF] text-[#6B635B] hover:bg-[#EFE9E1]'
            }`}
          >
            All Comments ({comments.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'pending'
                ? 'bg-amber-700 text-white'
                : 'bg-[#F7F4EF] text-[#6B635B] hover:bg-[#EFE9E1]'
            }`}
          >
            <span>Pending Moderation</span>
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeFilter === 'approved'
                ? 'bg-emerald-700 text-white'
                : 'bg-[#F7F4EF] text-[#6B635B] hover:bg-[#EFE9E1]'
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-[#A89F95] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reader, email, article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#D9CFC4] rounded-xl focus:outline-none focus:border-[#8C6D53] text-[#2D2A26]"
          />
        </div>
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E8DFD5] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#8C6D53] flex items-center justify-center mx-auto border border-[#E8DFD5]">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2D2A26]">No comments match your filter</h3>
          <p className="text-xs text-[#8A7E73] max-w-md mx-auto">
            {searchQuery ? 'Try clearing your search query to view other reader messages.' : 'All pending comments have been moderated.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => {
            const post = postsMap.get(comment.postId);
            const isReplying = replyingCommentId === comment.id;

            return (
              <div 
                key={comment.id}
                className={`p-5 sm:p-6 bg-white rounded-2xl border transition-all shadow-2xs ${
                  !comment.approved ? 'border-amber-300 bg-amber-50/20' : 'border-[#E8DFD5]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Author & Context Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#8C6D53] text-white text-xs font-bold flex items-center justify-center">
                          {comment.authorName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-sm text-[#2D2A26]">
                          {comment.authorName}
                        </span>
                      </div>
                      
                      <span className="text-xs text-[#8A7E73] flex items-center gap-1 font-mono">
                        <Mail className="w-3 h-3 text-[#A89F95]" />
                        {comment.authorEmail}
                      </span>

                      <span className="text-xs text-[#A89F95] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(comment.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>

                      {comment.approved ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" /> Needs Approval
                        </span>
                      )}
                    </div>

                    {/* Article Reference Link */}
                    {post && (
                      <div className="flex items-center gap-1.5 text-xs text-[#8C6D53]">
                        <span className="text-[#8A7E73]">On article:</span>
                        <button
                          onClick={() => navigate(`/blog/${post.slug}`)}
                          className="font-medium hover:underline flex items-center gap-1 cursor-pointer truncate max-w-md"
                        >
                          <span>{post.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </button>
                      </div>
                    )}

                    {/* Comment Content */}
                    <p className="text-sm text-[#3E3A36] leading-relaxed bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EFE9E1] font-sans whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>

                  {/* Actions Column */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    {!comment.approved ? (
                      <button
                        onClick={() => approveComment(comment.id, true)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => approveComment(comment.id, false)}
                        className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#6B635B] border border-[#D9CFC4] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Hide from public article view"
                      >
                        <XCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Unapprove</span>
                      </button>
                    )}

                    <button
                      onClick={() => setReplyingCommentId(isReplying ? null : comment.id)}
                      className="px-3 py-1.5 bg-white hover:bg-[#FAF8F5] text-[#8C6D53] border border-[#D9CFC4] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>{isReplying ? 'Cancel' : 'Reply'}</span>
                    </button>

                    {deleteConfirmId === comment.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { deleteComment(comment.id); setDeleteConfirmId(null); }}
                          className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 bg-gray-200 text-[#2D2A26] text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(comment.id)}
                        className="p-1.5 text-[#A89F95] hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Editorial Reply Field */}
                {isReplying && (
                  <div className="mt-4 pt-4 border-t border-[#E8DFD5] space-y-2">
                    <label className="text-xs font-bold text-[#8C6D53] block">
                      Respond as Editorial Team:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Reply to ${comment.authorName}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(comment); }}
                        className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CFC4] rounded-xl focus:outline-none focus:border-[#8C6D53] text-[#2D2A26]"
                      />
                      <button
                        onClick={() => handleSendReply(comment)}
                        className="px-4 py-2 bg-[#8C6D53] hover:bg-[#735841] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
