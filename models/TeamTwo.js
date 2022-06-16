const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true },
  teamphoto: { type: String, required: true },
  description: { type: String, required: true },
  colors: { type: mongoose.Schema.Types.ObjectId, ref: 'Colors' },
  players: [
    {
      name: { type: String, required: true },
      sm_photo: { type: String, required: true },
      lg_photo: { type: String, required: true },
      age: { type: Number, required: true },
      games: { type: Number, required: true },
      goals: { type: Number, required: true },
      biography: { type: String, required: true },
      createAt: { type: Date },
      role: { type: String, required: true },
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Teamsecond", teamSchema);
