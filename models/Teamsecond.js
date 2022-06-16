const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true },
  players: [
    {
      name: { type: String, required: true },
      photo: { type: String, required: true },
      age: { type: Number, required: true },
      games: { type: Number, required: true },
      goals: { type: Number, required: true },
      biography: { type: String, required: true },
      createAt: {
        type: Date,
        default: Date.now,
      },
      role: { type: String, required: true },
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Teams", teamSchema);