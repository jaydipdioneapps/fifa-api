const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    team1: { type: mongoose.Schema.Types.ObjectId, ref: 'Teamsecond' },
    team2: { type: mongoose.Schema.Types.ObjectId, ref: 'Teamsecond' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    matchType: { type: String, required: true },
    group: { type: String, required: true },
    prediction: {
        team1: { type: Number, default: "0" },
        team2: { type: Number, default: "0" },
    }
});

module.exports = mongoose.model('Matches', matchSchema);