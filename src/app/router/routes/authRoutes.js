import { Navigate } from 'react-router-dom';
import { routePaths } from '../routePaths';
import { lazyRouteElement } from '../lazyRouteElement';

export const authRoutes = [
	{ path: routePaths.auth.login(), element: lazyRouteElement(() => import('views/Auth/SignIn')) },
	{ path: routePaths.auth.signUp(), element: lazyRouteElement(() => import('views/Auth/SignUp')) },
	{ path: routePaths.auth.root(), element: <Navigate to={routePaths.auth.login()} replace /> },
];
