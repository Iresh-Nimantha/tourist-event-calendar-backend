const hotelSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: String,
  websiteUrl: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Hotel", hotelSchema);
