const Media = require("../models/Media");

// GET /api/media  (public) — filter with ?type=photo or ?type=video
exports.getMedia = async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const media = await Media.find(filter).sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/media  (admin)
exports.createMedia = async (req, res) => {
  try {
    const { type, url } = req.body;
    if (!type || !url)
      return res.status(400).json({ message: "type and url are required" });

    const media = await Media.create({ ...req.body, uploadedBy: req.user._id });
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/media/:id  (admin)
exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.json({ message: "Media deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};