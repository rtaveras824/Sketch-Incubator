const express = require('express');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./server/static'));
app.use(express.static('./client/dist'));

app.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'server/static', 'index.html'));
});

app.listen(PORT, function() {
	console.log('App listening on port', PORT);
});

