const express = require("express");
const router = express.Router();
const {
  getArticles, getFeatured, getArticleBySlug,
  createArticle, updateArticle, deleteArticle,
} = require("../controllers/articleController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/featured", getFeatured);        // must come BEFORE /:slug
router.get("/", getArticles);
router.get("/:slug", getArticleBySlug);

router.post("/", protect, adminOnly, createArticle);
router.patch("/:id", protect, adminOnly, updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);

module.exports = router;