const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // Removed unique constraint to allow multiple hotels per user
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      city: { type: String, required: true },
      region: { type: String, required: true },
      address: { type: String },
    },
    websiteUrl: {
      type: String,
    },
    bookingUrl: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

// Create non-unique index on ownerId for query performance (allows multiple hotels per user)
hotelSchema.index({ ownerId: 1 }, { unique: false });

module.exports = mongoose.model("Hotel", hotelSchema);
