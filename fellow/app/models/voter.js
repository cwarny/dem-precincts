import Ember from 'ember';
import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
	address: attr(),
	age: attr('number'),
	birthState: attr('string'),
	boe: attr('string'),
	cong: attr('string'),
	council: attr('string'),
	county: attr('string'),
	driversLic: attr('string'),
	ethnicity: attr('string'),
	gender: attr('string'),
	house: attr('string'),
	judic: attr('string'),
	municipality: attr('string'),
	name: attr(),
	party: attr('string'),
	precinct: attr('string'),
	race: attr('string'),
	regNum: attr('string'),
	registrationDate: attr('date'),
	senate: attr('string'),
	status: attr('string'),
	superCourt: attr('string'),
	ward: attr('string')
});