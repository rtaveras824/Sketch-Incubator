const express = require('express');
const validator = require('validator');
const passport = require('passport');

const router = new express.Router();

router.post('/login', function(req, res, next) {
	return passport.authenticate('local-login', (err, token, userData) => {
		console.log(err);
		console.log(token);
		console.log(userData);
		if (err) {
			if (err.name === 'IncorrectCredentialsError') {
				return res.status(400).json({
					success: false,
					message: err.message
				});
			}

			return res.status(400).json({
				success:false,
				message: 'Could not process the form'
			});
		}

		console.log('passport authenticate part');
		return res.json({
			success: true,
			message: 'You have successfully logged in!',
			token,
			user: userData,
		});
	})(req, res, next);
});

module.exports = router;