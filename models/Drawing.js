const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DrawingSchema = new Schema({
	title: {
		required: true,
		type: String,
		trim: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	drawing: {
		required: true,
		type: String,
		trim: true
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category'
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type:Date,
		default: Date.now
	}
});

const Drawing = mongoose.model('Drawing', DrawingSchema);

module.exports = Drawing;