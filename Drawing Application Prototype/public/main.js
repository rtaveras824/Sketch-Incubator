var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var canvas2 = document.getElementById('canvas2');
var context2 = canvas2.getContext('2d');

var currentContext = context;

var pressure = 1;
var radius = 1;
// var dragging = false;

canvas.width = (window.innerWidth / 2);
canvas.height = window.innerHeight;

canvas2.width = canvas.width;
canvas2.height = canvas.height;

var halfSizeWidth = window.innerWidth / 2;
var height = window.innerHeight;

context.lineWidth = radius*2;
context2.lineWidth = radius*2;
context2.fillStyle = 'black';
context2.strokeStyle = 'black';

var _points = new Array();
var _strokeID = 0;
var _r = new PDollarRecognizer();
var _isDown = false;

/* My CODE */

var points = [];
var strokes = [];
var redoStrokes = [];
var type = '';
var recording = false;
var steppin = false;
var prevStepX;
var prevStepY;
// variable test gets set in index.handlebars

type = 'pencil';

function IndividualPoint(x, y, pressure, id) {
	this.X = x;
	this.Y = y;
	this.Pressure = pressure;
	this.ID = id;
}

function Stroke(points, type) {
	this.points = points;
	this.type = type;
}

function Drawing(strokes, canvasWidth, canvasHeight) {
	this.strokes = strokes;
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;

	this.saveObject = function() {
		return {
			strokes: this.strokes,
			canvasWidth: this.canvasWidth,
			canvasHeight: this.canvasHeight
		}
	}
}

var redraw = function(strokes, length, canvasWidth, canvasHeight, intervalTime) {
	var super_points = strokes[j].points;
	var ratio = .5;
	var time;
	
	if (typeof intervalTime === 'undefined') {
		time = 5;
	} else {
		time = intervalTime;
	}
	console.log('interval time', time);

	var strokeDraw = window.setInterval(function() {
		if (strokes[j].type === 'pencil') {
			pencil(context);
			// context.fillStyle = 'red';
			// context.strokeStyle = 'red';
			radius = 10 * super_points[i].Pressure;
			context.lineWidth = radius * 2;
			context.fillStyle = ("rgba(0,0,0," + super_points[i].Pressure + ")");
			context.strokeStyle = ("rgba(0,0,0," + super_points[i].Pressure + ")");
		} else if (strokes[j].type === 'eraser') {
			erase(context);
		}

		var x = super_points[i].X * ratio;
		var y = super_points[i].Y * ratio;


		// if (steppin) {
		// 	context.moveTo(x, y);
		// }

		context.lineTo(x, y);
		context.stroke();
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI*2);
		// Firefox does not support offsetX or offsetY, so use client instead
		// context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
		// context.arc(x, y, radius, startAngle, endAngle); // Angle in radians
		context.fill();
		context.beginPath();
		context.moveTo(x, y);
		prevStepX = x;
		prevStepY = y;
		i++
		if (i >= super_points.length) {
			context.beginPath();
			clearInterval(strokeDraw);
			i = 0;
			j++;
			if (!steppin) {
				if (j < length) {
					console.log(j);
					redraw(strokes, length);
				}
			}
		}
	}, time);
}

var replayBtn = document.getElementById('replay_btn');
replayBtn.addEventListener('click', function(e) {

	reset();
	i = 0;
	j = 0;
	steppin = false;

	redraw(test.strokes, test.strokes.length, test.canvasWidth, test.canvasHeight);
});

function erase(context) {
	context.strokeStyle = "rgb(255, 255, 255)";
    context.globalCompositeOperation = "destination-out";  
    context.strokeStyle = ("rgba(255,255,255,255)");
    type = 'eraser';
}
var eraseBtn = document.getElementById('erase_btn');
eraseBtn.addEventListener('click', function(e) {
	erase(currentContext)
});

function pencil(context) {
	context.globalCompositeOperation = 'source-over';
	context.strokeStyle = 'black';
	type = 'pencil';
}
var pencilBtn = document.getElementById('pencil_btn');
pencilBtn.addEventListener('click', function(e) {
	pencil(currentContext)
});

function record() {
	var recordBtnText = recordBtn.innerHTML;
	if (recordBtnText === 'Record') {
		reset();
		recordBtn.innerHTML = 'Stop';
		recording = true;
	} else {
		recordBtn.innerHTML = 'Record';
		recording = false;
		test = new Drawing(strokes, canvas.width, canvas.height);
		console.log(JSON.stringify(test.saveObject()));
		document.getElementById('drawing_input').value = JSON.stringify(test.saveObject());
	}
}

var recordBtn = document.getElementById('record_btn');
recordBtn.addEventListener('click', record);

function stepByStep() {
	reset();
	i = 0;
	j = 0;
	recording = false;
	steppin = true;
	currentContext = context2;

	console.log(new PointCloud('title', test.strokes[j].points));
	_r.PointClouds.push(new PointCloud('title', test.strokes[j].points));

	// canvas2.style.display = 'block';
	// canvas2.width = halfSizeWidth;
	// canvas2.height = height;
	// canvas2.style.float = 'right';
	// canvas.width = halfSizeWidth;
	// canvas.style.float = 'left';

	redraw(test.strokes, test.strokes.length, test.canvasWidth, test.canvasHeight);
}

var stepBtn = document.getElementById('step_btn');
stepBtn.addEventListener('click', stepByStep);

function reset() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	points = [];
	strokes = [];
}

function undo() {
	var lastStroke = strokes.pop();
	redoStrokes.push(lastStroke);

	context.clearRect(0, 0, canvas.width, canvas.height);
	// i = 0;
	// j = 0;
	steppin = false;

	// redraw(strokes, strokes.length, canvas.width, canvas.height, 0);
	for (var i = 0; i < strokes.length; i++) {
		for (var j = 0; j < strokes[i].points.length; j++) {
			if (strokes[i].points[j].Pressure !== 0.5) {
				pressure = strokes[i].points[j].Pressure;
			} else {
				pressure = 1;
			}


			if (strokes[i].type === 'pencil') {
				pencil(context);
				// context.fillStyle = 'red';
				// context.strokeStyle = 'red';
				radius = 10 * pressure;
				context.lineWidth = radius * 2;
				context.fillStyle = ("rgba(0,0,0," + pressure + ")");
				context.strokeStyle = ("rgba(0,0,0," + pressure + ")");
			} else if (strokes[i].type === 'eraser') {
				erase(context);
			}

			var x = strokes[i].points[j].X;
			var y = strokes[i].points[j].Y;

			console.log('stroke', i, 'point', j);
			context.lineTo(x, y);
			context.stroke();
			context.beginPath();
			context.arc(x, y, radius, 0, Math.PI*2);
			// Firefox does not support offsetX or offsetY, so use client instead
			// context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
			// context.arc(x, y, radius, startAngle, endAngle); // Angle in radians
			context.fill();
			context.beginPath();
			context.moveTo(x, y);
		}
	}
}

var undoBtn = document.getElementById('undo_btn');
undoBtn.addEventListener('click', undo);

function redo() {
	var firstRedoStroke = redoStrokes.pop();
	strokes.push(firstRedoStroke);

	context.clearRect(0, 0, canvas.width, canvas.height);
	// i = 0;
	// j = 0;
	steppin = false;

	// redraw(strokes, strokes.length, canvas.width, canvas.height, 0);
	for (var i = 0; i < strokes.length; i++) {
		for (var j = 0; j < strokes[i].points.length; j++) {
			if (strokes[i].points[j].Pressure !== 0.5) {
				pressure = strokes[i].points[j].Pressure;
			} else {
				pressure = 1;
			}


			if (strokes[i].type === 'pencil') {
				pencil(context);
				// context.fillStyle = 'red';
				// context.strokeStyle = 'red';
				radius = 10 * pressure;
				context.lineWidth = radius * 2;
				context.fillStyle = ("rgba(0,0,0," + pressure + ")");
				context.strokeStyle = ("rgba(0,0,0," + pressure + ")");
			} else if (strokes[i].type === 'eraser') {
				erase(context);
			}

			var x = strokes[i].points[j].X;
			var y = strokes[i].points[j].Y;

			console.log('stroke', i, 'point', j);
			context.lineTo(x, y);
			context.stroke();
			context.beginPath();
			context.arc(x, y, radius, 0, Math.PI*2);
			// Firefox does not support offsetX or offsetY, so use client instead
			// context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
			// context.arc(x, y, radius, startAngle, endAngle); // Angle in radians
			context.fill();
			context.beginPath();
			context.moveTo(x, y);
		}
	}
}

var redoBtn = document.getElementById('redo_btn');
redoBtn.addEventListener('click', redo);
/* END MY CODE */

var putPoint = function(e, context) {
	if (_isDown) {
		context.lineTo(e.clientX, e.clientY);
		context.stroke();
		context.beginPath();
		context.arc(e.clientX, e.clientY, radius, 0, Math.PI*2);
		// Firefox does not support offsetX or offsetY, so use client instead
		// context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
		// context.arc(x, y, radius, startAngle, endAngle); // Angle in radians
		context.fill();
		context.beginPath();
		context.moveTo(e.clientX, e.clientY);

	}
}

// var engage = function(e) {
// 	dragging = true;
// 	putPoint(e);
// }

// var disengage = function() {
// 	_isDown = false;
// 	context.beginPath();
// }

function mouseDownEvent(e, context) {
	currentContext = context;
	console.log(currentContext);

	redoStrokes = [];

	var x = e.clientX;
	var y = e.clientY;
	if (e.button <= 1) {
		_isDown = true;
		if(_strokeID == 0) {
			_points.length = 0;
		}
		_points[_points.length] = new Point(x, y, ++_strokeID);

		//if (recording) {
			points.push(new IndividualPoint(x, y, pressure, ++_strokeID));
		//}
		
		putPoint(e, currentContext);
	}
}

function mouseDragEvent(e, context) {
	var x = e.clientX;
	var y = e.clientY;
	if (_isDown) {
		_points[_points.length] = new Point(x, y, _strokeID);

		// if (recording) {
			points.push(new IndividualPoint(x, y, pressure, _strokeID));
		// }
		
		putPoint(e, currentContext);
	}
}

function mouseUpEvent(e, context) {
	if (e.button <= 1) {
		if (_isDown) {
			//if (recording) {
			strokes.push(new Stroke(points, type));
			points = [];
			//}
			if (steppin) {
				if (j < test.strokes.length)
					redraw(test.strokes, test.strokes.length, test.canvasWidth, test.canvasHeight);
					_r.PointClouds[_r.PointClouds.length - 1] = new PointCloud('title2', test.strokes[j].points);
			}
			
			_isDown = false;
			context.beginPath();
		}
	} else if (e.button == 2) {
		var str = '';
		console.log('points', _points.length);
		if (_points.length >= 10) {
			for (var i = 0; i < _points.length; i++) {
				str += 'new Point(' + _points[i].X + ', ' + _points[i].Y + ', ' + _points[i].ID + '), ';
			}
			var result = _r.Recognize(_points);
			console.log(str);
			console.log(result.Name);
			console.log(result.Score);
		} else {
			console.log("Too little input made. Please try again.");
		}
		_strokeID = 0; // signal to begin new gesture
	}
	
}

canvas.addEventListener('mousedown', function(e) {
	mouseDownEvent(e, context)
});
canvas.addEventListener('mouseup', function(e) {
	mouseUpEvent(e, context)
});
canvas.addEventListener('mousemove', function(e) {
	mouseDragEvent(e, context)
});

canvas.addEventListener('pointermove', function(e) {
	pressure = e.pressure;
	radius = 10 * e.pressure;
	context.lineWidth = radius * 2;
	context.fillStyle = ("rgba(0,0,0," + e.pressure + ")");
	context.strokeStyle = ("rgba(0,0,0," + e.pressure*2 + ")");
});

window.addEventListener('keydown', function(e) {
	var keyPressed = e.which || e.keyCode;
	console.log(keyPressed);
	switch (keyPressed) {
		case 90:
			console.log('undo');
			undo();
			break;
		case 88:
			console.log('redo');
			redo();
			break;
		default:
			console.log('default');
	}
});

canvas2.addEventListener('mousedown', function(e) {
	mouseDownEvent(e, context2)
});
canvas2.addEventListener('mouseup', function(e) {
	mouseUpEvent(e, context2)
});
canvas2.addEventListener('mousemove', function(e) {
	mouseDragEvent(e, context2)
});