require("dotenv").config();
const express = require("express");
const cors = require("cors");

const errorHandler = require("./src/middleware/error.middleware");

// Route imports
const authRoutes = require("./src/routes/auth.routes");
const hotelRoutes = require("./src/routes/hotel.routes");
const eventRoutes = require("./src/routes/event.routes");

const app = express();

// ✅ CORS FIRST - handles OPTIONS preflight
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// BODY PARSERS - BEFORE ROUTES!
app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
// Handle all OPTIONS preflight requests
app.options("*", cors());

// ✅ Body parser
app.use(express.json());

// ✅ Routes (after CORS)
app.use("/api/auth", authRoutes);
app.use("/api", hotelRoutes);
app.use("/api", eventRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ✅ Error handler (last)
app.use(errorHandler);

module.exports = app;
