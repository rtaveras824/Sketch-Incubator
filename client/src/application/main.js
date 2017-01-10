import colors from './colors.js';
import { Point, PointCloud, Result, PDollarRecognizer } from './pdollar.js';

const Colors = new colors();

var doubleCanvasSupport = (document.getElementsByTagName('canvas').length > 1) ? true : false;
console.log('double canvas', doubleCanvasSupport);

var currentCanvas,
	currentContext;

var canvas1 = document.getElementById('canvas'),
	context1 = canvas1.getContext('2d');


var eraseBtn = document.getElementById('erase'),
	pencilBtn = document.getElementById('pencil'),
	undoBtn = document.getElementById('undo_btn'),
	redoBtn = document.getElementById('redo_btn'),
	playWalkthruBtn = document.getElementById('play_walkthru'),
	stepWalkthruBtn = document.getElementById('step_walkthru');

/************* DOUBLE CANVAS SUPPORT *****************/
if (!doubleCanvasSupport) {
	console.log('test');

	currentCanvas = canvas1;
	currentContext = context1;

	var recordSketchBtn = document.getElementById('record_sketch'),
		recordWalkthruBtn = document.getElementById('record_walkthru');
} else {
	var canvas2 = document.getElementById('canvas2'),
		context2 = canvas2.getContext('2d');

		currentCanvas = canvas2;
		currentContext = context2;

	var playSketchBtn = document.getElementById('play_sketch'),
		userSetSketchBtn = document.getElementById('user_set_sketch'),
		clearSketch = document.getElementById('clear_sketch');
}

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
	userSketchDataURL,
	points = [],
	sketchStrokes = [],
	walkthruStrokes = [],
	strokes = [],
	redoStrokes = [],
	drawing,
	leftBoundX,
	rightBoundX,
	topBoundY,
	bottomBoundY;

var _points = new Array(),
	_strokeID = 0;

const _r = new PDollarRecognizer();

function init(data) {
	console.log('test2');
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

	setContextStyle(r, g, b, pressure, type, currentContext);

	/*************** DOUBLE CANVAS SUPPORT *********************/
	if (doubleCanvasSupport) {
		var halfWidth = window.innerWidth / 2,
			height = window.innerHeight;

		canvas.width = halfWidth;
		canvas.height = height;
		canvas2.width = halfWidth;
		canvas2.height = height;

		setContextStyle(r, g, b, pressure, type, context1);
	} else {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	leftBoundX = canvas.width / 2;
	rightBoundX = canvas.width / 2;
	topBoundY = canvas.height / 2;
	bottomBoundY = canvas.height / 2;


	// currentContext.lineWidth = radius * 2;
	// currentContext.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";
	// currentContext.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";

	pencilBtn.addEventListener('click', function(e) {
		type = 'pencil';
	});

	eraseBtn.addEventListener('click', function(e) {
		type = 'eraser';
	});

	undoBtn.addEventListener('click', function(e) {
		undo(e);
	});

	redoBtn.addEventListener('click', function(e) {
		redo(e);
	});

	stepWalkthruBtn.addEventListener('click', function(e) {
		reset(context1);
		steppin = true;

		if(doubleCanvasSupport) {
			setSketchBackground(sketchDataURL, context1);
		}
		
		redraw(walkthruStrokes, stepCounter);
	});

	playWalkthruBtn.addEventListener('click', function(e) {
		reset(context1);

		if(doubleCanvasSupport) {
			setSketchBackground(sketchDataURL, context1);
		}

		redraw(walkthruStrokes, 0);	
	});

	/**************** DOUBLE CANVAS SUPPORT ******************/
	if (!doubleCanvasSupport) {
		recordSketchBtn.addEventListener('click', function(e) {
			recordSketch(e);
		});

		recordWalkthruBtn.addEventListener('click', function(e) {
			recordWalkthru(e);
		});
	} else {
		playSketchBtn.addEventListener('click', function(e) {
			console.log('playsketch');
			reset(context1);
			redraw(sketchStrokes, 0);
		});

		userSetSketchBtn.addEventListener('click', function(e){
			userSetSketch(e);
		});
	}

	currentCanvas.addEventListener('mousedown', function(e) {
		mouseDownEvent(e);
	});

	currentCanvas.addEventListener('mouseup', function(e) {
		mouseUpEvent(e);
	});

	currentCanvas.addEventListener('mousemove', function(e) {
		mouseDragEvent(e);
	});

	currentCanvas.addEventListener('pointermove', function(e) {
		if (isDown) {
			pressure = e.pressure;
			setContextStyle(r, g, b, e.pressure, type, currentContext);
		}
	});
}

function IndividualPoint(strokeId, x, y, pressure) {
	this.ID = strokeId;
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

function Drawing(sketchStrokes, sketchImg, walkthruStrokes, walkthruImg, canvasWidth, canvasHeight) {
	this.sketchStrokes = sketchStrokes;
	this.sketchImg = sketchImg;
	this.walkthruStrokes = walkthruStrokes;
	this.walkthruImg = walkthruImg;
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;

	this.saveObject = function() {
		return {
			sketchStrokes: this.sketchStrokes,
			sketchImg: this.sketchImg,
			walkthruStrokes: this.walkthruStrokes,
			walkthruImg: this.walkthruImg,
			canvasWidth: this.canvasWidth,
			canvasHeight: this.canvasHeight,
		}
	}
}

function checkBounds() {
	if (x < leftBoundX) {
		leftBoundX = x;
	} else if (x > rightBoundX) {
		rightBoundX = x;
	}

	if (y < topBoundY) {
		topBoundY = y;
	} else if (y > bottomBoundY) {
		bottomBoundY = y;
	}
}

function erase(context) {
	if (context === context1) {
		context = context1;
	} else if (context === context2) {
		context = context2;
	} else {
		context = currentContext;
	}

	context.strokeStyle = "rgb(255, 255, 255)";
    context.globalCompositeOperation = "destination-out";  
    context.strokeStyle = ("rgb(255,255,255,255)");
}

function pencil(r, g, b, pressure, context) {
	if (context === context1) {
		context = context1;
	} else if (context === context2) {
		context = context2;
	} else {
		context = currentContext;
	}

	context.globalCompositeOperation = 'source-over';
	context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";
}

function drawPoint(x, y, pressure, type, color) {
	setContextStyle(color[0], color[1], color[2], pressure, type, context1);
	redrawPutPoint(x, y);
}

function mouseDownEvent(e) {
	setXY(e);

	if(e.button <= 1) {
		isDown = true;
		checkBounds();
		points.push(new IndividualPoint(++_strokeID, x, y, pressure));
		putPoint(e, x, y);
	}
}

function mouseDragEvent(e) {
	setXY(e);

	if(isDown) {
		checkBounds();
		console.log('bounds', leftBoundX, rightBoundX, topBoundY, bottomBoundY);
		points.push(new IndividualPoint(_strokeID, x, y, pressure));
		putPoint(e, x, y);
	}
}

function mouseUpEvent(e) {
	setXY(e);

	if(e.button <= 1) {
		if (points.length > 0) {
			if (sketchRecordState) {
				sketchStrokes.push(new Stroke(points, type, [r, g, b], setRadius));
			} else if (walkthruRecordState) {
				walkthruStrokes.push(new Stroke(points, type, [r, g, b], setRadius));
			}

			strokes.push(new Stroke(points, type, [r, g, b], setRadius));
		}
		
		points = [];

		if(steppin) {
			redraw(walkthruStrokes, stepCounter);
		}

		isDown = false;
		currentContext.beginPath();
	}	
}

function redraw(strokes, j) {
	var stroke = strokes[j],
		points = stroke.points,
		i = 0;

	var strokeDraw = window.setInterval(function() {
		var point = points[i];
		// context.beginPath();
		drawPoint(point.X, point.Y, point.pressure, stroke.type, stroke.color);
		i++;
		if (i >= points.length) {
			currentContext.beginPath();
			clearInterval(strokeDraw);
			i = 0;
			j++;
			if (!steppin) {
				if (j < strokes.length) {
					console.log(j);
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
		currentContext.lineTo(X, Y);
		currentContext.stroke();
		currentContext.beginPath();
		currentContext.arc(X, Y, radius, 0, Math.PI * 2);
		currentContext.fill();
		currentContext.beginPath();
		currentContext.moveTo(X, Y);
	}
}

function redrawPutPoint(X, Y) {
	context1.lineTo(X, Y);
	context1.stroke();
	context1.beginPath();
	context1.arc(X, Y, radius, 0, Math.PI * 2);
	context1.fill();
	context1.beginPath();
	context1.moveTo(X, Y);
}

function setSketchBackground(dataURL, context) {
	if (context === context1) {
		context = context1;
	} else if (context === context2 && typeof context2 !== 'undefined') {
		context = context2;
	} else {
		context = currentContext;
	}

	var imageObj = new Image();
	imageObj.onload = function() {
		context.save();
		context.globalAlpha = 0.3;
		context.drawImage(imageObj, 0, 0);
		context.restore();
	}

	imageObj.src = dataURL;
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
		setSketchBackground(sketchDataURL, currentContext);
		
		e.target.innerHTML = 'Record Sketch';
		sketchRecordState = false;
	}
}

function userSetSketch(e) {
	userSketchDataURL = currentCanvas.toDataURL();
	reset();
	setSketchBackground(userSketchDataURL, currentContext);
}

function recordWalkthru(e) {
	var buttonText = recordWalkthruBtn.innerHTML;

	if (buttonText === 'Record Walkthru') {
		reset();
		setSketchBackground(sketchDataURL, currentContext);
		walkthruDataURL = '';
		strokes = [];
		e.target.innerHTML = 'Save Walkthru';
		walkthruRecordState = true;
	} else {
		walkthruDataURL = canvas.toDataURL();

		drawing = new Drawing(sketchStrokes, sketchDataURL, walkthruStrokes, walkthruDataURL, canvas.width, canvas.height);
		document.getElementById('drawing_input').value = JSON.stringify(drawing.saveObject());
		var event = new Event('input', { bubbles: true });
		document.getElementById('drawing_input').dispatchEvent(event);

		// $('#drawing_input').val(JSON.stringify(drawing.saveObject())).trigger('change');

		e.target.innerHTML = 'Record Walkthru';
		walkthruRecordState = false;
	}
}

function quickDrawStrokes() {
	for(var i = 0; i < strokes.length; i++) {
		currentContext.beginPath();
		for(var j = 0; j < strokes[i].points.length; j++) {
			var point = strokes[i].points[j];
			drawPoint(point.X, point.Y, point.pressure, strokes[i].type, strokes[i].color);
		}
	}
}

function redo(e) {
	var firstRedoStroke = redoStrokes.pop();
	strokes.push(firstRedoStroke);

	if (sketchRecordState) {
		sketchStrokes.push(firstRedoStroke);
	} else if (walkthruRecordState) {
		walkthruStrokes.push(firstRedoStroke);
	}

	reset();

	quickDrawStrokes();
}

function undo(e) {
	var lastStroke = strokes.pop();
	redoStrokes.push(lastStroke);
	console.log(strokes);
	if (sketchRecordState) {
		sketchStrokes.splice(-1, 1);
	} else if (walkthruRecordState) {
		walkthruStrokes.splice(-1, 1);
	}

	reset();

	quickDrawStrokes();
}

function reset(context) {

	if (context === context1) {
		context = context1;
	} else if (context === context2 && typeof context2 !== 'undefined') {
		context = context2;
	} else {
		context = currentContext;
	}

	console.log(context);

	context.clearRect(0, 0, canvas.width, canvas.height);
	points = [];
}

function setContextStyle(r, g, b, pressure, type, context) {
	if (context === context1) {
		context = context1;
	} else if (context === context2) {
		context = context2;
	} else {
		context = currentContext;
	}

	radius = setRadius * pressure;
	context.lineWidth = radius * 2;
	context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";
	context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";

	if (type === 'pencil') {
		pencil(r, g, b, pressure, context);
	} else {
		erase(context);
	}
}

function setXY(e) {
	x = e.clientX;
	y = e.clientY;
}

init();

if (doubleCanvasSupport) {
	var checkForId = window.location.pathname.match('^/drawing/[a-zA-Z0-9]*/?$');
	console.log('reg', checkForId);

	var regReturn = checkForId[0].split('/');
	var token = localStorage.getItem('token');

	var ajax = new XMLHttpRequest();
	ajax.onload = function(response) {
		var responseParse = JSON.parse(response.target.response);
		var drawing = JSON.parse(responseParse[0].drawing);

		sketchStrokes = drawing.sketchStrokes;
		walkthruStrokes = drawing.walkthruStrokes;
		sketchDataURL = drawing.sketchImg;
		walkthruDataURL = drawing.walkthruImg;

		console.log(walkthruStrokes.length);
	};
	ajax.open('GET', `/api/drawing/${ regReturn[2] }`);
	ajax.setRequestHeader('Authorization', `bearer ${ token }`);
	ajax.send();
}