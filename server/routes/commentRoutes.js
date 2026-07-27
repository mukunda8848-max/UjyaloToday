const express = require("express");
const router = express.Router();
const { deleteComment, approveComment } = require("../controllers/commentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.delete("/:id", protect, deleteComment);                  // owner or admin
router.patch("/:id/approve", protect, adminOnly, approveComment); // admin

module.exports = router;