const signToken = require('./index').signToken,
	config = require('../config');

exports.signinf = (req, res, next) => {
	const username = req.body.username,
		password = req.body.password;

	// Do some validation

	res.send({access_token: 'blah'});
};