import { AdminUser, BlogPost, UserRole } from '../types';

export interface PermissionFeature {
  id: string;
  name: string;
  admin: boolean;
  editor: boolean;
  author: boolean;
  description: string;
}

export const PERMISSION_MATRIX: PermissionFeature[] = [
  {
    id: 'posts_all',
    name: 'Manage All Articles',
    admin: true,
    editor: true,
    author: false,
    description: 'Create, edit, publish, schedule, or delete any article on the site.',
  },
  {
    id: 'posts_own',
    name: 'Manage Own Articles',
    admin: true,
    editor: true,
    author: true,
    description: 'Create, edit, and save drafts of articles created under your author profile.',
  },
  {
    id: 'categories',
    name: 'Category Taxonomies',
    admin: true,
    editor: true,
    author: false,
    description: 'Create, edit, sort, and delete lifestyle categories.',
  },
  {
    id: 'homepage',
    name: 'Homepage CMS Curator',
    admin: true,
    editor: false,
    author: false,
    description: 'Reorder sections, update hero banners, and customize editorial feeds.',
  },
  {
    id: 'navigation',
    name: 'Navigation & Menu Builder',
    admin: true,
    editor: false,
    author: false,
    description: 'Add or rearrange top navigation header and footer links.',
  },
  {
    id: 'media',
    name: 'Media Library & Assets',
    admin: true,
    editor: true,
    author: true,
    description: 'Upload high-res imagery, organize galleries, and copy CDN URLs.',
  },
  {
    id: 'subscribers',
    name: 'Subscriber Leads & Export',
    admin: true,
    editor: true,
    author: false,
    description: 'View newsletter signups and export CSV mailing lists.',
  },
  {
    id: 'settings',
    name: 'SEO & System Settings',
    admin: true,
    editor: false,
    author: false,
    description: 'Modify Google Analytics IDs, Pinterest domain verification, and backups.',
  },
  {
    id: 'users',
    name: 'Team & Role Management',
    admin: true,
    editor: false,
    author: false,
    description: 'Invite new writers, change role permissions, and manage team accounts.',
  },
];

export const ROLE_METADATA: Record<string, {
  label: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  summary: string;
}> = {
  admin: {
    label: 'Administrator',
    badgeBg: 'bg-stone-900',
    badgeText: 'text-amber-300',
    description: 'Full system control: articles, categories, homepage CMS, navigation, SEO, team management, and database exports.',
    summary: 'Full access to all editorial & system settings'
  },
  administrator: {
    label: 'Administrator',
    badgeBg: 'bg-stone-900',
    badgeText: 'text-amber-300',
    description: 'Full system control: articles, categories, homepage CMS, navigation, SEO, team management, and database exports.',
    summary: 'Full access to all editorial & system settings'
  },
  editor: {
    label: 'Editor',
    badgeBg: 'bg-[#8C6D53]',
    badgeText: 'text-white',
    description: 'Editorial leadership: can manage all articles, categories, media, and subscribers. Restricted from sensitive site settings.',
    summary: 'Can manage all posts, categories & media'
  },
  author: {
    label: 'Author',
    badgeBg: 'bg-[#6E7C69]',
    badgeText: 'text-white',
    description: 'Writer & contributor: can create new stories and edit only their own posts. Cannot modify categories or system settings.',
    summary: 'Can create and edit only their own posts'
  }
};

const isAdminRole = (role?: string) => role === 'admin' || role === 'administrator';

/**
 * Check if the user can manage site settings
 */
export function canManageSettings(user?: AdminUser | null): boolean {
  if (!user) return false;
  return isAdminRole(user.role);
}

/**
 * Check if user can manage navigation
 */
export function canManageNavigation(user?: AdminUser | null): boolean {
  if (!user) return false;
  return isAdminRole(user.role);
}

/**
 * Check if user can manage homepage layout
 */
export function canManageHomepage(user?: AdminUser | null): boolean {
  if (!user) return false;
  return isAdminRole(user.role);
}

/**
 * Check if user can manage categories
 */
export function canManageCategories(user?: AdminUser | null): boolean {
  if (!user) return false;
  return isAdminRole(user.role) || user.role === 'editor';
}

/**
 * Check if user can manage subscribers
 */
export function canManageSubscribers(user?: AdminUser | null): boolean {
  if (!user) return false;
  return isAdminRole(user.role) || user.role === 'editor';
}

/**
 * Check if user can manage team & roles
 */
export function canManageUsers(user?: AdminUser | null): boolean {
  if (!user) return false;
  return isAdminRole(user.role);
}

/**
 * Check if user can edit a specific blog post
 */
export function canEditPost(user?: AdminUser | null, post?: BlogPost | null): boolean {
  if (!user) return false;
  if (!post) return true; // Creating new
  if (isAdminRole(user.role) || user.role === 'editor') return true;
  
  // Author can only edit their own post
  if (user.role === 'author') {
    if (user.authorId && post.author?.id === user.authorId) return true;
    if (user.name && post.author?.name?.trim().toLowerCase() === user.name?.trim().toLowerCase()) return true;
    return false;
  }
  return false;
}

/**
 * Check if user can delete a specific blog post
 */
export function canDeletePost(user?: AdminUser | null, post?: BlogPost | null): boolean {
  if (!user || !post) return false;
  if (isAdminRole(user.role) || user.role === 'editor') return true;
  
  if (user.role === 'author') {
    if (user.authorId && post.author?.id === user.authorId) return true;
    if (user.name && post.author?.name?.trim().toLowerCase() === user.name?.trim().toLowerCase()) return true;
    return false;
  }
  return false;
}
