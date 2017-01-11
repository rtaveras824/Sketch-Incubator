import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Auth from '../../../modules/Auth';
import Body from './Body.jsx';

class Category extends React.Component {
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

		axios.get(`/api/category/${ this.props.params.category_id }`,
		config).then(function(response) {
			console.log('drawings', response.data);
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
						drawing={ JSON.parse(drawing.drawing) }
						category={ drawing.category }
					 />
			);
		});
	}

	render() {
		return (
			<div className="fluid-container">
				<div className="center">
					{ 
						this.showDrawings()
					}
				</div>
			</div>
		);
	}
}

export default Category;