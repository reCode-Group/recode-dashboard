import { useState } from 'react';
import { FiArrowRight, FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import { NavLink, useHistory } from 'react-router-dom';

import businessSiteCard from 'assets/img/landing/business-site-card.png';
import bottomFondLogo from 'assets/img/landing/exact/bottom-fond.png';
import bottomFondLogo2 from 'assets/img/landing/exact/bottom-fond2.png';
import featureJs from 'assets/img/landing/exact/feature-js.png';
import featureMainBg from 'assets/img/landing/exact/feature-main-bg.png';
import featurePuzzle from 'assets/img/landing/exact/feature-puzzle.png';
import heroMyOffice from 'assets/img/landing/exact/hero-myoffice.png';
import heroOffice2010 from 'assets/img/landing/exact/hero-office2010.png';
import heroOffice2016 from 'assets/img/landing/exact/hero-office2016.png';
import heroR7 from 'assets/img/landing/exact/hero-r7.png';
import heroYandex from 'assets/img/landing/exact/hero-yandex.png';
import supportBanner from 'assets/img/support-banner.png';
import videoPreview from 'assets/img/landing/exact/video.png';
import forBusinessIcon from 'assets/svg/for-business.svg';
import forItIcon from 'assets/svg/for-it.svg';
import habrLogo from 'assets/svg/habr-logo.svg';
import maxLogo from 'assets/svg/max-logo.svg';
import footerLogo from 'assets/svg/recode-logo-white-text.svg';
import vkLogo from 'assets/svg/vk-logo.svg';

const faqRows = [
	{
		id: 'faq-1',
		question: 'Сколько времени занимает перевод макроса?',
		answer:
			'Типовой макрос обычно обрабатывается за 1-3 минуты. Для крупных файлов время может увеличиваться до 10 минут.',
	},
	{
		id: 'faq-2',
		question: 'Какие офисные пакеты поддерживаются?',
		answer:
			'Поддерживаются Р7-Офис, МойОфис, Яндекс Документы, а также сценарии миграции из Microsoft Office.',
	},
	{
		id: 'faq-3',
		question: 'Нужны ли навыки программирования для работы?',
		answer:
			'Для базовых сценариев нет. Интерфейс рассчитан на специалистов без глубокого опыта разработки.',
	},
	{
		id: 'faq-4',
		question: 'Можно ли протестировать сервис до оплаты?',
		answer:
			'Да, доступен тестовый сценарий с ограничением по токенам, чтобы оценить качество перевода на реальном примере.',
	},
	{
		id: 'faq-5',
		question: 'Что делать, если перевод получился некорректным?',
		answer:
			'Обратитесь в техподдержку через чат. Команда поможет разобрать кейс и предложит варианты улучшения результата.',
	},
];

const priceCards = [
	{
		title: 'Базовый',
		price: '20 000',
		postfix: '₽ / мес.',
		items: ['20 000 токенов', 'Базовая поддержка', 'Базовый'],
	},
	{
		title: 'Экспертный',
		price: '50 000',
		postfix: '₽ / мес.',
		items: ['50 000 токенов', 'Базовая поддержка', 'Базовый', 'Базовый'],
		highlight: true,
	},
	{
		title: 'Для компаний',
		price: 'Индивидуально',
		postfix: '',
		items: ['600 000 токенов', 'Базовая поддержка', 'Расширенная поддержка'],
	},
];

export default function LandingPage() {
	const [openFaqId, setOpenFaqId] = useState(faqRows[0].id);
	const history = useHistory();

	const toggleFaq = (id) => {
		setOpenFaqId((current) => (current === id ? null : id));
	};

	const handleStartWorkClick = () => {
		history.push('/main/macro-translator');
	};

	const handleFeaturesClick = () => {
		const featuresSection = document.getElementById('features');
		if (featuresSection) {
			featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	return (
		<div className="relative overflow-x-hidden bg-white">
			{/* Hero background image disabled temporarily */}

			<section id="about" className="mx-auto w-[calc(100%-24px)] max-w-[990.717px] pt-[150px]">
				<div className="mx-auto flex h-7 w-[288px] items-center justify-center rounded-[100px] border border-[#005de0] bg-[rgba(0,93,224,0.11)] text-[14px] text-[#005de0]">
					Подходит для P7-Офис и МойОфис
				</div>
				<h1 className="mx-auto mt-8 max-w-[778px] text-center text-[46px] font-bold leading-none text-[#2d3748] md:text-[60px]">
					Автоматический перевод <span className="text-[#005de0]">в один клик</span>
				</h1>
				<p className="mx-auto mt-9 max-w-[990px] text-center text-[14px] leading-[1.5] text-[#718096]">
					Сохраняйте ценные инструменты автоматизации при переходе на российские офисные пакеты.
					<br />
					Рекод - это онлайн-сервис для автоматизированного перевода макросов под российские офисные
					пакеты.
					<br />
					Всё работает в облаке - ничего не нужно устанавливать.
				</p>
				<div className="mt-10 flex flex-wrap items-center justify-center gap-[15px]">
					<button
						type="button"
						onClick={handleStartWorkClick}
						className="appearance-none flex h-[59.66px] w-[245px] items-center justify-center gap-1 rounded-[12px] text-[14px] font-bold uppercase text-white transition-colors hover:bg-[#0051c2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005de0] focus-visible:ring-offset-2"
						style={{ backgroundColor: '#005de0' }}
					>
						Начать работу <FiArrowRight />
					</button>
					<button
						type="button"
						onClick={handleFeaturesClick}
						className="appearance-none flex h-[59.66px] w-[245px] items-center justify-center rounded-[12px] border border-[#005de0] bg-white text-[14px] font-bold uppercase text-[#005de0] transition-colors hover:bg-[#ebf3ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005de0] focus-visible:ring-offset-2"
					>
						Смотреть возможности
					</button>
				</div>

				<div className="mt-[112px]">
					<h2 className="text-center text-[32px] font-bold text-[#2d3748]">Поддерживается</h2>
					<div className="mt-[45px] grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-[45px]">
						{[
							{ title: 'МойОфис', image: heroMyOffice },
							{ title: 'Яндекс Документы', image: heroYandex },
							{ title: 'Р7-Офис', image: heroR7 },
							{ title: 'Microsoft Office 2016+', image: heroOffice2016 },
							{ title: 'Microsoft Office 2010', image: heroOffice2010 },
						].map((item) => (
							<div key={item.title} className="group text-center">
								<div className="mx-auto flex size-[120px] items-center justify-center rounded-[24px] border-2 border-[#e2e8f0] bg-white transition-transform duration-300 group-hover:scale-105">
									<img
										src={item.image}
										alt={item.title}
										className="max-h-[75px] w-auto object-contain"
									/>
								</div>
								<p className="mt-[15px] text-[16px] leading-[1.2] text-[#2d3748]">{item.title}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto w-[calc(100%-24px)] max-w-[990.717px] pt-[194px]">
				<h2 className="text-center text-[38px] font-bold leading-[1.3] text-[#2d3748] md:text-[45px]">
					За 90 секунд покажем как все работает
				</h2>
				<p className="mt-[12px] text-center text-[14px] text-[#718096] md:text-[18px]">
					На примере реального VBA-макроса из 200 строк — получаем готовый макрос для «Р7-Офис»
				</p>
				<div className="relative mt-[54px] overflow-hidden rounded-[32px]">
					<img src={videoPreview} alt="Видео-превью" className="h-auto w-full object-cover" />
					<div className="absolute inset-0 bg-[rgba(0,0,0,0.55)]" />
				</div>
			</section>

			<section id="features" className="mx-auto w-[calc(100%-24px)] max-w-[990.717px] pt-[175px]">
				<h2 className="text-center text-[38px] font-bold leading-[1.3] text-[#2d3748] md:text-[45px]">
					Возможности платформа Рекод
				</h2>
				<p className="mt-[12px] text-center text-[14px] text-[#718096] md:text-[18px]">
					Технические и функциональные преимущества, доступные уже сейчас
				</p>
				<div className="mt-[42px] grid gap-[30px] md:grid-cols-[480px_480px]">
					<div className="relative h-[480px] overflow-hidden rounded-[24px]">
						<img src={featureMainBg} alt="" className="absolute inset-0 size-full object-cover" />
						<div className="absolute left-8 top-8 text-[24px] font-semibold text-white">
							Единая платформа для макросов
						</div>
						<p className="absolute left-8 top-[95px] max-w-[339px] text-[16px] text-[#cbd5e0]">
							Всё необходимое для работы с макросами: переводчик, конструктор и редактор кода — в
							одном месте
						</p>
					</div>
					<div className="grid gap-[30px]">
						<div className="relative h-[225px] rounded-[24px] bg-[#f8f9fa] p-8">
							<h3 className="text-[24px] font-semibold text-[#151928]">Без знаний кода</h3>
							<p className="mt-8 max-w-[264px] text-[16px] text-[#718096]">
								Создавайте и редактируйте макросы через удобный интерфейс без глубоких знаний
								программирования
							</p>
							<img
								src={featurePuzzle}
								alt=""
								className="absolute bottom-4 right-4 h-[124px] w-[124px]"
							/>
						</div>
						<div className="relative h-[225px] rounded-[24px] bg-[#f8f9fa] p-8">
							<h3 className="max-w-[416px] text-[24px] font-semibold leading-[1.3] text-[#151928]">
								Поддержка VBA, JavaScript и Lua макросов
							</h3>
							<p className="mt-5 max-w-[236px] text-[16px] text-[#718096]">
								Настраивайте целевой язык перед обработкой и получайте нужный формат кода
							</p>
							<img
								src={featureJs}
								alt=""
								className="absolute bottom-4 right-4 h-[124px] w-[184px]"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto w-[calc(100%-24px)] max-w-[990.717px] pt-[161px]">
				<h2 className="text-center text-[38px] font-bold leading-[1.3] text-[#2d3748] md:text-[45px]">
					Для кого этот сервис?
				</h2>
				<p className="mt-[12px] text-center text-[14px] text-[#718096] md:text-[18px]">
					Те, кто сталкнуся с миграцией на отечественные офисные пакеты
				</p>
				<div className="mt-[35px] grid gap-[26px] md:grid-cols-2">
					<div className="h-[280px] rounded-[24px] bg-[#f8f9fa] p-8">
						<div className="flex size-[54.778px] items-center justify-center rounded-[16px] border border-[#e2e8f0] bg-white">
							<img src={forBusinessIcon} alt="Для бизнеса" className="size-7" />
						</div>
						<h3 className="mt-4 text-[24px] font-semibold text-[#151928]">
							Для бизнеса и специалистов
						</h3>
						<p className="mt-5 max-w-[378px] text-[16px] text-[#718096]">
							Подходит для сотрудников, которым нужно автоматизировать работу с документами и
							макросами без глубоких технических знаний
						</p>
					</div>
					<div className="h-[280px] rounded-[24px] bg-[#f8f9fa] p-8">
						<div className="flex size-[54.778px] items-center justify-center rounded-[16px] border border-[#e2e8f0] bg-white">
							<img src={forItIcon} alt="Р”Р»СЏ IT" className="size-7" />
						</div>
						<h3 className="mt-4 text-[24px] font-semibold text-[#151928]">
							Для разработчиков и IT-команд
						</h3>
						<p className="mt-5 max-w-[426px] text-[16px] text-[#718096]">
							Используйте редактор кода и инструменты перевода для интеграции, доработки и миграции
							макросов между системами
						</p>
					</div>
				</div>
			</section>

			<section className="mx-auto w-[calc(100%-24px)] max-w-[991px] pt-[184px]">
				<h2 className="text-center text-[38px] font-bold leading-[1.3] text-[#2d3748] md:text-[45px]">
					Как это работает?
				</h2>
				<p className="mt-[12px] text-center text-[14px] text-[#718096] md:text-[18px]">
					Логика процесса от загрузки исходного макроса до получения результата
				</p>
				<div className="mt-[64px] space-y-[100px]">
					{[1, 2, 3, 4].map((step) => (
						<div key={step} className="flex items-center justify-between px-[20px] md:px-[120px]">
							<div className="text-[90px] font-bold leading-[1.4] text-[#e2e8f0] md:text-[140px]">{`0${step}`}</div>
							<div className="relative h-[140px] w-[350px] rounded-[24px] border-[3px] border-[#e2e8f0] p-6">
								<div className="text-[24px] font-bold text-[#2d3748]">Заголовок</div>
								<p className="mt-2 text-[16px] leading-[1.3] text-[#2d3748]">
									Те, кто столкнулся с миграцией на отечественные офисные пакеты
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="mx-auto w-[calc(100%-24px)] max-w-[990.717px] pt-[188px]" id="pricing">
				<h2 className="text-center text-[38px] font-bold leading-[1.3] text-[#2d3748] md:text-[45px]">
					Тарифы
				</h2>
				<p className="mt-[12px] text-center text-[14px] text-[#718096] md:text-[18px]">
					Оптимальный выбор под ваш бюджет
				</p>
				<div className="mt-[58px] grid gap-[20px] md:grid-cols-[302.2px_317.48px_302.2px]">
					{priceCards.map((card) => (
						<div
							key={card.title}
							className={`rounded-[24px] p-5 ${
								card.highlight
									? 'h-[392.826px] border border-[#a0aec0] bg-[linear-gradient(83deg,#313860_2.25%,#151928_79.87%)]'
									: 'h-[357.015px] bg-[#edf2f7]'
							}`}
						>
							<div
								className={`rounded-[24px] p-5 ${
									card.highlight ? 'bg-[rgba(255,255,255,0.05)]' : 'bg-white'
								}`}
							>
								<div className={`text-[18px] ${card.highlight ? 'text-white' : 'text-[#151928]'}`}>
									{card.title}
								</div>
								<div className="mt-3">
									{card.postfix ? (
										<p className="text-[24px] font-bold">
											<span className={card.highlight ? 'text-white' : 'text-[#151928]'}>
												{card.price}
											</span>{' '}
											<span className="text-[18px] text-[#a0aec0]">{card.postfix}</span>
										</p>
									) : (
										<p
											className={
												card.highlight
													? 'text-[24px] font-bold text-white'
													: 'text-[24px] font-bold text-[#151928]'
											}
										>
											{card.price}
										</p>
									)}
								</div>
								<button
									type="button"
									className={`mt-4 h-[35px] w-[122px] rounded-[8px] text-[10px] font-bold ${
										card.highlight
											? 'bg-white text-[#151928]'
											: 'bg-[linear-gradient(62deg,#313860_2.25%,#151928_79.87%)] text-white'
									}`}
								>
									ВЫБРАТЬ
								</button>
							</div>
							<ul
								className={`mt-7 space-y-3 text-[12px] ${
									card.highlight ? 'text-white' : 'text-[#151928]'
								}`}
							>
								{card.items.map((item) => (
									<li key={item} className="flex items-center gap-2">
										<span className="inline-flex size-4 items-center justify-center rounded-[5px] bg-[#cbd5e0] text-[10px] text-[#151928]">
											✓
										</span>
										{item}
									</li>
								))}
							</ul>
							<p className="mt-6 text-[10px] leading-[1.3] text-[#718096]">
								* Пояснения о тарифе в две строки небольшие, чтобы внести ясность
							</p>
						</div>
					))}
				</div>
			</section>

			<section className="mx-auto w-[calc(100%-24px)] max-w-[991.21px] pt-[159px]" id="faq">
				<h2 className="text-center text-[38px] font-bold leading-[1.3] text-[#2d3748] md:text-[45px]">
					Частые вопросы
				</h2>
				<p className="mt-[12px] text-center text-[14px] text-[#718096] md:text-[18px]">
					Собрали самое важное, остальное — можно спросить в{' '}
					<span className="underline">техподдержке</span>
				</p>
				<div className="mt-[72px] space-y-[24px]">
					{faqRows.map((row) => {
						const isOpen = openFaqId === row.id;

						return (
							<div key={row.id} className="rounded-[24px] bg-[#e2e8f0] px-9 py-6">
								<button
									type="button"
									onClick={() => toggleFaq(row.id)}
									className="flex w-full items-center justify-between text-left"
								>
									<p className="pr-6 text-[18px] font-medium text-[rgba(21,25,40,0.88)] md:text-[24px]">
										{row.question}
									</p>
									<span className="inline-flex size-[42.052px] shrink-0 items-center justify-center rounded-full bg-[#005de0] text-white">
										<FiChevronDown
											className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
											size={18}
										/>
									</span>
								</button>
								{isOpen && (
									<p className="mt-4 max-w-[820px] text-[16px] leading-[1.45] text-[#4a5568]">
										{row.answer}
									</p>
								)}
							</div>
						);
					})}
				</div>
			</section>

			<section id="support" className="mx-auto w-[calc(100%-24px)] max-w-[990.717px] pt-[134px]">
				<div
					className="relative h-[320px] overflow-hidden rounded-[15px] bg-[#005de0] bg-cover bg-center p-[32px_50px]"
					style={{ backgroundImage: `url(${supportBanner})` }}
				>
					<div className="relative z-10">
						<div className="flex size-[54px] items-center justify-center rounded-[15px] bg-white text-[#005de0]">
							<FiHelpCircle size={28} />
						</div>
						<h3 className="mt-5 text-[34px] font-medium text-white md:text-[45px]">
							Онлайн чат с поддержкой
						</h3>
						<p className="mt-3 text-[14px] leading-[1.5] text-white">
							Ответим на Ваши вопросы о работе сервисов, напишем пошаговые
							<br />
							инструкции по их настройке и оплате тарифов
						</p>
						<NavLink
							to="/main/contacts#support"
							className="mt-8 flex h-[35px] w-[150px] items-center justify-center rounded-[12px] bg-white text-[10px] font-bold text-[#2d3748]"
						>
							НАПИСАТЬ
						</NavLink>
					</div>
				</div>
			</section>

			<section className="mx-auto w-[calc(100%-24px)] max-w-[990.507px] pt-[65px]">
				<img
					src={businessSiteCard}
					alt="Баннер для бизнеса"
					className="h-auto w-full rounded-[24px] object-contain"
				/>
			</section>

			<div className="mt-[69px] bg-[#f8f9fa]">
				<div className="mx-auto flex h-[100px] w-full max-w-[1224px] items-center gap-4 px-4 md:px-0">
					<img src={bottomFondLogo} alt="Фонд" className="h-[47px] w-auto" />
					<img src={bottomFondLogo2} alt="Студенческий стартап" className="h-[58px] w-auto" />
					<p className="text-[10px] leading-[1.2] text-[#718096] md:text-[18px]">
						Проект реализован при поддержке Фонда содействия инновациям в рамках программы
						«Студенческий стартап» мероприятия «Платформа университетского технологического
						предпринимательства» федерального проекта «Технологии».
					</p>
				</div>
			</div>

			<footer className="bg-[#171923] py-[38px]">
				<div className="mx-auto grid w-[calc(100%-24px)] max-w-[990px] gap-8 md:grid-cols-[1.1fr_0.7fr_1fr]">
					<div>
						<img src={footerLogo} alt="reCode" className="h-[29px] w-auto" />
						<p className="mt-4 max-w-[350px] text-[12px] leading-[1.5] text-[#718096]">
							Платформа автоматизированного перевода VBA макросов на различные языки
							программирования, для бесшовной интеграции с отечественными офисными пакетами.
						</p>
						<p className="mt-6 text-[11px] text-[#718096]">
							ПОЧТА: <span className="text-[12px] text-white underline">info@recode-group.ru</span>
						</p>
						<p className="mt-1 text-[11px] text-[#718096]">
							ТЕЛЕФОН: <span className="text-[12px] text-white">+7 (903) 356-92-98</span>
						</p>
						<p className="mt-[52px] text-[12px] text-[#718096]">© ООО «Рекод Решения», 2026</p>
					</div>
					<div className="text-[11px] text-white">
						<div className="space-y-2">
							<a href="#pricing" className="block">
								Тарифы
							</a>
							<a href="#features" className="block">
								Сервисы
							</a>
							<a href="#faq" className="block">
								FAQ
							</a>
							<NavLink to="/main/contacts" className="block">
								Контакты
							</NavLink>
							<NavLink to="/main/blog" className="block">
								Блог
							</NavLink>
							<a href="#about" className="block">
								Регистрация
							</a>
						</div>
					</div>
					<div>
						<div className="space-y-2 text-[11px] text-white">
							<NavLink to="/main/privacy-policy" className="block">
								Политика конфиденциальности
							</NavLink>
							<NavLink to="/main/public-offer" className="block">
								Публичная оферта
							</NavLink>
							<p>Рекомендательные технологии</p>
						</div>
						<div className="mt-8 flex items-center gap-3">
							<a href="https://vk.com" target="_blank" rel="noreferrer" aria-label="VK">
								<img src={vkLogo} alt="VK" className="h-[14px] w-auto" />
							</a>
							<a href="https://max.ru" target="_blank" rel="noreferrer" aria-label="MAX">
								<img src={maxLogo} alt="MAX" className="h-[14px] w-auto" />
							</a>
							<a href="https://habr.com" target="_blank" rel="noreferrer" aria-label="Habr">
								<img src={habrLogo} alt="Habr" className="h-[14px] w-auto" />
							</a>
						</div>
						<p className="mt-20 text-[12px] text-[#718096]">
							Задизайнено и разработано в{' '}
							<span className="text-white underline">Студии Рекод IT</span>
						</p>
						<p className="text-[12px] text-[#718096]">
							с использованием <span className="text-white underline">React</span>,{' '}
							<span className="text-white underline">Chakra UI</span>, и{' '}
							<span className="text-white underline">Golang Fiber</span>
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
