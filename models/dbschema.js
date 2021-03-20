const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  stock: {
    type: String,
    require: true,
    uppercase: true
  },
  price: Number
});

const stock = mongoose.model("Stock", stockSchema);

module.exports = stock;