module.exports = () => {
	return (err, req, res, next) => {
		if (err.name === 'UnauthorizedError') {
			res.status(401).send(err.message);
			return;
		}
		res.status(500).send();
	};
};