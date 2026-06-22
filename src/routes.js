import Billing from 'views/Dashboard/Billing';
import BillingPay from 'views/Dashboard/BillingPay';
import CompanyRegistration from 'views/Dashboard/CompanyRegistration';
import Company from 'views/Dashboard/Company';
import ConversionHistoryPage from 'views/Dashboard/ConversionHistory';
import Dashboard from 'views/Dashboard/Dashboard';
import Profile from 'views/Dashboard/Profile';
import ProfileComplete from 'views/Dashboard/ProfileComplete';
import Support from 'views/Dashboard/Support';
import EmployeeTable from 'views/Dashboard/Tables/components/EmployeeTable';
import Tariff from 'views/Dashboard/Tariff';
import SignIn from 'views/Auth/SignIn';
import SignUp from 'views/Auth/SignUp';
import BlogPage from 'views/Main/Blog';
import BlogArticlePage from 'views/Main/Blog/Article';
import ContactsPage from 'views/Main/Contacts';
import DocumentationPage from 'views/Main/Documentation';
import LandingPage from 'views/Main/Landing';
import PrivacyPolicyPage from 'views/Main/Legal/PrivacyPolicy';
import PublicOfferPage from 'views/Main/Legal/PublicOffer';
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
		path: '/login-page',
		name: 'Вход',
		component: SignIn,
		layout: '/auth',
		hiddenInSidebar: true,
	},
	{
		path: '/sign-up',
		name: 'Регистрация',
		component: SignUp,
		layout: '/auth',
		hiddenInSidebar: true,
	},
	{
		path: '/dashboard',
		name: 'Главная',
		icon: <HomeIcon color="inherit" />,
		component: Dashboard,
		layout: '/lk',
	},
	{
		path: '/profile/complete',
		name: 'Профиль',
		component: ProfileComplete,
		layout: '/lk',
		hiddenInSidebar: true,
	},
	{
		path: '/company/reg',
		name: 'Компания',
		component: CompanyRegistration,
		layout: '/lk',
		hiddenInSidebar: true,
	},
	{
		path: '/profile',
		name: 'Профиль',
		icon: <PersonIcon color="inherit" />,
		secondaryNavbar: true,
		component: Profile,
		layout: '/lk',
	},
	{
		path: '/billing/pay',
		name: 'Оплата услуг',
		component: BillingPay,
		layout: '/lk',
		hiddenInSidebar: true,
	},
	{
		path: '/billing',
		name: 'Финансы',
		icon: <CreditIcon color="inherit" />,
		component: Billing,
		layout: '/lk',
	},
	{
		path: '/support',
		name: 'Техподдержка',
		icon: <SupportIcon color="inherit" />,
		component: Support,
		layout: '/lk',
		hiddenInSidebar: true,
	},
	{
		path: '/tariff',
		name: 'Тариф',
		icon: <RocketIcon color="inherit" />,
		component: Tariff,
		layout: '/lk',
	},
	{
		name: 'УПРАВЛЕНИЕ',
		category: 'account',
		state: 'pageCollapse',
		views: [
			{
				path: '/company',
				name: 'Компания',
				secondaryNavbar: true,
				icon: <CompanyIcon color="inherit" />,
				component: Company,
				layout: '/lk',
			},
			{
				path: '/employees',
				name: 'Сотрудники',
				icon: <EmployersIcon color="inherit" />,
				component: EmployeeTable,
				layout: '/lk',
			},
			{
				path: '/',
				name: 'Лендинг',
				component: LandingPage,
				layout: '',
				hiddenInSidebar: true,
			},
			{
				path: '/documentation',
				name: 'Документация',
				component: DocumentationPage,
				layout: '',
				hiddenInSidebar: true,
			},
			{
				path: '/blog',
				name: 'Блог',
				component: BlogPage,
				layout: '',
				hiddenInSidebar: true,
			},
			{
				path: '/blog/:slug',
				name: 'Статья',
				component: BlogArticlePage,
				layout: '',
				hiddenInSidebar: true,
			},
			{
				path: '/contacts',
				name: 'Контакты',
				component: ContactsPage,
				layout: '',
				hiddenInSidebar: true,
			},
			{
				path: '/privacy-policy',
				name: 'Политика конфиденциальности',
				component: PrivacyPolicyPage,
				layout: '',
				hiddenInSidebar: true,
			},
			{
				path: '/public-offer',
				name: 'Публичная оферта',
				component: PublicOfferPage,
				layout: '',
				hiddenInSidebar: true,
			},
			{
				path: '/macro-translator',
				name: 'Перейти в переводчик',
				icon: <ConverterIcon color="inherit" />,
				component: MacroTranslatorPage,
				layout: '',
			},
			{
				path: '/conversion-history',
				name: 'История конвертаций',
				icon: <HistoryIcon color="inherit" />,
				component: ConversionHistoryPage,
				layout: '/lk',
			},
		],
	},
];

export default dashRoutes;



