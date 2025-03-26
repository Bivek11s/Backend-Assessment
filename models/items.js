const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  vendor: { type: String, required: true },
});

exports.Item = mongoose.model("Item", itemSchema);
