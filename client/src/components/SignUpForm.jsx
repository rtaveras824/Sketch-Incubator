import React from 'react';
import { Link } from 'react-router';

const SignUpForm = ({
	onSubmit,
	onChange,
	user
}) => (
	<div>
		<form action="/" onSubmit={ onSubmit }>
			<h2>Sign Up</h2>

			<input type="text" name="display_name" onChange={ onChange } />
			<input type="text" name="email" onChange={ onChange } />
			<input type="password" name="password" onChange={ onChange } />
			<input type="submit" value="submit" />
		</form>
	</div>
);

export default SignUpForm;