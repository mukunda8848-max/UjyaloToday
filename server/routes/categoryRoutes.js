const express = require("express");
const router = express.Router();
const {
  getCategories, createCategory, updateCategory, deleteCategory,
} = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getCategories);                                  // public
router.post("/", protect, adminOnly, createCategory);            // admin
router.patch("/:id", protect, adminOnly, updateCategory);        // admin
router.delete("/:id", protect, adminOnly, deleteCategory);       // admin

module.exports = router;