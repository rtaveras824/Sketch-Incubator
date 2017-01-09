/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _colors = __webpack_require__(274);

	var _colors2 = _interopRequireDefault(_colors);

	var _pdollar = __webpack_require__(275);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Colors = new _colors2.default();

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var eraseBtn = document.getElementById('erase');
	var pencilBtn = document.getElementById('pencil');
	var recordSketchBtn = document.getElementById('record_sketch');
	var recordWalkthruBtn = document.getElementById('record_walkthru');
	var undoBtn = document.getElementById('undo_btn');
	var redoBtn = document.getElementById('redo_btn');
	var replayBtn = document.getElementById('replay_btn');
	var stepBtn = document.getElementById('step_btn');

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

	var _r = new _pdollar.PDollarRecognizer();

	function init() {
		pressure = 0.5, setRadius = 10, radius = setRadius * pressure;
		type = 'pencil';

		r = Colors.getColors()[0], g = Colors.getColors()[1], b = Colors.getColors()[2];

		isDown = false, sketchRecordState = false, walkthruRecordState = false;
		stepCounter = 0;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		context.lineWidth = radius * 2;
		context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";
		context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";

		pencilBtn.addEventListener('click', function (e) {
			type = 'pencil';
		});

		eraseBtn.addEventListener('click', function (e) {
			type = 'eraser';
		});

		recordSketchBtn.addEventListener('click', function (e) {
			recordSketch(e);
		});

		recordWalkthruBtn.addEventListener('click', function (e) {
			recordWalkthru(e);
		});

		undoBtn.addEventListener('click', function (e) {
			undo(e);
		});

		redoBtn.addEventListener('click', function (e) {
			redo(e);
		});

		stepBtn.addEventListener('click', function (e) {
			stepByStep(e);
		});

		replayBtn.addEventListener('click', function (e) {
			reset();
			redraw(strokes, 0);
		});

		canvas.addEventListener('mousedown', function (e) {
			mouseDownEvent(e);
		});

		canvas.addEventListener('mouseup', function (e) {
			mouseUpEvent(e);
		});

		canvas.addEventListener('mousemove', function (e) {
			mouseDragEvent(e);
		});

		canvas.addEventListener('pointermove', function (e) {
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

		ths.saveObject = function () {
			return {
				sketch_strokes: this.sketch_strokes,
				sketch_img: this.sketch_img,
				strokes: this.strokes,
				canvasWidth: this.canvasWidth,
				canvasHeight: this.canvasHeight
			};
		};
	}

	function erase() {
		context.strokeStyle = "rgb(255, 255, 255)";
		context.globalCompositeOperation = "destination-out";
		context.strokeStyle = "rgb(255,255,255,255)";
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

		if (e.button <= 1) {
			isDown = true;
			points.push(new IndividualPoint(++_strokeID, x, y, pressure));
			putPoint(e, x, y);
		}
	}

	function mouseDragEvent(e) {
		setXY(e);

		if (isDown) {
			points.push(new IndividualPoint(_strokeID, x, y, pressure));
			putPoint(e, x, y);
		}
	}

	function mouseUpEvent(e) {
		setXY(e);

		if (e.button <= 1) {
			if (sketchRecordState) {
				sketchStrokes.push(new Stroke(points, type, [r, g, b], setRadius));
			} else if (walkthruRecordState) {
				walkthruStrokes.push(new Stroke(points, type, [r, g, b], setRadius));
			}

			strokes.push(new Stroke(points, type, [r, g, b], setRadius));
			points = [];

			if (steppin) {
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

		var strokeDraw = window.setInterval(function () {
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
		if (isDown) {
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
		imageObj.onload = function () {
			context.save();
			context.globalAlpha = 0.5;
			context.drawImage(imageObj, 0, 0);
			context.restore();
		};

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
		for (var i = 0; i < strokes.length; i++) {
			context.beginPath();
			for (var j = 0; j < strokes[i].points.length; j++) {
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

/***/ },

/***/ 274:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Colors = function () {
		function Colors() {
			_classCallCheck(this, Colors);

			this.r = 120;
			this.g = 80;
			this.b = 180;
		}

		_createClass(Colors, [{
			key: "getColors",
			value: function getColors() {
				return [this.r, this.b, this.g];
			}
		}]);

		return Colors;
	}();

	;

	exports.default = Colors;

/***/ },

/***/ 275:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
	 * The $P Point-Cloud Recognizer (JavaScript version)
	 *
	 * 	Radu-Daniel Vatavu, Ph.D.
	 *	University Stefan cel Mare of Suceava
	 *	Suceava 720229, Romania
	 *	vatavu@eed.usv.ro
	 *
	 *	Lisa Anthony, Ph.D.
	 *      UMBC
	 *      Information Systems Department
	 *      1000 Hilltop Circle
	 *      Baltimore, MD 21250
	 *      lanthony@umbc.edu
	 *
	 *	Jacob O. Wobbrock, Ph.D.
	 * 	The Information School
	 *	University of Washington
	 *	Seattle, WA 98195-2840
	 *	wobbrock@uw.edu
	 *
	 * The academic publication for the $P recognizer, and what should be 
	 * used to cite it, is:
	 *
	 *	Vatavu, R.-D., Anthony, L. and Wobbrock, J.O. (2012).  
	 *	  Gestures as point clouds: A $P recognizer for user interface 
	 *	  prototypes. Proceedings of the ACM Int'l Conference on  
	 *	  Multimodal Interfaces (ICMI '12). Santa Monica, California  
	 *	  (October 22-26, 2012). New York: ACM Press, pp. 273-280.
	 *
	 * This software is distributed under the "New BSD License" agreement:
	 *
	 * Copyright (c) 2012, Radu-Daniel Vatavu, Lisa Anthony, and 
	 * Jacob O. Wobbrock. All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are met:
	 *    * Redistributions of source code must retain the above copyright
	 *      notice, this list of conditions and the following disclaimer.
	 *    * Redistributions in binary form must reproduce the above copyright
	 *      notice, this list of conditions and the following disclaimer in the
	 *      documentation and/or other materials provided with the distribution.
	 *    * Neither the names of the University Stefan cel Mare of Suceava, 
	 *	University of Washington, nor UMBC, nor the names of its contributors 
	 *	may be used to endorse or promote products derived from this software 
	 *	without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
	 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
	 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
	 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Radu-Daniel Vatavu OR Lisa Anthony
	 * OR Jacob O. Wobbrock BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
	 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT 
	 * OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
	 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
	 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
	 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
	 * SUCH DAMAGE.
	**/
	//
	// Point class
	//
	function Point(x, y, id) // constructor
	{
		this.X = x;
		this.Y = y;
		this.ID = id; // stroke ID to which this point belongs (1,2,...)
	}
	//
	// PointCloud class: a point-cloud template
	//
	function PointCloud(name, points) // constructor
	{
		this.Name = name;
		this.Points = Resample(points, NumPoints);
		this.Points = Scale(this.Points);
		this.Points = TranslateTo(this.Points, Origin);
	}
	//
	// Result class
	//
	function Result(name, score) // constructor
	{
		this.Name = name;
		this.Score = score;
	}
	//
	// PDollarRecognizer class constants
	//
	var NumPointClouds = 17;
	var NumPoints = 32;
	var Origin = new Point(0, 0, 0);
	//
	// PDollarRecognizer class
	//
	function PDollarRecognizer() // constructor
	{
		//
		// one predefined point-cloud for each gesture
		//
		// this.PointClouds = new Array(NumPointClouds);
		this.PointClouds = [];
		// this.PointClouds[0] = new PointCloud("T", new Array(
		// 	new Point(30,7,1),new Point(103,7,1),
		// 	new Point(66,7,2),new Point(66,87,2)
		// ));
		// this.PointClouds[1] = new PointCloud("N", new Array(
		// 	new Point(177,92,1),new Point(177,2,1),
		// 	new Point(182,1,2),new Point(246,95,2),
		// 	new Point(247,87,3),new Point(247,1,3)
		// ));
		// this.PointClouds[2] = new PointCloud("D", new Array(
		// 	new Point(345,9,1),new Point(345,87,1),
		// 	new Point(351,8,2),new Point(363,8,2),new Point(372,9,2),new Point(380,11,2),new Point(386,14,2),new Point(391,17,2),new Point(394,22,2),new Point(397,28,2),new Point(399,34,2),new Point(400,42,2),new Point(400,50,2),new Point(400,56,2),new Point(399,61,2),new Point(397,66,2),new Point(394,70,2),new Point(391,74,2),new Point(386,78,2),new Point(382,81,2),new Point(377,83,2),new Point(372,85,2),new Point(367,87,2),new Point(360,87,2),new Point(355,88,2),new Point(349,87,2)
		// ));
		// this.PointClouds[3] = new PointCloud("P", new Array(
		// 	new Point(507,8,1),new Point(507,87,1),
		// 	new Point(513,7,2),new Point(528,7,2),new Point(537,8,2),new Point(544,10,2),new Point(550,12,2),new Point(555,15,2),new Point(558,18,2),new Point(560,22,2),new Point(561,27,2),new Point(562,33,2),new Point(561,37,2),new Point(559,42,2),new Point(556,45,2),new Point(550,48,2),new Point(544,51,2),new Point(538,53,2),new Point(532,54,2),new Point(525,55,2),new Point(519,55,2),new Point(513,55,2),new Point(510,55,2)
		// ));
		// this.PointClouds[4] = new PointCloud("X", new Array(
		// 	new Point(30,146,1),new Point(106,222,1),
		// 	new Point(30,225,2),new Point(106,146,2)
		// ));
		// this.PointClouds[5] = new PointCloud("H", new Array(
		// 	new Point(188,137,1),new Point(188,225,1),
		// 	new Point(188,180,2),new Point(241,180,2),
		// 	new Point(241,137,3),new Point(241,225,3)
		// ));
		// this.PointClouds[6] = new PointCloud("I", new Array(
		// 	new Point(371,149,1),new Point(371,221,1),
		// 	new Point(341,149,2),new Point(401,149,2),
		// 	new Point(341,221,3),new Point(401,221,3)
		// ));
		// this.PointClouds[7] = new PointCloud("exclamation", new Array(
		// 	new Point(526,142,1),new Point(526,204,1),
		// 	new Point(526,221,2)
		// ));
		// this.PointClouds[8] = new PointCloud("line", new Array(
		// 	new Point(12,347,1),new Point(119,347,1)
		// ));
		// this.PointClouds[9] = new PointCloud("five-point star", new Array(
		// 	new Point(177,396,1),new Point(223,299,1),new Point(262,396,1),new Point(168,332,1),new Point(278,332,1),new Point(184,397,1)
		// ));
		// this.PointClouds[10] = new PointCloud("null", new Array(
		// 	new Point(382,310,1),new Point(377,308,1),new Point(373,307,1),new Point(366,307,1),new Point(360,310,1),new Point(356,313,1),new Point(353,316,1),new Point(349,321,1),new Point(347,326,1),new Point(344,331,1),new Point(342,337,1),new Point(341,343,1),new Point(341,350,1),new Point(341,358,1),new Point(342,362,1),new Point(344,366,1),new Point(347,370,1),new Point(351,374,1),new Point(356,379,1),new Point(361,382,1),new Point(368,385,1),new Point(374,387,1),new Point(381,387,1),new Point(390,387,1),new Point(397,385,1),new Point(404,382,1),new Point(408,378,1),new Point(412,373,1),new Point(416,367,1),new Point(418,361,1),new Point(419,353,1),new Point(418,346,1),new Point(417,341,1),new Point(416,336,1),new Point(413,331,1),new Point(410,326,1),new Point(404,320,1),new Point(400,317,1),new Point(393,313,1),new Point(392,312,1),
		// 	new Point(418,309,2),new Point(337,390,2)
		// ));
		// this.PointClouds[11] = new PointCloud("arrowhead", new Array(
		// 	new Point(506,349,1),new Point(574,349,1),
		// 	new Point(525,306,2),new Point(584,349,2),new Point(525,388,2)
		// ));
		// this.PointClouds[12] = new PointCloud("pitchfork", new Array(
		// 	new Point(38,470,1),new Point(36,476,1),new Point(36,482,1),new Point(37,489,1),new Point(39,496,1),new Point(42,500,1),new Point(46,503,1),new Point(50,507,1),new Point(56,509,1),new Point(63,509,1),new Point(70,508,1),new Point(75,506,1),new Point(79,503,1),new Point(82,499,1),new Point(85,493,1),new Point(87,487,1),new Point(88,480,1),new Point(88,474,1),new Point(87,468,1),
		// 	new Point(62,464,2),new Point(62,571,2)
		// ));
		// this.PointClouds[13] = new PointCloud("six-point star", new Array(
		// 	new Point(177,554,1),new Point(223,476,1),new Point(268,554,1),new Point(183,554,1),
		// 	new Point(177,490,2),new Point(223,568,2),new Point(268,490,2),new Point(183,490,2)
		// ));
		// this.PointClouds[14] = new PointCloud("asterisk", new Array(
		// 	new Point(325,499,1),new Point(417,557,1),
		// 	new Point(417,499,2),new Point(325,557,2),
		// 	new Point(371,486,3),new Point(371,571,3)
		// ));
		// this.PointClouds[15] = new PointCloud("half-note", new Array(
		// 	new Point(546,465,1),new Point(546,531,1),
		// 	new Point(540,530,2),new Point(536,529,2),new Point(533,528,2),new Point(529,529,2),new Point(524,530,2),new Point(520,532,2),new Point(515,535,2),new Point(511,539,2),new Point(508,545,2),new Point(506,548,2),new Point(506,554,2),new Point(509,558,2),new Point(512,561,2),new Point(517,564,2),new Point(521,564,2),new Point(527,563,2),new Point(531,560,2),new Point(535,557,2),new Point(538,553,2),new Point(542,548,2),new Point(544,544,2),new Point(546,540,2),new Point(546,536,2)
		// ));
		// this.PointClouds[16] = new PointCloud("Penis", new Array(
		// 	new Point(636, 218, 1), new Point(625, 207, 1), new Point(624, 206, 1), new Point(623, 204, 1), new Point(622, 204, 1), new Point(622, 203, 1), new Point(621, 202, 1), new Point(621, 201, 1), new Point(620, 201, 1), new Point(620, 200, 1), new Point(620, 199, 1), new Point(619, 198, 1), new Point(619, 197, 1), new Point(618, 196, 1), new Point(618, 195, 1), new Point(618, 194, 1), new Point(618, 193, 1), new Point(618, 192, 1), new Point(617, 191, 1), new Point(617, 190, 1), new Point(617, 189, 1), new Point(617, 188, 1), new Point(617, 185, 1), new Point(617, 184, 1), new Point(618, 183, 1), new Point(618, 182, 1), new Point(618, 181, 1), new Point(619, 180, 1), new Point(619, 179, 1), new Point(620, 178, 1), new Point(620, 177, 1), new Point(621, 176, 1), new Point(622, 175, 1), new Point(623, 174, 1), new Point(624, 173, 1), new Point(624, 172, 1), new Point(625, 171, 1), new Point(626, 170, 1), new Point(627, 170, 1), new Point(628, 169, 1), new Point(628, 168, 1), new Point(629, 167, 1), new Point(630, 167, 1), new Point(631, 166, 1), new Point(632, 165, 1), new Point(633, 165, 1), new Point(634, 164, 1), new Point(635, 163, 1), new Point(636, 163, 1), new Point(637, 162, 1), new Point(638, 162, 1), new Point(639, 161, 1), new Point(641, 160, 1), new Point(642, 160, 1), new Point(643, 159, 1), new Point(644, 159, 1), new Point(646, 159, 1), new Point(647, 158, 1), new Point(648, 158, 1), new Point(649, 158, 1), new Point(651, 157, 1), new Point(652, 157, 1), new Point(653, 157, 1), new Point(654, 157, 1), new Point(656, 157, 1), new Point(657, 157, 1), new Point(658, 157, 1), new Point(659, 157, 1), new Point(660, 156, 1), new Point(661, 156, 1), new Point(662, 156, 1), new Point(663, 156, 1), new Point(664, 156, 1), new Point(665, 156, 1), new Point(667, 156, 1), new Point(668, 157, 1), new Point(669, 157, 1), new Point(670, 157, 1), new Point(671, 158, 1), new Point(672, 158, 1), new Point(673, 158, 1), new Point(674, 159, 1), new Point(675, 159, 1), new Point(675, 160, 1), new Point(676, 160, 1), new Point(677, 161, 1), new Point(678, 161, 1), new Point(678, 162, 1), new Point(679, 162, 1), new Point(679, 163, 1), new Point(680, 163, 1), new Point(681, 164, 1), new Point(682, 164, 1), new Point(682, 165, 1), new Point(683, 165, 1), new Point(684, 166, 1), new Point(685, 167, 1), new Point(685, 168, 1), new Point(686, 169, 1), new Point(686, 170, 1), new Point(687, 171, 1), new Point(687, 172, 1), new Point(687, 173, 1), new Point(688, 173, 1), new Point(688, 174, 1), new Point(688, 175, 1), new Point(688, 176, 1), new Point(689, 177, 1), new Point(689, 178, 1), new Point(689, 179, 1), new Point(689, 180, 1), new Point(689, 181, 1), new Point(689, 182, 1), new Point(689, 183, 1), new Point(688, 184, 1), new Point(688, 185, 1), new Point(688, 186, 1), new Point(687, 187, 1), new Point(687, 188, 1), new Point(687, 189, 1), new Point(687, 190, 1), new Point(686, 190, 1), new Point(686, 191, 1), new Point(686, 192, 1), new Point(685, 192, 1), new Point(685, 193, 1), new Point(685, 194, 1), new Point(684, 195, 1), new Point(683, 196, 1), new Point(683, 197, 1), new Point(683, 198, 1), new Point(682, 199, 1), new Point(681, 200, 1), new Point(681, 201, 1), new Point(680, 201, 1), new Point(680, 202, 1), new Point(679, 203, 1), new Point(679, 204, 1), new Point(678, 205, 1), new Point(678, 206, 1), new Point(677, 207, 1), new Point(677, 208, 1), new Point(676, 209, 1), new Point(676, 210, 1), new Point(675, 211, 1), new Point(675, 212, 1), new Point(674, 213, 1), new Point(674, 214, 1), new Point(673, 215, 1), new Point(673, 216, 1), new Point(672, 216, 1), new Point(672, 217, 1), new Point(671, 217, 1), new Point(671, 218, 1), new Point(670, 218, 1), new Point(670, 219, 1), new Point(669, 219, 1), new Point(668, 219, 2), new Point(669, 234, 2), new Point(668, 236, 2), new Point(668, 238, 2), new Point(668, 239, 2), new Point(668, 240, 2), new Point(668, 242, 2), new Point(668, 243, 2), new Point(668, 245, 2), new Point(667, 246, 2), new Point(667, 248, 2), new Point(667, 249, 2), new Point(667, 251, 2), new Point(667, 252, 2), new Point(667, 253, 2), new Point(667, 254, 2), new Point(667, 255, 2), new Point(667, 257, 2), new Point(667, 258, 2), new Point(667, 259, 2), new Point(667, 261, 2), new Point(667, 262, 2), new Point(667, 263, 2), new Point(667, 265, 2), new Point(667, 266, 2), new Point(667, 267, 2), new Point(667, 269, 2), new Point(668, 270, 2), new Point(668, 271, 2), new Point(668, 273, 2), new Point(668, 274, 2), new Point(668, 275, 2), new Point(668, 276, 2), new Point(668, 277, 2), new Point(668, 278, 2), new Point(668, 279, 2), new Point(668, 280, 2), new Point(669, 281, 2), new Point(669, 282, 2), new Point(669, 283, 2), new Point(669, 285, 2), new Point(669, 286, 2), new Point(669, 287, 2), new Point(669, 288, 2), new Point(670, 289, 2), new Point(670, 290, 2), new Point(670, 291, 2), new Point(670, 292, 2), new Point(670, 293, 2), new Point(670, 294, 2), new Point(670, 295, 2), new Point(671, 295, 2), new Point(671, 296, 2), new Point(671, 297, 2), new Point(671, 298, 2), new Point(671, 299, 2), new Point(671, 300, 2), new Point(671, 301, 2), new Point(671, 302, 2), new Point(672, 302, 2), new Point(672, 303, 2), new Point(672, 304, 2), new Point(672, 305, 2), new Point(672, 306, 2), new Point(673, 307, 2), new Point(673, 308, 2), new Point(673, 309, 2), new Point(673, 310, 2), new Point(673, 311, 2), new Point(674, 312, 2), new Point(674, 313, 2), new Point(674, 314, 2), new Point(674, 315, 2), new Point(674, 316, 2), new Point(674, 317, 2), new Point(675, 318, 2), new Point(675, 319, 2), new Point(675, 320, 2), new Point(675, 321, 2), new Point(676, 321, 2), new Point(676, 322, 2), new Point(676, 323, 2), new Point(676, 324, 2), new Point(677, 324, 2), new Point(677, 325, 2), new Point(677, 326, 2), new Point(677, 327, 2), new Point(677, 328, 2), new Point(678, 329, 2), new Point(678, 330, 2), new Point(678, 331, 2), new Point(678, 332, 2), new Point(678, 333, 2), new Point(677, 328, 3), new Point(688, 326, 3), new Point(690, 326, 3), new Point(691, 326, 3), new Point(692, 326, 3), new Point(693, 326, 3), new Point(694, 326, 3), new Point(695, 326, 3), new Point(696, 326, 3), new Point(697, 327, 3), new Point(698, 327, 3), new Point(699, 327, 3), new Point(700, 328, 3), new Point(701, 328, 3), new Point(702, 328, 3), new Point(703, 329, 3), new Point(704, 329, 3), new Point(705, 330, 3), new Point(706, 330, 3), new Point(706, 331, 3), new Point(707, 331, 3), new Point(708, 331, 3), new Point(708, 332, 3), new Point(709, 332, 3), new Point(709, 333, 3), new Point(710, 333, 3), new Point(710, 334, 3), new Point(711, 334, 3), new Point(712, 335, 3), new Point(713, 336, 3), new Point(714, 337, 3), new Point(715, 338, 3), new Point(715, 339, 3), new Point(716, 339, 3), new Point(716, 340, 3), new Point(717, 340, 3), new Point(717, 341, 3), new Point(717, 342, 3), new Point(718, 342, 3), new Point(718, 343, 3), new Point(718, 344, 3), new Point(719, 344, 3), new Point(719, 345, 3), new Point(719, 346, 3), new Point(719, 347, 3), new Point(720, 348, 3), new Point(720, 349, 3), new Point(720, 350, 3), new Point(720, 351, 3), new Point(721, 352, 3), new Point(721, 353, 3), new Point(721, 354, 3), new Point(721, 355, 3), new Point(721, 356, 3), new Point(722, 356, 3), new Point(722, 357, 3), new Point(722, 358, 3), new Point(722, 359, 3), new Point(722, 360, 3), new Point(722, 361, 3), new Point(722, 362, 3), new Point(722, 363, 3), new Point(722, 364, 3), new Point(722, 365, 3), new Point(722, 366, 3), new Point(722, 367, 3), new Point(722, 368, 3), new Point(722, 369, 3), new Point(722, 370, 3), new Point(722, 371, 3), new Point(722, 371, 3), new Point(722, 372, 3), new Point(722, 373, 3), new Point(722, 374, 3), new Point(722, 375, 3), new Point(722, 376, 3), new Point(722, 377, 3), new Point(722, 378, 3), new Point(722, 379, 3), new Point(721, 380, 3), new Point(721, 381, 3), new Point(720, 382, 3), new Point(720, 383, 3), new Point(719, 384, 3), new Point(719, 385, 3), new Point(718, 385, 3), new Point(718, 386, 3), new Point(717, 387, 3), new Point(716, 388, 3), new Point(716, 389, 3), new Point(715, 389, 3), new Point(715, 390, 3), new Point(714, 390, 3), new Point(713, 391, 3), new Point(713, 392, 3), new Point(712, 392, 3), new Point(712, 393, 3), new Point(711, 393, 3), new Point(710, 394, 3), new Point(710, 395, 3), new Point(709, 395, 3), new Point(708, 396, 3), new Point(707, 397, 3), new Point(706, 398, 3), new Point(705, 398, 3), new Point(705, 399, 3), new Point(704, 399, 3), new Point(703, 400, 3), new Point(702, 400, 3), new Point(702, 401, 3), new Point(701, 401, 3), new Point(700, 402, 3), new Point(699, 402, 3), new Point(698, 402, 3), new Point(697, 403, 3), new Point(696, 403, 3), new Point(695, 403, 3), new Point(695, 404, 3), new Point(694, 404, 3), new Point(693, 404, 3), new Point(692, 404, 3), new Point(691, 405, 3), new Point(690, 405, 3), new Point(689, 405, 3), new Point(688, 406, 3), new Point(687, 406, 3), new Point(686, 406, 3), new Point(685, 406, 3), new Point(684, 406, 3), new Point(683, 406, 3), new Point(682, 406, 3), new Point(681, 406, 3), new Point(680, 406, 3), new Point(679, 406, 3), new Point(678, 406, 3), new Point(678, 405, 3), new Point(677, 405, 3), new Point(676, 405, 3), new Point(675, 405, 3), new Point(674, 405, 3), new Point(674, 404, 3), new Point(673, 404, 3), new Point(672, 404, 3), new Point(672, 403, 3), new Point(671, 403, 3), new Point(670, 402, 3), new Point(669, 402, 3), new Point(669, 401, 3), new Point(668, 401, 3), new Point(668, 400, 3), new Point(667, 400, 3), new Point(666, 399, 3), new Point(666, 398, 3), new Point(665, 398, 3), new Point(665, 397, 3), new Point(664, 397, 3), new Point(663, 396, 3), new Point(663, 395, 3), new Point(662, 395, 3), new Point(662, 394, 3), new Point(661, 394, 3), new Point(661, 393, 3), new Point(661, 392, 3), new Point(660, 392, 3), new Point(660, 391, 3), new Point(660, 390, 3), new Point(659, 389, 3), new Point(659, 388, 3), new Point(659, 387, 3), new Point(659, 386, 3), new Point(660, 387, 4), new Point(650, 397, 4), new Point(649, 398, 4), new Point(648, 399, 4), new Point(647, 400, 4), new Point(646, 400, 4), new Point(645, 401, 4), new Point(644, 401, 4), new Point(643, 401, 4), new Point(642, 402, 4), new Point(641, 402, 4), new Point(640, 402, 4), new Point(639, 403, 4), new Point(638, 403, 4), new Point(637, 403, 4), new Point(636, 403, 4), new Point(635, 403, 4), new Point(634, 403, 4), new Point(633, 403, 4), new Point(632, 403, 4), new Point(631, 403, 4), new Point(630, 403, 4), new Point(629, 403, 4), new Point(628, 403, 4), new Point(627, 403, 4), new Point(626, 403, 4), new Point(625, 403, 4), new Point(624, 403, 4), new Point(623, 403, 4), new Point(622, 403, 4), new Point(621, 403, 4), new Point(620, 403, 4), new Point(619, 403, 4), new Point(618, 403, 4), new Point(617, 403, 4), new Point(616, 403, 4), new Point(615, 402, 4), new Point(614, 402, 4), new Point(613, 402, 4), new Point(612, 402, 4), new Point(612, 401, 4), new Point(611, 401, 4), new Point(610, 401, 4), new Point(609, 400, 4), new Point(608, 400, 4), new Point(607, 400, 4), new Point(606, 399, 4), new Point(605, 399, 4), new Point(604, 398, 4), new Point(603, 398, 4), new Point(602, 397, 4), new Point(601, 396, 4), new Point(600, 396, 4), new Point(599, 395, 4), new Point(598, 394, 4), new Point(597, 393, 4), new Point(596, 392, 4), new Point(595, 391, 4), new Point(594, 391, 4), new Point(594, 390, 4), new Point(593, 389, 4), new Point(592, 388, 4), new Point(591, 387, 4), new Point(591, 386, 4), new Point(590, 385, 4), new Point(589, 384, 4), new Point(589, 383, 4), new Point(588, 382, 4), new Point(587, 381, 4), new Point(587, 380, 4), new Point(587, 379, 4), new Point(586, 379, 4), new Point(586, 378, 4), new Point(585, 377, 4), new Point(585, 376, 4), new Point(585, 375, 4), new Point(585, 374, 4), new Point(585, 373, 4), new Point(584, 372, 4), new Point(584, 371, 4), new Point(584, 370, 4), new Point(584, 369, 4), new Point(584, 368, 4), new Point(584, 367, 4), new Point(584, 366, 4), new Point(584, 365, 4), new Point(584, 364, 4), new Point(584, 363, 4), new Point(584, 362, 4), new Point(585, 362, 4), new Point(585, 361, 4), new Point(585, 360, 4), new Point(586, 359, 4), new Point(586, 358, 4), new Point(587, 357, 4), new Point(587, 356, 4), new Point(588, 356, 4), new Point(588, 355, 4), new Point(589, 354, 4), new Point(590, 353, 4), new Point(591, 352, 4), new Point(592, 351, 4), new Point(593, 350, 4), new Point(594, 350, 4), new Point(595, 349, 4), new Point(596, 348, 4), new Point(597, 347, 4), new Point(598, 346, 4), new Point(599, 346, 4), new Point(599, 345, 4), new Point(600, 344, 4), new Point(601, 344, 4), new Point(602, 343, 4), new Point(603, 342, 4), new Point(604, 342, 4), new Point(605, 341, 4), new Point(606, 341, 4), new Point(607, 340, 4), new Point(608, 340, 4), new Point(609, 339, 4), new Point(610, 339, 4), new Point(611, 338, 4), new Point(612, 338, 4), new Point(613, 337, 4), new Point(614, 337, 4), new Point(615, 337, 4), new Point(615, 336, 4), new Point(616, 336, 4), new Point(617, 336, 4), new Point(617, 335, 4), new Point(618, 335, 4), new Point(619, 334, 4), new Point(620, 334, 4), new Point(621, 334, 4), new Point(621, 333, 4), new Point(622, 333, 4), new Point(623, 333, 4), new Point(624, 333, 4), new Point(625, 333, 4), new Point(626, 332, 4), new Point(627, 332, 4), new Point(628, 332, 4), new Point(628, 331, 4), new Point(629, 331, 4), new Point(630, 330, 4), new Point(630, 329, 5), new Point(630, 314, 5), new Point(630, 312, 5), new Point(631, 310, 5), new Point(631, 309, 5), new Point(631, 308, 5), new Point(631, 306, 5), new Point(631, 305, 5), new Point(631, 304, 5), new Point(631, 303, 5), new Point(631, 301, 5), new Point(631, 300, 5), new Point(631, 299, 5), new Point(631, 298, 5), new Point(631, 296, 5), new Point(631, 295, 5), new Point(631, 294, 5), new Point(631, 292, 5), new Point(631, 291, 5), new Point(631, 289, 5), new Point(632, 288, 5), new Point(632, 286, 5), new Point(632, 285, 5), new Point(632, 284, 5), new Point(633, 282, 5), new Point(633, 281, 5), new Point(633, 280, 5), new Point(633, 279, 5), new Point(633, 278, 5), new Point(634, 277, 5), new Point(634, 276, 5), new Point(634, 275, 5), new Point(634, 274, 5), new Point(634, 273, 5), new Point(634, 272, 5), new Point(634, 271, 5), new Point(634, 270, 5), new Point(634, 269, 5), new Point(634, 268, 5), new Point(634, 267, 5), new Point(634, 266, 5), new Point(634, 265, 5), new Point(634, 264, 5), new Point(634, 263, 5), new Point(634, 262, 5), new Point(635, 262, 5), new Point(635, 261, 5), new Point(635, 260, 5), new Point(635, 259, 5), new Point(635, 258, 5), new Point(635, 257, 5), new Point(635, 256, 5), new Point(635, 255, 5), new Point(635, 254, 5), new Point(635, 253, 5), new Point(635, 252, 5), new Point(635, 251, 5), new Point(635, 250, 5), new Point(635, 249, 5), new Point(635, 248, 5), new Point(635, 247, 5), new Point(635, 246, 5), new Point(635, 245, 5), new Point(635, 244, 5), new Point(635, 243, 5), new Point(635, 242, 5), new Point(635, 241, 5), new Point(635, 240, 5), new Point(635, 239, 5), new Point(635, 238, 5), new Point(635, 237, 5), new Point(635, 236, 5), new Point(635, 235, 5), new Point(635, 234, 5), new Point(635, 233, 5), new Point(636, 233, 5), new Point(636, 232, 5), new Point(636, 231, 5), new Point(636, 230, 5), new Point(636, 229, 5), new Point(636, 228, 5), new Point(636, 227, 5), new Point(635, 227, 5), new Point(635, 226, 5), new Point(635, 225, 5), new Point(635, 224, 5), new Point(635, 223, 5), new Point(635, 222, 5), new Point(635, 221, 5), new Point(635, 220, 5), new Point(635, 219, 5), new Point(635, 218, 5), new Point(635, 217, 5), new Point(635, 216, 5), new Point(635, 215, 5), new Point(635, 214, 5)
		// ));
		//
		// The $P Point-Cloud Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), DeleteUserGestures()
		//
		this.Recognize = function (points) {
			points = Resample(points, NumPoints);
			points = Scale(points);
			points = TranslateTo(points, Origin);

			var b = +Infinity;
			var u = -1;
			for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
			{
				var d = GreedyCloudMatch(points, this.PointClouds[i]);
				if (d < b) {
					b = d; // best (least) distance
					u = i; // point-cloud
				}
			}
			return u == -1 ? new Result("No match.", 0.0) : new Result(this.PointClouds[u].Name, Math.max((b - 2.0) / -2.0, 0.0));
		};
		this.AddGesture = function (name, points) {
			this.PointClouds[this.PointClouds.length] = new PointCloud(name, points);
			var num = 0;
			for (var i = 0; i < this.PointClouds.length; i++) {
				if (this.PointClouds[i].Name == name) num++;
			}
			return num;
		};
		this.DeleteUserGestures = function () {
			this.PointClouds.length = NumPointClouds; // clear any beyond the original set
			return NumPointClouds;
		};
	}
	//
	// Private helper functions from this point down
	//
	function GreedyCloudMatch(points, P) {
		var e = 0.50;
		var step = Math.floor(Math.pow(points.length, 1 - e));
		var min = +Infinity;
		for (var i = 0; i < points.length; i += step) {
			var d1 = CloudDistance(points, P.Points, i);
			var d2 = CloudDistance(P.Points, points, i);
			min = Math.min(min, Math.min(d1, d2)); // min3
		}
		return min;
	}
	function CloudDistance(pts1, pts2, start) {
		var matched = new Array(pts1.length); // pts1.length == pts2.length
		for (var k = 0; k < pts1.length; k++) {
			matched[k] = false;
		}var sum = 0;
		var i = start;
		do {
			var index = -1;
			var min = +Infinity;
			for (var j = 0; j < matched.length; j++) {
				if (!matched[j]) {
					var d = Distance(pts1[i], pts2[j]);
					if (d < min) {
						min = d;
						index = j;
					}
				}
			}
			matched[index] = true;
			var weight = 1 - (i - start + pts1.length) % pts1.length / pts1.length;
			sum += weight * min;
			i = (i + 1) % pts1.length;
		} while (i != start);
		return sum;
	}
	function Resample(points, n) {
		var I = PathLength(points) / (n - 1); // interval length
		var D = 0.0;
		var newpoints = new Array(points[0]);
		for (var i = 1; i < points.length; i++) {
			if (points[i].ID == points[i - 1].ID) {
				var d = Distance(points[i - 1], points[i]);
				if (D + d >= I) {
					var qx = points[i - 1].X + (I - D) / d * (points[i].X - points[i - 1].X);
					var qy = points[i - 1].Y + (I - D) / d * (points[i].Y - points[i - 1].Y);
					var q = new Point(qx, qy, points[i].ID);
					newpoints[newpoints.length] = q; // append new point 'q'
					points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
					D = 0.0;
				} else D += d;
			}
		}
		if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
			newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
		return newpoints;
	}
	function Scale(points) {
		var minX = +Infinity,
		    maxX = -Infinity,
		    minY = +Infinity,
		    maxY = -Infinity;
		for (var i = 0; i < points.length; i++) {
			minX = Math.min(minX, points[i].X);
			minY = Math.min(minY, points[i].Y);
			maxX = Math.max(maxX, points[i].X);
			maxY = Math.max(maxY, points[i].Y);
		}
		var size = Math.max(maxX - minX, maxY - minY);
		var newpoints = new Array();
		for (var i = 0; i < points.length; i++) {
			var qx = (points[i].X - minX) / size;
			var qy = (points[i].Y - minY) / size;
			newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
		}
		return newpoints;
	}
	function TranslateTo(points, pt) // translates points' centroid
	{
		var c = Centroid(points);
		var newpoints = new Array();
		for (var i = 0; i < points.length; i++) {
			var qx = points[i].X + pt.X - c.X;
			var qy = points[i].Y + pt.Y - c.Y;
			newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
		}
		return newpoints;
	}
	function Centroid(points) {
		var x = 0.0,
		    y = 0.0;
		for (var i = 0; i < points.length; i++) {
			x += points[i].X;
			y += points[i].Y;
		}
		x /= points.length;
		y /= points.length;
		return new Point(x, y, 0);
	}
	function PathDistance(pts1, pts2) // average distance between corresponding points in two paths
	{
		var d = 0.0;
		for (var i = 0; i < pts1.length; i++) {
			// assumes pts1.length == pts2.length
			d += Distance(pts1[i], pts2[i]);
		}return d / pts1.length;
	}
	function PathLength(points) // length traversed by a point path
	{
		var d = 0.0;
		for (var i = 1; i < points.length; i++) {
			if (points[i].ID == points[i - 1].ID) d += Distance(points[i - 1], points[i]);
		}
		return d;
	}
	function Distance(p1, p2) // Euclidean distance between two points
	{
		var dx = p2.X - p1.X;
		var dy = p2.Y - p1.Y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	exports.Point = Point;
	exports.PointCloud = PointCloud;
	exports.Result = Result;
	exports.PDollarRecognizer = PDollarRecognizer;

/***/ }

/******/ });