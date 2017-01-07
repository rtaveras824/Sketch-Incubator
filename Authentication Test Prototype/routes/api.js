const express = require('express');
const router = new express.Router;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Drawing = mongoose.model('Drawing');
const Category = mongoose.model('Category');
const UserDrawing = mongoose.model('UserDrawing');
const UserFollow = mongoose.model('UserFollow');

router.get('/drawings', function(req, res, next) {
	console.log('drawing');
	return Drawing.find({})
		.limit(10)
		.populate('author category')
		.exec(function(err, result) {
			if (err) return err;
			console.log(JSON.stringify(result));
			res.json(result);
		});
});

router.get('/:category_id', function(req, res, next) {
	console.log('found');
	console.log(req.params.category_id);

	return Category.find({
		ancestors: {
			$elemMatch: {
				_id: ObjectId(req.params.category_id)
			}
		}
	}, function(err, docs) {
		console.log(docs);

		var categoryIds = [];
		categoryIds.push(ObjectId(req.params.category_id));

		if (docs.length > 0) {
			docs.map(function(category) {
				return categoryIds.push(ObjectId(category._id));
			});
		}

		return Drawing.find({
			category: {
				$in: categoryIds
			}
		}).exec(function(err, drawings) {
			if (err) return err;
			console.log(drawings.length);
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

module.exports = router;