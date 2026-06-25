import { Navigate } from 'react-router-dom';
import { routePaths } from '../routePaths';
import { lazyRouteElement } from '../lazyRouteElement';

export const dashboardRoutes = [
	{ path: routePaths.dashboard.home(), element: lazyRouteElement(() => import('views/Dashboard/Dashboard')) },
	{
		path: routePaths.dashboard.profileComplete(),
		element: lazyRouteElement(() => import('views/Dashboard/ProfileComplete')),
	},
	{
		path: routePaths.dashboard.companyRegistration(),
		element: lazyRouteElement(() => import('views/Dashboard/CompanyRegistration')),
	},
	{ path: routePaths.dashboard.profile(), element: lazyRouteElement(() => import('views/Dashboard/Profile')) },
	{ path: routePaths.dashboard.billingPay(), element: lazyRouteElement(() => import('views/Dashboard/BillingPay')) },
	{ path: routePaths.dashboard.billing(), element: lazyRouteElement(() => import('views/Dashboard/Billing')) },
	{ path: routePaths.dashboard.support(), element: lazyRouteElement(() => import('views/Dashboard/Support')) },
	{ path: routePaths.dashboard.tariff(), element: lazyRouteElement(() => import('views/Dashboard/Tariff')) },
	{ path: routePaths.dashboard.company(), element: lazyRouteElement(() => import('views/Dashboard/Company')) },
	{
		path: routePaths.dashboard.employees(),
		element: lazyRouteElement(() => import('views/Dashboard/Tables/components/EmployeeTable')),
	},
	{
		path: routePaths.dashboard.conversionHistory(),
		element: lazyRouteElement(() => import('views/Dashboard/ConversionHistory')),
	},
	{ path: routePaths.dashboard.root(), element: <Navigate to={routePaths.dashboard.home()} replace /> },
];
