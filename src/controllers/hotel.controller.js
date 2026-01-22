const Hotel = require("../models/Hotel");

// GET /api/me/hotel
const getMyHotel = async (req, res) => {
  if (!req.hotel) {
    return res.status(404).json({ message: "Hotel profile not created yet" });
  }
  res.json(req.hotel);
};

// GET /api/hotels (public)
const getAllHotelsPublic = async (req, res, next) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    next(error);
  }
};

// PUT /api/me/hotel (create or update)
const upsertMyHotel = async (req, res, next) => {
  try {
    const {
      name,
      description,
      location,
      websiteUrl,
      bookingUrl,
      phone,
      email,
      imageUrl,
    } = req.body;

    const hotelData = {
      ownerId: req.user._id,
      name,
      description,
      location,
      websiteUrl,
      bookingUrl,
      phone,
      email,
      imageUrl,
    };

    const hotel = await Hotel.findOneAndUpdate(
      { ownerId: req.user._id },
      hotelData,
      { new: true, upsert: true, runValidators: true },
    );

    res.json(hotel);
  } catch (error) {
    next(error);
  }
};

// GET /api/hotels/:id (public)
const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyHotel,
  upsertMyHotel,
  getHotelById,
  getAllHotelsPublic,
};
