import Base from '../client/src/components/Base.jsx';
import MainPage from '../client/src/containers/MainPage.jsx';
import LoginPage from '../client/src/containers/LoginPage.jsx';
import Category from '../client/src/components/Category.jsx';
import Drawing from '../client/src/components/Drawing.jsx';
import NotFound from '../client/src/components/NotFound.jsx';

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
					//callback(null, LoginPage);
					callback(null, MainPage);
				}
			}
		},
		{
			path: '/login',
			component: LoginPage
		},
		{
			path: '/category/:category_id',
			component: Category
		},
		{
			path: '/drawing/:drawing_id',
			component: Drawing
		},
		{
			path: '*',
			component: NotFound
		}
	]
};

export default routes;