const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  name: { type: String, required: true },
  sm_photo: { type: String, required: true },
  lg_photo: { type: String, required: true },
  age: { type: Number, required: true },
  games: { type: Number, required: true },
  goals: { type: Number, required: true },
  biography: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  //   createid:{type: mongoose.Scheme.Types.ObjectId,ref:"Admin"},
});

module.exports = mongoose.model('Player', playerSchema);