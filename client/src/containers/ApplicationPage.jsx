import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import Auth from '../../../modules/Auth';

class ApplicationPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			submission: {
				title: '',
				drawing: '',
				category: '',
				categories: [{
				_id: '123914',
				name: 'uggg'
				}]
			}, 
		}

		this.sendDrawingData = this.sendDrawingData.bind(this);
		this.onChange = this.onChange.bind(this);
		this.setHeader = this.setHeader.bind(this);
	}

	componentWillMount() {
		axios.get('/api/categories')
			.then(function(response) {
				var field = 'categories';
				const submission = this.state.submission;
				submission[field] = response.data;

				field = 'category';
				submission[field] = response.data[0]._id;

				this.setState({
					submission
				});
			}.bind(this))
			.catch(function(err) {
				console.log(err);
			});
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

	sendDrawingData(event) {
		event.preventDefault();

		const title = this.state.submission.title;
		const drawing = this.state.submission.drawing;
		const category = this.state.submission.category;

		axios.post('/api/upload',
			{
				title,
				drawing,
				category
			},
			this.setHeader())
		.then(function(response) {
			console.log(response);
			browserHistory.push(`/profile/${ response.data.author }`);
			})
	}

	onChange(event) {
		const field = event.target.name;
		const submission = this.state.submission;

		submission[field] = event.target.value;

		this.setState({
			submission
		});
	}

	render() {
		return (
			<div className="application-container fluid-container">
				<div className="text-center">
					<canvas id="canvas">Canvas is not supported</canvas>
				</div>

				<div className="row bottom-commands text-center">
					<button id="pencil" className="btn btn-default">Pencil</button>
					<button id="erase" className="btn btn-default">Erase</button>

					<button id="record_sketch" className="btn btn-default">Record Sketch</button>
					<button id="record_walkthru" className="btn btn-default">Record Walkthru</button>
					<button id="play_walkthru" className="btn btn-default">Walkthru Play</button>
					<button id="step_walkthru" className="btn btn-default">Walkthru Step By Step</button>

					<form className="form-inline" action="/" onSubmit={ this.sendDrawingData }>
						<div className="input-group bottom-command-input">
							<label className="input-group-addon">Title</label>
							<input className="form-control" type="text" name="title" onChange= { this.onChange }/>
						</div>
						<div className="input-group bottom-command-input">
							<label className="input-group-addon">Category</label>
							<select className="form-control" name="category" onChange={ this.onChange }>
								{
									this.state.submission.categories.map(function(category, index) {
										return <option value={ category._id }>{ category.name }</option>
									})
								}
							</select>
						</div>
						
						<input id="drawing_input" type="text" style={{ display: 'none' }} name="drawing" onChange={ this.onChange } />
						<input className="form-control bottom-command-input" type="submit" value="Submit" />

					</form>
				</div>
			</div>
		)
	}
}

export default ApplicationPage;