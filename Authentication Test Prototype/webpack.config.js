const path = require('path');

module.exports = {
	entry: path.join(__dirname, '/src/app.jsx'),

	output: {
		path: path.join(__dirname, '/public/js'),
		filename: 'app.js'
	},

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
	}
};