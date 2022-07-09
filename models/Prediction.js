const mongoose = require("mongoose");

const Prediction = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  predictiont1: {
    type: Number,
  },
  predictiont2: {
    type: Number,
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "match",
    required: true,
  },
  score: {
    type: Number,
    default: "0"
  },
  createAt: {
    type: Date,
    required : true 
  },
});
//3:2
//2:3
module.exports = mongoose.model("Prediction", Prediction);
