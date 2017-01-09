import colors from './colors.js';
import { Point, PointCloud, Result, PDollarRecognizer } from './pdollar.js';

const Colors = new colors();

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const eraseBtn = document.getElementById('erase');
const pencilBtn = document.getElementById('pencil');
const replayBtn = document.getElementById('replay');

var pressure,
	setRadius,
	radius,
	r,
	g,
	b,
	x,
	y,
	isDown,
	type,
	points = [],
	strokes = [],
	redoStrokes = [];


var _points = new Array(),
	_strokeID = 0,
	_r = new PDollarRecognizer();

function init() {
	pressure = 0.5,
	setRadius = 10,
	radius = setRadius;
	type = 'pencil';

	r = Colors.getColors()[0],
	g = Colors.getColors()[1],
	b = Colors.getColors()[2];

	console.log(r, g, b);

	isDown = false;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	context.lineWidth = radius * 2;
	context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";
	context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";

	pencilBtn.addEventListener('click', function(e) {
		type = 'pencil';
	});

	eraseBtn.addEventListener('click', function(e) {
		type = 'eraser';
	});

	replayBtn.addEventListener('click', function(e) {
		redraw(strokes);
	})

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
		console.log(e.pressure);
		setContextStyle(r, g, b, e.pressure, type);
	});
}

function IndividualPoint(stroke_id, x, y, pressure) {
	this.ID = stroke_id;
	this.X = x;
	this.Y = y;
	this.pressure = pressure;
}

function Stroke(points, type, color, radius) {
	this.points = points;
	this.type = type;
	this.color = color;
	this.radius = radius;
}

function Drawing(strokes, canvasWidth, canvasHeight) {
	this.sketch_strokes = sketch_strokes;
	this.sketch_img = sketch_img;
	this.strokes = strokes;
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;

	ths.saveObject = function() {
		return {
			sketch_strokes: this.sketch_strokes,
			sketch_img: this.sketch_img,
			strokes: this.strokes,
			canvasWidth: this.canvasWidth,
			canvasHeight: this.canvasHeight,
		}
	}
}

function setContextStyle(r, g, b, pressure, type) {
	radius = setRadius * pressure;
	context.lineWidth = radius * 2;
	context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";
	context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";

	if (type === 'pencil') {
		pencil(r, g, b, pressure);
	} else {
		erase();
	}
}

function erase() {
	context.strokeStyle = "rgb(255, 255, 255)";
    context.globalCompositeOperation = "destination-out";  
    context.strokeStyle = ("rgba(255,255,255,255)");
    type = 'eraser';
}

function pencil(r, g, b, pressure) {
	context.globalCompositeOperation = 'source-over';
	context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";
	type = 'pencil';
}

function drawPoint(x, y, pressure, type, color) {
	setContextStyle(color[0], color[1], color[2], pressure, type);
	putPoint(null, x, y);
}

function drawStroke() {
	
}

function setXY(e) {
	x = e.clientX;
	y = e.clientY;
}

function putPoint(e, x, y) {
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
		points.push(new IndividualPoint(x, y, pressure, ++_strokeID));
		putPoint(e);
	}
}

function mouseDragEvent(e) {
	setXY(e);

	if(isDown) {
		points.push(new IndividualPoint(x, y, pressure, _strokeID));
		putPoint(e);
	}
}

function mouseUpEvent(e) {
	setXY(e);

	if(e.button <= 1) {
		strokes.push(new Stroke(points, type, [r, g, b], setRadius));
		points = [];
		isDown = false;
		context.beginPath();
	}
	
}

init();