const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: Date,
    time: String,
    category: String,
    location: String,
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);
