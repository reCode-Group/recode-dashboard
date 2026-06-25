import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import AuthLayout from 'layouts/Auth';
import AdminLayout from 'layouts/Admin';
import MainLayout from 'layouts/Main';
import { authRoutes } from './routes/authRoutes';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { legacyRedirectRoutes } from './routes/legacyRedirectRoutes';
import { mainRoutes } from './routes/mainRoutes';
import { routePaths } from './routePaths';
import { RequireAuth } from './ui/RequireAuth';
import { RequireGuest } from './ui/RequireGuest';

const appRouter = createBrowserRouter([
	{
		element: <MainLayout />,
		children: [...mainRoutes, ...legacyRedirectRoutes.filter((route) => route.path.startsWith('/main'))],
	},
	{
		element: <RequireGuest />,
		children: [
			{
				element: <AuthLayout />,
				children: authRoutes,
			},
		],
	},
	{
		element: <RequireAuth />,
		children: [
			{
				element: <AdminLayout />,
				children: [
					...dashboardRoutes,
					...legacyRedirectRoutes.filter((route) => route.path.startsWith('/admin')),
				],
			},
		],
	},
	{ path: '*', element: <Navigate to={routePaths.home()} replace /> },
]);

export function AppRouter() {
	return <RouterProvider router={appRouter} />;
}
