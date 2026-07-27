const express = require("express");
const router = express.Router();
const { getAds, createAd, updateAd, deleteAd } = require("../controllers/adController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getAds);
router.post("/", protect, adminOnly, createAd);
router.patch("/:id", protect, adminOnly, updateAd);
router.delete("/:id", protect, adminOnly, deleteAd);

module.exports = router;