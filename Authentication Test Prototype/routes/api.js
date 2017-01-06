const express = require('express');
const router = new express.Router;

const mongoose = require('mongoose');
const Drawing = mongoose.model('Drawing');

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
})

module.exports = router;