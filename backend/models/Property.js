const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["pg","flat","house","villa","commercial"], required: true },
  location: {
    city: { type: String, index: true },
    state: String,
    address: String
  },
  price: { type: Number, required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Property", propertySchema);
