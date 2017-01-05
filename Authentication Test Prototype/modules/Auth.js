const Auth = {
	authenticateUser: (token) => {
		localStorage.setItem('token', token);
	},
	isUserAuthenticated: () => {
		return localStorage.getItem('token') !== null;
	}
};

export default Auth;