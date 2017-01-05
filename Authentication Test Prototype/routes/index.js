import Base from '../src/components/Base.jsx';
import Body from '../src/components/Body.jsx';
import NotFound from '../src/components/NotFound.jsx';

const routes = {
	component: Base,
	childRoutes: [
		{
			path: '/',
			getComponent: (location, callback) => {
				callback(null, Body);
			}
		},
		{
			path: '/user/:userid',
			component: Profile
		},
		
		{
			path: '*',
			component: NotFound
		}
	]
};

export default routes;