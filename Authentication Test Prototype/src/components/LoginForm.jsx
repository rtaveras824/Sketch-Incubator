import React from 'react';

const LoginForm = ({
	onSubmit,
	onChange,
	user
}) => (
	<form action="/" onSubmit={ onSubmit }>
		<input type="text" name="email" onChange={ onChange }/>
		<input type="password" name="password" onChange={ onChange }/>
		<input type="submit" value="submit" />
	</form>
)

export default LoginForm;