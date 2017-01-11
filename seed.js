const bcryptjs = require('bcryptjs');
const async = require('async');
const mongojs = require('mongojs');
const ObjectId = mongojs.ObjectId;

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

const seedCategories = [
	{
		_id: ObjectId("5863f68da5a1ac0ecc852111"),
		name: 'People'
	},
	{
		_id: ObjectId("5863f68da5a1ac0ecc852112"),
		name: 'Classical',
		parent: ObjectId("5863f68da5a1ac0ecc852111"),
		ancestors: [{
			_id: ObjectId("5863f68da5a1ac0ecc852111"),
			name: 'People'
		}]
	},
	{
		_id: ObjectId("5863f68da5a1ac0ecc852113"),
		name: 'Face',
		parent: ObjectId("5863f68da5a1ac0ecc852112"),
		ancestors: [
			{
				_id: ObjectId("5863f68da5a1ac0ecc852112"),
				name: 'Classical'
			},
			{
				_id: ObjectId("5863f68da5a1ac0ecc852111"),
				name: 'People'
			}
		]
	},
	{
		_id: ObjectId("5863f68da5a1ac0ecc852114"),
		name: 'Figure',
		parent: ObjectId("5863f68da5a1ac0ecc852112"),
		ancestors: [
			{
				_id: ObjectId("5863f68da5a1ac0ecc852112"),
				name: 'Classical'
			},
			{
				_id: ObjectId("5863f68da5a1ac0ecc852111"),
				name: 'People'
			}
		]
	},
	{
		_id: ObjectId("587481cd31645f0854cf53d8"),
		name: 'Environment',
	},
	{
		_id: ObjectId("587481cd31645f0854cf53d9"),
		name: 'Landscape',
		parent: ObjectId("587481cd31645f0854cf53d8"),
		ancestors: [{
			_id: ObjectId("587481cd31645f0854cf53d8"),
			name: 'Environment'
		}]
	},
	{
		_id: ObjectId("587481cd31645f0854cf5310"),
		name: 'Flower',
		parent: ObjectId("587481cd31645f0854cf53d9"),
		ancestors: [{
			_id: ObjectId("587481cd31645f0854cf53d9"),
			name: 'Landscape'
		},
		{
			_id: ObjectId("587481cd31645f0854cf53d8"),
			name: 'Environment'
		}]
	},
	{
		_id: ObjectId("5874864d5f51f13320655432"),
		name: 'Design',
	},
	{
		_id: ObjectId("5874864d5f51f13320655433"),
		name: 'Swirls',
		parent: ObjectId("5874864d5f51f13320655432"),
		ancestors: [{
			_id: ObjectId("5874864d5f51f13320655432"),
			name: 'Design',
		}]
	},
	{
		_id: ObjectId("587593fd0f768613848214b4"),
		name: 'Mechanical'
	},
	{
		_id: ObjectId("587593fd0f768613848214b5"),
		name: 'Vehicle',
		parent: ObjectId("587593fd0f768613848214b4"),
		ancestors: [{
			_id: ObjectId("587593fd0f768613848214b4"),
			name: 'Mechanical'
		}]
	}
];

const seedDrawings = [
	{
		_id: ObjectId("5863f68da5a1ac0ecc852463"),
		title: 'Boobs',
		author: ObjectId("5863f68da5a1ac0ecc852557"),
		drawing: 'THIS IS DRAWING',
		category: ObjectId("5863f68da5a1ac0ecc852113"),
		created: new Date(),
		updated: new Date()
	},
	{
		_id: ObjectId("5863f68da5a1ac0ecc852464"),
		title: 'Boobs 2',
		author: ObjectId("58572d3d989b6d2588482998"),
		drawing: 'THIS IS DRAWING 2222',
		category: ObjectId("5863f68da5a1ac0ecc852114"),
		created: new Date(),
		updated: new Date()
	},
	{
		_id: ObjectId("5863f68da5a1ac0ecc852485"),
		title: 'Boobs 3',
		author: ObjectId("5863f68da5a1ac0ecc852557"),
		drawing: 'THIS IS DRAWING 3333333',
		category: ObjectId("5863f68da5a1ac0ecc852112"),
		created: new Date(),
		updated: new Date()
	},
	{
		_id: ObjectId("5863f68da5a1ac0ecc852482"),
		title: 'Boobs 4',
		author: ObjectId("58572d3d989b6d2588482998"),
		drawing: 'THIS IS DRAWING 44444444444',
		category: ObjectId("5863f68da5a1ac0ecc852113"),
		created: new Date(),
		updated: new Date()
	}
];

const seedUserDrawing = [
	{
		_id: ObjectId("5863f68da5a1ac0ecc853333"),
		user_id: ObjectId("5863f68da5a1ac0ecc852557"),
		drawing_id: ObjectId("5863f68da5a1ac0ecc852464"),
		like: true,
		favorite: true
	},
	{
		_id: ObjectId("5863f68da5a1ac0ecc853334"),
		user_id: ObjectId("5863f68da5a1ac0ecc852557"),
		drawing_id: ObjectId("5863f68da5a1ac0ecc852482"),
		like: true,
		favorite: false
	}
];

const seedUserFollow = [
	{
		_id: ObjectId("5863f68da5a1ac0ecc854444"),
		following_id: ObjectId("58572d3d989b6d2588482998"),
		follower_id: ObjectId("5863f68da5a1ac0ecc852557")

	}
];

const databaseUrl = 'authTest';
const collections = ['users', 'drawings', 'categories', 'userdrawings', 'userfollows'];
const db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
	console.log('Database Error:', err);
});

db.on('connect', function() {
	console.log('Database connected');	
});

const hashPassword = function(user, callback) {
	bcryptjs.hash(user.password, 10, function(err, hash) {
		if (err) throw err;
		user.password = hash;
		callback(null, user);
	});
};

// async.map(seedUsers, hashPassword, function(error, result) {
// 	console.log(result);
// 	db.users.save(result);
// });

// seedCategories.map(function(category) {
// 	return db.categories.save(category);
// });

// seedDrawings.map(function(drawing) {
// 	return db.drawings.save(drawing);
// });

// seedUserDrawing.map(function(userDrawing) {
// 	return db.userdrawings.save(userDrawing);
// });

// seedUserFollow.map(function(userFollow) {
// 	return db.userfollows.save(userFollow);
// });

console.log("the end");