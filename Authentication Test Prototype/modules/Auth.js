class Auth {
	static authenticateUser(token) {
		localStorage.setItem('token', token);
	}

	static isUserAuthenticated() {
		if (localStorage.getItem('token') == null)
			return false;
		else if (localStorage.getItem('token') == 'undefined')
			return false;
		else
			return true;
	}

	static getToken() {
		return localStorage.getItem('token');
	}
};

export default Auth;