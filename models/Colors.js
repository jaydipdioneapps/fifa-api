const mongoose = require("mongoose");

const colorsSchema = mongoose.Schema({
    country_name: { type: String, required: true },
    logocolor: { type: String, required: true },
    Excolor: { type: String, required: true },
    Bgcolor: { type: String, required: true },
    Bgtopcolor: { type: String, required: true },
    Rlightcolor: { type: String, required: true },
    Rdarkcolor: { type: String, required: true },
    shadow: { type: String, required: true },
    shadow20: { type: String, required: true },
    fontcolor: { type: String, required: true },
});

module.exports = mongoose.model("Colors", colorsSchema);
