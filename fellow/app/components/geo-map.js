import Ember from 'ember';

const { computed, get, getProperties, setProperties, run } = Ember;

const { schedule } = run;

/* global d3 */

export default Ember.Component.extend({
	tagName: 'svg',
	attributeBindings: ['viewBox'],
	classNames: ['geo-map'],

	width: 2000,
	height: 1700,
	viewBox: computed('width', 'height', function() {
		let { width, height } = getProperties(this, 'width', 'height');
		return `0 0 ${width} ${height}`;
	}),

	scale: null,
	translate: null,
	p: null,
	origin: [-78.644257, 35.787743],

	pi: Math.PI,
    tau: computed(function() {
    	return 2 * get(this, 'pi');
    }),

    zoom: computed(function() {
		return d3.zoom()
			.scaleExtent([1 << 11, 1 << 25])
			.on('zoom', () => {
				this.zoomed();
			});
	}),

	path: computed('projection', 'translate', 'scale', function() {
		let { scale, translate, projection } = getProperties(this, 'scale', 'translate', 'projection');
		projection.scale(scale).translate(translate);
		return d3.geoPath().projection(projection);
	}),

	precinctShapes: computed('path', 'precincts', function() {
		let { path, precincts } = getProperties(this, 'path', 'precincts');
		return precincts.map(d => {
			return {
				path: path(get(d, 'geometry')),
				props: d
			};
		});
	}),

	init() {
    	this._super(...arguments);

    	let { width, height, tau, origin } = getProperties(this, 'width', 'height', 'tau', 'origin');

    	let projection = d3.geoMercator()
		    .scale(1 / tau)
		    .translate([0, 0]);

    	let tile = d3.tile()
    		.size([width, height]);

    	let center = projection(origin);

    	let transform = d3.zoomIdentity
			.translate(width / 2, height / 2)
			.scale(1 << 21)
			.translate(-center[0], -center[1]);

    	projection
			.scale(transform.k / tau)
			.translate([transform.x, transform.y]);

		setProperties(this, {
			projection: projection,
			tile: tile,
			center: center,
			translate: projection.translate(),
			scale: projection.scale()
		});
    },

    didInsertElement() {
    	let { zoom, element, width, height, center } = getProperties(this, 'zoom', 'element', 'width', 'height', 'center');

		d3.select(element)
			.call(zoom)
			.call(zoom.transform, d3.zoomIdentity
				.translate(width / 2, height / 2)
				.scale(1 << 19)
				.translate(-center[0], -center[1])
			);
    },

    stringify: function(scale, translate) {
		let k = scale / 256, r = scale % 1 ? Number : Math.round;
		return `translate(${r(translate[0] * scale)},${r(translate[1] * scale)})scale(${k})`;
	},

	zoomed: function() {
		let { tile, tau, element, projection } = getProperties(this, 'tile', 'tau', 'element', 'projection');
		
		let transform = d3.event.transform;

		let tiles = tile
			.scale(transform.k)
			.translate([transform.x, transform.y])
			();

		projection
			.scale(transform.k / tau)
			.translate([transform.x, transform.y]);

		schedule('render', () => {
			let image = d3.select(element).select('.raster')
				.attr('transform', this.stringify(tiles.scale, tiles.translate))
				.selectAll('image')
				.data(tiles, d => d);

			image.exit().remove();

			image.enter().append('image')
				.attr('xlink:href', d => `http://${'abc'[d[1] % 3]}.tile.openstreetmap.org/${d[2]}/${d[0]}/${d[1]}.png`)
				.attr('x', d => d[0] * 256)
				.attr('y', d => d[1] * 256)
				.attr('width', 256)
				.attr('height', 256);
		});

		setProperties(this, {
			scale: projection.scale(),
			translate: projection.translate()
		});
	}
});