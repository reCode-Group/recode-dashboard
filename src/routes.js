// import
import SignIn from 'views/Auth/SignIn.js';
import ConversionHistoryPage from 'views/Dashboard/ConversionHistory';
import Dashboard from 'views/Dashboard/Dashboard';
import Profile from 'views/Dashboard/Profile';
import Support from 'views/Dashboard/Support';
import EmployeeTable from 'views/Dashboard/Tables/components/EmployeeTable';

import { CreditIcon, HomeIcon, PersonIcon, RocketIcon, SupportIcon } from 'components/Icons/Icons';

import { CompanyIcon, ConverterIcon, EmployersIcon, HistoryIcon } from 'components/Icons/Icons';
import Billing from 'views/Dashboard/Billing';
import BillingPay from 'views/Dashboard/BillingPay';
import Tariff from 'views/Dashboard/Tariff';

var dashRoutes = [
	{
		path: '/dashboard',
		name: 'Главная',
		icon: <HomeIcon color="inherit" />,
		component: Dashboard,
		layout: '/admin',
	},
	{
		path: '/profile',
		name: 'Профиль',
		icon: <PersonIcon color="inherit" />,
		secondaryNavbar: true,
		component: Profile,
		layout: '/admin',
	},
	{
		path: '/billing/pay',
		name: 'Оплата услуг',
		component: BillingPay,
		layout: '/admin',
		hiddenInSidebar: true,
	},
	{
		path: '/billing',
		name: 'Финансы',
		icon: <CreditIcon color="inherit" />,
		component: Billing,
		layout: '/admin',
	},
	{
		path: '/support',
		name: 'Техподдержка',
		icon: <SupportIcon color="inherit" />,
		component: Support,
		layout: '/admin',
		hiddenInSidebar: true,
	},
	{
		path: '/tariff',
		name: 'Тариф',
		icon: <RocketIcon color="inherit" />,
		component: Tariff,
		layout: '/admin',
	},
	{
		name: 'УПРАВЛЕНИЕ',
		category: 'account',
		state: 'pageCollapse',
		views: [
			{
				path: '/tables',
				name: 'Компания',
				icon: <CompanyIcon color="inherit" />,
				component: EmployeeTable,
				layout: '/admin',
			},
			{
				path: '/tables',
				name: 'Сотрудники',
				icon: <EmployersIcon color="inherit" />,
				component: EmployeeTable,
				layout: '/admin',
			},
			{
				path: '/login-page',
				name: 'Перейти в переводчик',
				icon: <ConverterIcon color="inherit" />,
				component: SignIn,
				layout: '/auth',
			},
			{
				path: '/conversion-history',
				name: 'История конвертаций',
				icon: <HistoryIcon color="inherit" />,
				component: ConversionHistoryPage,
				layout: '/admin',
			},
		],
	},
];
export default dashRoutes;
