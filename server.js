const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config.json');

const PORT = process.env.PORT || 3000;

if (process.env.production) {
	mongoUrl = config.MONGODB_URI;
} else {
	mongoUrl = 'mongodb://localhost/authTest';
}
mongoose.connect(mongoUrl);
mongoose.connection.on('error', (err) => {
	console.log('Mongoose error', err);
});
require('./models/User');
require('./models/Drawing');
require('./models/Category');
require('./models/UserDrawing');
require('./models/UserFollow');

app.use(express.static('./server/static'));
// this is where webpack outputs react app
app.use(express.static('./client/dist'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

const localLoginStrategy = require('./passport/local-login');
passport.use('local-login', localLoginStrategy);

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const authCheckMiddleware = require('./middleware/auth-check');

app.use('/api', authCheckMiddleware);

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'server/static', 'index.html'));
});

app.listen(PORT, function() {
	console.log('App listening on port', PORT);
});