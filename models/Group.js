const mongoose = require("mongoose");

const Group = mongoose.Schema({
    group: { type: String, required: true },
    teams: [
        {
            team: { type: mongoose.Schema.Types.ObjectId, ref: "Teamsecond" },
            MP: { type: Number, default: "0" },
            W: { type: Number, default: "0" },
            D: { type: Number, default: "0" },
            L: { type: Number, default: "0" },
            GF: { type: Number, default: "0" },
            GA: { type: Number, default: "0" },
            plms: { type: Number, default: "0" },
            PTS: { type: Number, default: "0" },
        },
    ],
});

module.exports = mongoose.model("group", Group);
