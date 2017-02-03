import Ember from 'ember';
import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
	chair: attr('string'),
	code: attr('string'),
	countyName: attr('string'),
	numberOfDelegates: attr('number'),
	district: attr('string'),
	pollingPlace: attr('string'),
	secretary: attr('string'),
	organizationStatus: attr('string'),
	fundGoal: attr('number'),
	viceChair: attr('string'),
	events: hasMany('event'),
	geometry: attr()
});