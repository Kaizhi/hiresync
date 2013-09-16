var HashIds = require('hashids'),
	hashIds = new HashIds("this is my salt"),
	moment = require('moment'),
	Account = require('./models/account');

exports.generateHashId = function() {
	var max = 100,
		min = 0;
	return hashIds.encrypt( moment().unix() * Math.floor(Math.random() * (max - min + 1) + min) );
}

exports.fetch = function(req, res, username) {
    Account.find({'username': username}, function(err, users) {
        return users;
    });
};
