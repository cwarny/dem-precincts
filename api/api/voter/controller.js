const es = require('../../util/es'),
	_ = require('lodash');

exports.get = (options) => {
	let filters = [];

	filters.push({
		term: {
			'status.name': 'ACTIVE'
		}
	});

	let subAggs = {
		ages: {
			terms: {
				field: 'age'
			}
		},
		genders: {
			terms: {
				field: 'gender'
			}
		},
		races: {
			terms: {
				field: 'race'
			}
		},
		ethnicities: {
			terms: {
				field: 'ethnicity'
			}
		},
		parties: {
			terms: {
				field: 'party'
			}
		},
		'registrations': {
			date_histogram: {
				field: 'registration-date',
				interval: 'year'
			}
		}
	};

	let aggs = {
		precincts: {
			terms: {
				field: 'precinct.code',
				size: 250
			},
			aggs: subAggs
		}
	};

	let requestBody = {
		size: 0,
		query: {
			bool: {
				must: {
					match_all: {}
				}
			}
		},
		aggs: aggs
	};

	if (filters.length) requestBody.query.bool.filter = filters;

	return es.search({
		index: 'fellow',
		type: 'voter',
		body: requestBody
	}).then(resp => ({
		meta: {
			total: resp.hits.total,
			aggregations: resp.aggregations.precincts.buckets.map(p => _.merge({id: p.key}, _.mapValues(p, 'buckets')))
		},
		data: resp.hits.hits.map(d => ({
			id: d._id,
			type: 'voters',
			attributes: d._source
		}))
	}));
};