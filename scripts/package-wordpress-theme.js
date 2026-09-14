import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function packageWordPressTheme() {
  const rootDir = process.cwd();
  const themeDir = path.join(rootDir, 'wordpress-theme', 'thedecordiary');
  const themeAssetsDir = path.join(themeDir, 'assets');
  const distAssetsDir = path.join(rootDir, 'dist', 'assets');
  const rootAssetsDir = path.join(rootDir, 'assets');

  console.log('[WP Theme Packager] Packaging The Decor Diary WordPress Theme...');

  // 1. Ensure target assets directories exist
  if (!fs.existsSync(themeAssetsDir)) {
    fs.mkdirSync(themeAssetsDir, { recursive: true });
  }
  if (!fs.existsSync(rootAssetsDir)) {
    fs.mkdirSync(rootAssetsDir, { recursive: true });
  }

  // 2. Copy compiled assets from dist/assets into theme assets
  if (fs.existsSync(distAssetsDir)) {
    const assetFiles = fs.readdirSync(distAssetsDir);
    let copiedCount = 0;
    for (const file of assetFiles) {
      const srcFile = path.join(distAssetsDir, file);
      const stat = fs.statSync(srcFile);
      if (stat.isFile()) {
        fs.copyFileSync(srcFile, path.join(themeAssetsDir, file));
        fs.copyFileSync(srcFile, path.join(rootAssetsDir, file));
        copiedCount++;
      }
    }
    console.log(`[WP Theme Packager] Synced ${copiedCount} compiled React assets into theme.`);
  }

  // 3. Create zip archive containing the WordPress theme
  const zip = new JSZip();
  const themeFolderName = 'thedecordiary';
  const folder = zip.folder(themeFolderName);

  function addDirectoryToZip(dirPath, zipFolder) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      // Ignore git and temp files
      if (item.startsWith('.') || item === 'node_modules') continue;

      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(item);
        addDirectoryToZip(fullPath, subFolder);
      } else {
        const fileContent = fs.readFileSync(fullPath);
        zipFolder.file(item, fileContent);
      }
    }
  }

  addDirectoryToZip(themeDir, folder);

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const sizeKb = (zipBuffer.length / 1024).toFixed(1);

  // Write to public/ so it can be directly downloaded via web url
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicZipPath = path.join(publicDir, 'thedecordiary-wordpress-theme.zip');
  fs.writeFileSync(publicZipPath, zipBuffer);

  // Write to dist/ if dist exists
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'thedecordiary-wordpress-theme.zip'), zipBuffer);
  }

  // Write to root
  fs.writeFileSync(path.join(rootDir, 'thedecordiary-wordpress-theme.zip'), zipBuffer);

  console.log(`[WP Theme Packager] ✅ Created thedecordiary-wordpress-theme.zip (${sizeKb} KB)`);
  console.log(`[WP Theme Packager] Ready for WordPress upload at: Appearance > Themes > Add New > Upload Theme`);
}

packageWordPressTheme().catch(err => {
  console.error('[WP Theme Packager] Failed to package theme:', err);
  process.exit(1);
});
