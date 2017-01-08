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
mongoose.Promise = global.Promise;
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

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

app.use(passport.initialize());

const localLoginStrategy = require('./passport/local-login');
const localSignupStrategy = require('./passport/local-signup');
passport.use('local-login', localLoginStrategy);
passport.use('local-signup', localSignupStrategy);

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const applicationRoutes = require('./routes/application');
const authCheckMiddleware = require('./middleware/auth-check');

app.use('/api', authCheckMiddleware);

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/application', applicationRoutes);

app.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'server/static', 'index.html'));
});

app.listen(PORT, function() {
	console.log('App listening on port', PORT);
});