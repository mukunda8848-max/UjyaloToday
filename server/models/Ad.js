const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    targetLink: { type: String, default: "" },
    placement: {
      type: String,
      enum: ["header", "sidebar", "in-article", "footer"],
      default: "sidebar",
    },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ad", adSchema);