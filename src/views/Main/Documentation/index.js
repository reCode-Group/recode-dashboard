import 'views/Main/Documentation/styles.css';

import recodeLogoColored from 'assets/svg/recode-logo-colored.svg';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

const sections = [
	{
		id: 'services',
		title: 'Все сервисы Ре-Код.рф',
		items: [
			{
				title: 'Конвертер макросов',
				description: 'Переводчик устаревших макросов и скриптов на новые языки программирования',
				href: '/docs/Описание_продукта.pdf',
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
				href: '/docs/Анализ_предметной_области.pdf',
			},
			{
				title: 'Анализ проекта и риски',
				description: 'Анализ перспектив проекта и возможные риски',
				href: '/docs/Анализ_проекта_и_риски.pdf',
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
				href: '/docs/Описание_продукта.pdf',
			},
			{
				title: 'Демонстрация работы',
				description: 'Примеры взаимодействия с продуктом',
				href: '/docs/Демонстрация_работы.pdf',
			},
			{
				title: 'Модули продукта',
				description: 'Функциональное описание работы переводчика',
				href: '/docs/Модули_продукта.pdf',
			},
		],
	},
];

function DocumentIcon() {
	return (
		<svg className="docs-card-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.29289 1.29289C9.48043 1.10536 9.73478 1 10 1H18C19.6569 1 21 2.34315 21 4V20C21 21.6569 19.6569 23 18 23H6C4.34315 23 3 21.6569 3 20V8C3 7.73478 3.10536 7.48043 3.29289 7.29289L9.29289 1.29289ZM18 3H11V8C11 8.55228 10.5523 9 10 9H5V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V4C19 3.44772 18.5523 3 18 3ZM6.41421 7H9V4.41421L6.41421 7ZM7 13C7 12.4477 7.44772 12 8 12H16C16.5523 12 17 12.4477 17 13C17 13.5523 16.5523 14 16 14H8C7.44772 14 7 13.5523 7 13ZM7 17C7 16.4477 7.44772 16 8 16H16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18H8C7.44772 18 7 17.5523 7 17Z"
			/>
		</svg>
	);
}

function SearchIcon() {
	return (
		<svg className="docs-search-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M17.0392 15.6244C18.2714 14.084 19.0082 12.1301 19.0082 10.0041C19.0082 5.03127 14.9769 1 10.0041 1C5.03127 1 1 5.03127 1 10.0041C1 14.9769 5.03127 19.0082 10.0041 19.0082C12.1301 19.0082 14.084 18.2714 15.6244 17.0392L21.2921 22.707C21.6828 23.0977 22.3163 23.0977 22.707 22.707C23.0977 22.3163 23.0977 21.6828 22.707 21.2921L17.0392 15.6244ZM10.0041 17.0173C6.1308 17.0173 2.99087 13.8774 2.99087 10.0041C2.99087 6.1308 6.1308 2.99087 10.0041 2.99087C13.8774 2.99087 17.0173 6.1308 17.0173 10.0041C17.0173 13.8774 13.8774 17.0173 10.0041 17.0173Z"
			/>
		</svg>
	);
}

export default function DocumentationPage() {
	const history = useHistory();
	const [activeSectionId, setActiveSectionId] = useState(sections[0].id);
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	const searchableItems = useMemo(
		() =>
			sections.flatMap((section) =>
				section.items.map((item) => ({
					...item,
					sectionId: section.id,
					sectionTitle: section.title,
					searchText:
						`${section.title} ${item.title} ${item.description}`.toLocaleLowerCase('ru-RU'),
				}))
			),
		[]
	);

	const trimmedSearchQuery = searchQuery.trim().toLocaleLowerCase('ru-RU');
	const searchResults = useMemo(() => {
		if (!trimmedSearchQuery) return [];
		return searchableItems
			.filter((item) => item.searchText.includes(trimmedSearchQuery))
			.slice(0, 8);
	}, [searchableItems, trimmedSearchQuery]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visibleEntries = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

				if (visibleEntries.length > 0) {
					setActiveSectionId(visibleEntries[0].target.id);
				}
			},
			{
				root: null,
				rootMargin: '-25% 0px -55% 0px',
				threshold: [0.15, 0.35, 0.6],
			}
		);

		sections.forEach((section) => {
			const sectionElement = document.getElementById(section.id);
			if (sectionElement) observer.observe(sectionElement);
		});

		return () => observer.disconnect();
	}, []);

	const scrollToSection = (sectionId) => {
		const sectionElement = document.getElementById(sectionId);
		if (!sectionElement) return;
		const sectionTop = sectionElement.getBoundingClientRect().top + window.pageYOffset;
		window.scrollTo({
			top: sectionTop - 110,
			behavior: 'smooth',
		});
	};

	const openSearchResult = (result) => {
		scrollToSection(result.sectionId);
		setSearchQuery(result.title);
		setIsSearchFocused(false);
		window.open(result.href, '_blank', 'noopener,noreferrer');
	};

	return (
		<div className="docs-page">
			<aside className="docs-side-menu">
				<div className="docs-side-sticky">
					<div className="docs-side-logo">
						<img src={recodeLogoColored} alt="reCode" />
						<span>/ Документация</span>
					</div>
					<ul className="docs-side-nav">
						{sections.map((section) => (
							<li key={section.id}>
								<button
									type="button"
									className={activeSectionId === section.id ? 'is-active' : ''}
									onClick={() => scrollToSection(section.id)}
								>
									{section.title}
								</button>
							</li>
						))}
					</ul>
				</div>
			</aside>

			<main className="docs-main">
				<div className="docs-search-bar">
					<div className="docs-mobile-logo">
						<img src={recodeLogoColored} alt="reCode" />
					</div>
					<div className="docs-search-placeholder">
						<SearchIcon />
						<input
							type="text"
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							onFocus={() => setIsSearchFocused(true)}
							onBlur={() => setTimeout(() => setIsSearchFocused(false), 120)}
							placeholder="Поиск по документации"
							aria-label="Поиск по документации"
						/>
						{trimmedSearchQuery && isSearchFocused && (
							<div className="docs-search-dropdown">
								{searchResults.length > 0 ? (
									searchResults.map((result) => (
										<button
											key={`${result.sectionId}-${result.title}-${result.href}`}
											type="button"
											className="docs-search-result"
											onMouseDown={(event) => {
												event.preventDefault();
												openSearchResult(result);
											}}
										>
											<span className="docs-search-result-title">{result.title}</span>
											<span className="docs-search-result-section">
												{result.sectionTitle}
											</span>
										</button>
									))
								) : (
									<div className="docs-search-empty">Ничего не найдено</div>
								)}
							</div>
						)}
					</div>
					<button
						type="button"
						className="docs-start-button"
						onClick={() => history.push('/main/macro-translator')}
					>
						Начать работу
					</button>
				</div>

				<div className="docs-content">
					{sections.map((section) => (
						<section id={section.id} key={section.id} className="docs-section">
							<h2>{section.title}</h2>
							<div className="docs-cards">
								{section.items.map((item) => (
									<a
										key={`${section.id}-${item.title}`}
										className="docs-card"
										href={item.href}
										target="_blank"
										rel="noreferrer"
									>
										<DocumentIcon />
										<span className="docs-card-title">{item.title}</span>
										<p>{item.description}</p>
										<span className="docs-card-arrow" />
									</a>
								))}
							</div>
						</section>
					))}
				</div>
			</main>
		</div>
	);
}
