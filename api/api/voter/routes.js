const router = require('express').Router(),
	controller = require('./controller');

router.route('/')
	.get(controller.get);

router.route('/:voter_id')
	.get(controller.getOne);