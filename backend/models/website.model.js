const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  isActive: {
    type: Boolean,
  },
});

const websiteModel = mongoose.model("website", websiteSchema);

module.exports = websiteModel;
