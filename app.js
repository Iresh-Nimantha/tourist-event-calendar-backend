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

const allowedOrigins = [
  "http://localhost:5173",
  "https://event-haven.vercel.app",
];

// Allow all Vercel preview deployments
const vercelRegex = /^https:\/\/.*\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || vercelRegex.test(origin)) {
        return callback(null, true);
      }

      console.error("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Handle OPTIONS preflight requests
app.options(
  "*",
  cors({
    origin: true,
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
