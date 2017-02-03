const es = require('../../util/es');

exports.get = (options) => {
	let filter = options.query.filter,
		precinct_id = filter.precinct_id;

	let filters = [];

	filters.push({
		term: {
			'status.name': 'ACTIVE'
		}
	});

	let s = precinct_id.split('-');
	filters.push({
		term: {
			precinct: `ocd-division/country:us/state:nc/county:wake/precinct:${[parseInt(s[0]),s[1]].join('-')}`
		}
	});

	let requestBody = {
		size: 0,
		query: {
			bool: {
				must: {
					match_all: {}
				}
			}
		},
		aggs: {
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
		}
	};

	if (filters.length) requestBody.query.bool.filter = filters;

	return es.search({
		index: 'fellow',
		type: 'voter',
		body: requestBody
	}).then(resp => {
		return {
			meta: {
				total: resp.hits.total,
				aggregations: resp.aggregations
			},
			data: resp.hits.hits.map(d => ({
				id: d._id,
				type: 'voters',
				attributes: d._source
			}))
		};
	});
};