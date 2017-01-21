import Ember from 'ember';

let { RSVP } = Ember;
let { Promise } = RSVP;

export function getJSON(url) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', url);
		xhr.onreadystatechange = handler;
		xhr.responseType = 'json';
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.send();

		function handler() {
			if (this.readyState === this.DONE) {
				if (this.status === 200) {
					resolve(this.response);
				} else {
					reject(new Error(`getJSON: \`${url}\` failed with status: [${this.status}]`));
				}
			}
		};
	});
};

export default {
	getJSON: getJSON
};