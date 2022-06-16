const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  teamphoto: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  players: [
    {
      player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      role: { type: String, required: true },
    },
  ],
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Team", teamSchema);
