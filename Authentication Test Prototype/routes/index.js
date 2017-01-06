import Base from '../src/components/Base.jsx';
import MainPage from '../src/containers/MainPage.jsx';
import LoginPage from '../src/containers/LoginPage.jsx';
import NotFound from '../src/components/NotFound.jsx';

import Auth from '../modules/Auth';

const routes = {
	component: Base,
	childRoutes: [
		{
			path: '/',
			getComponent: (location, callback) => {
				if (Auth.isUserAuthenticated()) {
					callback(null, MainPage);
				} else {
					callback(null, LoginPage);
				}
			}
		},
		// {
		// 	path: '/user/:userid',
		// 	component: Profile
		// },

		{
			path: '*',
			component: NotFound
		}
	]
};

export default routes;