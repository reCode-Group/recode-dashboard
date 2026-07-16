const getDocumentHref = (fileName) =>
	`${import.meta.env.BASE_URL}docs/${encodeURIComponent(fileName)}`;

export const DOCUMENTATION_SECTIONS = [
	{
		id: 'services',
		title: 'Все сервисы reCode-Group.ru',
		items: [
			{
				title: 'Конвертер макросов',
				description: 'Переводчик устаревших макросов и скриптов на новые языки программирования',
				href: getDocumentHref('Описание_продукта.pdf'),
			},
		],
	},
	{
		id: 'engineer',
		title: 'Анализ и проектирование',
		items: [
			{
				title: 'Анализ сферы макросов',
				description: 'Системный анализ предметной области скриптовых языков и макросов',
				href: getDocumentHref('Анализ_предметной_области.pdf'),
			},
			{
				title: 'Анализ проекта и риски',
				description: 'Анализ перспектив проекта и возможные риски',
				href: getDocumentHref('Анализ_проекта_и_риски.pdf'),
			},
		],
	},
	{
		id: 'program',
		title: 'Программное обеспечение',
		items: [
			{
				title: 'Описание продукта',
				description: 'Переводчик устаревших макросов и скриптов на новые языки программирования',
				href: getDocumentHref('Описание_продукта.pdf'),
			},
			{
				title: 'Демонстрация работы',
				description: 'Примеры взаимодействия с продуктом',
				href: getDocumentHref('Демонстрация_работы.pdf'),
			},
			{
				title: 'Модули продукта',
				description: 'Функциональное описание работы переводчика',
				href: getDocumentHref('Модули_продукта.pdf'),
			},
		],
	},
];
