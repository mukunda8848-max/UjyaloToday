const express = require("express");
const router = express.Router();
const { getAllArticlesAdmin } = require("../controllers/articleController");
const { getCommentsAdmin } = require("../controllers/commentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/articles", protect, adminOnly, getAllArticlesAdmin);
router.get("/comments", protect, adminOnly, getCommentsAdmin);   // ?status=pending

module.exports = router;