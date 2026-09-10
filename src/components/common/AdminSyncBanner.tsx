import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  ShieldCheck, 
  RefreshCw, 
  LayoutDashboard, 
  PenTool, 
  LogOut, 
  ChevronDown, 
  ChevronUp, 
  Radio, 
  Eye, 
  Sparkles 
} from 'lucide-react';

export const AdminSyncBanner: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    currentUser, 
    syncNow, 
    navigate, 
    logoutAdmin 
  } = useBlog();

  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isAdminAuthenticated) return null;

  const handleSyncClick = () => {
    setIsSyncing(true);
    syncNow();
    setTimeout(() => setIsSyncing(false), 600);
  };

  return (
    <div className="fixed bottom-22 lg:bottom-4 left-3 lg:left-4 z-40 transition-all duration-300 max-w-[calc(100vw-24px)]">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1A1816] text-[#F7F4EE] shadow-2xl border border-[#3A3530] text-xs font-bold hover:bg-[#25221E] cursor-pointer"
          title="Expand Admin CMS Quick Controls"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>CMS Bar</span>
          <ChevronUp className="w-3.5 h-3.5 text-[#C4A482]" />
        </button>
      ) : (
        <div className="bg-[#1A1816] text-[#F7F4EE] rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-[#3A3530] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-in slide-in-from-bottom-2 duration-200">
          
          {/* User Role Indicator */}
          <div className="flex items-center justify-between sm:justify-start gap-2.5 pr-3 sm:border-r sm:border-[#332E29]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="leading-tight">
                <span className="text-[11px] font-bold block text-white">
                  {currentUser?.name || 'Administrator'}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#C4A482] font-semibold block">
                  {currentUser?.role || 'Admin'} • Live Sync
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              className="sm:hidden p-1 rounded-md text-[#A89F95] hover:text-white"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick CMS Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSyncClick}
              disabled={isSyncing}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border border-[#38332E] cursor-pointer ${
                isSyncing 
                  ? 'bg-emerald-800/50 text-emerald-200' 
                  : 'bg-[#25221E] hover:bg-[#332D27] text-[#D9CFC4]'
              }`}
              title="Force synchronization between Admin and Public site across all tabs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="px-3 py-1.5 rounded-xl bg-[#2F3A32] hover:bg-[#3D4B41] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#48594D] cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#C8A97E]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => navigate('/admin/posts/new')}
              className="px-3 py-1.5 rounded-xl bg-[#8C6D53] hover:bg-[#785C44] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>New Post</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold flex items-center gap-1 transition-colors border border-red-900/30 cursor-pointer"
              title="Log out of Admin CMS"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="hidden sm:inline-flex p-1.5 rounded-lg text-[#A89F95] hover:text-white hover:bg-[#25221E] transition-colors cursor-pointer ml-1"
              title="Minimize bar"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
