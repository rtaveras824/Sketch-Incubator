import Base from '../src/components/Base.jsx';
import Body from '../src/components/Body.jsx';
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
					callback(null, Body);
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