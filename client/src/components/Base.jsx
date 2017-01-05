import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';

const Base = ({ children }) => (
	<div>
		<div>
			<IndexLink to="/">Home Page</IndexLink>
			<Link to="/login">Login</Link>
		</div>
		<div>
			{ children }
		</div>
	</div>
);

Base.propTypes = {
	children: PropTypes.object.isRequired,
};

export default Base;