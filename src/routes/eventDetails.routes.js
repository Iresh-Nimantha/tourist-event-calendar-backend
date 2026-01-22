const express = require("express");
const Event = require("../models/Event.js");
const Hotel = require("../models/Hotel.js");

const router = express.Router();

// GET /api/event-details/:eventId
router.get("/event-details/:eventId", async (req, res) => {
  const { eventId } = req.params;

  try {
    // Find the event by ID
    const event = await Event.findById(eventId).lean();
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find the hotel related to this event
    const hotel = await Hotel.findById(event.hotelId).lean();
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Return both
    res.json({ event, hotel });
  } catch (error) {
    console.error("Fetch event + hotel error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
