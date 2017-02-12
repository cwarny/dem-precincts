import Ember from 'ember';

/* global d3 */

const { computed, get, getProperties, set, setProperties } = Ember;

export default Ember.Component.extend({
	margin: {top: 20, right: 20, bottom: 30, left: 40},

    width: 500,
    height: 175,

	chartW: computed(function() {
		let { margin, width } = getProperties(this, 'margin', 'width');
		return width - margin.left - margin.right;
	}),

	halfChartW: computed('chartW', function() {
		return get(this, 'chartW')/2;
	}),

	chartH: computed(function() {
		let { margin, height } = getProperties(this, 'margin', 'height');
		return height - margin.left - margin.right;
	}),

	xScale: computed('data', 'chartW', function() {
		let { chartW, data } = getProperties(this, 'chartW', 'data');

		return d3.scaleLinear()
			.domain([0, d3.max(data.map(d => d3.max(d.value.map(d => d[0]))))])
			.rangeRound([0, chartW]);
	}),

	yScale: computed('data', 'chartH', function() {
		let { chartH, data } = getProperties(this, 'chartH', 'data');

		return d3.scaleLinear()
			.domain([0, d3.max(data.map(d => d3.max(d.value.map(d => d[1]))))])
			.rangeRound([chartH, 0]);
	}),

	cScale: computed('data', function() {
		return d3.scaleOrdinal(d3.schemeCategory20)
			.domain(get(this, 'data').map(d => d.key));
	}),

	area: computed('xScale', 'yScale', function() {
		let { chartH, xScale, yScale } = getProperties(this, 'chartH', 'xScale', 'yScale');
		return d3.area()
			.curve(d3.curveLinear)
			.x(d => xScale(d[0]))
			.y0(chartH)
			.y1(d => yScale(d[1]));
	}),

	series: computed('area', function() {
		let { data, area, cScale } = getProperties(this, 'data', 'area', 'cScale');
		return data.map(d => ({
			d: area(d.value),
			fill: cScale(d.key)
		}));
	}),

	didInsertElement() {
		let { element, yScale, xScale } = getProperties(this, 'element', 'yScale', 'xScale');

		let svg = d3.select(element);

		svg.select('.axis--x')
			.call(d3.axisBottom(xScale));

		svg.select('.axis--y')
			.call(d3.axisLeft(yScale).ticks(5, 's'))
	}
});