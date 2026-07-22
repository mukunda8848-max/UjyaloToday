const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    avatar: { type: String, default: "" },
    savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  },
  { timestamps: true }
);

// Runs automatically before saving: hash the password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // only hash if it changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper: check a typed password against the stored hash
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);