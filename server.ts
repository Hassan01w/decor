import express from "express";
import path from "path";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const distPath = __dirname;

app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
