export type PostStatus = 'published' | 'draft' | 'scheduled';

export type UserRole = 'admin' | 'administrator' | 'editor' | 'author';

export interface AdminUser {
  id: string;
  name: string;
  username?: string;
  password?: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  bio?: string;
  authorId?: string;
  createdAt?: string;
}

export interface Author {
  id?: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
}

export type BlockType = 
  | 'paragraph'
  | 'heading2'
  | 'heading3'
  | 'image'
  | 'quote'
  | 'tip_box'
  | 'shoppable_product'
  | 'before_after'
  | 'pinterest_gallery'
  | 'divider'
  | 'bullet_list'
  | 'number_list'
  | 'callout'
  | 'button'
  | 'video'
  | 'gallery';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: {
    text?: string;
    caption?: string;
    level?: 2 | 3;
    // Lists
    items?: string[];
    // Callouts
    calloutType?: 'info' | 'tip' | 'warning';
    calloutTitle?: string;
    // Buttons & Video
    buttonText?: string;
    buttonUrl?: string;
    buttonStyle?: string;
    embedUrl?: string;
    // Image / Pinterest Block
    url?: string;
    alt?: string;
    pinUrl?: string;
    // Tip Box
    title?: string;
    style?: 'sage' | 'taupe' | 'gold';
    // Quote
    author?: string;
    // Shoppable Product
    productTitle?: string;
    productPrice?: string;
    productBrand?: string;
    productLink?: string;
    productImage?: string;
    // Before / After
    beforeImage?: string;
    afterImage?: string;
    beforeLabel?: string;
    afterLabel?: string;
    // Gallery
    images?: Array<{ url: string; caption?: string; alt?: string }>;
  };
}

export interface BlogPostSeo {
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  focusKeywords?: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  imageAlt?: string;
  imageCaption?: string;
  categoryId: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  wordCount?: number;
  status: PostStatus;
  scheduledAt?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  savesCount?: number;
  viewsCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  focusKeywords?: string[];
  seo?: BlogPostSeo;
  contentBlocks: ContentBlock[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  accentColor?: string;
  displayOrder: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isEnabled: boolean;
  isExternal?: boolean;
}

export interface HomepageSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  title?: string;
  subtitle?: string;
}

export interface HomepageConfig {
  hero: {
    badge: string;
    title: string;
    highlightWord: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    imageUrl: string;
    imageCaption: string;
  };
  sectionTitles: {
    featuredTitle: string;
    featuredSubtitle: string;
    latestTitle: string;
    latestSubtitle: string;
    categoriesTitle: string;
    categoriesSubtitle: string;
    pinterestTitle: string;
    pinterestSubtitle: string;
    curatedTitle: string;
    curatedSubtitle: string;
  };
  sectionsOrder: HomepageSectionConfig[];
  pinterestBanner: {
    title: string;
    description: string;
    handle: string;
    profileUrl: string;
    followersCount: string;
    boardImages: string[];
  };
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoText: string;
  logoSubtext: string;
  footerAbout: string;
  copyrightNotice: string;
  contactEmail: string;
  contactPhone?: string;
  contactAddress?: string;
  siteUrl?: string;
  socialLinks: {
    pinterest: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    twitter?: string;
  };
  googleAnalyticsId: string;
  googleAdsenseId?: string;
  googleSiteVerification?: string;
  pinterestVerification?: string;
  headerAnnouncement: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkUrl: string;
  };
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: string;
  status: 'active' | 'unsubscribed';
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  alt: string;
  category: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
  type: 'post' | 'category' | 'settings' | 'sync' | 'media' | 'comment' | 'user' | 'system';
}

export interface SyncDiagnosticInfo {
  isConnected: boolean;
  channelName: string;
  lastSyncTimestamp: number;
  totalPosts: number;
  totalCategories: number;
  totalMedia: number;
  totalSubscribers: number;
  totalComments: number;
  storageQuotaUsedKb: number;
}
