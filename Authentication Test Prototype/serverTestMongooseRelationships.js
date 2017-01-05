/*

Categories
People
	Realistic
	Cartoon
Environment
	Landscape
	Structural
Design
	Floral
	Swirls
Lettering
	Decorative
	Graffiti

User
	displayName
	address
	email
	password
	role
	approved
	banned
	admin
	photoURL
	created
	updated
	portfolioURL
	artstationURL
	behanceURL
	dribbleURL
	deviantartURL
	linkedinURL
Drawing
	Title
	Author [user_id]
	Drawing
	Category [category_id] (bottom-level-category)
	created
	updated
Category
	name
	parent [category_id]
	ancestors
		[category_id]
		name
UserDrawing
	user_id
	drawings_id
	like: true
	favorite: true
UserFollow
	following_id
	follower_id

*/

const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');

app.use(express.static('public'));

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(3000, function() {
	console.log('Listening on port 3000');
});