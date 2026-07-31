import { PUBLIC_SITE_URLS } from 'constants/publicSite';

const getDocumentHref = (fileName) =>
	`${import.meta.env.BASE_URL}docs/${encodeURIComponent(fileName)}`;

const getLegalHref = (anchor) => `${PUBLIC_SITE_URLS.legal}#${anchor}`;

export const DOCUMENTATION_SECTIONS = [
	{
		id: 'services',
		title: 'Все сервисы reCode-Group.ru',
		items: [
			{
				title: 'Переводчик макросов',
				description: 'Переводчик устаревших VBA макросов на новые языки программирования',
				href: getDocumentHref('Описание_продукта.pdf'),
			},
			{
				title: 'Конструктор макросов',
				description: 'Создание и редактирование макросов в конструкторе Рекод',
				href: getDocumentHref('Описание_продукта.pdf'),
			},
		],
	},
	// {
	// 	id: 'engineer',
	// 	title: 'Анализ и проектирование',
	// 	items: [
	// 		{
	// 			title: 'Анализ сферы макросов',
	// 			description: 'Системный анализ предметной области скриптовых языков и макросов',
	// 			href: getDocumentHref('Анализ_предметной_области.pdf'),
	// 		},
	// 		{
	// 			title: 'Анализ проекта и риски',
	// 			description: 'Анализ перспектив проекта и возможные риски',
	// 			href: getDocumentHref('Анализ_проекта_и_риски.pdf'),
	// 		},
	// 	],
	// },
	// {
	// 	id: 'program',
	// 	title: 'Программное обеспечение',
	// 	items: [
	// 		{
	// 			title: 'Описание продукта',
	// 			description: 'Переводчик устаревших макросов и скриптов на новые языки программирования',
	// 			href: getDocumentHref('Описание_продукта.pdf'),
	// 		},
	// 		{
	// 			title: 'Демонстрация работы',
	// 			description: 'Примеры взаимодействия с продуктом',
	// 			href: getDocumentHref('Демонстрация_работы.pdf'),
	// 		},
	// 		{
	// 			title: 'Модули продукта',
	// 			description: 'Функциональное описание работы переводчика',
	// 			href: getDocumentHref('Модули_продукта.pdf'),
	// 		},
	// 	],
	// },
	{
		id: 'legal',
		title: 'Юридические документы',
		items: [
			{
				title: 'Публичная оферта',
				description: 'Условия оказания услуг с использованием платформы РеКод',
				href: getLegalHref('offer'),
			},
			{
				title: 'Лицензионное соглашение',
				description: 'Правила использования платформы и допустимого поведения пользователей',
				href: getLegalHref('agreement'),
			},
			{
				title: 'Согласие на обработку персональных данных',
				description: 'Условия обработки персональных данных пользователей платформы',
				href: getLegalHref('personal-data-consent'),
			},
			{
				title: 'Политика конфиденциальности',
				description: 'Правила сбора, хранения и защиты персональных данных пользователей',
				href: getLegalHref('privacy'),
			},
			{
				title: 'Согласие на обучение на пользовательском коде',
				description: 'Разрешение на использование кода для обучения и улучшения платформы',
				href: getLegalHref('code-training-consent'),
			},
			{
				title: 'Правила обработки кода и использования ИИ',
				description: 'Ограничения, требования и правила работы с пользовательским кодом',
				href: getLegalHref('code-and-ai-rules'),
			},
		],
	},
];
