const Article = require("../models/Article");
const slugify = require("../utils/slugify");

// Only articles the public should see: published, and past their publish time
const publicFilter = () => ({
  status: "published",
  $or: [{ publishAt: null }, { publishAt: { $lte: new Date() } }],
});

// GET /api/articles  (public) — supports ?category=&type=&search=&page=&limit=
exports.getArticles = async (req, res) => {
  try {
    const { category, type, search, page = 1, limit = 10 } = req.query;
    const filter = publicFilter();

    if (category) filter.category = category;
    if (type) filter.contentType = type;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate("category", "name slug")
        .populate("author", "name")
        .sort({ isPinned: -1, createdAt: -1 })   // pinned first (FR-27)
        .skip(skip)
        .limit(Number(limit)),
      Article.countDocuments(filter),
    ]);

    res.json({
      articles,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/articles/featured  (public) — homepage slider (FR-1)
exports.getFeatured = async (req, res) => {
  try {
    const articles = await Article.find({ ...publicFilter(), isFeatured: true })
      .populate("category", "name slug")
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/articles/:slug  (public)
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      ...publicFilter(),
    })
      .populate("category", "name slug")
      .populate("author", "name avatar");

    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/articles  (admin) — includes drafts and scheduled
exports.getAllArticlesAdmin = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("category", "name")
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/articles  (admin)
exports.createArticle = async (req, res) => {
  try {
    const { title, body, category } = req.body;
    if (!title || !body || !category)
      return res.status(400).json({ message: "Title, body and category are required" });

    // Ensure the slug is unique, even if two articles share a title
    let slug = slugify(title);
    if (await Article.findOne({ slug })) slug = `${slug}-${Date.now()}`;

    const article = await Article.create({
      ...req.body,
      slug,
      author: req.user._id,   // taken from the token, never trusted from the body
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/articles/:id  (admin)
exports.updateArticle = async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.author;   // don't let the author be reassigned

    if (update.title) {
      let slug = slugify(update.title);
      const clash = await Article.findOne({ slug, _id: { $ne: req.params.id } });
      update.slug = clash ? `${slug}-${Date.now()}` : slug;
    }

    const article = await Article.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/articles/:id  (admin)
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};