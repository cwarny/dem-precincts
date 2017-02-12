const router = require('express').Router(),
	controller = require('./controller'),
	toHTTP = require('../../util/to-http');

router.route('/')
	.get(toHTTP(controller.get));

module.exports = router;