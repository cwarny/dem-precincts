import Ember from 'ember';

let { get, set, isArray, assign } = Ember;

export default Ember.Route.extend({
	model(transition, params) {
		return this.store.findAll('precinct');
	},

	setupController(controller, model) {
		let selected = controller.get('selectedPrecincts').map(code => model.findBy('code', code));
		selected.setEach('selected', true);
		controller.setProperties({
			selected: selected,
			model: model
		});
	}
});