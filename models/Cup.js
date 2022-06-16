const mongoose = require("mongoose");

const Cup = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  match: [{ type: mongoose.Schema.Types.ObjectId, ref: "Matches" }],
});

module.exports = mongoose.model("cup", Cup);
