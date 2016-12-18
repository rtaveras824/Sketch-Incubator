var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var canvas2 = document.getElementById('canvas2');
var context2 = canvas2.getContext('2d');

var currentContext;

var radius = 1;
// var dragging = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
var type = '';
var recording = false;
var steppin = false;
var prevStepX;
var prevStepY;
// variable test gets set in index.handlebars

type = 'pencil';

function IndividualPoint(x, y, id) {
	this.X = x;
	this.Y = y;
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

var redraw = function(stroke, canvasWidth, canvasHeight) {
	var super_points = stroke.points;
	var ratio = .5;

	var strokeDraw = window.setInterval(function() {
		if (stroke.type === 'pencil') {
			pencil(context);
			context.fillStyle = 'red';
			context.strokeStyle = 'red';
		} else if (stroke.type === 'eraser') {
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
				if (j < test.strokes.length) {
					console.log(j);
					redraw(test.strokes[j]);
				}
			}
		}
	}, 5);
}

var replayBtn = document.getElementById('replay_btn');
replayBtn.addEventListener('click', function(e) {

	reset();
	i = 0;
	j = 0;
	steppin = false;

	redraw(test.strokes[i], test.canvasWidth, test.canvasHeight);
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

	redraw(test.strokes[i], test.canvasWidth, test.canvasHeight);
}

var stepBtn = document.getElementById('step_btn');
stepBtn.addEventListener('click', stepByStep);

function reset() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	points = [];
	strokes = [];
}
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

	var x = e.clientX;
	var y = e.clientY;
	if (e.button <= 1) {
		_isDown = true;
		if(_strokeID == 0) {
			_points.length = 0;
		}
		_points[_points.length] = new Point(x, y, ++_strokeID);

		if (recording) {
			points.push(new IndividualPoint(x, y, ++_strokeID));
		}
		
		putPoint(e, currentContext);
	}
}

function mouseDragEvent(e, context) {
	var x = e.clientX;
	var y = e.clientY;
	if (_isDown) {
		_points[_points.length] = new Point(x, y, _strokeID);

		if (recording) {
			points.push(new IndividualPoint(x, y, _strokeID));
		}
		
		putPoint(e, currentContext);
	}
}

function mouseUpEvent(e, context) {
	if (e.button <= 1) {
		if (_isDown) {
			if (recording) {
				strokes.push(new Stroke(points, type));
				points = [];
			} else if (steppin) {
				if (j < test.strokes.length)
					redraw(test.strokes[j], test.canvasWidth, test.canvasHeight);
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

canvas2.addEventListener('mousedown', function(e) {
	mouseDownEvent(e, context2)
});
canvas2.addEventListener('mouseup', function(e) {
	mouseUpEvent(e, context2)
});
canvas2.addEventListener('mousemove', function(e) {
	mouseDragEvent(e, context2)
});