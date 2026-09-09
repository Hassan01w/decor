import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  Users, 
  Download, 
  Trash2, 
  Mail, 
  Search, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';

export const AdminSubscribers: React.FC = () => {
  const { subscribers, deleteSubscriber, showToast } = useBlog();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = subscribers.filter(sub => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return sub.email.toLowerCase().includes(q) || sub.source?.toLowerCase().includes(q);
  });

  const exportCSV = () => {
    if (subscribers.length === 0) {
      showToast('No subscribers to export.', 'info');
      return;
    }

    const headers = ['ID', 'Email', 'Source', 'Status', 'Subscribed At'];
    const rows = subscribers.map(s => [
      s.id,
      s.email,
      `"${s.source || 'General'}"`,
      s.status,
      s.subscribedAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `decor-diary-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Subscribers CSV downloaded successfully!', 'success');
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DED2] pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#A68B6A]">
            Audience & Lead Growth
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#242522] tracking-tight">
            Newsletter Subscribers ({subscribers.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#5A534B] mt-1">
            View, manage, and export email leads captured across article footers and the homepage.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-5 py-2.5 bg-[#2F3A32] hover:bg-[#202722] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Subscribers CSV</span>
        </button>
      </div>

      {/* Control Bar & Search */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5DED2] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#2F3A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subscribers by email or source..."
              className="w-full pl-10 pr-4 py-2 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs sm:text-sm text-[#242522] placeholder-[#8A857B] focus:outline-none focus:border-[#2F3A32]"
            />
          </div>

          <div className="text-xs text-[#7A7369]">
            Showing <strong>{filtered.length}</strong> of <strong>{subscribers.length}</strong> active readers
          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <div className="overflow-x-auto border border-[#E5DED2] rounded-2xl">
            <table className="w-full text-left text-xs text-[#242522]">
              <thead className="bg-[#F7F4EE] text-[#7A7369] uppercase font-bold text-[10px] tracking-wider border-b border-[#E5DED2]">
                <tr>
                  <th className="py-3.5 px-6">Subscriber Email</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Lead Source</th>
                  <th className="py-3.5 px-4">Subscribed Date</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DED2]">
                {filtered.map(sub => (
                  <tr key={sub.id} className="hover:bg-[#F7F4EE]/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-[#242522]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#EFEAE1] text-[#2F3A32] flex items-center justify-center">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span>{sub.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-[#5A534B]">
                      {sub.source || 'Homepage Newsletter Box'}
                    </td>
                    <td className="py-4 px-4 text-xs text-[#7A7369]">
                      {new Date(sub.subscribedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => deleteSubscriber(sub.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <p className="font-serif text-lg font-bold text-[#242522]">No subscribers found</p>
            <p className="text-xs text-[#7A7369]">Subscribers who sign up via the front-end will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
};
