import Base from './components/Base.jsx';
import HomePage from './components/HomePage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import NotFound from './components/NotFound.jsx';

const routes = {
	// base component (wrapper for the whole application)
	component: Base,
	childRoutes: [
		{
			path: '/',
			getComponent: (location, callback) => {
				callback(null, HomePage);
			},
		},
		{
			path: '/login',
			component: LoginPage
		},
		{
			path: '*',
			component: NotFound
		}
	]
};

export default routes;