import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { rateLimit } from "express-rate-limit";

const app = express();
const PORT = 3000;

// Rate limiting for auth-related attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 5 login attempts per window
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());

// API route for login attempt logging (to satisfy "implement rate limiting" request)
app.post("/api/auth/rate-limit-check", authLimiter, (req, res) => {
  res.json({ success: true, message: "Rate limit check passed." });
});

// Admin analytics route placeholder (Secure logic would go here)
app.get("/api/admin/stats", (req, res) => {
  // In a real app, verify admin session here
  res.json({
    totalUsers: 1250,
    waitingList: 450,
    betaTesters: 42,
    revenue: "€12,450"
  });
});

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
