var HashIds = require('hashids'),
hashIds = new HashIds("this is my salt"),
moment = require('moment');

exports.generateHashId = function() {
	var max = 100,
		min = 0;
	return hashIds.encrypt( moment().unix() * Math.floor(Math.random() * (max - min + 1) + min) );
}
