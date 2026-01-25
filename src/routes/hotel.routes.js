const express = require("express");
const router = express.Router();
const {
  getMyHotels,
  getMyHotelById,
  createMyHotel,
  updateMyHotel,
  deleteMyHotel,
  getHotelById,
  getAllHotelsPublic,
} = require("../controllers/hotel.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

// Admin routes - Multiple hotels per user
router.get("/me/hotels", authenticate, authorize("admin"), getMyHotels);

router.get("/me/hotels/:id", authenticate, authorize("admin"), getMyHotelById);

router.post("/me/hotels", authenticate, authorize("admin"), createMyHotel);

router.put("/me/hotels/:id", authenticate, authorize("admin"), updateMyHotel);

router.delete(
  "/me/hotels/:id",
  authenticate,
  authorize("admin"),
  deleteMyHotel,
);

// GET /api/admin/hotels (all hotels - admin only)
router.get(
  "/admin/hotels",
  authenticate,
  authorize("admin"),
  getAllHotelsPublic,
);

// Public routes
router.get("/hotels", getAllHotelsPublic);
router.get("/hotels/:id", getHotelById);

module.exports = router;
