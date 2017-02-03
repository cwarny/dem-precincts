module.exports = func => {
	return (req, res, next) => {
		func(req)
			.then(data => {
				res.send(data);
			})
			.catch(err => {
				next(err);
			});
	}
};