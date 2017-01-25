const jwt = require('jsonwebtoken'),
	config = require('../config'),
	expressJwt = require('express-jwt'),
	checkToken = expressJwt({secret: config.secrets.jwt, requestProperty: 'auth'}),
	request = require('request'),
	crypto = require('crypto');

exports.decodeToken = () => {
	return (req, res, next) => {
		checkToken(req, res, next); // Calls next if token is valid and send error otherwise. It will attach the decoded token to req[requestedProperty]
	};
};

exports.signToken = username => {
	return jwt.sign(
		{username: username},
		config.secrets.jwt,
		{expiresIn: config.expireTime}
	);
};