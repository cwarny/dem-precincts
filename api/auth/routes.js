const router = require('express').Router(),
	controller = require('./controller'),
	toHTTP = require('../util/to-http');

router.post('/signin', toHTTP(controller.signin));

module.exports = router; 