const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	if (!req.headers.authorization) {
		console.log('THEY DONT EXIST');
		return res.status(401).end();
	} else {
		console.log('TEHY DO EXIST');
		return next();
	}
};