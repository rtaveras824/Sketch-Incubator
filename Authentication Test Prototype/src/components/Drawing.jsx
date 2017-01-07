import React from 'react';
import axios from 'axios';
import Auth from '../../modules/Auth';

class Drawing extends React.Component {
	constructor(props) {
		super(props);
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
			});
	}

	render() {
		return (
			<div>
				{ this.props.params.drawing_id }
			</div>
		)
	}
}

export default Drawing;