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