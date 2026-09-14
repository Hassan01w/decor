# The Decor Diary — WordPress Theme & Sync Guide

A complete, high-performance, aesthetic editorial lifestyle magazine & home decor store WordPress theme. Built with React 19, Tailwind CSS, and full WordPress REST API two-way synchronization.

---

## 🇵🇰 اردو میں انسٹالیشن کا طریقہ (Urdu Installation Steps)

1. **تھیم ڈاؤن لوڈ کریں (Download Theme ZIP):**
   - ایڈمن پینل (`/admin/wordpress` یا Dashboard) سے **"Download WordPress Theme (.zip)"** بٹن پر کلک کریں۔
   - آپ کے پاس `thedecordiary-wordpress-theme.zip` فائل ڈاؤن لوڈ ہو جائے گی۔

2. **ورڈپریس میں اپلوڈ کریں (Upload to WordPress):**
   - اپنے ورڈپریس ایڈمن ڈیش بورڈ میں لاگ ان کریں (`yourdomain.com/wp-admin`)۔
   - بائیں مینو میں **Appearance > Themes** پر جائیں۔
   - اوپر **Add New Theme** پر کلک کریں اور پھر **Upload Theme** منتخب کریں۔
   - ڈاؤن لوڈ کی گئی `.zip` فائل کو منتخب کریں اور **Install Now** پر کلک کریں۔
   - انسٹال ہونے کے بعد **Activate** کر دیں۔

3. **بلاگز سنکنگ (Real-Time Blog Sync):**
   - تھیم کے اندر ریئل ٹائم بلاگ سنکنگ کی سہولت موجود ہے۔
   - ایڈمن پینل یا ہیڈر میں موجود **"Sync Blogs"** بٹن پر کلک کرنے سے تمام بلاگز تمام صارفین کے پاس بیک وقت اپ ڈیٹ ہو جاتے ہیں۔

---

## 🇬🇧 English Installation Instructions

1. **Download the Ready-to-Install ZIP:**
   - From The Decor Diary Admin Dashboard (`/admin/wordpress`), click **"Download Complete WordPress Theme (.zip)"**.
   - A packaged `thedecordiary-wordpress-theme.zip` file will be generated and saved to your device.

2. **Upload & Activate in WordPress:**
   - Log in to your WordPress Dashboard (`wp-admin`).
   - Navigate to **Appearance > Themes > Add New > Upload Theme**.
   - Choose `thedecordiary-wordpress-theme.zip` and click **Install Now**.
   - Click **Activate**.

3. **REST API Endpoints:**
   - Public Stories Feed: `https://yourdomain.com/wp-json/decordiary/v1/posts`
   - Two-Way Sync Endpoint: `https://yourdomain.com/wp-json/decordiary/v1/sync`

---

## ✨ Features Included
- **Zero Layout Distortion:** 100% exact responsive styling, typography, smooth touch carousels, and animations.
- **Cross-Device Multi-User Sync:** Whenever an editor or user publishes a blog, other users across devices see it immediately.
- **SEO & Crawler Fallback:** Fully accessible semantic HTML markup rendered for Google, Bing, and Pinterest bots.
- **Interactive Modals:** Search modal, bookmarks drawer, newsletter subscription, and comment moderation.
