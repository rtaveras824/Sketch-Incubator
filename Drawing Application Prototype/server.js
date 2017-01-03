var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));


var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var mongojs = require('mongojs');

var db = mongojs('project', ['drawings']);

// console.log(Object.bsonsize(db.drawings.findOne({title:"Happy Face"})));

app.get('/', function(req, res) {
	// res.sendFile(path.join(__dirname + '/public/index.html'));
	var drawings;
	db.drawings.find({}, function(err, docs) {
		if (err) {
			console.log(err);
		} else {
			console.log('docs', docs);
			drawings = docs;
			res.render('index', { drawings: drawings });
		}
	});
	
});

app.post('/add', function(req, res) {
	console.log(req.body);
	db.drawings.save({
		title: req.body.title,
		drawing: req.body.drawing
	}, function(err, saved) {
		if (err) {
			console.log(err);
		} else {
			console.log(saved);
		}
	});
});

app.listen(3000, function() {
	console.log('App listening on port 3000');
});