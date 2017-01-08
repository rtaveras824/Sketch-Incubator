const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = (req, res, next) => {
	if (!req.headers.authorization) {
		console.log('THEY DONT EXIST');
		// return res.status(401).end();
		next();
	} else {
		console.log('TEHY DO EXIST');
		const token = req.headers.authorization.split(' ')[1];

		return jwt.verify(token, config.jwtSecret, (err, decoded) => {
			if (err) { return res.status(401).end(); }

			const userId = decoded.sub;

			req.user_id = userId;
			next();
		})
	}
};