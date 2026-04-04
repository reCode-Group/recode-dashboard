import {
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	Image,
	SimpleGrid,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import recodeLogoColored from 'assets/svg/recode-logo-colored.svg';
import { useEffect, useMemo, useState } from 'react';
import { FiChevronRight, FiFileText, FiSearch } from 'react-icons/fi';
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
	return <Icon as={FiFileText} boxSize={{ base: 8, md: 10 }} color="blue.500" />;
}

function SearchIcon() {
	return <Icon as={FiSearch} color="gray.500" boxSize={4} mr={2} />;
}

export default function DocumentationPage() {
	const history = useHistory();
	const [activeSectionId, setActiveSectionId] = useState(sections[0].id);
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const panelBg = useColorModeValue('gray.100', 'gray.700');
	const softBg = useColorModeValue('gray.100', 'gray.700');
	const textColor = useColorModeValue('gray.800', 'white');
	const mutedColor = useColorModeValue('gray.500', 'gray.300');
	const dividerColor = useColorModeValue('gray.100', 'whiteAlpha.200');
	const dropdownBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
	const searchBg = useColorModeValue('white', 'whiteAlpha.200');
	const mainBg = useColorModeValue('white', 'gray.800');
	const dropdownBg = useColorModeValue('white', 'gray.800');
	const searchResultHoverBg = useColorModeValue('gray.100', 'whiteAlpha.200');

	const searchableItems = useMemo(
		() =>
			sections.flatMap((section) =>
				section.items.map((item) => ({
					...item,
					sectionId: section.id,
					sectionTitle: section.title,
					searchText: `${section.title} ${item.title} ${item.description}`.toLocaleLowerCase(
						'ru-RU'
					),
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
			top: sectionTop - 90,
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
		<Flex w="100vw" ml="calc(50% - 50vw)" color={textColor}>
			<Box as="aside" display={{ base: 'none', md: 'block' }} w="30vw" minW="280px" bg={panelBg}>
				<Box position="sticky" top="0" p="2vw">
					<Flex align="center" mb="2vw" fontWeight="500" fontSize={{ md: 'md', xl: '2xl' }}>
						<Image src={recodeLogoColored} alt="reCode" w="8vw" minW="96px" mr="0.5rem" />
						<Text color={mutedColor}>/ Документация</Text>
					</Flex>
					<Box as="ul" listStyleType="none" m="0" p="0">
						{sections.map((section) => (
							<Box as="li" key={section.id}>
								<Button
									variant="unstyled"
									w="100%"
									textAlign="left"
									fontWeight="medium"
									p="1rem"
									mb="8px"
									h="auto"
									minH="unset"
									whiteSpace="normal"
									wordBreak="break-word"
									overflowWrap="anywhere"
									borderRadius="1rem"
									color={activeSectionId === section.id ? 'white' : mutedColor}
									bg={activeSectionId === section.id ? 'gray.400' : 'transparent'}
									transition="all 0.15s ease-in-out"
									_hover={{ bg: 'gray.300', color: 'gray.500' }}
									onClick={() => scrollToSection(section.id)}
								>
									{section.title}
								</Button>
							</Box>
						))}
					</Box>
				</Box>
			</Box>

			<Box as="main" flex="1" minW="0" h="180vh">
				<Flex
					position="sticky"
					top="0"
					zIndex="5"
					align="center"
					justify="space-between"
					px="4vw"
					py={{ base: '4.5vw', md: '0.8rem' }}
					bg={mainBg}
					borderBottom="1px solid"
					borderColor={dividerColor}
					boxShadow={{
						base: '0 0 8px rgba(45, 60, 100, 0.03), 0 4px 32px rgba(45, 60, 100, 0.05)',
						md: 'none',
					}}
				>
					<Flex display={{ base: 'flex', md: 'none' }} w="50vw">
						<Image src={recodeLogoColored} alt="reCode" w="8rem" />
					</Flex>
					<Box
						position="relative"
						w={{ base: '100%', md: '25vw' }}
						minW={{ base: '0', md: '220px' }}
					>
						<Flex
							align="center"
							bg={searchBg}
							borderRadius="2rem"
							border="2px solid"
							borderColor={dividerColor}
							px="0.6rem"
							py={{ base: '2vw', md: '0.4rem' }}
						>
							<SearchIcon />
							<input
								type="text"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								onFocus={() => setIsSearchFocused(true)}
								onBlur={() => setTimeout(() => setIsSearchFocused(false), 120)}
								placeholder="Поиск по документации"
								aria-label="Поиск по документации"
								style={{
									width: '100%',
									border: 'none',
									outline: 'none',
									background: 'transparent',
									color: 'inherit',
									fontSize: 'inherit',
								}}
							/>
						</Flex>
						{trimmedSearchQuery && isSearchFocused && (
							<Box
								position="absolute"
								top="calc(100% + 8px)"
								left="0"
								right="0"
								display="flex"
								flexDir="column"
								gap="2px"
								p="6px"
								border="1px solid"
								borderColor={dropdownBorder}
								borderRadius="14px"
								bg={dropdownBg}
								boxShadow="0 10px 30px rgba(26, 32, 44, 0.12)"
								zIndex="20"
							>
								{searchResults.length > 0 ? (
									searchResults.map((result) => (
										<Box
											as="button"
											key={`${result.sectionId}-${result.title}-${result.href}`}
											type="button"
											display="flex"
											flexDir="column"
											gap="2px"
											w="100%"
											px="10px"
											py="8px"
											borderRadius="10px"
											textAlign="left"
											transition="0.15s ease-in-out"
											_hover={{ bg: searchResultHoverBg }}
											onMouseDown={(event) => {
												event.preventDefault();
												openSearchResult(result);
											}}
										>
											<Text fontSize="0.92rem" fontWeight="600" color={textColor}>
												{result.title}
											</Text>
											<Text fontSize="0.78rem" color={mutedColor}>
												{result.sectionTitle}
											</Text>
										</Box>
									))
								) : (
									<Text px="10px" py="10px" color={mutedColor} fontSize="0.85rem">
										Ничего не найдено
									</Text>
								)}
							</Box>
						)}
					</Box>
					<Button
						display={{ base: 'none', md: 'inline-flex' }}
						bg="recode.500"
						color="white"
						borderRadius="999px"
						px="1.6rem"
						py="0.5rem"
						fontSize="sm"
						fontWeight="medium"
						_hover={{ bg: 'recode.400' }}
						onClick={() => history.push('/main/macro-translator')}
					>
						НАЧАТЬ РАБОТУ
					</Button>
				</Flex>

				<Box mx="4vw">
					{sections.map((section) => (
						<Box as="section" id={section.id} key={section.id} my={{ base: '10vw', md: '4vw' }}>
							<Heading
								fontWeight="semibold"
								fontSize={{ base: '2xl', md: '2rem' }}
								mb={{ base: '4vw', md: '2vw' }}
							>
								{section.title}
							</Heading>
							<SimpleGrid
								columns={{ base: 1, xl: 2 }}
								spacing={{ base: '4vw', md: '2vw' }}
								w={{ base: '100%', md: '80%' }}
							>
								{section.items.map((item) => (
									<Box
										as="a"
										key={`${section.id}-${item.title}`}
										href={item.href}
										target="_blank"
										rel="noreferrer"
										role="group"
										position="relative"
										display="flex"
										flexWrap="wrap"
										alignItems="center"
										gap={{ base: '2vw', md: '1vw' }}
										p={{ base: '4vw', md: '1.5vw' }}
										borderRadius="1rem"
										bg={softBg}
										textDecoration="none"
										transition="all 0.2s ease-in-out"
										_hover={{ transform: 'translateY(-3px)' }}
									>
										<DocumentIcon />
										<Text
											display="inline-block"
											fontSize={{ base: '1.2rem', md: '1.4rem' }}
											fontWeight="500"
										>
											{item.title}
										</Text>
										<Text m="0" color={mutedColor}>
											{item.description}
										</Text>
										<Icon
											as={FiChevronRight}
											position="absolute"
											right={{ base: '4vw', md: '1vw' }}
											bottom={{ base: '4vw', md: '1vw' }}
											color="blue.500"
											boxSize={5}
											opacity="0"
											transform="translateX(-4px)"
											transition="all 0.2s ease-in-out"
											_groupHover={{ opacity: 1, transform: 'translateX(0)' }}
										/>
									</Box>
								))}
							</SimpleGrid>
						</Box>
					))}
				</Box>
			</Box>
		</Flex>
	);
}
