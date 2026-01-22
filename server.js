const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// app.use("/api/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
