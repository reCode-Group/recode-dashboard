import Billing from 'views/Dashboard/Billing';
import BillingPay from 'views/Dashboard/BillingPay';
import CompanyRegistration from 'views/Dashboard/CompanyRegistration';
import ConversionHistoryPage from 'views/Dashboard/ConversionHistory';
import Dashboard from 'views/Dashboard/Dashboard';
import Profile from 'views/Dashboard/Profile';
import ProfileComplete from 'views/Dashboard/ProfileComplete';
import Support from 'views/Dashboard/Support';
import EmployeeTable from 'views/Dashboard/Tables/components/EmployeeTable';
import Tariff from 'views/Dashboard/Tariff';
import DocumentationPage from 'views/Main/Documentation';
import BlogArticlePage from 'views/Main/Blog/Article';
import BlogPage from 'views/Main/Blog';
import MacroTranslatorPage from 'views/Main/MacroTranslator';

import {
	CompanyIcon,
	ConverterIcon,
	CreditIcon,
	EmployersIcon,
	HistoryIcon,
	HomeIcon,
	PersonIcon,
	RocketIcon,
	SupportIcon,
} from 'components/Icons/Icons';

const dashRoutes = [
	{
		path: '/dashboard',
		name: 'Главная',
		icon: <HomeIcon color="inherit" />,
		component: Dashboard,
		layout: '/admin',
	},
	{
		path: '/profile/complete',
		name: 'Профиль',
		component: ProfileComplete,
		layout: '/admin',
		hiddenInSidebar: true,
	},
	{
		path: '/company/reg',
		name: 'Компания',
		component: CompanyRegistration,
		layout: '/admin',
		hiddenInSidebar: true,
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
				layout: '/main',
			},
			{
				path: '/documentation',
				name: 'Документация',
				component: DocumentationPage,
				layout: '/main',
				hiddenInSidebar: true,
			},
			{
				path: '/blog',
				name: 'Блог',
				component: BlogPage,
				layout: '/main',
				hiddenInSidebar: true,
			},
			{
				path: '/blog/:slug',
				name: 'Статья',
				component: BlogArticlePage,
				layout: '/main',
				hiddenInSidebar: true,
			},
			{
				path: '/macro-translator',
				name: 'Перейти в переводчик',
				icon: <ConverterIcon color="inherit" />,
				component: MacroTranslatorPage,
				layout: '/main',
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

