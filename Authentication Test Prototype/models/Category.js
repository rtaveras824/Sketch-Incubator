const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	name: {
		required: true,
		type: String,
		trim: true
	},
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'Category'
	},
	ancestors: [{
		id: {
			type: Schema.Types.ObjectId,
			ref: 'Category'
		},
		name: String
	}]
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;