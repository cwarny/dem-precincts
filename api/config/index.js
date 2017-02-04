const _ = require('lodash'),
	fs = require('fs');

let config = {
	dev: 'development',
	test: 'testing',
	prod: 'production',
	port: process.env.PORT || 7000,
	expireTime: 10 * 24 * 60 * 60,
	secrets: {
		jwt: process.env.JWT || 'supersecretkey'
	},
	credentials: {
		key: fs.readFileSync(process.env.HTTPS_KEY_PATH),
		cert: fs.readFileSync(process.env.HTTPS_CERT_PATH)
	}
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;

config.env = process.env.NODE_ENV;

let envConfig = require('./' + config.env);

module.exports = _.merge(config, envConfig);