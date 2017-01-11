import React from 'react';

const LoginForm = ({
	onSubmit,
	onChange,
	user
}) => (
	<div className="fluid-container">
		<div className="login-container center">
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Log In</h3>
				</div>

				<div className="panel-body">
					<form action="/" onSubmit={ onSubmit }>
						<div className="form-group">
							<label>Email</label>
							<input className="form-control" type="text" name="email" onChange={ onChange }/>
						</div>
						
						<div className="form-group">
							<label>Password</label>
							<input className="form-control" type="password" name="password" onChange={ onChange }/>
						</div>
						<input className="form-control" type="submit" value="Submit" />
					</form>
				</div>
			</div>
		</div>
	</div>
)

export default LoginForm;