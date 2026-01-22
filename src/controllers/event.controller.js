const Event = require("../models/Event");

// ============ ADMIN ROUTES ============

// POST /api/me/events
const createEvent = async (req, res, next) => {
  try {
    const { hotelId, ...eventData } = req.body;

    // Verify that the hotelId belongs to the user
    const Hotel = require("../models/Hotel");
    const hotel = await Hotel.findOne({
      _id: hotelId,
      ownerId: req.user._id,
    });

    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found or access denied" });
    }

    const event = await Event.create({
      ...eventData,
      hotelId: hotel._id,
    });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// GET /api/me/events
const getMyEvents = async (req, res, next) => {
  try {
    // Get all hotels owned by user
    const Hotel = require("../models/Hotel");
    const hotels = await Hotel.find({ ownerId: req.user._id }).select("_id");
    const hotelIds = hotels.map((h) => h._id);

    if (hotelIds.length === 0) {
      return res.json([]);
    }

    // Fetch events belonging to any of user's hotels
    const events = await Event.find({ hotelId: { $in: hotelIds } })
      .populate("hotelId", "name location")
      .sort({ date: -1 })
      .lean();
    
    // Transform MongoDB $date → string
    events.forEach((event) => {
      event.date = new Date(event.date).toISOString().split("T")[0]; // "2026-02-15"
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// PUT /api/me/events/:id
const updateEvent = async (req, res, next) => {
  try {
    const { hotelId, ...updateData } = req.body;
    
    // Verify event ownership
    const Hotel = require("../models/Hotel");
    const hotels = await Hotel.find({ ownerId: req.user._id }).select("_id");
    const hotelIds = hotels.map((h) => h._id);

    const event = await Event.findOne({
      _id: req.params.id,
      hotelId: { $in: hotelIds },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found or access denied" });
    }

    // If hotelId is being updated, verify it belongs to user
    if (hotelId) {
      const newHotel = await Hotel.findOne({
        _id: hotelId,
        ownerId: req.user._id,
      });
      if (!newHotel) {
        return res.status(400).json({ message: "Hotel not found or access denied" });
      }
      updateData.hotelId = newHotel._id;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      updateData,
      { new: true, runValidators: true },
    );

    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/me/events/:id
const deleteEvent = async (req, res, next) => {
  try {
    // Verify event ownership
    const Hotel = require("../models/Hotel");
    const hotels = await Hotel.find({ ownerId: req.user._id }).select("_id");
    const hotelIds = hotels.map((h) => h._id);

    const event = await Event.findOne({
      _id: req.params.id,
      hotelId: { $in: hotelIds },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found or access denied" });
    }

    await Event.findByIdAndDelete(event._id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ============ PUBLIC ROUTES ============

// GET /api/events
const getPublicEvents = async (req, res, next) => {
  try {
    const {
      category,
      city,
      region,
      from,
      to,
      limit = 20,
      page = 1,
    } = req.query;

    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (region) filter["location.region"] = new RegExp(region, "i");

    // Date range filter
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    } else {
      // Default: upcoming events only
      filter.date = { $gte: new Date() };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate("hotelId", "name location websiteUrl bookingUrl imageUrl")
        .sort({ date: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Event.countDocuments(filter),
    ]);

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/:id
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate("hotelId");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  getPublicEvents,
  getEventById,
};
