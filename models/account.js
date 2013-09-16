var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    Questions = require('./questions');

var Account = new Schema({
    username: String,
    questions: [Questions]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);