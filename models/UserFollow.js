const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserFollowSchema = new Schema({
	following_id: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	follower_id: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

const UserFollow = mongoose.model('UserFollow', UserFollowSchema);

module.exports = UserFollow;