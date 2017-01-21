import Ember from 'ember';
import DS from 'ember-data';

const { computed, get, getProperties } = Ember;
const { attr } = DS;
const { map } = computed;

export default DS.Model.extend({
	chair: attr('string'),
	county: attr('string'),
	numberOfDelegates: attr('number'),
	district: attr('string'),
	pollingPlace: attr(),
	secretary: attr('string'),
	status: attr('string'),
	fundGoal: attr('number'),
	viceChair: attr('string'),
	events: attr(),
	geometry: attr()
});