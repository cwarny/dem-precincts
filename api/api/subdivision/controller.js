const es = require('../../util/es');

exports get = (req, res, next) => {
	var filter = req.query.filter;

	es.search({
		index: 'fellow',
		type: 'subdivision',
		body: {
			query: {
				bool: {
					must: {
						match_all: {}
					}
				}
			}
		}
	}, (err, resp) => {
		if (err) {
			next(err);
		} else {
			res.send(resp);
		}
	});
};