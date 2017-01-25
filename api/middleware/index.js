const bodyParser = require('body-parser'),
	cors = require('cors');

module.exports = app => {
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json({type: ['application/json', 'application/vnd.api+json']})); // Specifies payload type. 'vnd.api+json' is for JSON API specification
	app.use(cors());
};