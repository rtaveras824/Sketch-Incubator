const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs');

const roles = ['user', 'admin'];

const UserSchema = new Schema({
	display_name: {
		unique: true,
		required: true,
		type: String,
		trim: true
	},
	address: {
		type: String,
		trim: true
	},
	email: {
		unique: true,
		required: true,
		type: String,
		trim: true,
		match: [/.+\@.+\..+/, "Please enter a valid email address."]
	},
	password: {
		required: true,
		type: String,
		validate: [
			function(input) {
				return input.length >= 6;
			},
			"Password should be longer than 6 characters."
		]
	},
	role: {
		required: true,
		type: String,
		enum: roles,
		default: roles[0]
	},
	approved: {
		type: Boolean,
		default: true
	},
	banned: {
		type: Boolean,
		default: false
	},
	admin: {
		type: Boolean,
		default: false
	},
	photo_url: String,
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

UserSchema.methods.comparePassword = function comparePassword(password, callback) {
	bcryptjs.compare(password, this.password, callback);
};

UserSchema.pre('save', function saveHook(next) {
	const user = this;

	// proceed further only if the password is modified or the user is new
	if (!user.isModified('password')) return next();

	return bcryptjs.genSalt((saltError, salt) => {
		if (saltError) { return next(saltError); }

		return bcryptjs.hash(user.password, salt, (hashError, hash) => {
			if (hashError) { return next(hashError); }

			// replace a password string with hash value
			user.password = hash;

			return next();
		});
	});
});

const User = mongoose.model('User', UserSchema);

module.exports = User;