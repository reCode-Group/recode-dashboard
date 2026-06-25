import { Navigate } from 'react-router-dom';
import { routePaths } from '../routePaths';

export const legacyRedirectRoutes = [
	{ path: '/main', element: <Navigate to={routePaths.home()} replace /> },
	{ path: '/main/landing', element: <Navigate to={routePaths.home()} replace /> },
	{ path: '/main/documentation', element: <Navigate to={routePaths.public.documentation()} replace /> },
	{ path: '/main/blog', element: <Navigate to={routePaths.public.blog()} replace /> },
	{ path: '/main/contacts', element: <Navigate to={routePaths.public.contacts()} replace /> },
	{ path: '/main/privacy-policy', element: <Navigate to={routePaths.public.privacyPolicy()} replace /> },
	{ path: '/main/public-offer', element: <Navigate to={routePaths.public.publicOffer()} replace /> },
	{ path: '/main/macro-translator', element: <Navigate to={routePaths.public.macroTranslator()} replace /> },
	{ path: '/admin/profile/complete', element: <Navigate to={routePaths.dashboard.profileComplete()} replace /> },
	{ path: '/admin/profile', element: <Navigate to={routePaths.dashboard.profile()} replace /> },
	{ path: '/admin/company/reg', element: <Navigate to={routePaths.dashboard.companyRegistration()} replace /> },
	{ path: '/admin/company', element: <Navigate to={routePaths.dashboard.company()} replace /> },
	{ path: '/admin/employees', element: <Navigate to={routePaths.dashboard.employees()} replace /> },
	{ path: '/admin/billing/pay', element: <Navigate to={routePaths.dashboard.billingPay()} replace /> },
	{ path: '/admin/billing', element: <Navigate to={routePaths.dashboard.billing()} replace /> },
	{ path: '/admin/support', element: <Navigate to={routePaths.dashboard.support()} replace /> },
	{ path: '/admin/tariff', element: <Navigate to={routePaths.dashboard.tariff()} replace /> },
	{
		path: '/admin/conversion-history',
		element: <Navigate to={routePaths.dashboard.conversionHistory()} replace />,
	},
	{ path: '/admin', element: <Navigate to={routePaths.dashboard.home()} replace /> },
];
