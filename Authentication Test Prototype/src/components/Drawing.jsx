import React from 'react';
import axios from 'axios';
import Auth from '../../modules/Auth';

class Drawing extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			drawing: [],
			like: false,
			favorite: false
		}
	}

	componentWillMount() {
		const config = {};
		if (Auth.isUserAuthenticated()) {
			console.log('Authenticated');
			const token = Auth.getToken();
			config.headers = {
				"Authorization": `bearer ${token}`
			};
		}

		axios.get(`/api/drawing/${ this.props.params.drawing_id }`,
		config)
		.then(function(response) {
			console.log(response);
			if (response.data.length > 1) {
				this.setState({
					like: response.data[1].like,
					favorite: response.data[1].favorite
				});
			}

			console.log(response.data[1].like);

			this.setState({
				drawing: response.data[0]
			});
		}.bind(this));
	}

	render() {
		return (
			<div>
				{ this.props.params.drawing_id }
				{ this.state.like && (<p>Like</p>) }
				{ this.state.favorite && (<p>Favorite</p>) }
			</div>
		)
	}
}

export default Drawing;