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

// Public routes
router.get("/hotels/:id", getHotelById);

module.exports = router;
