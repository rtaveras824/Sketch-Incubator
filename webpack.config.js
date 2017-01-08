const path = require('path');

module.exports = {
	entry: {
		'client/dist/js/app': './client/src/app.jsx', // will be  ./client/dist/js/app.js
		'client/dist/js/main': './client/src/application/main.js'// will be  ./client/dist/js/main.js
	},
	output: {
		path: './',
		filename: '[name].js'
	},

	// the entry file for the bundle
	// entry: path.join(__dirname, '/client/src/app.jsx'),

	// // the bundle file we will get in the result
	// output: {
	// 	path: path.join(__dirname, '/client/dist/js'),
	// 	filename: 'app.js',
	// },

	module: {
		// apply loaders to files that meet given conditions
		loaders: [{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'babel',
			query: {
				presets: ['react', 'es2015']
			}
		}],
	},

	// start Webpack in a watch mode, so Webpack willr ebuild the bundle on changes
	watch: true
};