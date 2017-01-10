import React from 'react';
import axios from 'axios';
import Auth from '../../../modules/Auth';

class ApplicationWalkthruPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			drawing: [],
			like: false,
			favorite: false
		}

		this.toggleLikeButton = this.toggleLikeButton.bind(this);
		this.toggleFavoriteButton = this.toggleFavoriteButton.bind(this);
		this.setHeader = this.setHeader.bind(this);
	}

	setHeader() {
		const config = {};
		if (Auth.isUserAuthenticated()) {
			console.log('Authenticated');
			const token = Auth.getToken();
			config.headers = {
				"Authorization": `bearer ${token}`
			};
		}

		return config;
	}

	componentWillMount() {


		axios.get(`/api/drawing/${ this.props.params.drawing_id }`,
		this.setHeader())
		.then(function(response) {
			console.log(response);
			if ((response.data.length > 1) && (response.data[1] !== null)) {
				console.log(response.data[1]);
				this.setState({
					like: response.data[1].like,
					favorite: response.data[1].favorite
				});
			}

			this.setState({
				drawing: response.data[0]
			});
		}.bind(this));
	}

	toggleLikeButton() {
		const like = !this.state.like;
		
		axios.post('/api/drawing/userlike', {
			drawing_id: this.props.params.drawing_id,
			like
		},
		this.setHeader())
		.then(function(response) {
			console.log(response);
			this.setState({
				like: response.data.like
				});
			}.bind(this))
		.catch(function(err) {
			console.log(err)
			});
	}

	toggleFavoriteButton() {
		const favorite = !this.state.favorite;
		
		axios.post('/api/drawing/userfavorite', {
			drawing_id: this.props.params.drawing_id,
			favorite
		},
		this.setHeader())
		.then(function(response) {
			console.log(response);
			this.setState({
				favorite: response.data.favorite
				});
			}.bind(this))
		.catch(function(err) {
			console.log(err)
			});
	}

	render() {
		return (
			<div>
				{ Auth.isUserAuthenticated() && <button onClick={ this.toggleLikeButton }>{ this.state.like ? 'Unlike' : 'Like' }</button> }
				{ Auth.isUserAuthenticated() && <button onClick={ this.toggleFavoriteButton }>{ this.state.favorite ? 'Unfavorite' : 'Favorite' }</button> }
				<canvas id="canvas">Canvas is not supported</canvas>
				<canvas id="canvas2">Canvas is not supported</canvas>
				<button id="pencil">Pencil</button>
				<button id="erase">Erase</button>
				<button id="undo_btn">Undo</button>
				<button id="redo_btn">Redo</button>
				<button id="play_sketch">Play Sketch</button>
				<button id="play_walkthru">Play Walkthru</button>
				<button id="step_walkthru">Walkthru Step By Step</button>
				<button id="user_set_sketch">User Set Sketch</button>

			</div>
		)
	}
}

export default ApplicationWalkthruPage;