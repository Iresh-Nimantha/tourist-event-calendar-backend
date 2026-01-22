const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one hotel per admin
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

module.exports = mongoose.model("Hotel", hotelSchema);
