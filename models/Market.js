const mongoose = require("mongoose");
const { Schema } = mongoose;

const MarketSchema = new Schema({
  symbol: {
    type: String,
    required: [true, "A market symbol must be provided."],
    trim: true,
    unique: true,
    index: true
  }
});

module.exports = mongoose.model("Market", MarketSchema);
