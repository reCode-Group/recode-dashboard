import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import AuthLayout from 'layouts/Auth';
import AdminLayout from 'layouts/Admin';
import MainLayout from 'layouts/Main';
import { authRoutes } from './routes/authRoutes';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { mainRoutes } from './routes/mainRoutes';
import { routePaths } from './routePaths';
import { RequireAuth } from './ui/RequireAuth';
import { RequireGuest } from './ui/RequireGuest';

const appRouter = createBrowserRouter([
	{
		element: <MainLayout />,
		children: mainRoutes,
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
				children: dashboardRoutes,
			},
		],
	},
	{ path: '*', element: <Navigate to={routePaths.home()} replace /> },
]);

export function AppRouter() {
	return <RouterProvider router={appRouter} />;
}
