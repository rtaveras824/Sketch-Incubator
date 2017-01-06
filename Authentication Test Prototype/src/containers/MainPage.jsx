import React from 'react';
import mongoose from 'mongoose';
import axios from 'axios';
import Auth from '../../modules/Auth';

import Body from '../components/Body.jsx';

class MainPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			drawings: []
		}
	}

	componentWillMount() {
		const token = Auth.getToken();
		console.log(token);
		axios.get('/api/drawings',
			{
				headers: { "Authorization": `bearer ${token}` }
			})
			.then(function(response) {
				console.log('returning');
				console.log(response);
				this.setState({
					drawings: response.data
				});
			}.bind(this));
	}

	

	showDrawings() {
		return this.state.drawings.map(function(drawing, index) {
			return (<Body
						key={ index }
						author={ drawing.author.display_name }
						title={ drawing.title }
						drawing={ drawing.drawing }
						category={ drawing.category }
					 />
			);
		});
	}

	render() {
		return (
			<div>
				{ this.showDrawings() }
			</div>
		)
	}
}

export default MainPage;