import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';
import routes from './routes.js';

ReactDOM.render(
	<Router history={ browserHistory } routes={ routes } />,
	document.getElementById('app')
);

