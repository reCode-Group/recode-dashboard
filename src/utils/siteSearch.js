import routes from 'routes';
import { DOCUMENTATION_SECTIONS } from 'views/Main/Documentation/data';

const ROUTE_DESCRIPTIONS = {
	'/lk/dashboard': 'Главная страница личного кабинета, статистика и обзор платформы',
	'/lk/profile': 'Профиль пользователя, документы и последние конвертации',
	'/lk/company': 'Компания, настройки и история конвертаций организации',
	'/lk/employees': 'Сотрудники компании и управление доступом',
	'/lk/billing': 'Финансы, платежи, пополнение и способы оплаты',
	'/lk/billing/pay': 'Оплата услуг и пополнение баланса',
	'/lk/tariff': 'Тарифы и пакеты токенов',
	'/lk/support': 'Техническая поддержка и тикеты',
	'/lk/conversion-history': 'Полная история конвертаций',
	'/documentation': 'Документация, описание продукта и проектные материалы',
	'/translator': 'Переводчик макросов VBA в JavaScript и Lua',
};

const ROUTE_KEYWORDS = {
	'/lk/dashboard': ['главная', 'dashboard', 'статистика', 'обзор'],
	'/lk/profile': ['аккаунт', 'профиль', 'документы'],
	'/lk/company': ['организация', 'компания', 'настройки компании'],
	'/lk/employees': ['команда', 'сотрудники', 'работники'],
	'/lk/billing': ['финансы', 'оплата', 'платежи', 'пополнение', 'токены'],
	'/lk/billing/pay': ['оплата', 'пополнить', 'баланс'],
	'/lk/tariff': ['тариф', 'пакет', 'токены'],
	'/lk/support': ['поддержка', 'тикеты', 'помощь'],
	'/lk/conversion-history': ['история', 'конвертации', 'переводы'],
	'/documentation': ['документация', 'ресурсы', 'pdf'],
	'/translator': ['переводчик', 'макросы', 'vba', 'lua', 'js'],
};

function normalizeText(value) {
	return String(value || '')
		.toLocaleLowerCase('ru-RU')
		.replace(/\s+/g, ' ')
		.trim();
}

function flattenRoutes(items, result = []) {
	items.forEach((item) => {
		if (Array.isArray(item.views)) {
			flattenRoutes(item.views, result);
			return;
		}

		if (typeof item?.layout !== 'string' || !item?.path || !item?.name) {
			return;
		}

		const fullPath = `${item.layout}${item.path}`;
		if (fullPath.includes(':') || fullPath.startsWith('/auth')) {
			return;
		}

		result.push({
			id: `route:${fullPath}`,
			type: 'page',
			title: item.name,
			description: ROUTE_DESCRIPTIONS[fullPath] || item.name,
			sectionLabel: fullPath.startsWith('/lk') ? 'Страница кабинета' : 'Страница сайта',
			keywords: ROUTE_KEYWORDS[fullPath] || [],
			route: fullPath,
		});
	});

	return result;
}

function getRouteEntries() {
	return flattenRoutes(routes).filter((item, index, array) => {
		return array.findIndex((candidate) => candidate.route === item.route) === index;
	});
}

function getDocumentationEntries() {
	return DOCUMENTATION_SECTIONS.flatMap((section) =>
		section.items.map((item) => ({
			id: `doc:${section.id}:${item.href}`,
			type: 'doc',
			title: item.title,
			description: item.description,
			sectionLabel: `Документ · ${section.title}`,
			keywords: [section.title],
			href: item.href,
		}))
	);
}

function buildSearchText(entry) {
	return normalizeText(
		[entry.title, entry.description, entry.sectionLabel, ...(entry.keywords || [])].join(' ')
	);
}

const SEARCH_INDEX = [...getRouteEntries(), ...getDocumentationEntries()].map((entry) => ({
	...entry,
	searchText: buildSearchText(entry),
}));

function getMatchScore(entry, query) {
	const normalizedQuery = normalizeText(query);
	if (!normalizedQuery) return -1;

	const title = normalizeText(entry.title);
	const description = normalizeText(entry.description);

	if (title === normalizedQuery) return 100;
	if (title.startsWith(normalizedQuery)) return 80;
	if (title.includes(normalizedQuery)) return 60;
	if (description.startsWith(normalizedQuery)) return 40;
	if (entry.searchText.includes(normalizedQuery)) return 20;

	return -1;
}

export function searchSite(query, limit = 8) {
	const normalizedQuery = normalizeText(query);
	if (!normalizedQuery) {
		return [];
	}

	return SEARCH_INDEX.map((entry) => ({
		...entry,
		score: getMatchScore(entry, normalizedQuery),
	}))
		.filter((entry) => entry.score >= 0)
		.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'ru-RU'))
		.slice(0, limit);
}
