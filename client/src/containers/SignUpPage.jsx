import React from 'react';
import { browserHistory } from 'react-router';
import Auth from '../../../modules/Auth';
import axios from 'axios';
import SignUpForm from '../components/SignUpForm.jsx';

class SignUpPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: {
				email: '',
				display_name: '',
				password: ''
			}
		};

		this.processForm = this.processForm.bind(this);
		this.changeUser = this.changeUser.bind(this);
	}

	changeUser(event) {
		const field = event.target.name;
		const user = this.state.user;
		user[field] = event.target.value;

		this.setState({
			user
		});
	}

	processForm(event) {
		event.preventDefault();

		const display_name = this.state.user.display_name;
		const email = this.state.user.email;
		const password = this.state.user.password;

		axios.post('/auth/signup', {
			display_name,
			email,
			password
			})
		.then(function(response) {
			console.log(response.data);
			Auth.authenticateUser(response.data.token);
			browserHistory.push('/');
			})
		.catch(function(err) {
			console.log(err);
			});
	}

	render() {
		return (
			<SignUpForm
				onSubmit={this.processForm}
				onChange={this.changeUser}
				user={this.state.user}
			/>
		);
	}
}

export default SignUpPage;