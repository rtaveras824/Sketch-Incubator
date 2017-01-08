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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Colors = new _colors2.default();

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	var pressure, setRadius, radius, r, g, b, x, y, isDown;

	function init() {
		pressure = 1, setRadius = 10, radius = setRadius;

		r = Colors.getColors[0], g = Colors.getColors[1], b = Colors.getColors[2];

		isDown = false;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		context.lineWidth = radius * 2;
		context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";
		context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + pressure + ")";

		canvas.addEventListener('mousedown', function (e) {
			mouseDownEvent(e);
		});
		canvas.addEventListener('mouseup', function (e) {
			mouseUpEvent(e);
		});
		canvas.addEventListener('mousemove', function (e) {
			console.log('mousemove');
			mouseDragEvent(e);
		});
		canvas.addEventListener('pointermove', function (e) {
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
		if (isDown) {
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

		if (e.button <= 1) {
			isDown = true;
			putPoint(e);
		}
	}

	function mouseDragEvent(e) {
		setXY(e);

		if (isDown) {
			putPoint(e);
		}
	}

	function mouseUpEvent(e) {
		setXY(e);

		isDown = false;
		context.beginPath();
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

			this.r = 0;
			this.g = 0;
			this.b = 0;
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

/***/ }

/******/ });