// Turns "Local News & Politics!" into "local-news-politics"
module.exports = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // remove punctuation
    .replace(/\s+/g, "-")        // spaces become hyphens
    .replace(/-+/g, "-");        // collapse repeated hyphens