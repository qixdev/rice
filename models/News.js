const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    name_en: { type: String, required: true },
    name_ru: { type: String, required: true },
    desc_en: { type: String, required: true },
    desc_ru: { type: String, required: true },
    images: { type: [String], required: true }, // need only 3.
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

module.exports = mongoose.model("News", newsSchema);
