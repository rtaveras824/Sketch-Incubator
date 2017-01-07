import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Auth from '../../modules/Auth';

class Category extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			drawings: [{'title': 'Reuben'}]
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

		axios.get(`/api/${ this.props.params.category_id }`,
		config).then(function(response) {
			this.setState({
				drawings: response.data
			});
		}.bind(this));
	}

	showDrawings() {

	}

	render() {
		return (
			<div>
			{ this.state.drawings.map(function(drawing) {
				return (<Link to={ `/api/drawing/${drawing._id}` }>{ drawing.title }</Link>)
				})
			}
			</div>
		);
	}
}

export default Category;