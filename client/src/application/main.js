import colors from './colors.js';

const Colors = new colors();

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

var pressure,
	setRadius,
	radius,
	r,
	g,
	b,
	x,
	y,
	isDown;

function init() {
	pressure = 1,
	setRadius = 10,
	radius = setRadius;

	r = Colors.getColors[0],
	g = Colors.getColors[1],
	b = Colors.getColors[2];

	isDown = false;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	context.lineWidth = radius * 2;
	context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";
	context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";

	canvas.addEventListener('mousedown', function(e) {
		mouseDownEvent(e);
	});
	canvas.addEventListener('mouseup', function(e) {
		mouseUpEvent(e);
	});
	canvas.addEventListener('mousemove', function(e) {
		console.log('mousemove');
		mouseDragEvent(e);
	});
	canvas.addEventListener('pointermove', function(e) {
		console.log('pointermove');
		pressure = e.pressure;
		radius = setRadius * pressure;
		context.lineWidth = radius * 2;
		context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + e.pressure + ")";
		context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + e.pressure + ")";
	});
}

function setXY(e) {
	x = e.clientX;
	y = e.clientY;
}

function putPoint(e) {
	if(isDown) {
		context.lineTo(x, y);
		context.stroke();
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI * 2);
		context.fill();
		context.beginPath();
		context.moveTo(x, y);
	}
}

function mouseDownEvent(e) {
	setXY(e);

	if(e.button <= 1) {
		isDown = true;
		putPoint(e);
	}
}

function mouseDragEvent(e) {
	setXY(e);

	if(isDown) {
		putPoint(e);
	}
}

function mouseUpEvent(e) {
	setXY(e);

	isDown = false;
	context.beginPath();
}

init();