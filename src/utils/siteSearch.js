import routes from 'routes';
import { BLOG_ARTICLES } from 'views/Main/Blog/data';
import { DOCUMENTATION_SECTIONS } from 'views/Main/Documentation/data';

const ROUTE_DESCRIPTIONS = {
	'/admin/dashboard': 'Главная страница личного кабинета, статистика и обзор платформы',
	'/admin/profile': 'Профиль пользователя, документы и последние конвертации',
	'/admin/company': 'Компания, настройки и история конвертаций организации',
	'/admin/employees': 'Сотрудники компании и управление доступом',
	'/admin/billing': 'Финансы, платежи, пополнение и способы оплаты',
	'/admin/billing/pay': 'Оплата услуг и пополнение баланса',
	'/admin/tariff': 'Тарифы и пакеты токенов',
	'/admin/support': 'Техническая поддержка и тикеты',
	'/admin/conversion-history': 'Полная история конвертаций',
	'/main/landing': 'О проекте, возможности платформы и преимущества сервиса',
	'/main/documentation': 'Документация, описание продукта и проектные материалы',
	'/main/blog': 'Блог о VBA, автоматизации и миграции макросов',
	'/main/contacts': 'Контакты и каналы связи',
	'/main/privacy-policy': 'Политика конфиденциальности',
	'/main/public-offer': 'Публичная оферта и условия использования',
	'/main/macro-translator': 'Переводчик макросов VBA в JavaScript и Lua',
};

const ROUTE_KEYWORDS = {
	'/admin/dashboard': ['главная', 'dashboard', 'статистика', 'обзор'],
	'/admin/profile': ['аккаунт', 'профиль', 'документы'],
	'/admin/company': ['организация', 'компания', 'настройки компании'],
	'/admin/employees': ['команда', 'сотрудники', 'работники'],
	'/admin/billing': ['финансы', 'оплата', 'платежи', 'пополнение', 'токены'],
	'/admin/billing/pay': ['оплата', 'пополнить', 'баланс'],
	'/admin/tariff': ['тариф', 'пакет', 'токены'],
	'/admin/support': ['поддержка', 'тикеты', 'помощь'],
	'/admin/conversion-history': ['история', 'конвертации', 'переводы'],
	'/main/documentation': ['документация', 'ресурсы', 'pdf'],
	'/main/blog': ['блог', 'статьи', 'vba'],
	'/main/macro-translator': ['переводчик', 'макросы', 'vba', 'lua', 'js'],
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

		if (!item?.layout || !item?.path || !item?.name) {
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
			sectionLabel: fullPath.startsWith('/admin') ? 'Страница кабинета' : 'Страница сайта',
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

function getBlogEntries() {
	return BLOG_ARTICLES.map((article) => ({
		id: `blog:${article.slug}`,
		type: 'blog',
		title: article.title,
		description: article.description || article.subtitle,
		sectionLabel: 'Блог',
		keywords: [article.subtitle, ...(article.content || []).slice(0, 2)],
		route: `/main/blog/${article.slug}`,
	}));
}

function buildSearchText(entry) {
	return normalizeText([entry.title, entry.description, entry.sectionLabel, ...(entry.keywords || [])].join(' '));
}

const SEARCH_INDEX = [...getRouteEntries(), ...getDocumentationEntries(), ...getBlogEntries()].map((entry) => ({
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

	return SEARCH_INDEX
		.map((entry) => ({
			...entry,
			score: getMatchScore(entry, normalizedQuery),
		}))
		.filter((entry) => entry.score >= 0)
		.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'ru-RU'))
		.slice(0, limit);
}
