const es = require('../../util/es');

exports.get = (options) => {
	let filters = [];
	
	let requestBody = {
		query: {
			bool: {
				must: {
					match_all: {}
				}
			}
		}
	};

	if (filters.length) requestBody.query.bool.filter = filters;

	return es.search({
		index: 'fellow',
		type: 'subdivision',
		body: requestBody
	}).then(resp => {
		return {
			meta: {
				total: resp.hits.total
			},
			data: resp.hits.hits.map(d => ({
				id: d._id,
				type: 'subdivisions',
				attributes: d._source
			}))
		};
	});
};