const express = require("express");
const router = express.Router();
const {
  getMyHotel,
  upsertMyHotel,
  getHotelById,
} = require("../controllers/hotel.controller");
const {
  authenticate,
  authorize,
  attachHotel,
} = require("../middleware/auth.middleware");
const Hotel = require("../models/Hotel"); // ← ADD THIS

// Admin routes
router.get(
  "/me/hotel",
  authenticate,
  authorize("admin"),
  attachHotel,
  getMyHotel,
);
router.put(
  "/me/hotel",
  authenticate,
  authorize("admin"),
  attachHotel,
  upsertMyHotel,
);

// GET /api/admin/hotels (all hotels - admin only)
router.get(
  "/admin/hotels",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    // ← Add 'next'
    try {
      const hotels = await Hotel.find() // ← Hotel (capital H)
        .populate("ownerId", "name email")
        .sort({ createdAt: -1 });
      res.json(hotels);
    } catch (error) {
      next(error); // ← Error handling
    }
  },
);

// Public routes
router.get("/hotels/:id", getHotelById);

module.exports = router;
