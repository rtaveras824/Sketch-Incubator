import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import LoginForm from '../components/LoginForm.jsx';
import Auth from '../../modules/Auth';
import axios from 'axios';

class LoginPage extends React.Component {
	constructor(props, context) {
		super(props);

		console.log(context);
		const storedMessage = localStorage.getItem('successMessage');
		let successMessage = '';

		if (storedMessage) {
			successMessage = storedMessage;
			localStorage.removeItem('successMessage');
		}

		this.state = {
			errors: {},
			successMessage,
			user: {
				email: '',
				password: ''
			}
		};

		this.processForm = this.processForm.bind(this);
		this.changeUser = this.changeUser.bind(this);
	}

	processForm(event) {
		event.preventDefault();

		const email = this.state.user.email;
		const password = this.state.user.password;

		axios.post('/auth/login', {
				email,
				password
			}).then(function(response) {
				console.log(response.data);
				Auth.authenticateUser(response.data.token);
				browserHistory.push('/');
			}).catch(function(err) {
				console.log(err);
				});
	}

	changeUser(event) {
		const field = event.target.name;
		const user = this.state.user;
		user[field] = event.target.value;

		console.log(this.state.user);
		this.setState({
			user
			});
	}

	render() {
		return (
			<LoginForm
				onSubmit={ this.processForm }
				onChange={ this.changeUser }
				user={ this.state.user }
				/>
		)
	}
};

export default LoginPage;