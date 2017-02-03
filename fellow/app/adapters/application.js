import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
	host: 'https://localhost:7000',
	namespace: 'api'
});