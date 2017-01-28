const router = require('express').Router();

router.use('/voters', require('./voter/routes'));
router.use('/subdivisions', require('./subdivision/routes'));
router.use('/precincts', require('./precinct/routes'));

module.exports = router;