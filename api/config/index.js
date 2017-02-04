const _ = require('lodash');

let config = {
	dev: 'development',
	test: 'testing',
	prod: 'production',
	port: process.env.PORT || 7000,
	expireTime: 10 * 24 * 60 * 60,
	secrets: {
		jwt: process.env.JWT || 'supersecretkey'
	}
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;

config.env = process.env.NODE_ENV;

let envConfig = require('./' + config.env);

module.exports = _.merge(config, envConfig);