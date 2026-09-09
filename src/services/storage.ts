import { 
  BlogPost, 
  Category, 
  HomepageConfig, 
  NavigationItem, 
  SiteSettings, 
  MediaItem, 
  Subscriber,
  Comment,
  AdminUser
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_POSTS, 
  INITIAL_NAVIGATION, 
  INITIAL_HOMEPAGE_CONFIG, 
  INITIAL_SITE_SETTINGS, 
  INITIAL_MEDIA_LIBRARY,
  INITIAL_SUBSCRIBERS,
  INITIAL_USERS 
} from './initialData';

const STORAGE_KEYS = {
  POSTS: 'decordiary_posts_v2',
  CATEGORIES: 'decordiary_categories_v2',
  NAVIGATION: 'decordiary_navigation_v2',
  HOMEPAGE: 'decordiary_homepage_v2',
  SETTINGS: 'decordiary_settings_v2',
  MEDIA: 'decordiary_media_v2',
  SUBSCRIBERS: 'decordiary_subscribers_v2',
  COMMENTS: 'decordiary_comments_v2',
  ADMIN_AUTH: 'decordiary_admin_auth_v2',
  CURRENT_USER: 'decordiary_current_user_v2',
  USERS: 'decordiary_users_v2',
  SAVED_POSTS: 'decordiary_saved_posts_v2',
};

// Automatic migration helper to upgrade existing cached browser data to The Decor Diary
(() => {
  try {
    // 1. Clean legacy settings and migrate to decordiary_settings_v2
    const legacySettingsRaw = localStorage.getItem('haven_blog_settings_v1');
    const newSettingsRaw = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (legacySettingsRaw || newSettingsRaw) {
      try {
        const raw = newSettingsRaw || legacySettingsRaw;
        const parsed = JSON.parse(raw || '{}');
        if (
          !parsed.logoText ||
          parsed.logoText.toUpperCase().includes('HAVEN') ||
          (parsed.siteName && parsed.siteName.toUpperCase().includes('HAVEN')) ||
          (parsed.logoSubtext && parsed.logoSubtext.toUpperCase().includes('LIFESTYLE JOURNAL'))
        ) {
          const updated = {
            ...parsed,
            ...INITIAL_SITE_SETTINGS,
            siteName: 'The Decor Diary',
            siteTagline: 'Your Home Decor Destination',
            logoText: 'THE DECOR DIARY',
            logoSubtext: 'ONLINE HOME DECOR STORE',
            siteUrl: 'https://thedecordiary.store/',
            contactEmail: 'thedecordiarystore@gmail.com',
            contactPhone: '03364585863',
            contactAddress: 'Sargodha',
          };
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
          localStorage.removeItem('haven_blog_settings_v1');
        } else if (!newSettingsRaw && legacySettingsRaw) {
          localStorage.setItem(STORAGE_KEYS.SETTINGS, legacySettingsRaw);
        }
      } catch (e) {
        // ignore parse error
      }
    }

    // 2. Migrate posts from legacy key if user created any custom posts
    const legacyPosts = localStorage.getItem('haven_blog_posts_v1');
    if (legacyPosts && !localStorage.getItem(STORAGE_KEYS.POSTS)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, legacyPosts);
    }

    // 3. Migrate categories
    const legacyCats = localStorage.getItem('haven_blog_categories_v1');
    if (legacyCats && !localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, legacyCats);
    }
  } catch (err) {
    console.warn('Decor Diary storage migration warning:', err);
  }
})();

// Listeners for reactive updates
type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

export const subscribeToStorage = (listener: StorageListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Listener notification error:', e);
    }
  });
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Posts CRUD
  getPosts: (): BlogPost[] => {
    return getItem<BlogPost[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  },

  getPublishedPosts: (): BlogPost[] => {
    const posts = StorageService.getPosts();
    const now = Date.now();
    return posts.filter(p => {
      if (p.status === 'published') return true;
      if (p.status === 'scheduled' && p.scheduledAt) {
        return new Date(p.scheduledAt).getTime() <= now;
      }
      return false;
    });
  },

  getPostBySlug: (slug: string): BlogPost | undefined => {
    const posts = StorageService.getPosts();
    return posts.find(p => p.slug === slug || p.id === slug);
  },

  getPostById: (id: string): BlogPost | undefined => {
    const posts = StorageService.getPosts();
    return posts.find(p => p.id === id);
  },

  savePost: (post: BlogPost): BlogPost => {
    const posts = StorageService.getPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    let updatedPosts: BlogPost[];
    
    if (existingIndex >= 0) {
      updatedPosts = [...posts];
      updatedPosts[existingIndex] = {
        ...post,
        updatedAt: new Date().toISOString()
      };
    } else {
      updatedPosts = [
        {
          ...post,
          publishedAt: post.publishedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          viewsCount: post.viewsCount || 0,
          savesCount: post.savesCount || 0,
        },
        ...posts
      ];
    }
    
    setItem(STORAGE_KEYS.POSTS, updatedPosts);
    return post;
  },

  deletePost: (id: string): void => {
    const posts = StorageService.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    setItem(STORAGE_KEYS.POSTS, filtered);
  },

  duplicatePost: (id: string): BlogPost | undefined => {
    const posts = StorageService.getPosts();
    const target = posts.find(p => p.id === id);
    if (!target) return undefined;

    const newId = `post-${Date.now()}`;
    const duplicated: BlogPost = {
      ...target,
      id: newId,
      title: `${target.title} (Copy)`,
      slug: `${target.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'draft',
      viewsCount: 0,
      savesCount: 0,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seo: {
        ...target.seo,
        seoTitle: `${target.seo.seoTitle} (Copy)`,
      }
    };

    setItem(STORAGE_KEYS.POSTS, [duplicated, ...posts]);
    return duplicated;
  },

  incrementPostViews: (postId: string): void => {
    const posts = StorageService.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index >= 0) {
      posts[index].viewsCount = (posts[index].viewsCount || 0) + 1;
      setItem(STORAGE_KEYS.POSTS, posts);
    }
  },

  toggleSavePost: (postId: string): boolean => {
    const saved = getItem<string[]>(STORAGE_KEYS.SAVED_POSTS, []);
    const isAlreadySaved = saved.includes(postId);
    let newSaved: string[];
    
    if (isAlreadySaved) {
      newSaved = saved.filter(id => id !== postId);
    } else {
      newSaved = [...saved, postId];
    }
    
    setItem(STORAGE_KEYS.SAVED_POSTS, newSaved);

    // Update post count
    const posts = StorageService.getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex >= 0) {
      posts[postIndex].savesCount = Math.max(0, (posts[postIndex].savesCount || 0) + (isAlreadySaved ? -1 : 1));
      setItem(STORAGE_KEYS.POSTS, posts);
    }

    return !isAlreadySaved;
  },

  getSavedPostIds: (): string[] => {
    return getItem<string[]>(STORAGE_KEYS.SAVED_POSTS, []);
  },

  // Categories CRUD
  getCategories: (): Category[] => {
    return getItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  saveCategory: (category: Category): Category => {
    const categories = StorageService.getCategories();
    const existingIndex = categories.findIndex(c => c.id === category.id);
    let updated: Category[];

    if (existingIndex >= 0) {
      updated = [...categories];
      updated[existingIndex] = category;
    } else {
      updated = [...categories, category];
    }

    setItem(STORAGE_KEYS.CATEGORIES, updated);
    return category;
  },

  deleteCategory: (id: string): void => {
    const categories = StorageService.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CATEGORIES, filtered);
  },

  // Navigation CRUD
  getNavigation: (): NavigationItem[] => {
    return getItem<NavigationItem[]>(STORAGE_KEYS.NAVIGATION, INITIAL_NAVIGATION);
  },

  saveNavigation: (items: NavigationItem[]): void => {
    setItem(STORAGE_KEYS.NAVIGATION, items);
  },

  // Homepage Config
  getHomepageConfig: (): HomepageConfig => {
    return getItem<HomepageConfig>(STORAGE_KEYS.HOMEPAGE, INITIAL_HOMEPAGE_CONFIG);
  },

  saveHomepageConfig: (config: HomepageConfig): void => {
    setItem(STORAGE_KEYS.HOMEPAGE, config);
  },

  // Site Settings
  getSiteSettings: (): SiteSettings => {
    return getItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  },

  saveSiteSettings: (settings: SiteSettings): void => {
    setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  // Media Library
  getMediaLibrary: (): MediaItem[] => {
    return getItem<MediaItem[]>(STORAGE_KEYS.MEDIA, INITIAL_MEDIA_LIBRARY);
  },

  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem => {
    const media = StorageService.getMediaLibrary();
    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setItem(STORAGE_KEYS.MEDIA, [newItem, ...media]);
    return newItem;
  },

  deleteMediaItem: (id: string): void => {
    const media = StorageService.getMediaLibrary();
    setItem(STORAGE_KEYS.MEDIA, media.filter(m => m.id !== id));
  },

  // Newsletter Subscribers
  getSubscribers: (): Subscriber[] => {
    return getItem<Subscriber[]>(STORAGE_KEYS.SUBSCRIBERS, INITIAL_SUBSCRIBERS);
  },

  addSubscriber: (email: string, source = 'Homepage'): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const subscribers = StorageService.getSubscribers();
    if (subscribers.some(s => s.email.toLowerCase() === cleanEmail)) {
      return { success: true, message: 'You are already subscribed to our journal! Thank you.' };
    }

    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
      source,
      status: 'active'
    };

    setItem(STORAGE_KEYS.SUBSCRIBERS, [newSub, ...subscribers]);
    return { success: true, message: 'Thank you for subscribing! Check your inbox for your welcome issue.' };
  },

  deleteSubscriber: (id: string): void => {
    const subscribers = StorageService.getSubscribers();
    setItem(STORAGE_KEYS.SUBSCRIBERS, subscribers.filter(s => s.id !== id));
  },

  // Comments
  getComments: (postId?: string): Comment[] => {
    const all = getItem<Comment[]>(STORAGE_KEYS.COMMENTS, []);
    if (postId) {
      return all.filter(c => c.postId === postId && c.approved);
    }
    return all;
  },

  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'approved'>): Comment => {
    const all = getItem<Comment[]>(STORAGE_KEYS.COMMENTS, []);
    const newComment: Comment = {
      ...comment,
      id: `comm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      approved: true
    };
    setItem(STORAGE_KEYS.COMMENTS, [newComment, ...all]);
    return newComment;
  },

  // Users & Roles Management
  getUsers: (): AdminUser[] => {
    return getItem<AdminUser[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  saveUser: (user: AdminUser): AdminUser => {
    const users = StorageService.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    let updated: AdminUser[];

    if (existingIndex >= 0) {
      updated = [...users];
      updated[existingIndex] = user;
    } else {
      updated = [...users, user];
    }

    setItem(STORAGE_KEYS.USERS, updated);
    
    // Update current user if modifying own profile
    const current = StorageService.getCurrentUser();
    if (current && current.id === user.id) {
      StorageService.setCurrentUser(user);
    }

    return user;
  },

  deleteUser: (id: string): void => {
    const users = StorageService.getUsers();
    const filtered = users.filter(u => u.id !== id);
    setItem(STORAGE_KEYS.USERS, filtered);
  },

  getCurrentUser: (): AdminUser | null => {
    const users = StorageService.getUsers();
    const current = getItem<AdminUser | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) {
      return users[0] || INITIAL_USERS[0];
    }
    // Sync latest from users list
    const found = users.find(u => u.id === current.id);
    return found || current;
  },

  setCurrentUser: (user: AdminUser | null): void => {
    if (user) {
      setItem(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      notifyListeners();
    }
  },

  // Admin Auth State
  isAdminAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  setAdminAuthenticated: (auth: boolean, user?: AdminUser | null): void => {
    if (auth) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      if (user) {
        StorageService.setCurrentUser(user);
      } else {
        const defaultUser = StorageService.getUsers()[0] || INITIAL_USERS[0];
        StorageService.setCurrentUser(defaultUser);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      StorageService.setCurrentUser(null);
    }
    notifyListeners();
  },

  // Backup and Restore full database
  exportDatabaseJson: (): string => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      version: '1.2',
      posts: StorageService.getPosts(),
      categories: StorageService.getCategories(),
      navigation: StorageService.getNavigation(),
      homepage: StorageService.getHomepageConfig(),
      settings: StorageService.getSiteSettings(),
      media: StorageService.getMediaLibrary(),
      subscribers: StorageService.getSubscribers(),
      users: StorageService.getUsers(),
    };
    return JSON.stringify(fullBackup, null, 2);
  },

  importDatabaseJson: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.posts) setItem(STORAGE_KEYS.POSTS, data.posts);
      if (data.categories) setItem(STORAGE_KEYS.CATEGORIES, data.categories);
      if (data.navigation) setItem(STORAGE_KEYS.NAVIGATION, data.navigation);
      if (data.homepage) setItem(STORAGE_KEYS.HOMEPAGE, data.homepage);
      if (data.settings) setItem(STORAGE_KEYS.SETTINGS, data.settings);
      if (data.media) setItem(STORAGE_KEYS.MEDIA, data.media);
      if (data.subscribers) setItem(STORAGE_KEYS.SUBSCRIBERS, data.subscribers);
      if (data.users) setItem(STORAGE_KEYS.USERS, data.users);
      notifyListeners();
      return true;
    } catch (e) {
      console.error('Failed to import database:', e);
      return false;
    }
  },

  // Export & Import custom blog posts independently
  exportBlogsJson: (): string => {
    const posts = StorageService.getPosts();
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      type: 'decor-diary-blogs-export',
      count: posts.length,
      posts
    }, null, 2);
  },

  importBlogsJson: (jsonString: string, mode: 'merge' | 'replace' = 'merge'): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      const incomingPosts = Array.isArray(parsed) ? parsed : (parsed.posts || []);
      if (!Array.isArray(incomingPosts)) return false;

      if (mode === 'replace') {
        setItem(STORAGE_KEYS.POSTS, incomingPosts);
      } else {
        const currentPosts = StorageService.getPosts();
        const existingIds = new Set(currentPosts.map(p => p.id));
        const merged = [...currentPosts];
        incomingPosts.forEach(post => {
          if (post && post.id && !existingIds.has(post.id)) {
            merged.push(post);
            existingIds.add(post.id);
          } else if (post && !post.id) {
            merged.push({ ...post, id: `imported-${Date.now()}-${Math.random().toString().slice(-4)}` });
          }
        });
        setItem(STORAGE_KEYS.POSTS, merged);
      }
      notifyListeners();
      return true;
    } catch (err) {
      console.error('Failed to import blogs:', err);
      return false;
    }
  },

  resetToSampleData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.NAVIGATION);
    localStorage.removeItem(STORAGE_KEYS.HOMEPAGE);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIBERS);
    localStorage.removeItem(STORAGE_KEYS.COMMENTS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_POSTS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    notifyListeners();
  }
};
