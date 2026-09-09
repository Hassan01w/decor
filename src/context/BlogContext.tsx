import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  BlogPost, 
  Category, 
  HomepageConfig, 
  NavigationItem, 
  SiteSettings, 
  MediaItem, 
  Subscriber,
  Comment,
  AdminUser,
  UserRole
} from '../types';
import { StorageService, subscribeToStorage } from '../services/storage';
import { INITIAL_USERS } from '../services/initialData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface BlogContextType {
  // Data
  posts: BlogPost[];
  publishedPosts: BlogPost[];
  categories: Category[];
  navigation: NavigationItem[];
  homepageConfig: HomepageConfig;
  siteSettings: SiteSettings;
  mediaLibrary: MediaItem[];
  subscribers: Subscriber[];
  savedPostIds: string[];
  comments: Comment[];
  
  // Admin & User Role Auth
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  currentUser: AdminUser | null;
  users: AdminUser[];
  loginAdmin: (password: string, preferredUser?: AdminUser, username?: string) => boolean;
  loginAsRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  logoutAdmin: () => void;
  saveUser: (user: AdminUser) => void;
  deleteUser: (id: string) => void;
  
  // Navigation / Routing
  currentPath: string;
  navigate: (path: string) => void;
  
  // Actions
  savePost: (post: BlogPost) => void;
  deletePost: (id: string) => void;
  duplicatePost: (id: string) => BlogPost | undefined;
  saveCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  saveNavigation: (items: NavigationItem[]) => void;
  saveHomepageConfig: (config: HomepageConfig) => void;
  saveSiteSettings: (settings: SiteSettings) => void;
  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => MediaItem;
  deleteMediaItem: (id: string) => void;
  addSubscriber: (email: string, source?: string) => { success: boolean; message: string };
  deleteSubscriber: (id: string) => void;
  toggleSavePost: (postId: string) => boolean;
  incrementViews: (postId: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'approved'>) => void;
  resetDatabase: () => void;
  importDatabase: (json: string) => boolean;
  exportDatabase: () => string;
  exportBlogs: () => string;
  importBlogs: (json: string, mode?: 'merge' | 'replace') => boolean;
  
  // Temporary Unlisted Preview Post (for Live Editor Preview)
  previewPostData: BlogPost | null;
  setPreviewPostData: (post: BlogPost | null) => void;

  // UI & Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => StorageService.getPosts());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [navigation, setNavigation] = useState<NavigationItem[]>(() => StorageService.getNavigation());
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => StorageService.getHomepageConfig());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => StorageService.getSiteSettings());
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(() => StorageService.getMediaLibrary());
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => StorageService.getSubscribers());
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => StorageService.getSavedPostIds());
  const [comments, setComments] = useState<Comment[]>(() => StorageService.getComments());
  const [users, setUsers] = useState<AdminUser[]>(() => StorageService.getUsers());
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => StorageService.getCurrentUser());
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => StorageService.isAdminAuthenticated());
  const [previewPostData, setPreviewPostData] = useState<BlogPost | null>(null);
  
  // Custom path routing for smooth client-side SPA in all environments
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.slice(1);
    // Legacy support: if there's a hash, replace it with standard path
    if (hash && hash.startsWith('/')) {
      window.history.replaceState(null, '', hash);
      return hash.replace(/\/+/g, '/');
    }
    const pathname = window.location.pathname;
    if (pathname && pathname !== '/index.html') {
      return pathname.replace(/\/+/g, '/');
    }
    return '/';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state from storage
  const reloadFromStorage = () => {
    setPosts(StorageService.getPosts());
    setCategories(StorageService.getCategories());
    setNavigation(StorageService.getNavigation());
    setHomepageConfig(StorageService.getHomepageConfig());
    setSiteSettings(StorageService.getSiteSettings());
    setMediaLibrary(StorageService.getMediaLibrary());
    setSubscribers(StorageService.getSubscribers());
    setSavedPostIds(StorageService.getSavedPostIds());
    setComments(StorageService.getComments());
    setUsers(StorageService.getUsers());
    setCurrentUser(StorageService.getCurrentUser());
    setIsAdminAuthenticated(StorageService.isAdminAuthenticated());
  };

  useEffect(() => {
    const unsubscribe = subscribeToStorage(() => {
      reloadFromStorage();
    });
    return unsubscribe;
  }, []);

  // Ensure any cached legacy branding in browser localStorage is immediately replaced with The Decor Diary
  useEffect(() => {
    if (
      !siteSettings.logoText ||
      siteSettings.logoText.toUpperCase().includes('HAVEN') ||
      (siteSettings.siteName && siteSettings.siteName.toUpperCase().includes('HAVEN')) ||
      (siteSettings.logoSubtext && siteSettings.logoSubtext.toUpperCase().includes('LIFESTYLE JOURNAL'))
    ) {
      const sanitized: SiteSettings = {
        ...siteSettings,
        siteName: 'The Decor Diary',
        logoText: 'THE DECOR DIARY',
        logoSubtext: 'ONLINE HOME DECOR STORE',
        siteTagline: 'Your Home Decor Destination',
        siteUrl: 'https://thedecordiary.store/',
        contactPhone: '03364585863',
        contactAddress: 'Sargodha',
        contactEmail: 'thedecordiarystore@gmail.com'
      };
      setSiteSettings(sanitized);
      StorageService.saveSiteSettings(sanitized);
    }
  }, [siteSettings.logoText, siteSettings.siteName, siteSettings.logoSubtext]);

  // Listen to browser back/forward changes
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      const resolved = (pathname && pathname !== '/index.html') ? pathname : '/';
      setCurrentPath(resolved.replace(/\/+/g, '/'));
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    const sanitizedPath = path.replace(/\/+/g, '/');
    if (currentPath !== sanitizedPath) {
      setCurrentPath(sanitizedPath);
      window.history.pushState(null, '', sanitizedPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth & Role functions
  const loginAdmin = (password: string, preferredUser?: AdminUser, username?: string): boolean => {
    const trimmedPass = password.trim();
    const trimmedUser = username ? username.trim().toLowerCase() : '';
    
    // Master password verification
    const isMasterPassword = 
      trimmedPass === 'vip123' ||
      trimmedPass === 'vip' ||
      trimmedPass === 'admin123';

    // Find matching user by username, email, or name
    let user: AdminUser | undefined = preferredUser;
    
    if (!user && trimmedUser) {
      user = users.find(u => 
        (u.username && u.username.toLowerCase() === trimmedUser) ||
        u.name.toLowerCase() === trimmedUser ||
        u.email.toLowerCase() === trimmedUser
      );
    }

    // Check user-specific custom password (configured via Edit Team Member)
    const userCustomPassword = user?.password?.trim();
    const isCustomPasswordValid = Boolean(userCustomPassword && trimmedPass === userCustomPassword);

    const isAuthorized = 
      isCustomPasswordValid ||
      (isMasterPassword && (
        trimmedUser === 'vip123' || 
        trimmedUser === 'admin' || 
        trimmedUser === 'mbi' || 
        trimmedUser === 'samavia' ||
        !trimmedUser ||
        Boolean(user)
      ));

    if (isAuthorized) {
      if (!user) {
        user = users.find(u => u.username === trimmedUser) || 
               users.find(u => u.role === 'admin') || 
               users[0] || 
               INITIAL_USERS[0];
      }

      StorageService.setAdminAuthenticated(true, user);
      setIsAdminAuthenticated(true);
      setCurrentUser(user);
      showToast(`Welcome back, ${user.name}`, 'success');
      return true;
    }

    showToast('Invalid username or password. Please try again.', 'error');
    return false;
  };

  const loginAsRole = (role: UserRole) => {
    const user = users.find(u => u.role === role) || users[0];
    StorageService.setAdminAuthenticated(true, user);
    setIsAdminAuthenticated(true);
    setCurrentUser(user);
    showToast(`Switched account to ${user.name} [${user.role.toUpperCase()}]`, 'success');
    navigate('/admin');
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      StorageService.setCurrentUser(user);
      setCurrentUser(user);
      showToast(`Active profile switched to ${user.name} (${user.role.toUpperCase()})`, 'info');
    }
  };

  const logoutAdmin = () => {
    StorageService.setAdminAuthenticated(false);
    setIsAdminAuthenticated(false);
    setCurrentUser(null);
    showToast('Logged out of Admin CMS.', 'info');
    navigate('/');
  };

  const saveUser = (user: AdminUser) => {
    const updated = StorageService.saveUser(user);
    showToast(`Team member ${updated.name} updated.`, 'success');
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) {
      showToast('Cannot delete the last remaining system user.', 'error');
      return;
    }
    StorageService.deleteUser(id);
    showToast('User removed from team.', 'info');
  };

  // Actions
  const savePost = (post: BlogPost) => {
    StorageService.savePost(post);
    if (post.status === 'scheduled' && post.scheduledAt) {
      const formattedDate = new Date(post.scheduledAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
      showToast(`Article scheduled for publication on ${formattedDate}.`, 'success');
    } else {
      showToast(`Article "${post.title.slice(0, 28)}..." saved successfully.`, 'success');
    }
  };

  const deletePost = (id: string) => {
    StorageService.deletePost(id);
    showToast('Article deleted.', 'info');
  };

  const duplicatePost = (id: string) => {
    const duplicated = StorageService.duplicatePost(id);
    if (duplicated) {
      showToast('Article duplicated as draft.', 'success');
    }
    return duplicated;
  };

  const saveCategory = (category: Category) => {
    StorageService.saveCategory(category);
    showToast(`Category "${category.name}" updated.`, 'success');
  };

  const deleteCategory = (id: string) => {
    StorageService.deleteCategory(id);
    showToast('Category deleted.', 'info');
  };

  const saveNavigation = (items: NavigationItem[]) => {
    StorageService.saveNavigation(items);
    showToast('Navigation menu updated.', 'success');
  };

  const saveHomepageConfig = (config: HomepageConfig) => {
    StorageService.saveHomepageConfig(config);
    showToast('Homepage layout and content updated.', 'success');
  };

  const saveSiteSettings = (settings: SiteSettings) => {
    StorageService.saveSiteSettings(settings);
    showToast('Site settings & SEO updated.', 'success');
  };

  const addMediaItem = (item: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const created = StorageService.addMediaItem(item);
    showToast('Image added to Media Library.', 'success');
    return created;
  };

  const deleteMediaItem = (id: string) => {
    StorageService.deleteMediaItem(id);
    showToast('Image removed from library.', 'info');
  };

  const addSubscriber = (email: string, source = 'Homepage') => {
    const result = StorageService.addSubscriber(email, source);
    showToast(result.message, result.success ? 'success' : 'error');
    return result;
  };

  const deleteSubscriber = (id: string) => {
    StorageService.deleteSubscriber(id);
    showToast('Subscriber removed.', 'info');
  };

  const toggleSavePost = (postId: string) => {
    const isSaved = StorageService.toggleSavePost(postId);
    showToast(isSaved ? 'Saved to your inspiration board!' : 'Removed from saved articles.', 'info');
    return isSaved;
  };

  const incrementViews = (postId: string) => {
    StorageService.incrementPostViews(postId);
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt' | 'approved'>) => {
    StorageService.addComment(comment);
    showToast('Thank you! Your comment has been posted.', 'success');
  };

  const resetDatabase = () => {
    StorageService.resetToSampleData();
    showToast('Database reset to fresh editorial sample data.', 'info');
  };

  const importDatabase = (json: string) => {
    const ok = StorageService.importDatabaseJson(json);
    if (ok) {
      showToast('Database backup imported successfully!', 'success');
    } else {
      showToast('Failed to import database JSON format.', 'error');
    }
    return ok;
  };

  const exportDatabase = () => {
    return StorageService.exportDatabaseJson();
  };

  const exportBlogs = () => {
    return StorageService.exportBlogsJson();
  };

  const importBlogs = (json: string, mode: 'merge' | 'replace' = 'merge') => {
    const ok = StorageService.importBlogsJson(json, mode);
    if (ok) {
      setPosts(StorageService.getPosts());
      showToast('Blogs imported successfully!', 'success');
    } else {
      showToast('Failed to import blogs JSON format.', 'error');
    }
    return ok;
  };

  // Only public published stories (or scheduled stories whose time has arrived)
  const now = Date.now();
  const publishedPosts = posts.filter(p => {
    if (p.status === 'published') return true;
    if (p.status === 'scheduled' && p.scheduledAt) {
      return new Date(p.scheduledAt).getTime() <= now;
    }
    return false;
  });

  return (
    <BlogContext.Provider
      value={{
        posts,
        publishedPosts,
        categories,
        navigation,
        homepageConfig,
        siteSettings,
        mediaLibrary,
        subscribers,
        savedPostIds,
        comments,
        isAdmin: isAdminAuthenticated,
        isAdminAuthenticated,
        currentUser,
        users,
        loginAdmin,
        loginAsRole,
        switchUser,
        logoutAdmin,
        saveUser,
        deleteUser,
        currentPath,
        navigate,
        savePost,
        deletePost,
        duplicatePost,
        saveCategory,
        deleteCategory,
        saveNavigation,
        saveHomepageConfig,
        saveSiteSettings,
        addMediaItem,
        deleteMediaItem,
        addSubscriber,
        deleteSubscriber,
        toggleSavePost,
        incrementViews,
        addComment,
        resetDatabase,
        importDatabase,
        exportDatabase,
        exportBlogs,
        importBlogs,
        previewPostData,
        setPreviewPostData,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
