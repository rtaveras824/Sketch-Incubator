import React from 'react';
import { browserHistory } from 'react-router';
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
			linkedin_url: ''
		}

		this.setHeader = this.setHeader.bind(this);
		this.onChange = this.onChange.bind(this);
		this.processForm = this.processForm.bind(this);
	}

	processForm(event) {
		event.preventDefault();

		const _id = this.state._id;
		const display_name = this.state.display_name;
		const email = this.state.email;
		const address = this.state.address;
		const photo_url = this.state.photo_url;
		const portfolio_url = this.state.portfolio_url;
		const artstation_url = this.state.artstation_url;
		const behance_url = this.state.behance_url;
		const dribbble_url = this.state.dribbble_url;
		const deviantart_url = this.state.deviantart_url;
		const linkedin_url = this.state.linkedin_url;

		const user = {
			_id,
			display_name,
			email,
			address,
			photo_url,
			portfolio_url,
			artstation_url,
			behance_url,
			dribbble_url,
			deviantart_url,
			linkedin_url
		};

		axios.post(`/api/update`,
			user,
			this.setHeader())
		.then(function(response) {
			console.log(response);
			browserHistory.push(`/profile/${ this.state._id }`);
			}.bind(this))
			.catch(function(err) {
				console.log(err);
				});
	}

	onChange(event) {
		const user = {};
		const field = event.target.name;
		user[field] = event.target.value;

		this.setState(
			user
		)
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
		axios.get(`/api/update/${ this.props.params.user_id }`,
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
			<div className="container update-container">
				<form action="/" onSubmit={ this.processForm }>
					<div className="form-group">
						<label>Display Name</label>
						<input className="form-control" type="text" name="display_name" value={ this.state.display_name } onChange={ this.onChange }/>
					</div>

					<div className="form-group">
						<label>Email</label>
						<input className="form-control" type="text" name="email" value={ this.state.email } onChange={ this.onChange }/>
					</div>

					<div className="form-group">
						<label>Address</label>
						<input className="form-control" type="text" name="address" value={ this.state.address } onChange={ this.onChange }/>
					</div>

					<div className="form-group">
						<label>Photo URL</label>
						<input className="form-control" type="text" name="photo_url" value={ this.state.photo_url } onChange={ this.onChange }/>
					</div>

					<div className="form-group">
						<label>Portfolio</label>
						<input className="form-control" type="text" name="portfolio_url" value={ this.state.portfolio_url } onChange={ this.onChange }/>
					</div>

					<div className="form-group">
						<label>Artstation</label>
						<input className="form-control" type="text" name="artstation_url" value={ this.state.artstation_url } onChange={ this.onChange }/>
					</div>

					<div className="form-group">
						<label>Behance</label>
						<input className="form-control" type="text" name="behance_url" value={ this.state.behance_url } onChange={ this.onChange }/>
					</div>

					<div className="form-group">
						<label>Dribbble</label>
						<input className="form-control" type="text" name="dribbble_url" value={ this.state.dribbble_url } onChange={ this.onChange }/>
					</div>

					<div className="form-group">
						<label>Deviant Art</label>
						<input className="form-control" type="text" name="deviantart_url" value={ this.state.deviantart_url } onChange={ this.onChange }/>
					</div>

					<div className="form-group">
						<label>Linkedin</label>
						<input className="form-control" type="text" name="linkedin_url" value={ this.state.linkedin_url } onChange={ this.onChange }/>
					</div>

					<input type="submit" value="submit" />
					
				</form>
			</div>
		)
	}
}

export default Profile;