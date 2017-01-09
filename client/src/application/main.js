import colors from './colors.js';
import { Point, PointCloud, Result, PDollarRecognizer } from './pdollar.js';

const Colors = new colors();

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const eraseBtn = document.getElementById('erase');
const pencilBtn = document.getElementById('pencil');
const recordSketchBtn = document.getElementById('record_sketch');
const recordWalkthruBtn = document.getElementById('record_walkthru');
const undoBtn = document.getElementById('undo_btn');
const redoBtn = document.getElementById('redo_btn');
const replayBtn = document.getElementById('replay_btn');
const stepBtn = document.getElementById('step_btn');

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
	sketchRecordState,
	walkthruRecordState,
	steppin,
	stepCounter,
	sketchDataURL,
	walkthruDataURL,
	points = [],
	sketchStrokes = [],
	walkthruStrokes = [],
	strokes = [],
	redoStrokes = [];

var _points = new Array(),
	_strokeID = 0;

const _r = new PDollarRecognizer();

function init() {
	pressure = 0.5,
	setRadius = 10,
	radius = setRadius * pressure;
	type = 'pencil';

	r = Colors.getColors()[0],
	g = Colors.getColors()[1],
	b = Colors.getColors()[2];

	isDown = false,
	sketchRecordState = false,
	walkthruRecordState = false;
	stepCounter = 0;

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

	recordSketchBtn.addEventListener('click', function(e) {
		recordSketch(e);
	});

	recordWalkthruBtn.addEventListener('click', function(e) {
		recordWalkthru(e);
	});

	undoBtn.addEventListener('click', function(e) {
		undo(e);
	});

	redoBtn.addEventListener('click', function(e) {
		redo(e);
	});

	stepBtn.addEventListener('click', function(e) {
		stepByStep(e);
	});

	replayBtn.addEventListener('click', function(e) {
		reset();
		redraw(strokes, 0);
	})

	canvas.addEventListener('mousedown', function(e) {
		mouseDownEvent(e);
	});

	canvas.addEventListener('mouseup', function(e) {
		mouseUpEvent(e);
	});

	canvas.addEventListener('mousemove', function(e) {
		mouseDragEvent(e);
	});

	canvas.addEventListener('pointermove', function(e) {
		if (isDown) {
			pressure = e.pressure;
			setContextStyle(r, g, b, e.pressure, type);
		}
		
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

function erase() {
	context.strokeStyle = "rgb(255, 255, 255)";
    context.globalCompositeOperation = "destination-out";  
    context.strokeStyle = ("rgb(255,255,255,255)");
}

function pencil(r, g, b, pressure) {
	context.globalCompositeOperation = 'source-over';
	context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";
}

function drawPoint(x, y, pressure, type, color) {
	console.log(type);
	setContextStyle(color[0], color[1], color[2], pressure, type);
	redrawPutPoint(x, y);
}

function mouseDownEvent(e) {
	setXY(e);

	if(e.button <= 1) {
		isDown = true;
		points.push(new IndividualPoint(++_strokeID, x, y, pressure));
		putPoint(e, x, y);
	}
}

function mouseDragEvent(e) {
	setXY(e);

	if(isDown) {
		points.push(new IndividualPoint(_strokeID, x, y, pressure));
		putPoint(e, x, y);
	}
}

function mouseUpEvent(e) {
	setXY(e);

	if(e.button <= 1) {
		if (sketchRecordState) {
			sketchStrokes.push(new Stroke(points, type, [r, g, b], setRadius));
		} else if (walkthruRecordState) {
			walkthruStrokes.push(new Stroke(points, type, [r, g, b], setRadius));
		}

		strokes.push(new Stroke(points, type, [r, g, b], setRadius));
		points = [];

		if(steppin) {
			redraw(walkthruStrokes, stepCounter);
		}

		isDown = false;
		context.beginPath();
	}	
}

function redraw(strokes, j) {
	var stroke = strokes[j],
		points = stroke.points,
		r = stroke.color[0],
		g = stroke.color[1],
		b = stroke.color[2],
		i = 0;

	var strokeDraw = window.setInterval(function() {
		var point = points[i];
		console.log(stroke.type);
		//context.beginPath();
		drawPoint(point.X, point.Y, point.Pressure, stroke.type, stroke.color);
		i++;
		if (i >= points.length) {
			context.beginPath();
			clearInterval(strokeDraw);
			i = 0;
			j++;
			if (!steppin) {
				if (j < strokes.length) {
					redraw(strokes, j);
				}
			} else {
				if (j > strokes.length) {
					steppin = false;
					stepCounter = 0;
				} else {
					stepCounter++;
				}
			}
		}
	}, 5);
}

function putPoint(e, X, Y) {
	if(isDown) {
		context.lineTo(X, Y);
		context.stroke();
		context.beginPath();
		context.arc(X, Y, radius, 0, Math.PI * 2);
		context.fill();
		context.beginPath();
		context.moveTo(X, Y);
	}
}

function redrawPutPoint(X, Y) {
	context.lineTo(X, Y);
	context.stroke();
	context.beginPath();
	context.arc(X, Y, 10, 0, Math.PI * 2);
	context.fill();
	context.beginPath();
	context.moveTo(X, Y);
}

function setSketchBackground() {
	var imageObj = new Image();
	imageObj.onload = function() {
		context.save();
		context.globalAlpha = 0.5;
		context.drawImage(imageObj, 0, 0);
		context.restore();
	}

	imageObj.src = sketchDataURL;
}

function recordSketch(e) {
	var buttonText = recordSketchBtn.innerHTML;

	if (buttonText === 'Record Sketch') {
		reset();
		sketchDataURL = '';
		sketchStrokes = [];
		e.target.innerHTML = 'Save Sketch';
		sketchRecordState = true;
	} else {
		sketchDataURL = canvas.toDataURL();
		reset();
		setSketchBackground();
		
		e.target.innerHTML = 'Record Sketch';
		sketchRecordState = false;
	}
}

function recordWalkthru(e) {
	var buttonText = recordWalkthruBtn.innerHTML;

	if (buttonText === 'Record Walkthru') {
		reset();
		setSketchBackground();
		walkthruDataURL = '';
		strokes = [];
		e.target.innerHTML = 'Save Walkthru';
		walkthruRecordState = true;
	} else {
		walkthruDataURL = canvas.toDataURL();

		e.target.innerHTML = 'Record Walkthru';
		walkthruRecordState = false;
	}
}

function quickDrawStrokes() {
	for(var i = 0; i < strokes.length; i++) {
		context.beginPath();
		for(var j = 0; j < strokes[i].points.length; j++) {
			var point = strokes[i].points[j];
			drawPoint(point.X, point.Y, point.Pressure, strokes[i].type, strokes[i].color);
		}
	}
}

function redo(e) {
	var firstRedoStroke = redoStrokes.pop();
	strokes.push(firstRedoStroke);

	reset();

	quickDrawStrokes();
}

function undo(e) {
	var lastStroke = strokes.pop();
	redoStrokes.push(lastStroke);
	console.log(strokes);

	reset();

	quickDrawStrokes();
}

function reset() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	points = [];
}

function setContextStyle(r, g, b, pressure, type) {
	console.log('working');
	radius = setRadius * pressure;
	context.lineWidth = radius * 2;
	context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";
	context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";

	if (type === 'pencil') {
		console.log('pencil');
		pencil(r, g, b, pressure);
	} else {
		console.log('err');
		erase();
	}
}

function setXY(e) {
	x = e.clientX;
	y = e.clientY;
}

function stepByStep(e) {
	reset();
	steppin = true;
	
	redraw(walkthruStrokes, stepCounter);
}

init();