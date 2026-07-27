const Comment = require("../models/Comment");
const Article = require("../models/Article");

// GET /api/articles/:id/comments  (public) — approved only
exports.getArticleComments = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.id, status: "approved" })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/articles/:id/comments  (logged-in user)
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim())
      return res.status(400).json({ message: "Comment cannot be empty" });

    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const comment = await Comment.create({
      article: article._id,
      user: req.user._id,     // from the token, not the body
      text: text.trim(),
    });

    res.status(201).json({ message: "Comment submitted and awaiting approval", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/comments/:id  (owner OR admin)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = comment.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Not allowed to delete this comment" });

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/comments  (admin) — all, or filter with ?status=pending
exports.getCommentsAdmin = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const comments = await Comment.find(filter)
      .populate("user", "name email")
      .populate("article", "title slug")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/comments/:id/approve  (admin)
exports.approveComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment approved", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};