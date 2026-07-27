const Ad = require("../models/Ad");

// GET /api/ads  (public) — active ads, filter with ?placement=sidebar
exports.getAds = async (req, res) => {
  try {
    const now = new Date();
    const filter = {
      isActive: true,
      $or: [{ startDate: null }, { startDate: { $lte: now } }],
      $and: [{ $or: [{ endDate: null }, { endDate: { $gte: now } }] }],
    };
    if (req.query.placement) filter.placement = req.query.placement;

    const ads = await Ad.find(filter).sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/ads  (admin)
exports.createAd = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title || !imageUrl)
      return res.status(400).json({ message: "title and imageUrl are required" });

    const ad = await Ad.create(req.body);
    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/ads/:id  (admin)
exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/ads/:id  (admin)
exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.json({ message: "Ad deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};