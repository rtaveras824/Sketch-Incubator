import React from 'react';
import { Link } from 'react-router';
import Auth from '../../../modules/Auth';
import axios from 'axios';

class Base extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user_id: ''
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
		if (Auth.isUserAuthenticated()) {
			axios.get('/api/getuserid',
				this.setHeader())
				.then(function(response) {
					console.log('userid', response);
					this.setState({
						user_id: response.data
						})
					}.bind(this))
				.catch(function(err) {
					console.log(err);
					});
		}
		
	}

	render() {
		return (
			<div className="fluid-container">
				<nav className="top-bar navbar navbar-default">
				  <div className="container-fluid">
				    <div className="navbar-header">
				      <a className="navbar-brand" href="/">Sketch Incubator</a>
				    </div>

				        { Auth.isUserAuthenticated() ? (
							<ul className="nav navbar-nav navbar-right">
								<li><a href="/application/draw">Create Walkthru</a></li>
								<li><Link to={ `/profile/${ this.state.user_id }` }>Profile</Link></li>
								<li><Link to={ '/logout' }>Logout</Link></li>
							</ul>
						) : (
							<ul className="nav navbar-nav navbar-right">
								<li><Link to={ '/login' }>Log In</Link></li>
								<li><Link to={ '/signup' }>Sign Up</Link></li>
							</ul>
						)}
				    </div>
				</nav>
				<div className="fluid-container">{ this.props.children }</div>
			</div>
		);
	}
}

export default Base;