const express = require("express");
const router = express.Router();
const {
  getArticles, getFeatured, getArticleBySlug,
  createArticle, updateArticle, deleteArticle,
} = require("../controllers/articleController");
const { getArticleComments, addComment } = require("../controllers/commentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// --- Article routes ---
router.get("/featured", getFeatured);        // must come BEFORE /:slug
router.get("/", getArticles);
router.get("/:slug", getArticleBySlug);

router.post("/", protect, adminOnly, createArticle);
router.patch("/:id", protect, adminOnly, updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);

// --- Nested comment routes (a comment belongs to an article) ---
router.get("/:id/comments", getArticleComments);      // public — approved comments
router.post("/:id/comments", protect, addComment);    // logged-in user

module.exports = router;