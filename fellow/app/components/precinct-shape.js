import Ember from 'ember';

const { computed, get, getProperties, setProperties } = Ember;
const { oneWay } = computed;

export default Ember.Component.extend({
	tagName: 'path',
	attributeBindings: ['d', 'fill', 'style'],
	classNames: ['entity']
});