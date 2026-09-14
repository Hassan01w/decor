import fs from 'fs';
import path from 'path';
import { INITIAL_POSTS, INITIAL_CATEGORIES } from '../src/services/initialData';

const BASE_URL = 'https://thedecordiary.store';

function generateSitemap() {
  console.log('Generating SEO XML sitemap...');

  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' },
    { url: '/about', changefreq: 'monthly', priority: '0.6' },
    { url: '/contact', changefreq: 'monthly', priority: '0.5' },
    { url: '/privacy', changefreq: 'yearly', priority: '0.3' },
    { url: '/terms', changefreq: 'yearly', priority: '0.3' },
    { url: '/disclaimer', changefreq: 'yearly', priority: '0.3' },
  ];

  // Try loading from localStorage backup file if exists, or fallback to INITIAL_POSTS & INITIAL_CATEGORIES
  let posts = INITIAL_POSTS;
  let categories = INITIAL_CATEGORIES;

  try {
    const storageFilePath = path.join(process.cwd(), '.decordiary_storage.json');
    if (fs.existsSync(storageFilePath)) {
      const data = JSON.parse(fs.readFileSync(storageFilePath, 'utf8'));
      if (Array.isArray(data.posts)) posts = data.posts;
      if (Array.isArray(data.categories)) categories = data.categories;
    }
  } catch (err) {
    console.warn('Could not read local storage backup, using initial dataset for sitemap.');
  }

  const publishedPosts = posts.filter(p => p.status === 'published');

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static pages
  for (const page of staticPages) {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  // Add categories
  for (const cat of categories) {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/category/${cat.slug}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += '  </url>\n';
  }

  // Add blog posts
  for (const post of publishedPosts) {
    const lastMod = post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>';

  // Ensure public/ directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xml, 'utf8');
  console.log(`Successfully generated sitemap at ${publicSitemapPath} with ${staticPages.length} static pages, ${categories.length} categories, and ${publishedPosts.length} posts.`);

  // Also write to dist/ if dist/ exists
  const distDir = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distSitemapPath, xml, 'utf8');
    console.log(`Also copied sitemap to ${distSitemapPath}`);

    const pubAds = path.join(publicDir, 'ads.txt');
    const distAds = path.join(distDir, 'ads.txt');
    if (fs.existsSync(pubAds)) {
      fs.copyFileSync(pubAds, distAds);
      console.log(`Copied ads.txt to ${distAds}`);
    }
  }
}

generateSitemap();
