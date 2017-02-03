import DS from 'ember-data';

/* global d3 */

export default DS.Transform.extend({
	serialize: function(value) {
		return d3.timeFormat('%A, %b %e, %Y, %I:%M %p')(value);
	},
	deserialize: function(value) {
		return d3.timeParse('%A, %b %e, %Y, %I:%M %p')(value);
	}
});