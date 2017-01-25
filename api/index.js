const config = require('./config'),
	express = require('express'),
	app = express();

require('./middleware')(app);

app.use('/api', require('./auth').decodeToken(), require('./api'));
app.use('/auth', require('./auth/routes'));

app.use(require('./middleware/err')());

const server = app.listen(config.port, () => {
	console.log('http server listening on port', config.port);
});

module.exports = app;