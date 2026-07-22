const Category = require("../models/Category");
const slugify = require("../utils/slugify");

// GET /api/categories  (public)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/categories  (admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const category = await Category.create({
      name,
      slug: slugify(name),
      description: description || "",
    });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "That category already exists" });
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/categories/:id  (admin)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const update = {};
    if (name) { update.name = name; update.slug = slugify(name); }
    if (description !== undefined) update.description = description;

    const category = await Category.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/categories/:id  (admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};