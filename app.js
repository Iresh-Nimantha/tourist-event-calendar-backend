require("dotenv").config();
const express = require("express");
const cors = require("cors");

const errorHandler = require("./src/middleware/error.middleware");

// Route imports
const authRoutes = require("./src/routes/auth.routes");
const hotelRoutes = require("./src/routes/hotel.routes");
const eventRoutes = require("./src/routes/event.routes");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", hotelRoutes);
app.use("/api", eventRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
