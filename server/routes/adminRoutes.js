const express = require("express");
const router = express.Router();
const { getAllArticlesAdmin } = require("../controllers/articleController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/articles", protect, adminOnly, getAllArticlesAdmin);

module.exports = router;