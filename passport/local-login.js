const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config.json');

module.exports = new PassportLocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	session: false,
	passReqToCallback: true
}, (req, email, password, done) => {
	const userData = {
		email: email.trim(),
		password: password.trim()
	};
	console.log('passport strategy');
	return User.findOne({ email: userData.email }, (err, user) => {
		console.log(userData);
		if (err) { return err; };

		if (!user) {
			const error = new Error('Incorrect email or password');
			error.name = 'IncorrectCredentialsError';

			return done(error);
		}

		return user.comparePassword(userData.password, (passwordErr, isMatch) => {
			if (err) { return done(err); }

			if (!isMatch) {
				const error = new Error('Incorrect email or password');
				error.name = 'IncorrectCredentialsError';

				return done(error);
			}

			const payload = {
				sub: user._id
			}

			const token = jwt.sign(payload, config.jwtSecret);
			const data = {
				name: user.display_name
			};

			console.log('user', JSON.stringify(user));

			return done(null, token, data);
		});
	});
});