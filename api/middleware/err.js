module.exports = () => {
	return (err, req, res, next) => {
		console.log(err);
		if (err.name === 'UnauthorizedError') {
			res.status(401).send(err.message);
			return;
		}
		res.status(500).send();
	};
};