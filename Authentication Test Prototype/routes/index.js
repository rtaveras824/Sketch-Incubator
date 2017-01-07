import Base from '../src/components/Base.jsx';
import MainPage from '../src/containers/MainPage.jsx';
import LoginPage from '../src/containers/LoginPage.jsx';
import Category from '../src/components/Category.jsx';
import Drawing from '../src/components/Drawing.jsx';
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
			path: '/api/:category_id',
			component: Category
		},
		{
			path: '/api/drawing/:drawing_id',
			component: Drawing
		},
		{
			path: '*',
			component: NotFound
		}
	]
};

export default routes;