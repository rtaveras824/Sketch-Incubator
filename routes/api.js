const express = require('express');
const router = new express.Router;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = mongoose.model('User');
const Drawing = mongoose.model('Drawing');
const Category = mongoose.model('Category');
const UserDrawing = mongoose.model('UserDrawing');
const UserFollow = mongoose.model('UserFollow');

router.get('/user/:user_id', function(req, res, next) {
	return User.findById(req.params.user_id)
		.lean()
		.select('display_name address email photo_url portfolio_url artstation_url behance_url dribbble_url deviantart_url linkedin_url')
		.exec(function(err, result) {
			if (req.params.user_id === req.user_id) {
				result.match = true;
				console.log(JSON.stringify(result));
				res.json(result);
			} else {
				result.match = false;
				if (req.user_id) {
					return UserFollow.find({
						$and: [
							{
								follower_id: ObjectId(req.user_id)
							},
							{
								following_id: ObjectId(req.params.user_id)
							}
						]
					})
					.exec(function(err, response) {
						const combo = [];
						combo.push(result);
						combo.push(response[0]);
						console.log('combo', combo);
						res.send(combo);
					});
				} else {
					res.json(result);
				}
			}
			
		});
})

router.get('/update/:user_id', function(req, res, next) {
	if (req.params.user_id !== req.user_id) {
		console.log('NOPE');
		res.end();
	} else {
		return User.findById(req.params.user_id)
		.select('display_name address email photo_url portfolio_url artstation_url behance_url dribbble_url deviantart_url linkedin_url')
		.exec(function(err, result) {
			console.log(JSON.stringify(result));
			res.json(result);
		});
	}
});

router.post('/update', function(req, res, next) {
	if (req.body._id !== req.user_id) {
		console.log('NOPE');
		res.end();
	} else {
		return User.findByIdAndUpdate(req.body._id, { $set: req.body })
		.exec(function(err, result) {
			console.log(JSON.stringify(result));
			res.json(result);
		});
	}
});

router.post('/userfollow', function(req, res, next) {
	return UserFollow.find({
		$and: [
			{
				following_id: ObjectId(req.body.following_id)
			},
			{
				follower_id: ObjectId(req.user_id)
			}
		]
	}).exec(function(err, userfollow) {
		if (err) return err;

		if (userfollow.length > 0) {
			return UserFollow.remove({ _id: userfollow[0]._id }, function(err) {
				if (err) return err;

				res.send({ follow: false });
			});
		} else {
			var newFollow = new UserFollow({
				follower_id: req.user_id,
				following_id: req.body.following_id,
			});
			newFollow.save(function(err, newEntry) {
				if (err) return err;

				res.send({ follow: true });
			})
		}
	})
});

// router.get('/menu', function(req, res, next) {
// 	const sortedMenu = [];
// 	function recursiveFunction(categories) {
// 		const category = categories.shift();
// 		const len = category.ancestors.length;
// 		const i = 0;
// 		if (len > 0) {
// 			if (len == 2) {
// 				var checkIfExists = sortedMenu.some(function(el, index, array) {
// 					return el.name === category.ancestors[i].name;
// 				});
// 			} else if (len == 1) {
// 				var checkIfExists = sortedMenu.some(function(el, index, array) {
// 					return el.name === category.ancestors[0].name;
// 				});
// 				if (!checkIfExists) {

// 				}
// 			}
// 		} else {
// 			var checkIfExists = sortedMenu.some(function(el, index, array) {
// 				return el.name === category.name;
// 			});
// 			if (!checkIfExists)
// 				sortedMenu.push({ 'name': category.name });
// 		}
// 		console.log(JSON.stringify(category));


// 		if (categories.length > 0)
// 			return recursiveFunction(categories);
// 	}

// 	return Category.find({})
// 		.exec(function(err, categories) {
// 			console.log(categories);
// 			recursiveFunction(categories);
// 		});
// });

router.get('/categories', function(req, res, next) {
	return Category.find({})
			.then(function(response) {
				res.send(response);
			})
			.catch(function(err) {
				console.log(err);
			});
})

router.get('/category/:category_id', function(req, res, next) {
	return Category.find({
		ancestors: {
			$elemMatch: {
				_id: req.params.category_id
			}
		}
	}, function(err, docs) {

		var query = ObjectId(req.params.category_id);
		var categoryIds = [];

		if (docs.length > 0) {
			categoryIds.push(ObjectId(req.params.category_id))
			docs.map(function(category) {
				return categoryIds.push(ObjectId(category._id));
			});
			query = {
				$in: categoryIds
			}
		}
		console.log(JSON.stringify(query));

		return Drawing.find({
			category: query 
		}).exec(function(err, drawings) {
			if (err) return err;
			console.log('drawings', drawings);
			res.send(drawings);
		});
	})

	// return Category.find({
	// 	$or: [
	// 		{
	// 			category: {
	// 				_id: ObjectId(req.params.category_id)
	// 			}
	// 		},
	// 		$in: {

	// 		}
	// 	]
		
	// }, function(err, docs) {
	// 	console.log('success');
	// 	res.send(docs);
	// });
});

router.get('/drawings', function(req, res, next) {
	console.log('drawing');
	return Drawing.find({})
		.limit(10)
		.populate('author category')
		.exec(function(err, result) {
			if (err) return err;
			res.json(result);
		});
});

router.get('/drawing/:drawing_id', function(req, res, next) {
	console.log('user_id', req.user_id);

	return Drawing.find({
		_id: ObjectId(req.params.drawing_id)
	}).exec(function(err, docs) {
		if (req.user_id) {
			return UserDrawing.find({
				$and: [
					{
						user_id: ObjectId(req.user_id)
					},
					{
						drawing_id: ObjectId(req.params.drawing_id)
					}
				]
			})
			.exec(function(err, response) {
				const combo = [];
				combo.push(docs[0]);
				combo.push(response[0]);
				res.send(combo);
			});
		} else {
			res.send(docs[0]);
		}
	})
});

router.post('/drawing/userlike', function(req, res, next) {
	return UserDrawing.find({
		$and: [
			{
				drawing_id: ObjectId(req.body.drawing_id)
			},
			{
				user_id: ObjectId(req.user_id)
			}
		]
	}).exec(function(err, userdrawing) {
		if (err) return err;

		if (userdrawing.length > 0) {
			userdrawing[0].like = req.body.like;
			userdrawing[0].save(function(err, updatedUserdrawing) {
				if (err) return err;

				res.send(updatedUserdrawing);
			});
		} else {
			var newLike = new UserDrawing({
				user_id: req.user_id,
				drawing_id: req.body.drawing_id,
				like: req.body.like
			});
			newLike.save(function(err, newEntry) {
				if (err) return err;

				res.send(newEntry);
			})
		}
	})
});

router.post('/drawing/userfavorite', function(req, res, next) {
	return UserDrawing.find({
		$and: [
			{
				drawing_id: ObjectId(req.body.drawing_id)
			},
			{
				user_id: ObjectId(req.user_id)
			}
		]
	}).exec(function(err, userdrawing) {
		if (err) return err;

		if (userdrawing.length > 0) {
			userdrawing[0].favorite = req.body.favorite;
			userdrawing[0].save(function(err, updatedUserdrawing) {
				if (err) return err;

				res.send(updatedUserdrawing);
			});
		} else {
			var newLike = new UserDrawing({
				user_id: req.user_id,
				drawing_id: req.body.drawing_id,
				favorite: req.body.favorite
			});
			newLike.save(function(err, newEntry) {
				if (err) return err;

				res.send(newEntry);
			})
		}
	})
});

router.post('/upload', function(req, res, next) {
	var newDrawing = new Drawing({
		title: req.body.title,
		author: req.user_id,
		drawing: req.body.drawing,
		category: req.body.category
	});
	newDrawing.save(function(err, newEntry) {
		if (err) return err;

		res.send(newEntry);
	})
});

router.get('/getuserid', function(req, res, next) {
	console.log('user id', req.user_id);
	res.send(req.user_id);
});

module.exports = router;