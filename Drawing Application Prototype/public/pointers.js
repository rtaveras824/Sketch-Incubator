var down_handler = function(e) {
	console.log(e);
}

var move_handler = function(e) {
	console.log('move', e.pressure);
}

canvas.onpointerdown = down_handler;
canvas.onpointermove = move_handler;