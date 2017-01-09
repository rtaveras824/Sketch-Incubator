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
				<button id="replay">Replay</button>
			</div>
		)
	}
}

export default ApplicationPage;