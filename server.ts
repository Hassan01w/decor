import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { INITIAL_POSTS, INITIAL_CATEGORIES, INITIAL_SITE_SETTINGS } from "./src/services/initialData";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Persistent storage file location
const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to safely read JSON file
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

// Helper to safely write JSON file
function writeJsonFile<T>(filePath: string, data: T): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Initialize server files with default data if not already existing
if (!fs.existsSync(POSTS_FILE)) {
  writeJsonFile(POSTS_FILE, INITIAL_POSTS);
}
if (!fs.existsSync(CATEGORIES_FILE)) {
  writeJsonFile(CATEGORIES_FILE, INITIAL_CATEGORIES);
}
if (!fs.existsSync(SETTINGS_FILE)) {
  writeJsonFile(SETTINGS_FILE, INITIAL_SITE_SETTINGS);
}

// In-memory cache with disk sync for maximum speed
let serverPosts = readJsonFile(POSTS_FILE, INITIAL_POSTS);
let serverCategories = readJsonFile(CATEGORIES_FILE, INITIAL_CATEGORIES);
let serverSettings = readJsonFile(SETTINGS_FILE, INITIAL_SITE_SETTINGS);
let lastUpdated = Date.now();

// ==========================================
// API ROUTES (Always before Vite middleware)
// ==========================================

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    server: "The Decor Diary Sync Server",
    postsCount: serverPosts.length,
    lastUpdated,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/posts - Fetch all posts (cross-user real-time sync)
app.get("/api/posts", (req, res) => {
  res.json({
    success: true,
    count: serverPosts.length,
    lastUpdated,
    posts: serverPosts,
  });
});

// POST /api/posts - Save or update a post
app.post("/api/posts", (req, res) => {
  try {
    const post = req.body?.post || req.body;
    if (!post || !post.id) {
      return res.status(400).json({ success: false, error: "Valid post with id required" });
    }

    const index = serverPosts.findIndex((p: any) => p.id === post.id);
    if (index >= 0) {
      // Update existing post
      serverPosts[index] = {
        ...serverPosts[index],
        ...post,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Create new post at the beginning of the list
      serverPosts.unshift({
        ...post,
        createdAt: post.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    lastUpdated = Date.now();
    writeJsonFile(POSTS_FILE, serverPosts);

    res.json({
      success: true,
      post: index >= 0 ? serverPosts[index] : serverPosts[0],
      count: serverPosts.length,
      lastUpdated,
    });
  } catch (err: any) {
    console.error("Error saving post on server:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to save post" });
  }
});

// DELETE /api/posts/:id - Delete a post
app.delete("/api/posts/:id", (req, res) => {
  try {
    const { id } = req.params;
    const initialLen = serverPosts.length;
    serverPosts = serverPosts.filter((p: any) => p.id !== id);

    if (serverPosts.length !== initialLen) {
      lastUpdated = Date.now();
      writeJsonFile(POSTS_FILE, serverPosts);
    }

    res.json({
      success: true,
      deletedId: id,
      count: serverPosts.length,
      lastUpdated,
    });
  } catch (err: any) {
    console.error("Error deleting post on server:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to delete post" });
  }
});

// GET /api/sync - Full sync bundle for instant multi-user synchronization
app.get("/api/sync", (req, res) => {
  res.json({
    success: true,
    lastUpdated,
    posts: serverPosts,
    categories: serverCategories,
    settings: serverSettings,
  });
});

// POST /api/sync - Two-way sync (merge client posts into server and return full synced list)
app.post("/api/sync", (req, res) => {
  try {
    const { clientPosts, mode } = req.body;

    if (Array.isArray(clientPosts) && clientPosts.length > 0) {
      if (mode === "replace") {
        serverPosts = clientPosts;
      } else {
        // Merge mode: add any client posts that don't exist on the server
        const serverIds = new Set(serverPosts.map((p: any) => p.id));
        clientPosts.forEach((post: any) => {
          if (post && post.id && !serverIds.has(post.id)) {
            serverPosts.push(post);
            serverIds.add(post.id);
          }
        });
      }
      lastUpdated = Date.now();
      writeJsonFile(POSTS_FILE, serverPosts);
    }

    res.json({
      success: true,
      lastUpdated,
      posts: serverPosts,
      categories: serverCategories,
      settings: serverSettings,
    });
  } catch (err: any) {
    console.error("Error performing sync on server:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to sync" });
  }
});

// GET /api/wordpress/info - WordPress Theme Export metadata
app.get("/api/wordpress/info", (req, res) => {
  res.json({
    themeName: "The Decor Diary",
    themeSlug: "thedecordiary",
    version: "1.0.0",
    author: "The Decor Diary Editorial Studio",
    compatibleWpVersion: "5.8 - 6.7+",
    restApiEndpoint: "/wp-json/decordiary/v1/posts",
    description: "Complete embedded React WordPress Theme for The Decor Diary with live cross-device sync.",
  });
});

// ==========================================
// Vite Middleware / Static Files Serving
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Decor Diary server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
