import Ember from 'ember';

let { computed, get, set, getProperties, setProperties } = Ember;

export default Ember.Controller.extend({
	queryParams: ['subdivisionType'],

	subdivisionType: 'cd',
	subdivisionTypes: ['cd','council_district','sldl','sldu'],

	actions: {
		highlight(precinct) {
			set(this, 'highlighted', precinct);
			set(precinct, 'highlighted', true);
		},
		dehighlight(precinct) {
			set(this, 'highlighted', null);
			set(precinct, 'highlighted', false);
		},
		select(precinct) {
			get(this, 'selected').pushObject(precinct);
			set(precinct, 'selected', true);
		},
		deselect(precinct) {
			get(this, 'selected').removeObject(precinct);
			setProperties(precinct, {
				selected: false,
				highlighted: false
			});
		}
	}
});