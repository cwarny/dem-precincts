const router = require('express').Router(),
	controller = require('./controller'),
	toHTTP = require('../../util/to-http');

router.route('/')
	.get(toHTTP(controller.get));

router.route('/:precinct_id')
	.get(toHTTP(controller.getOne));

module.exports = router;