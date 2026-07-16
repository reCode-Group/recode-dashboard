import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { routePaths } from '../routePaths';

const BRAND_NAME = 'РеКод';

const DEFAULT_METADATA = {
	title: `Платформа для автоматического перевода макросов — ${BRAND_NAME}`,
	description: 'Платформа Рекод для перевода, создания и управления макросами.',
	robots: 'noindex, nofollow',
};

const ROUTE_METADATA = {
	[routePaths.public.documentation()]: {
		title: `Документация по переводу макросов — ${BRAND_NAME}`,
		description:
			'Документация Рекод: возможности платформы, описание перевода макросов, примеры использования и проектные материалы.',
		robots: 'index, follow',
	},
	[routePaths.public.macroTranslator()]: {
		title: `Переводчик VBA-макросов в JavaScript и Lua — ${BRAND_NAME}`,
		description:
			'Онлайн-переводчик VBA-макросов в JavaScript и Lua: загрузите исходный код и получите результат автоматической конвертации.',
		robots: 'index, follow',
	},
	[routePaths.public.macroConstructor()]: {
		title: `Конструктор макросов — ${BRAND_NAME}`,
		description:
			'Создание и редактирование макросов в конструкторе Рекод для пользователей расширенных тарифов.',
		robots: 'noindex, nofollow',
	},
	[routePaths.auth.login()]: {
		title: `Вход в личный кабинет — ${BRAND_NAME}`,
		description:
			'Вход в личный кабинет платформы Рекод для работы с макросами, компанией и тарифами.',
		robots: 'noindex, nofollow',
	},
	[routePaths.auth.signUp()]: {
		title: `Регистрация в ${BRAND_NAME}`,
		description:
			'Создание аккаунта для доступа к инструментам перевода и управления макросами в Рекод.',
		robots: 'noindex, nofollow',
	},
	[routePaths.dashboard.home()]: {
		title: `Личный кабинет — ${BRAND_NAME}`,
		description:
			'Обзор аккаунта, тарифа, токенов, сотрудников и последних конвертаций в личном кабинете Рекод.',
		robots: 'noindex, nofollow',
	},
	[routePaths.dashboard.profile()]: {
		title: `Профиль пользователя — ${BRAND_NAME}`,
		description:
			'Данные профиля, настройки платформы, документы и последние конвертации пользователя.',
		robots: 'noindex, nofollow',
	},
	[routePaths.dashboard.profileComplete()]: {
		title: `Заполнение профиля — ${BRAND_NAME}`,
		description: 'Завершение регистрации и заполнение данных профиля пользователя Рекод.',
		robots: 'noindex, nofollow',
	},
	[routePaths.dashboard.company()]: {
		title: `Управление компанией — ${BRAND_NAME}`,
		description:
			'Информация о компании, сотрудниках, документах, настройках и истории конвертаций.',
		robots: 'noindex, nofollow',
	},
	[routePaths.dashboard.companyRegistration()]: {
		title: `Регистрация компании — ${BRAND_NAME}`,
		description: 'Создание или привязка компании к аккаунту пользователя Рекод.',
		robots: 'noindex, nofollow',
	},
	[routePaths.dashboard.employees()]: {
		title: `Управление сотрудниками — ${BRAND_NAME}`,
		description: 'Список сотрудников компании и управление их доступом к платформе Рекод.',
		robots: 'noindex, nofollow',
	},
	[routePaths.dashboard.tariff()]: {
		title: `Тарифы и пакеты токенов — ${BRAND_NAME}`,
		description: 'Информация о текущем тарифе, доступных пакетах токенов и способах оплаты.',
		robots: 'noindex, nofollow',
	},
	[routePaths.dashboard.billingPay()]: {
		title: `Оплата услуг — ${BRAND_NAME}`,
		description: 'Выбор тарифа и способа оплаты услуг платформы Рекод.',
		robots: 'noindex, nofollow',
	},
	[routePaths.dashboard.support()]: {
		title: `Техническая поддержка — ${BRAND_NAME}`,
		description: 'Создание обращений и просмотр истории переписки с технической поддержкой Рекод.',
		robots: 'noindex, nofollow',
	},
	[routePaths.dashboard.conversionHistory()]: {
		title: `История конвертаций — ${BRAND_NAME}`,
		description: 'Полная история переводов и конвертаций макросов пользователя или компании.',
		robots: 'noindex, nofollow',
	},
};

function normalizePathname(pathname) {
	if (pathname === '/') return pathname;
	return pathname.replace(/\/+$/, '');
}

function setMetaContent(name, content) {
	let element = document.head.querySelector(`meta[name="${name}"]`);

	if (!element) {
		element = document.createElement('meta');
		element.setAttribute('name', name);
		document.head.appendChild(element);
	}

	element.setAttribute('content', content);
}

export function getRouteMetadata(pathname) {
	return ROUTE_METADATA[normalizePathname(pathname)] || DEFAULT_METADATA;
}

export function RouteMetadata() {
	const { pathname } = useLocation();

	useLayoutEffect(() => {
		const metadata = getRouteMetadata(pathname);

		document.title = metadata.title;
		setMetaContent('description', metadata.description);
		setMetaContent('robots', metadata.robots);
	}, [pathname]);

	return <Outlet />;
}
