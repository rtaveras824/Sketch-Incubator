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
			<div>
				<canvas id="canvas">Canvas is not supported</canvas>
				<button id="pencil">Pencil</button>
				<button id="erase">Erase</button>
				<button id="undo_btn">Undo</button>
				<button id="redo_btn">Redo</button>
				<button id="record_sketch">Record Sketch</button>
				<button id="record_walkthru">Record Walkthru</button>
				<button id="play_walkthru">Walkthru Play</button>
				<button id="step_walkthru">Walkthru Step By Step</button>

				<form action="/" onSubmit={ this.sendDrawingData }>
					<input type="text" name="title" onChange= { this.onChange }/>
				
					<select name="category" onChange={ this.onChange }>
						{
							this.state.submission.categories.map(function(category, index) {
								return <option value={ category._id }>{ category.name }</option>
							})
						}
					</select>

					<input id="drawing_input" type="text" style={{ display: 'none' }} name="drawing" onChange={ this.onChange } />
					<input type="submit" value="Submit" />
				</form>
				<img id="canvas_img" />
			</div>
		)
	}
}

export default ApplicationPage;