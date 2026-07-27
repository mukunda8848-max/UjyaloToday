const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Connect to the database
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/articles", require("./routes/articleRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/media", require("./routes/mediaRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "Ujyaalo Today API is running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));