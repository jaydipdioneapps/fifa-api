const mongoose = require('mongoose');

const rulesSchema = mongoose.Schema({
    name: { type: String, required: true },
    rule: [{ type: String, required: true }],
});

module.exports = mongoose.model('Rules', rulesSchema);