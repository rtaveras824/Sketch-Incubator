const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
		default: false
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

const User = mongoose.model('User', UserSchema);

module.exports = User;