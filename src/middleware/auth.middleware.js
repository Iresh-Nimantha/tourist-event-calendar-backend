const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Hotel = require("../models/Hotel");

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Check if user is admin
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// Attach hotel to request (for admin routes)
const attachHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ ownerId: req.user._id });
    req.hotel = hotel; // can be null if not created yet
    next();
  } catch (error) {
    next(error);
  }
};

// Verify event ownership
const verifyEventOwnership = async (req, res, next) => {
  try {
    if (!req.hotel) {
      return res.status(400).json({ message: "Create a hotel profile first" });
    }

    const Event = require("../models/Event");
    const event = await Event.findOne({
      _id: req.params.id,
      hotelId: req.hotel._id,
    });

    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found or access denied" });
    }

    req.event = event;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
  authorize,
  attachHotel,
  verifyEventOwnership,
};
