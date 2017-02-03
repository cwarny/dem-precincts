import Ember from 'ember';
import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
	date: attr('event-date'),
	title: attr('string'),
	location: attr(),
	precinct: belongsTo('precinct')
});