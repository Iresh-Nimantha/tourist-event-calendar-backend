const express = require("express");
const router = express.Router();
const {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  getPublicEvents,
  getEventById,
} = require("../controllers/event.controller");
const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

// Public routes (no auth required)
router.get("/events", getPublicEvents);
router.get("/events/:id", getEventById);

// Admin routes
router.post(
  "/me/events",
  authenticate,
  authorize("admin"),
  createEvent,
);
router.get(
  "/me/events",
  authenticate,
  authorize("admin"),
  getMyEvents,
);
router.put(
  "/me/events/:id",
  authenticate,
  authorize("admin"),
  updateEvent,
);
router.delete(
  "/me/events/:id",
  authenticate,
  authorize("admin"),
  deleteEvent,
);

module.exports = router;
