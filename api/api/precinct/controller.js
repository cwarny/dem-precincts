const es = require('../../util/es'),
	Promise = require('bluebird')
	_ = require('lodash');

exports.get = (options) => {
	return Promise.all([
		es.search({
			index: 'fellow',
			type: 'precinct',
			body: {
				size: 250,
				query: {
					bool: {
						must: {
							match_all: {}
						}
					}
				}
			}
		}),
		require('../voter/controller')
			.get()
	]).then(results => {
		let arr1 = results[0].hits.hits.map(d => ({
			id: d._id,
			type: 'precincts',
			attributes: d._source
		}));

		let arr2 = results[1].meta.aggregations.map(d => ({
			id: d.id,
			attributes: d
		}));

		return {
			meta: {
				total: results[0].hits.total
			},
			data: _(arr1).concat(arr2)
				.groupBy('id')
				.map(_.spread(_.merge))
				.value()
		};
	});
};