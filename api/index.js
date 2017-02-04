const config = require('./config'),
	https = require('https'),
	express = require('express'),
	app = express();

require('./middleware')(app);

app.use('/api', /*require('./auth').decodeToken(),*/ require('./api'));
app.use('/auth', require('./auth/routes'));

app.use(require('./middleware/err')());

const server = https.createServer(app).listen(config.port, () => {
	console.log('https server listening on port', config.port);
});

module.exports = app;