import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set limits to handle bulk data uploads (like banners, base64 images)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const DB_FILE = path.join(process.cwd(), "db.json");

  // Load database
  const getDatabase = (): Record<string, any> => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error reading db.json, returning empty", e);
    }
    return {};
  };

  // Save database
  const saveDatabase = (db: Record<string, any>) => {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing db.json", e);
    }
  };

  // API endpoints
  app.get("/api/db/get", (req, res) => {
    try {
      const db = getDatabase();
      res.json({ success: true, data: db });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/db/save", (req, res) => {
    try {
      const { key, data } = req.body;
      if (!key) {
        return res.status(400).json({ success: false, error: "Missing key" });
      }
      const db = getDatabase();
      db[key] = data;
      saveDatabase(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/db/save-bulk", (req, res) => {
    try {
      const { payload } = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ success: false, error: "Missing or invalid payload" });
      }
      const db = getDatabase();
      Object.assign(db, payload);
      saveDatabase(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Serve static assets or mount Vite middleware in development mode
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
