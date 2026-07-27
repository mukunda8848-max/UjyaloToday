const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["photo", "video"], required: true },
    url: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    title: { type: String, default: "" },
    caption: { type: String, default: "" },
    videoSource: { type: String, enum: ["upload", "embed"], default: "upload" },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);