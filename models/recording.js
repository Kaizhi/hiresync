var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Recording = new Schema({
    title: String,
    user: String,
    events: Array,
    startTime: Number,
    language: String
});

module.exports = mongoose.model('Recording', Recording);