import { lazy } from 'react';

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

const Billing = lazy(() => import('views/Dashboard/Billing'));
const BillingPay = lazy(() => import('views/Dashboard/BillingPay'));
const CompanyRegistration = lazy(() => import('views/Dashboard/CompanyRegistration'));
const Company = lazy(() => import('views/Dashboard/Company'));
const ConversionHistoryPage = lazy(() => import('views/Dashboard/ConversionHistory'));
const Dashboard = lazy(() => import('views/Dashboard/Dashboard'));
const Profile = lazy(() => import('views/Dashboard/Profile'));
const ProfileComplete = lazy(() => import('views/Dashboard/ProfileComplete'));
const Support = lazy(() => import('views/Dashboard/Support'));
const EmployeeTable = lazy(() => import('views/Dashboard/Tables/components/EmployeeTable'));
const Tariff = lazy(() => import('views/Dashboard/Tariff'));
const SignIn = lazy(() => import('views/Auth/SignIn'));
const SignUp = lazy(() => import('views/Auth/SignUp'));
const BlogPage = lazy(() => import('views/Main/Blog'));
const BlogArticlePage = lazy(() => import('views/Main/Blog/Article'));
const ContactsPage = lazy(() => import('views/Main/Contacts'));
const DocumentationPage = lazy(() => import('views/Main/Documentation'));
const MacroConstructorPage = lazy(() => import('features/macroConstructor/MacroConstructorPage'));
const LandingPage = lazy(() => import('views/Main/Landing'));
const PrivacyPolicyPage = lazy(() => import('views/Main/Legal/PrivacyPolicy'));
const PublicOfferPage = lazy(() => import('views/Main/Legal/PublicOffer'));
const MacroTranslatorPage = lazy(() => import('views/Main/MacroTranslator'));

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
				path: '/macro-constructor',
				name: 'Конструктор макросов',
				component: MacroConstructorPage,
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
