require("dotenv").config();
const express = require("express");
const cors = require("cors");

const chatRoutes = require("./src/routes/chat.routes");
const errorHandler = require("./src/middleware/error.middleware");

// Route imports
const authRoutes = require("./src/routes/auth.routes");
const hotelRoutes = require("./src/routes/hotel.routes");
const eventRoutes = require("./src/routes/event.routes");
const eventDetailsRoutes = require("./src/routes/eventDetails.routes");

const app = express();

/* =========================================================
   ✅ CORS CONFIG (Vercel + Render SAFE)
========================================================= */

// Base allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "https://event-haven.vercel.app",
];

// Add origins from environment variable (comma-separated)
// Support both ALLOWED_ORIGINS and FRONTEND_URL for backward compatibility
if (process.env.ALLOWED_ORIGINS) {
  const envOrigins = process.env.ALLOWED_ORIGINS.split(",").map((o) =>
    o.trim(),
  );
  allowedOrigins.push(...envOrigins);
}
if (process.env.FRONTEND_URL) {
  const frontendUrls = process.env.FRONTEND_URL.split(",").map((o) => o.trim());
  frontendUrls.forEach((url) => {
    if (!allowedOrigins.includes(url)) {
      allowedOrigins.push(url);
    }
  });
}

// Allow all Vercel deployments (production and preview)
// Matches: https://*.vercel.app (any subdomain)
const vercelRegex = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;

// In development, be more permissive
const isDevelopment = process.env.NODE_ENV !== "production";

// Helper function to normalize origin (remove trailing slash)
const normalizeOrigin = (origin) => {
  if (!origin) return origin;
  return origin.replace(/\/$/, "");
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);

      // In development, allow all localhost origins
      if (
        isDevelopment &&
        /^http:\/\/localhost(:\d+)?$/.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      // Check against allowed origins (normalized)
      const normalizedAllowed = allowedOrigins.map(normalizeOrigin);
      if (
        normalizedAllowed.includes(normalizedOrigin) ||
        vercelRegex.test(normalizedOrigin)
      ) {
        console.log("✅ Allowed CORS origin:", normalizedOrigin);
        return callback(null, true);
      }

      // Log the blocked origin for debugging
      console.error("❌ Blocked by CORS:", normalizedOrigin);
      console.error("Allowed origins:", normalizedAllowed);
      console.error("Vercel regex test:", vercelRegex.test(normalizedOrigin));
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Handle OPTIONS preflight requests
app.options(
  "*",
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);

      if (
        isDevelopment &&
        /^http:\/\/localhost(:\d+)?$/.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      const normalizedAllowed = allowedOrigins.map(normalizeOrigin);
      if (
        normalizedAllowed.includes(normalizedOrigin) ||
        vercelRegex.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      // Allow preflight for debugging in development
      if (isDevelopment) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  }),
);

/* =========================================================
   ✅ BODY PARSERS
========================================================= */

app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: true }));

/* =========================================================
   ✅ ROUTES
========================================================= */

app.use("/api/auth", authRoutes);
app.use("/api", hotelRoutes);
app.use("/api", eventRoutes);
app.use("/api", eventDetailsRoutes);

// Chat routes
app.use("/chat", chatRoutes);

/* =========================================================
   ✅ HEALTH CHECK
========================================================= */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   ✅ ERROR HANDLER (LAST)
========================================================= */

app.use(errorHandler);

module.exports = app;
