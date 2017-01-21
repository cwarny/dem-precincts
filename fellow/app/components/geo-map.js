import Ember from 'ember';

const { computed, get, getProperties, setProperties } = Ember;

/* global d3 */

export default Ember.Component.extend({
	tagName: 'svg',
	attributeBindings: ['viewBox'],
	classNames: ['geo-map'],

	width: 2000,
	height: 2000,
	viewBox: computed('width', 'height', function() {
		let { width, height } = getProperties(this, 'width', 'height');
		return `0 0 ${width} ${height}`;
	}),

	path: computed('width', 'height', function() {
		let { width, height } = getProperties(this, 'width', 'height');
		return d3.geoPath();
	}),

	shapes: computed('path', 'data', function() {
		let { path, data } = getProperties(this, 'path', 'data');
		return data.map(d => ({
			path: path(get(d, 'geometry')),
			props: d
		}));
	})
});