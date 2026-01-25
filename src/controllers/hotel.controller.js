const Hotel = require("../models/Hotel");

// GET /api/me/hotels - Get all hotels owned by user
const getMyHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ ownerId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(hotels);
  } catch (error) {
    next(error);
  }
};

// GET /api/me/hotel/:id - Get single hotel by ID (must be owned by user)
const getMyHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({
      _id: req.params.id,
      ownerId: req.user._id,
    });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    next(error);
  }
};

// POST /api/me/hotels - Create a new hotel
const createMyHotel = async (req, res, next) => {
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

    const hotel = new Hotel({
      ownerId: req.user._id,
      name,
      description,
      location,
      websiteUrl,
      bookingUrl,
      phone,
      email,
      imageUrl,
    });

    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    next(error);
  }
};

// PUT /api/me/hotels/:id - Update a hotel (must be owned by user)
const updateMyHotel = async (req, res, next) => {
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

    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      {
        name,
        description,
        location,
        websiteUrl,
        bookingUrl,
        phone,
        email,
        imageUrl,
      },
      { new: true, runValidators: true },
    );

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(hotel);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/me/hotels/:id - Delete a hotel (must be owned by user)
const deleteMyHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user._id,
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    next(error);
  }
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
  getMyHotels,
  getMyHotelById,
  createMyHotel,
  updateMyHotel,
  deleteMyHotel,
  getHotelById,
  getAllHotelsPublic,
};
