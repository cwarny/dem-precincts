const es = require('../../util/es'),
	Promise = require('bluebird')
	_ = require('lodash');

exports.get = (options) => {
	return es.search({
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
	}).then(resp => {
		return {
			meta: {
				total: resp.hits.total
			},
			data: resp.hits.hits.map(d => ({
				id: d._id,
				type: 'precincts',
				attributes: d._source
			}))
		};
	});
};

exports.getOne = (options) => {
	let precinctId = options.params.precinct_id;
	return Promise.all([
		es.get({
			index: 'fellow',
			type: 'precinct',
			id: precinctId
		}),
		require('../voter/controller')
			.get({
				query: {
					filter: {
						precinct_id: precinctId
					}
				}
			})
	]).then(results => {
		return {
			data: {
				id: results[0]._id,
				type: 'precincts',
				attributes: _.merge(results[0]._source, results[1].meta.aggregations)
			}
		};
	});
};