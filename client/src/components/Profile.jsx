import React from 'react';

class Profile extends React.Component {
	constructor(props) {
		super(props);


	}

	render() {
		return (
			<div>
				{ this.props.params.user_id }
			</div>
		)
	}
}

export default Profile;