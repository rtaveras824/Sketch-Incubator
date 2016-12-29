var setRadius = function(newRadius) {
	if (newRadius < minRad) {
		newRadius = minRad;
	} else if (newRadius > maxRad) {
		newRadius = maxRad;
	}
	radius = newRadius;
	currentContext.lineWidth = radius * 2;
	radSpan.innerHTML = radius;
}

var minRad = 0.5,
	maxRad = 100,
	defaultRad = 1,
	interval = 5,
	radSpan = document.getElementById('radval'),
	decRad = document.getElementById('decrad'),
	incRad = document.getElementById('incrad');

decRad.addEventListener('click', function(e) {
	setRadius(radius - interval);
});

incRad.addEventListener('click', function(e) {
	setRadius(radius + interval);
});

setRadius(defaultRad);