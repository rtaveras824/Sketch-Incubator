import React from 'react';
import Auth from '../../../modules/Auth';
import axios from 'axios';

class Profile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			_id: '',
			display_name: '',
			email: '',
			address: '',
			photo_url: '',
			portfolio_url: '',
			artstation_url: '',
			behance_url: '',
			dribbble_url: '',
			deviantart_url: '',
			linkedin_url: '',
			match: false
		}

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
		axios.get(`/api/user/${ this.props.params.user_id }`,
			this.setHeader())
		.then(function(response) {
			console.log(response);
			this.setState(response.data);
			}.bind(this))
		.catch(function(err) {
			console.log(err);
			})
	}

	render() {
		return (
			<div>
				{ this.state.match && <a href={ `/update/${ this.state._id }` }>Update Profile</a> }
				<h1>{ this.state.display_name }</h1>
				<p>Email: { this.state.email }</p>
				{ this.state.address && <p>Address: { this.state.address }</p> }
				{ this.state.photo_url && <img src={ this.state.photo_url } /> }
				{ this.state.portfolio_url && <a href={ this.state.portfolio_url }>{ this.state.portfolio_url }</a> }
				{ this.state.artstation_url && <a href={ this.state.artstation_url }>{ this.state.artstation_url }</a> }
				{ this.state.behance_url && <a href={ this.state.behance_url }>{ this.state.behance_url }</a> }
				{ this.state.dribbble_url && <a href={ this.state.dribbble_url }>{ this.state.dribbble_url }</a> }
				{ this.state.deviantart_url && <a href={ this.state.deviantart_url }>{ this.state.deviantart_url }</a> }
				{ this.state.linkedin_url && <a href={ this.state.linkedin_url }>{ this.state.linkedin_url }</a> }
			</div>
		)
	}
}

export default Profile;