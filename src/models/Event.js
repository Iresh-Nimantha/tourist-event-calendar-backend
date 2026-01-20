const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // "18:00"
      required: true,
    },
    endTime: {
      type: String,
    },
    location: {
      venue: { type: String },
      city: { type: String, required: true },
      region: { type: String, required: true },
    },
    category: {
      type: String,
      enum: [
        "cultural",
        "festival",
        "nightlife",
        "adventure",
        "food",
        "wellness",
        "music",
        "other",
      ],
      required: true,
    },
    imageUrl: {
      type: String,
    },
    price: {
      type: Number,
      default: 0, // 0 = free
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Index for efficient public queries
eventSchema.index({ date: 1, category: 1, "location.city": 1 });

module.exports = mongoose.model("Event", eventSchema);
