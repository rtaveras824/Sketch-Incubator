import React from 'react';

class ApplicationPage extends React.Component {
	constructor(props) {
		super(props);


	}

	render() {
		return (
			<div>
				<canvas id="canvas"></canvas>
				<button id="erase">Erase</button>
				<button id="pencil">Pencil</button>
				<button id="undo_btn">Undo</button>
				<button id="redo_btn">Redo</button>
				<button id="record_sketch">Record Sketch</button>
				<button id="record_walkthru">Record Walkthru</button>
				<button id="replay_btn">Replay</button>
				<button id="step_btn">Step By Step</button>

				<form action="/" onSubmit={ this.onSubmit }>
					<input type="text" name="title" />
					<input id="drawing_input" type="hidden" name="drawing" />
					<input type="submit" value="Submit" />
				</form>
				<img id="canvas_img" />
			</div>
		)
	}
}

export default ApplicationPage;