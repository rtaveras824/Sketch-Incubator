import React from 'react';
import axios from 'axios';
import Auth from '../../../modules/Auth';

import Body from '../components/Body.jsx';
import Menu from '../components/Menu.jsx';

console.log(Auth);

class MainPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			drawings: []
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
		
		axios.get('/api/drawings',
			config)
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
						drawing_id={ drawing._id }
						author_id={ drawing.author._id }
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
				<Menu />
				{ this.showDrawings() }
			</div>
		)
	}
}

export default MainPage;