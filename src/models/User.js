const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true },
    name: String,
    email: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
