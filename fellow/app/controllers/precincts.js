import Ember from 'ember';

let { computed, get, set, getProperties, setProperties, A, inject } = Ember;

export default Ember.Controller.extend({
	queryParams: ['subdivisionType',{'selectedPrecincts':'codes'}],

	subdivisionType: 'cd',
	subdivisionTypes: ['cd','council_district','sldl','sldu'],

	selected: computed({
		get() {
			return A([]);
		},
		set(key, value) {
			return value;
		}
	}),

	selectedPrecincts: computed('selected.[]', {
		get() {
			return get(this,'selected').mapBy('id');
		},
		set(key, value) {
			return value;
		}
	}),

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