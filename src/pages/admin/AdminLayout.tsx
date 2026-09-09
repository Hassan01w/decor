import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Home, 
  Compass, 
  Image, 
  Users, 
  Settings, 
  Globe, 
  LogOut, 
  ExternalLink,
  SlidersHorizontal,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  UserCheck,
  Menu,
  X,
  Lock
} from 'lucide-react';
import { 
  canManageHomepage, 
  canManageNavigation, 
  canManageSettings, 
  canManageCategories, 
  canManageSubscribers, 
  canManageUsers,
  ROLE_METADATA 
} from '../../utils/permissions';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    logoutAdmin, 
    navigate, 
    posts, 
    subscribers 
  } = useBlog();

  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roleMeta = currentUser ? ROLE_METADATA[currentUser.role] : ROLE_METADATA.admin;

  const navLinks = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/admin', 
      allowed: true 
    },
    { 
      id: 'posts', 
      label: 'All Articles', 
      icon: FileText, 
      path: '/admin/posts', 
      count: posts.length, 
      allowed: true 
    },
    { 
      id: 'categories', 
      label: 'Categories', 
      icon: FolderTree, 
      path: '/admin/categories', 
      allowed: canManageCategories(currentUser) 
    },
    { 
      id: 'media', 
      label: 'Media Library', 
      icon: Image, 
      path: '/admin/media', 
      allowed: true 
    },
    { 
      id: 'subscribers', 
      label: 'Newsletter Leads', 
      icon: Users, 
      path: '/admin/subscribers', 
      count: subscribers.length, 
      allowed: canManageSubscribers(currentUser) 
    },
    { 
      id: 'homepage', 
      label: 'Homepage CMS', 
      icon: Home, 
      path: '/admin/homepage', 
      allowed: canManageHomepage(currentUser),
      adminOnly: true
    },
    { 
      id: 'navigation', 
      label: 'Navigation Menu', 
      icon: Compass, 
      path: '/admin/navigation', 
      allowed: canManageNavigation(currentUser),
      adminOnly: true
    },
    { 
      id: 'users', 
      label: 'Team & Permissions', 
      icon: ShieldCheck, 
      path: '/admin/users', 
      count: users.length, 
      allowed: canManageUsers(currentUser),
      adminOnly: true
    },
    { 
      id: 'settings', 
      label: 'Site Settings & SEO', 
      icon: Settings, 
      path: '/admin/settings', 
      allowed: canManageSettings(currentUser),
      adminOnly: true
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex flex-col lg:flex-row text-[#2D2A26]">
      {/* Mobile Top Navbar */}
      <div className="lg:hidden bg-[#1A1816] text-white p-4 flex items-center justify-between border-b border-[#2E2925] sticky top-0 z-40">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/admin')}>
          <div className="w-8 h-8 rounded-lg bg-[#8C6D53] flex items-center justify-center text-white">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif text-sm font-bold tracking-wider uppercase block leading-tight">The Decor Diary</span>
            <span className="text-[10px] text-[#A89F95] block leading-tight">thedecordiary.store</span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-[#2E2925] text-[#FAF8F5]"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full lg:w-72 bg-[#1A1816] text-[#E5DDD5] flex flex-col justify-between shrink-0 border-r border-[#2E2925] ${
        isMobileMenuOpen ? 'block' : 'hidden lg:flex'
      }`}>
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#2E2925]">
            <div className="cursor-pointer" onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8C6D53] text-white flex items-center justify-center shadow-md">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-serif text-base font-bold tracking-wider text-white uppercase block leading-tight">
                    The Decor Diary
                  </span>
                  <span className="text-[10px] text-[#C4A482] font-semibold tracking-wider uppercase block leading-tight mt-0.5">
                    Store & Journal CMS
                  </span>
                </div>
              </div>
            </div>

            {/* Live Domain Status Card */}
            <div className="mt-4 p-2.5 rounded-xl bg-[#24211D] border border-[#38332E] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[11px] text-[#D9CFC4] truncate max-w-[140px]">thedecordiary.store</span>
              </div>
              <a
                href="https://thedecordiary.store"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] uppercase font-bold text-[#C4A482] hover:text-white flex items-center gap-0.5"
                title="Open production store"
              >
                Live <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Quick Front View Switcher */}
          <div className="p-4 border-b border-[#2E2925]">
            <button
              onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3.5 bg-[#25221E] hover:bg-[#322C26] text-[#FAF8F5] rounded-xl text-xs font-semibold flex items-center justify-between transition-colors border border-[#38332E] cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C4A482] group-hover:rotate-12 transition-transform" />
                <span>View Public Store</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[#A89F95]" />
            </button>
          </div>

          {/* Navigation Links with RBAC */}
          <nav className="p-4 space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#8A7E73] px-3 py-1.5 flex items-center justify-between">
              <span>Management</span>
              <span className="text-[9px] text-[#C4A482]">2 Admins</span>
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (!item.allowed) {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#6B635B] opacity-50 cursor-not-allowed select-none"
                    title={`Restricted to ${item.adminOnly ? 'Administrators' : 'Editors'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#6B635B]" />
                      <span>{item.label}</span>
                    </div>
                    <Lock className="w-3 h-3 text-[#8A7E73]" />
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#8C6D53] text-white shadow-md font-bold'
                      : 'text-[#B3A89D] hover:bg-[#25221E] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#A89F95]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#25221E] text-[#A89F95]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Role Switcher Footer */}
        <div className="p-4 border-t border-[#2E2925] space-y-3">
          {/* Quick Role Simulation / Switcher Drawer */}
          {isUserSwitcherOpen && (
            <div className="p-3 bg-[#25221E] rounded-2xl border border-[#38332E] space-y-2 mb-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-1 border-b border-[#322C26]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C4A482]">
                  Switch Administrator
                </span>
                <button 
                  onClick={() => setIsUserSwitcherOpen(false)}
                  className="text-[#A89F95] hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {users.map(u => {
                  const isCurrent = currentUser?.id === u.id;
                  const uMeta = ROLE_METADATA[u.role];

                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setIsUserSwitcherOpen(false);
                      }}
                      className={`p-2 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                        isCurrent ? 'bg-[#8C6D53] text-white' : 'hover:bg-[#322C26] text-[#E5DDD5]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-[#8C6D53]" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate leading-tight">{u.name}</p>
                          <span className="text-[10px] text-[#A89F95] block leading-tight">{uMeta.label}</span>
                        </div>
                      </div>
                      {isCurrent && <UserCheck className="w-3.5 h-3.5 text-white shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Profile Bar */}
          <div className="p-2.5 bg-[#25221E] rounded-2xl border border-[#38332E] space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div 
                onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                title="Click to switch administrator"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={currentUser?.name || 'Admin'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#8C6D53] shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate leading-tight">
                    {currentUser?.name || 'MBI'}
                  </span>
                  <span className="text-[10px] text-[#C4A482] font-semibold block leading-tight">
                    Admin ({currentUser?.username || 'mbi'})
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-[#A89F95] shrink-0" />
              </div>

              <button
                onClick={logoutAdmin}
                className="p-1.5 text-[#A89F95] hover:text-red-400 transition-colors shrink-0"
                title="Logout from CMS"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Top Context Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Desktop Context Bar */}
        <header className="hidden lg:flex bg-white border-b border-[#E8DFD5] px-8 py-3.5 items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="font-serif text-sm font-bold text-[#211E1B] tracking-wide">
              The Decor Diary
            </span>
            <span className="text-[#D9CFC4]">•</span>
            <span className="text-xs text-[#8A7E73] capitalize font-medium">
              {activeTab === 'dashboard' ? 'Overview & Analytics' : `${activeTab} Management`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Link to public site */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-[#6B635B] hover:text-[#8C6D53] flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#8C6D53]" />
              <span>thedecordiary.store</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <div className="h-4 w-px bg-[#E8DFD5]"></div>

            {/* Quick Add Button */}
            <button
              onClick={() => navigate('/admin/posts/new')}
              className="px-3.5 py-1.5 bg-[#8C6D53] hover:bg-[#735842] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>+ New Article</span>
            </button>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 pl-1">
              <span className="text-xs font-bold text-[#211E1B]">
                {currentUser?.name || 'MBI'}
              </span>
              <span className="text-[10px] uppercase font-bold bg-[#FAF8F5] text-[#8C6D53] border border-[#E8DFD5] px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Main Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
