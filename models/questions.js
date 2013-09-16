var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Questions = new Schema({
    title: String,
    user: String,
    content: String
});

module.exports = mongoose.model('Questions', Questions);