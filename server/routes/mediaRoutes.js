const express = require("express");
const router = express.Router();
const { getMedia, createMedia, deleteMedia } = require("../controllers/mediaController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getMedia);
router.post("/", protect, adminOnly, createMedia);
router.delete("/:id", protect, adminOnly, deleteMedia);

module.exports = router;