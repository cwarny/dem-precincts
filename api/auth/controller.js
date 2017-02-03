const signToken = require('./index').signToken,
	config = require('../config');

exports.signin = options => {
	const username = options.body.username,
		password = options.body.password;

	// Do some validation
	
	return { access_token: 'blah' };
};