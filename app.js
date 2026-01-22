require("dotenv").config();
const express = require("express");
const cors = require("cors");
const chatRoutes = require("./src/routes/chat.routes");

const errorHandler = require("./src/middleware/error.middleware");

// Route imports
const authRoutes = require("./src/routes/auth.routes");
const hotelRoutes = require("./src/routes/hotel.routes");
const eventRoutes = require("./src/routes/event.routes");

// ✅ NEW: Import the eventDetails route
const eventDetailsRoutes = require("./src/routes/eventDetails.routes");

const app = express();

// ✅ CORS FIRST - handles OPTIONS preflight
// Support multiple origins for different environments
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(",").map(url => url.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

// ✅ NEW: Add combined event + hotel details route
app.use("/api", eventDetailsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

//chat
app.use("/chat", chatRoutes);

// ✅ Error handler (last)
app.use(errorHandler);

module.exports = app;
