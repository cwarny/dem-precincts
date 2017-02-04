import Ember from 'ember';

export default Ember.Route.extend({
	model: function(transition, params) {
		return this.store.findAll('precinct').then(data => {
			debugger;
			return data;
		});
	}
});