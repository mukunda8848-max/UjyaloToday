const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    body: { type: String, required: true },
    excerpt: { type: String, default: "" },

    contentType: {
      type: String,
      enum: ["news", "blog", "report"],
      default: "news",
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    featuredImage: { type: String, default: "" },

    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    publishAt: { type: Date, default: null },

    isFeatured: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },

    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// Makes keyword search fast (FR-7)
articleSchema.index({ title: "text", body: "text", excerpt: "text" });

module.exports = mongoose.model("Article", articleSchema);