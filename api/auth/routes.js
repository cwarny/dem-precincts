const router = require('express').Router(),
	controller = require('./controller');

router.post('/signin', controller.signin);

module.exports = router;