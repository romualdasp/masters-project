const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    _owner: mongoose.Schema.Types.ObjectId,
    title: String,
    url: String,
    interactivity: [{ timestamp: Number, type: String, question: String, answers: [String] }]
}, { typeKey: '$type' });

module.exports = mongoose.model('Video', videoSchema);
