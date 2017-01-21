import Ember from 'ember';
import { getJSON } from '../utils/http';
import { parseCurrency, parseTime } from '../utils/parsers';

let { RSVP, get, computed, set, setProperties } = Ember;

/* global topojson */

export default Ember.Route.extend({
	model: function(transition, params) {
		return getJSON('wake-quantized-topo.json').then(wake => {
			return get(this, 'store').push({
				data: topojson.feature(wake, wake.objects.precincts).features.map(d => {
					let attrs = {
						chair: d.properties.Chair,
						county: d.properties.County,
						numberOfDelegates: +d.properties.Delegates,
						district: d.properties.District,
						pollingPlace: { name: d.properties['Polling location name'] },
						secretary: d.properties.Secretary,
						status: d.properties.Status,
						fundGoal: parseCurrency(d.properties['Sustaining fund goal']),
						viceChair: d.properties['Vice chair'],
						geometry: d.geometry
					};

					if (d.properties.events.length) {
						attrs.events = d.properties.events.map(evt => ({
							date: parseTime(evt.Date),
							location: evt.Location,
							title: evt.Event
						}));
					}

					return {
						type: 'precinct',
						id: d.properties.code,
						attributes: attrs
					};
				})
			});
		});
	}
});