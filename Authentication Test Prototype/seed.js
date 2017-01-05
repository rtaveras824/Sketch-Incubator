const bcryptjs = require('bcryptjs');
const async = require('async');
const mongojs = require('mongojs');
const ObjectId = mongojs.ObjectId;

/*
const seedUsers = [
	{
		_id: ObjectId("58572d3d989b6d2588482998"),
		display_name: 'Stealthzeus',
		address: 'Orlando, FL',
		email: 'stealthzeus@hotmail.com',
		password: 'password',
		role: 'admin',
		approved: true,
		admin: true,
		photo_url: 'http://lorempixel.com/200/200/',
		created: new Date(),
		updated: new Date()
	},
	{
		_id: ObjectId("5863f68da5a1ac0ecc852557"),
		display_name: 'Rtaveras824',
		address: 'Orlando, FL',
		email: 'rtaveras824@hotmail.com',
		password: 'password',
		role: 'user',
		approved: true,
		photo_url: 'http://lorempixel.com/200/200/',
		created: new Date(),
		updated: new Date()
	},
	{
		_id: ObjectId("586299afc41a4d1becd79a5a"),
		display_name: 'Anthony',
		address: 'Orlando, FL',
		email: 'anthony@hotmail.com',
		password: 'password',
		role: 'user',
		approved: true,
		banned: true,
		photo_url: 'http://lorempixel.com/200/200/',
		created: new Date(),
		updated: new Date()
	}
];
*/

const hashPassword = function(user, callback) {
	bcryptjs.hash(user.password, 10, function(err, hash) {
		if (err) throw err;
		user.password = hash;
		callback(null, user);
	});
};

console.log('testing');

const databaseUrl = 'authTest';
const collections = ['users', 'drawings', 'categories', 'userdrawings', 'userfollows'];
const db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
	console.log('Database Error:', err);
});

db.on('connect', function() {
	console.log('Database connected');	
});

async.map(seedUsers, hashPassword, function(error, result) {
	console.log(result);
	db.users.save(result);
});

console.log("the end");