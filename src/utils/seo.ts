import { BlogPost, Category, SiteSettings } from '../types';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Strips HTML tags and counts words accurately
 */
export function countWordsInText(text?: string | null): number {
  if (!text || typeof text !== 'string') return 0;
  // Strip HTML tags if any
  const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/[#*_~`>[\]()]/g, ' ');
  // Split on whitespace and filter out empty strings / lone punctuation
  const words = cleanText.trim().split(/\s+/).filter(w => w.length > 0 && /[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/.test(w));
  return words.length;
}

/**
 * Calculates total word count for an entire post, including title, excerpt, and all content blocks
 */
export function calculatePostWordCount(post: {
  title?: string;
  excerpt?: string;
  contentBlocks?: any[];
  rawHtml?: string;
}): number {
  if (!post) return 0;

  let total = 0;

  if (post.title) {
    total += countWordsInText(post.title);
  }

  if (post.excerpt) {
    total += countWordsInText(post.excerpt);
  }

  if (post.rawHtml) {
    total += countWordsInText(post.rawHtml);
  }

  if (Array.isArray(post.contentBlocks)) {
    post.contentBlocks.forEach(block => {
      if (!block?.content) return;

      if (block.content.text) {
        total += countWordsInText(block.content.text);
      }
      if (block.content.calloutTitle) {
        total += countWordsInText(block.content.calloutTitle);
      }
      if (block.content.author) {
        total += countWordsInText(block.content.author);
      }
      if (block.content.caption) {
        total += countWordsInText(block.content.caption);
      }
      if (block.content.buttonText) {
        total += countWordsInText(block.content.buttonText);
      }
      if (Array.isArray(block.content.items)) {
        block.content.items.forEach((item: string) => {
          total += countWordsInText(item);
        });
      }
    });
  }

  return Math.max(0, total);
}

export interface ReadingTimeResult {
  minutes: number;
  seconds: number;
  wordCount: number;
  wordsPerMinute: number;
  formattedTime: string;
  formattedBadge: string;
  detailText: string;
}

/**
 * Automated reading time calculator based on word count
 * Standard average adult reading speed: 200 words per minute (WPM)
 */
export function calculateReadingTime(
  source: number | { title?: string; excerpt?: string; contentBlocks?: any[]; rawHtml?: string },
  wordsPerMinute: number = 200
): ReadingTimeResult {
  const wpm = wordsPerMinute > 0 ? wordsPerMinute : 200;
  const wordCount = typeof source === 'number' ? Math.max(0, source) : calculatePostWordCount(source);
  
  const totalSeconds = Math.round((wordCount / wpm) * 60);
  const minutes = Math.max(1, Math.ceil(wordCount / wpm));
  const exactMinutes = Math.floor(totalSeconds / 60);
  const remainderSeconds = totalSeconds % 60;

  const formattedTime = minutes === 1 ? '1 min read' : `${minutes} min read`;
  const formattedBadge = `${formattedTime} • ${wordCount.toLocaleString()} words`;
  const detailText = `Calculated at ~${wpm} words/min (${wordCount.toLocaleString()} words total)`;

  return {
    minutes,
    seconds: totalSeconds,
    wordCount,
    wordsPerMinute: wpm,
    formattedTime,
    formattedBadge,
    detailText,
  };
}

/**
 * Backwards-compatible estimate reading time function
 */
export function estimateReadingTime(blocks: any[], excerpt?: string, title?: string): number {
  const wordCount = calculatePostWordCount({ contentBlocks: blocks, excerpt, title });
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function generateArticleJsonLd(post: BlogPost, settings: SiteSettings, currentUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.seo.seoTitle || post.title,
    'image': [post.seo.ogImage || post.featuredImage],
    'datePublished': post.publishedAt,
    'dateModified': post.updatedAt || post.publishedAt,
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'jobTitle': post.author.role,
      'image': post.author.avatar,
    },
    'publisher': {
      '@type': 'Organization',
      'name': settings.siteName,
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80',
      }
    },
    'description': post.seo.metaDescription || post.excerpt,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': currentUrl || post.seo.canonicalUrl
    },
    'keywords': post.tags.join(', ')
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };
}

export function generateXmlSitemap(posts: BlogPost[], categories: Category[], baseUrl = 'https://thedecordiary.store'): string {
  const publishedPosts = posts.filter(p => p.status === 'published');
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Homepage
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  // Blog Archive
  xml += `  <url>\n    <loc>${baseUrl}/blog</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

  // Categories
  categories.forEach(cat => {
    xml += `  <url>\n    <loc>${baseUrl}/category/${cat.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // Posts
  publishedPosts.forEach(post => {
    const lastMod = post.updatedAt ? post.updatedAt.split('T')[0] : post.publishedAt.split('T')[0];
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    if (post.featuredImage) {
      xml += `    <image:image>\n      <image:loc>${post.featuredImage}</image:loc>\n      <image:title>${escapeXml(post.title)}</image:title>\n    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

export const generateSitemapXml = generateXmlSitemap;

export function generateRobotsTxt(baseUrl = 'https://thedecordiary.store'): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*

Sitemap: ${baseUrl}/sitemap.xml
`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export function getPinterestShareUrl(url: string, media: string, description: string): string {
  const params = new URLSearchParams({
    url,
    media,
    description
  });
  return `https://www.pinterest.com/pin/create/button/?${params.toString()}`;
}

export function getTwitterShareUrl(url: string, text: string): string {
  const params = new URLSearchParams({
    url,
    text
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function getFacebookShareUrl(url: string): string {
  const params = new URLSearchParams({
    u: url
  });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

export function getWhatsAppShareUrl(url: string, text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`;
}
