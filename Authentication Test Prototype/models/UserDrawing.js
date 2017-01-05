const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserDrawingSchema = new Schema({
	user_id: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	drawing_id: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: 'Drawing',
	},
	like: {
		type: Boolean,
		default: false
	},
	favorite: {
		type: Boolean,
		default: false
	}
});

const UserDrawing = mongoose.model('UserDrawing', UserDrawingSchema);

module.exports = UserDrawing;