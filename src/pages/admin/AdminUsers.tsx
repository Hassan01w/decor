import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { AdminUser, UserRole } from '../../types';
import { PERMISSION_MATRIX, ROLE_METADATA } from '../../utils/permissions';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  Lock, 
  ArrowRight,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, currentUser, saveUser, deleteUser, switchUser, showToast } = useBlog();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('author');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  const openCreateModal = () => {
    setEditingUser(null);
    setName('');
    setUsername('');
    setPassword('vip123');
    setShowPassword(false);
    setEmail('');
    setRole('author');
    setTitle('Contributing Author');
    setBio('Passionate home decor and lifestyle writer.');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setName(user.name);
    setUsername(user.username || user.name.toLowerCase().replace(/\s+/g, ''));
    setPassword(user.password || 'vip123');
    setShowPassword(false);
    setEmail(user.email);
    setRole(user.role);
    setTitle(user.title);
    setBio(user.bio || '');
    setAvatar(user.avatar);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required.', 'error');
      return;
    }

    const cleanUsername = (username.trim() || name.trim()).toLowerCase().replace(/\s+/g, '');
    const cleanPassword = password.trim() || editingUser?.password || 'vip123';

    const userData: AdminUser = {
      id: editingUser?.id || `user-${Date.now()}`,
      name: name.trim(),
      username: cleanUsername,
      password: cleanPassword,
      email: email.trim(),
      role,
      title: title.trim() || 'Contributor',
      bio: bio.trim(),
      avatar: avatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      authorId: editingUser?.authorId || cleanUsername.replace(/[^a-z0-9]/g, '-'),
      createdAt: editingUser?.createdAt || new Date().toISOString().split('T')[0]
    };

    saveUser(userData);
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 sm:space-y-10 max-w-7xl mx-auto pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D53]">
            Access Control & RBAC
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211E1B] tracking-tight mt-0.5">
            Team & Permissions Management
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7E73] mt-1">
            Manage administrators, editor credentials, passwords, and granular role permissions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {(['admin', 'editor', 'author'] as UserRole[]).map((r) => {
          const meta = ROLE_METADATA[r];
          const membersInRole = users.filter(u => u.role === r);

          return (
            <div key={r} className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFD5] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${meta.badgeBg} ${meta.badgeText}`}>
                    {meta.label}
                  </span>
                  <span className="text-xs font-bold text-[#8A7E73]">
                    {membersInRole.length} {membersInRole.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#211E1B]">
                  {meta.label}
                </h3>
                <p className="text-xs text-[#6B635B] leading-relaxed">
                  {meta.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0EBE6] text-[11px] text-[#8A7E73]">
                <span className="font-bold text-[#2D2A26]">Key Rights: </span>
                {r === 'admin' && 'Full CMS settings, SEO tags, navigation, users & database'}
                {r === 'editor' && 'All articles & drafts, categories, taxonomy, and subscribers'}
                {r === 'author' && 'Create & edit own articles only; media library access'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Members List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-serif text-xl font-bold text-[#211E1B]">
            Active Team Profiles ({users.length})
          </h3>
          <span className="text-xs text-[#8A7E73]">
            Active session: <strong className="text-[#8C6D53]">{currentUser?.name}</strong> ({currentUser?.role.toUpperCase()})
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-xs overflow-hidden">
          <div className="divide-y divide-[#F0EBE6]">
            {users.map(user => {
              const meta = ROLE_METADATA[user.role];
              const isCurrent = currentUser?.id === user.id;

              return (
                <div key={user.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5]/80 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E8DFD5] shrink-0"
                      />
                      {isCurrent && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" title="Active Session" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-serif text-base font-bold text-[#211E1B]">
                          {user.name}
                        </h4>
                        {user.username && (
                          <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8DFD5] text-[#8C6D53] text-[11px] font-mono font-semibold">
                            @{user.username}
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider">
                            You (Active)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8A7E73]">
                        {user.title} • <span className="text-[#6B635B]">{user.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${meta.badgeBg} ${meta.badgeText}`}>
                      {meta.label}
                    </span>

                    {/* Switch Profile Button */}
                    {!isCurrent && (
                      <button
                        onClick={() => switchUser(user.id)}
                        className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#8C6D53] hover:text-white border border-[#E8DFD5] text-[#2D2A26] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Switch active session to this user"
                      >
                        <span>Switch to {user.name.split(' ')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Edit Profile & Change Password Button */}
                    <button
                      onClick={() => openEditModal(user)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EFE9E1] border border-[#E8DFD5] text-[#2D2A26] transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Edit user profile, role, and password"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#8C6D53]" />
                      <span>Edit & Password</span>
                    </button>

                    {/* Delete User Button */}
                    {users.length > 1 && (
                      <button
                        onClick={() => setDeleteConfirmId(user.id)}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 text-[#A89F95] hover:text-red-600 border border-[#E8DFD5] transition-colors cursor-pointer"
                        title="Remove User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Granular Permissions Matrix Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#211E1B]">
            Role-Based Access Control (RBAC) Matrix
          </h3>
          <span className="px-3 py-1 rounded-full bg-[#EFE9E1] text-[#8C6D53] text-xs font-bold">
            12 Enforced Policies
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8DFD5] text-[11px] font-bold uppercase tracking-wider text-[#8A7E73]">
                  <th className="py-3.5 px-4 sm:px-6">Permission / Capability</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-center">Administrator</th>
                  <th className="py-3.5 px-4 text-center">Editor</th>
                  <th className="py-3.5 px-4 text-center">Author</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE6]">
                {PERMISSION_MATRIX.map(perm => (
                  <tr key={perm.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#211E1B]">
                      {perm.name}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#6B635B] max-w-sm">
                      {perm.description}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {perm.admin ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-stone-400">
                          <X className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {perm.editor ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-stone-400">
                          <X className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {perm.author ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-stone-400">
                          <X className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit User Modal - Fully Responsive & Scrollable with Password Change */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg sm:max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8DFD5] my-auto overflow-hidden animate-in fade-in duration-200">
            {/* Sticky Header */}
            <div className="px-5 sm:px-7 py-4 bg-white border-b border-[#F0EBE6] flex items-center justify-between shrink-0">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D53]">
                  {editingUser ? 'Profile & Access Credentials' : 'New Member Registration'}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#211E1B]">
                  {editingUser ? `Edit ${editingUser.name}` : 'Add Team Member'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#8A7E73] hover:text-[#211E1B] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="team-member-form" onSubmit={handleSave} className="p-5 sm:p-7 overflow-y-auto space-y-5 text-left flex-1">
              
              {/* Account Credentials / Password Section */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD5] space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2D2A26] uppercase tracking-wider">
                  <KeyRound className="w-4 h-4 text-[#8C6D53]" />
                  <span>CMS Sign-In & Password</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B635B] mb-1">
                      Username *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. mbi"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs font-mono font-semibold text-[#211E1B] focus:outline-none focus:border-[#8C6D53]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B635B] mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password (e.g. vip123)"
                        className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs font-mono font-semibold text-[#211E1B] focus:outline-none focus:border-[#8C6D53]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8A7E73] hover:text-[#211E1B] transition-colors cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8A7E73] pt-1">
                  <span>Default access: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8DFD5] font-mono text-[#2D2A26] font-bold">vip123</code></span>
                  <button
                    type="button"
                    onClick={() => setPassword('vip123')}
                    className="text-[#8C6D53] hover:underline font-semibold cursor-pointer"
                  >
                    Reset to vip123
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julian Davies"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs sm:text-sm text-[#211E1B] focus:outline-none focus:border-[#8C6D53]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@thedecordiary.store"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs sm:text-sm text-[#211E1B] focus:outline-none focus:border-[#8C6D53]"
                  />
                </div>
              </div>

              {/* Role & Job Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                    Assigned Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs font-bold text-[#211E1B] focus:outline-none focus:border-[#8C6D53]"
                  >
                    <option value="admin">👑 Administrator (Full access)</option>
                    <option value="editor">✍️ Editor (All articles & taxonomy)</option>
                    <option value="author">🌿 Author (Own articles only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                    Job Title / Role Display
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lead Store Curator"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs sm:text-sm text-[#211E1B] focus:outline-none focus:border-[#8C6D53]"
                  />
                </div>
              </div>

              {/* Avatar Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  Avatar Image URL
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="Preview"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E8DFD5] shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs text-[#211E1B] focus:outline-none focus:border-[#8C6D53]"
                  />
                </div>
              </div>

              {/* Author Bio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
                  Short Author Biography
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief biography displayed on authored stories..."
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-xs text-[#211E1B] focus:outline-none focus:border-[#8C6D53]"
                />
              </div>
            </form>

            {/* Sticky Footer */}
            <div className="px-5 sm:px-7 py-4 bg-[#FAF8F5] border-t border-[#F0EBE6] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 sm:px-5 py-2.5 bg-white hover:bg-[#EFE9E1] border border-[#E8DFD5] text-[#6B635B] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="team-member-form"
                className="px-5 sm:px-6 py-2.5 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
              >
                <span>Save Team Member</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#E8DFD5]">
            <h4 className="font-serif text-lg font-bold text-[#2D2A26]">Confirm Team Member Removal</h4>
            <p className="text-xs text-[#6B635B]">
              Are you sure you want to remove this user from the editorial team? Their existing authored articles will remain safe.
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
                Remove User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
