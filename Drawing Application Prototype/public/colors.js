var r = 0;
var g = 0;
var b = 0;

var colors = ['black', 'gray', 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

for (var i = 0, n = colors.length; i < n; i++) {
	var swatch = document.createElement('div');
	swatch.className = 'swatch';
	swatch.style.backgroundColor = colors[i];
	swatch.addEventListener('click', setSwatch);
	document.getElementById('colors').appendChild(swatch);
}

function setColor(color) {
	currentContext.fillStyle = color;
	currentContext.strokeStyle = color;
	var active = document.getElementsByClassName('active')[0];
	if (active) {
		active.className = 'swatch';
	}
}

function setSwatch(e) {
	var swatch = e.target;
	console.log(swatch.style.backgroundColor);
	switch (swatch.style.backgroundColor) {
		case 'black':
			r = 0;
			g = 0;
			b = 0;
			break;
		case 'red':
			r = 255;
			g = 0;
			b = 0;
			break;
		case 'green':
			r = 0;
			g = 255;
			b = 0;
			break;
		case 'blue':
			r = 0;
			g = 0;
			b = 255;
			break;
		default:
			r = 0;
			g = 0;
			b = 0;
	}
	// setColor(swatch.style.backgroundColor);
	swatch.className += ' active';
}

// dirty fix, anonymous object to replace event parameter
setSwatch({target: document.getElementsByClassName('swatch')[0]});