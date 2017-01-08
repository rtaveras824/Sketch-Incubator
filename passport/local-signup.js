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
		password: password.trim(),
		display_name: req.body.display_name.trim()
	};

	const newUser = new User(userData);
	newUser.save((err, user) => {
		if (err) return err;

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