import Ember from 'ember';

const { computed, get, getProperties, setProperties } = Ember;
const { oneWay } = computed;

export default Ember.Component.extend({
	tagName: 'path',
	attributeBindings: ['d', 'fill', 'style'],
	classNames: ['precinct','clickable'],
	classNameBindings: ['highlighted','selected'],

	highlighted: oneWay('entity.highlighted'),
	selected: oneWay('entity.selected'),
	code: oneWay('entity.code'),

	mouseEnter() {
		get(this, 'onhighlight')(get(this, 'entity'));
	},

	mouseLeave() {
		get(this, 'ondehighlight')(get(this, 'entity'));
	},

	click() {
		if (get(this, 'code')) {
			if (get(this, 'selected')) {
				get(this, 'ondeselect')(get(this, 'entity'));
			} else {
				get(this, 'onselect')(get(this, 'entity'));
			}
		}
	}
});