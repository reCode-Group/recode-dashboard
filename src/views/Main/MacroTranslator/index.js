import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	Grid,
	HStack,
	Icon,
	Image,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Spinner,
	Switch,
	Text,
	Textarea,
	useColorModeValue,
} from '@chakra-ui/react';
import BannerConstructor from 'assets/img/banner_constructor.png';
import ConversionHistory from 'components/Tables/ConversionHistory';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiAlertCircle, FiCheck, FiCopy } from 'react-icons/fi';
import { IoArrowForwardSharp } from 'react-icons/io5';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'services/auth';
import { getUserConversions } from 'services/conversions';
import { convertFreeMacro, convertPaidMacro } from 'services/macroTranslator';
import { getUserSubscription } from 'services/subscription';
import { mapConversion } from 'utils/conversions';
import IncorrectMacroModal from './components/IncorrectMacroModal';

const NO_SUBSCRIPTION_MESSAGES = [
	'subscription not found',
	'subscription is not active',
	'ErrNoSubscription',
	'ErrSubscriptionNotActive',
];

const LANGUAGE_OPTIONS = [
	{ value: 'JS', label: 'JavaScript (JS)' },
	{ value: 'LUA', label: 'Lua (LUA)' },
];

const TOKEN_SOURCE = {
	PERSONAL: 'personal',
	EMPLOYEE: 'employee',
};

const TRANSLATION_MODE = {
	FREE: 'free',
	PAID: 'paid',
};

const FREE_TRANSLATIONS_PER_DAY = 4;
const FREE_TRANSLATION_CHAR_LIMIT = 600;
const FREE_TRANSLATION_LIMIT_MESSAGE = `В бесплатном переводе можно ввести не более ${FREE_TRANSLATION_CHAR_LIMIT} символов`;

const conversionDateFormat = {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
};

function formatTokenValue(value) {
	return new Intl.NumberFormat('ru-RU').format(Number(value) || 0).replace(/,/g, ' ');
}

function isUnauthorizedError(error) {
	const message = String(error?.message || '').toLowerCase();
	return message.includes('unauthorized');
}

function isNoSubscriptionError(error) {
	const message = error?.message || '';
	return NO_SUBSCRIPTION_MESSAGES.some((knownMessage) => message.includes(knownMessage));
}

function getTokenPanelLabel(tokenSource) {
	return tokenSource === TOKEN_SOURCE.EMPLOYEE ? 'СЧЕТ СОТРУДНИКА' : 'ЛИЧНЫЙ СЧЕТ';
}

function getTariffLabel(subscriptionName) {
	return subscriptionName || 'Нет тарифа';
}

export default function MacroTranslatorPage() {
	const navigate = useNavigate();
	const [source, setSource] = useState('');
	const [translated, setTranslated] = useState('');
	const [targetLanguage, setTargetLanguage] = useState('JS');
	const [copied, setCopied] = useState(false);
	const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
	const [isIncorrectMacroModalOpen, setIsIncorrectMacroModalOpen] = useState(false);
	const [incorrectMacroSnapshot, setIncorrectMacroSnapshot] = useState({
		conversionId: '',
		source: '',
		translated: '',
		targetLanguage: 'JS',
	});
	const [lastConversion, setLastConversion] = useState(null);
	const [isPageLoading, setIsPageLoading] = useState(true);
	const [isConverting, setIsConverting] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [subscriptionName, setSubscriptionName] = useState('Нет тарифа');
	const [translationMode, setTranslationMode] = useState(TRANSLATION_MODE.FREE);
	const [selectedTokenSource, setSelectedTokenSource] = useState(TOKEN_SOURCE.PERSONAL);
	const [historyItems, setHistoryItems] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');
	const copyResetTimeoutRef = useRef(null);

	const textColor = useColorModeValue('gray.700', 'white');
	const mutedColor = useColorModeValue('gray.400', 'gray.300');
	const tableBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
	const inputBg = useColorModeValue('white', 'gray.700');
	const modalTitleColor = useColorModeValue('gray.800', 'white');
	const modalTextColor = useColorModeValue('gray.600', 'gray.200');
	const modalGlassBg = useColorModeValue('rgba(255, 255, 255, 0.92)', 'rgba(26, 32, 44, 0.92)');
	const modalSectionBg = useColorModeValue('rgba(255, 255, 255, 0.72)', 'rgba(26, 32, 44, 0.72)');
	const selectPlaceholderColor = useColorModeValue('gray.600', 'gray.200');
	const toggleBg = useColorModeValue('gray.50', 'whiteAlpha.100');

	const canUseEmployeeAccount =
		user?.has_organization === true && user?.organization_status === 'active';
	const personalTokens = Number(user?.personal_tokens_remain) || 0;
	const employeeTokens = Number(user?.organization_tokens_remain) || 0;
	const activeTokenBalance =
		selectedTokenSource === TOKEN_SOURCE.EMPLOYEE ? employeeTokens : personalTokens;
	const isFreeTranslation = translationMode === TRANSLATION_MODE.FREE;

	const loadData = useCallback(async ({ showLoader = true } = {}) => {
		if (showLoader) {
			setIsPageLoading(true);
		}
		setErrorMessage('');

		try {
			const currentUser = await getCurrentUser();
			setIsAuthenticated(true);
			setUser(currentUser);

			const [subscriptionResult, conversionsResult] = await Promise.all([
				getUserSubscription().catch((error) => {
					if (isNoSubscriptionError(error)) {
						return null;
					}
					throw error;
				}),
				getUserConversions(9).catch(() => ({ items: [] })),
			]);

			setSubscriptionName(getTariffLabel(subscriptionResult?.package_name));
			const mappedConversions = (conversionsResult?.items || []).map((conversion) =>
				mapConversion(conversion, { dateFormat: conversionDateFormat })
			);
			setHistoryItems(mappedConversions);
			return mappedConversions;
		} catch (error) {
			if (isUnauthorizedError(error)) {
				setIsAuthenticated(false);
				setUser(null);
				setSubscriptionName('Нет тарифа');
				setHistoryItems([]);
				setSelectedTokenSource(TOKEN_SOURCE.PERSONAL);
			} else {
				setErrorMessage(error.message || 'Не удалось загрузить данные переводчика');
			}
			return [];
		} finally {
			if (showLoader) {
				setIsPageLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	useEffect(() => {
		if (errorMessage) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}, [errorMessage]);

	useEffect(() => {
		if (!canUseEmployeeAccount && selectedTokenSource === TOKEN_SOURCE.EMPLOYEE) {
			setSelectedTokenSource(TOKEN_SOURCE.PERSONAL);
		}
	}, [canUseEmployeeAccount, selectedTokenSource]);

	useEffect(() => {
		return () => {
			if (copyResetTimeoutRef.current) {
				clearTimeout(copyResetTimeoutRef.current);
			}
		};
	}, []);

	const handleCopyResult = async () => {
		if (!translated) return;
		try {
			await navigator.clipboard.writeText(translated);
			setCopied(true);
			if (copyResetTimeoutRef.current) {
				clearTimeout(copyResetTimeoutRef.current);
			}
			copyResetTimeoutRef.current = setTimeout(() => {
				setCopied(false);
			}, 3000);
		} catch (error) {
			// Clipboard API may be unavailable in restricted browser contexts.
		}
	};

	const handleOpenIncorrectMacroModal = () => {
		if (!translated.trim()) return;
		setIncorrectMacroSnapshot(
			lastConversion || { conversionId: '', source, translated, targetLanguage }
		);
		setIsIncorrectMacroModalOpen(true);
	};

	const handleTranslationModeChange = (event) => {
		const nextMode = event.target.checked ? TRANSLATION_MODE.PAID : TRANSLATION_MODE.FREE;
		setTranslationMode(nextMode);

		if (nextMode === TRANSLATION_MODE.FREE && source.length > FREE_TRANSLATION_CHAR_LIMIT) {
			setSource(source.slice(0, FREE_TRANSLATION_CHAR_LIMIT));
			setErrorMessage(FREE_TRANSLATION_LIMIT_MESSAGE);
		} else if (errorMessage === FREE_TRANSLATION_LIMIT_MESSAGE) {
			setErrorMessage('');
		}
	};

	const handleSourceChange = (event) => {
		const nextSource = event.target.value;

		if (isFreeTranslation && nextSource.length > FREE_TRANSLATION_CHAR_LIMIT) {
			setSource(nextSource.slice(0, FREE_TRANSLATION_CHAR_LIMIT));
			setErrorMessage(FREE_TRANSLATION_LIMIT_MESSAGE);
			return;
		}

		setSource(nextSource);
		if (errorMessage === FREE_TRANSLATION_LIMIT_MESSAGE) {
			setErrorMessage('');
		}
	};

	const handleTranslate = async () => {
		if (!source.trim()) {
			setErrorMessage('Введите исходный макрос для перевода');
			return;
		}

		if (!isAuthenticated) {
			navigate('/auth/login-page');
			return;
		}

		setIsConverting(true);
		setErrorMessage('');
		setCopied(false);

		try {
			const requestPayload = {
				origin_code: source.trim(),
				origin_language: 'VBA',
				target_language: targetLanguage,
			};
			const result = isFreeTranslation
				? await convertFreeMacro(requestPayload)
				: await convertPaidMacro({
						...requestPayload,
						as_employee: selectedTokenSource === TOKEN_SOURCE.EMPLOYEE,
				  });

			const translatedCode = result?.target_code || '';
			setTranslated(translatedCode);
			const refreshedHistory = await loadData({ showLoader: false });
			const matchingConversion = refreshedHistory.find(
				(item) =>
					item.sourceCode === requestPayload.origin_code && item.translatedCode === translatedCode
			);
			setLastConversion({
				conversionId: matchingConversion?.id || '',
				source: requestPayload.origin_code,
				translated: translatedCode,
				targetLanguage: result?.target_language || targetLanguage,
			});
		} catch (error) {
			if (isUnauthorizedError(error)) {
				navigate('/auth/login-page');
				return;
			}

			if (isNoSubscriptionError(error)) {
				setErrorMessage('Для списания с личного счета нужна активная подписка');
				return;
			}

			if (String(error?.message || '').includes('not enough tokens')) {
				setErrorMessage('Недостаточно токенов на выбранном счете');
				return;
			}

			if (String(error?.message || '').includes('unsupported language')) {
				setErrorMessage('Выбранный язык перевода пока не поддерживается');
				return;
			}

			setErrorMessage(error.message || 'Не удалось выполнить перевод');
		} finally {
			setIsConverting(false);
		}
	};

	return (
		<>
			<Flex direction="column" py={{ base: '120px', md: '150px' }} gap="48px">
				<Box>
					<Text
						fontSize={{ base: '28px', md: '32px' }}
						lineHeight="1.3"
						fontWeight="700"
						color={textColor}
					>
						Переводчик макросов
					</Text>
					<Text mt="6px" fontSize="sm" fontWeight="medium" color={mutedColor}>
						Перевод VBA макросов в JavaScript и Lua в один клик
					</Text>
				</Box>

				{errorMessage ? (
					<Alert status="error" borderRadius="15px" color={textColor}>
						<AlertIcon />
						<Text fontSize="sm">{errorMessage}</Text>
					</Alert>
				) : null}

				{isPageLoading ? (
					<Flex align="center" justify="center" minH="220px">
						<Spinner color="recode.300" size="xl" />
					</Flex>
				) : (
					<>
						<Box
							borderWidth="1px"
							borderColor={tableBorder}
							borderRadius="15px"
							bg={toggleBg}
							px="16px"
							py="12px"
							mb="20px"
						>
							<Grid
								templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
								gap="20px"
								alignItems="stretch"
							>
								<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="12px">
									<Box>
										<Text fontSize="xs" fontWeight="600" color={mutedColor} mb="6px">
											ИСХОДНЫЙ ЯЗЫК
										</Text>
										<Select
											value="VBA"
											isDisabled
											bg={inputBg}
											borderColor={tableBorder}
											borderRadius="15px"
										>
											<option value="VBA">VBA</option>
										</Select>
									</Box>
									<Box>
										<Text fontSize="xs" fontWeight="600" color={mutedColor} mb="6px">
											ЯЗЫК ПЕРЕВОДА
										</Text>
										<Select
											value={targetLanguage}
											onChange={(event) => setTargetLanguage(event.target.value)}
											bg={inputBg}
											borderColor={tableBorder}
											borderRadius="15px"
											color={selectPlaceholderColor}
										>
											{LANGUAGE_OPTIONS.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</Select>
									</Box>
								</Grid>

								<Box
									borderLeftWidth={{ base: '0', lg: '1px' }}
									borderTopWidth={{ base: '1px', lg: '0' }}
									borderColor={tableBorder}
									pl={{ base: '0', lg: '20px' }}
									pt={{ base: '20px', lg: '0' }}
								>
									<Text fontSize="xs" fontWeight="600" color={mutedColor} mb="6px">
										РЕЖИМ ПЕРЕВОДА
									</Text>
									<Flex justify="space-between" align="center" gap="16px">
										<Flex
											minH="40px"
											px="12px"
											align="center"
											flex="1"
											bg={inputBg}
											borderWidth="1px"
											borderColor={tableBorder}
											borderRadius="15px"
										>
											<Text fontSize="12px" color={textColor}>
												{isFreeTranslation
													? `Бесплатно, ${FREE_TRANSLATIONS_PER_DAY} перевода в день`
													: 'Перевод с оплатой токенами'}
											</Text>
										</Flex>
										<HStack spacing="8px" flexShrink={0}>
											<Text
												fontSize="sm"
												fontWeight="600"
												color={isFreeTranslation ? textColor : mutedColor}
											>
												Бесплатно
											</Text>
											<Switch
												size="lg"
												colorScheme="green"
												isChecked={!isFreeTranslation}
												onChange={handleTranslationModeChange}
											/>
											<Text
												fontSize="sm"
												fontWeight="600"
												color={!isFreeTranslation ? textColor : mutedColor}
											>
												За токены
											</Text>
										</HStack>
									</Flex>
									{!isFreeTranslation && canUseEmployeeAccount ? (
										<Flex mt="12px" justify="space-between" align="center" gap="12px" wrap="wrap">
											<Text fontSize="xs" fontWeight="600" color={mutedColor}>
												СПИСЫВАТЬ ТОКЕНЫ
											</Text>
											<HStack spacing="6px">
												<Button
													size="xs"
													h="30px"
													px="10px"
													borderRadius="8px"
													bg={
														selectedTokenSource === TOKEN_SOURCE.PERSONAL ? 'recode.300' : inputBg
													}
													color={
														selectedTokenSource === TOKEN_SOURCE.PERSONAL ? 'white' : textColor
													}
													borderWidth="1px"
													borderColor={
														selectedTokenSource === TOKEN_SOURCE.PERSONAL
															? 'recode.300'
															: tableBorder
													}
													aria-pressed={selectedTokenSource === TOKEN_SOURCE.PERSONAL}
													onClick={() => setSelectedTokenSource(TOKEN_SOURCE.PERSONAL)}
													_hover={{
														bg:
															selectedTokenSource === TOKEN_SOURCE.PERSONAL
																? 'recode.400'
																: inputBg,
													}}
												>
													Личный счет
												</Button>
												<Button
													size="xs"
													h="30px"
													px="10px"
													borderRadius="8px"
													bg={
														selectedTokenSource === TOKEN_SOURCE.EMPLOYEE ? 'recode.300' : inputBg
													}
													color={
														selectedTokenSource === TOKEN_SOURCE.EMPLOYEE ? 'white' : textColor
													}
													borderWidth="1px"
													borderColor={
														selectedTokenSource === TOKEN_SOURCE.EMPLOYEE
															? 'recode.300'
															: tableBorder
													}
													aria-pressed={selectedTokenSource === TOKEN_SOURCE.EMPLOYEE}
													onClick={() => setSelectedTokenSource(TOKEN_SOURCE.EMPLOYEE)}
													_hover={{
														bg:
															selectedTokenSource === TOKEN_SOURCE.EMPLOYEE
																? 'recode.400'
																: inputBg,
													}}
												>
													Счет сотрудника
												</Button>
											</HStack>
										</Flex>
									) : null}
								</Box>
							</Grid>
						</Box>

						<Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="20px">
							<Box>
								<Text fontSize="sm" color={textColor} mb="8px">
									Исходный макрос
								</Text>
								<Box position="relative">
									<Textarea
										value={source}
										onChange={handleSourceChange}
										placeholder="Введите или вставьте ваш код здесь..."
										minH={{ base: '250px', md: '320px' }}
										bg={inputBg}
										color={textColor}
										borderColor={tableBorder}
										borderRadius="15px"
										resize="none"
										fontSize="sm"
										pb={isFreeTranslation ? '34px' : undefined}
										position="relative"
										zIndex={1}
									/>
									{isFreeTranslation ? (
										<Text
											position="absolute"
											right="12px"
											bottom="10px"
											fontSize="xs"
											color={mutedColor}
											zIndex={2}
											pointerEvents="none"
										>
											{source.length} / {FREE_TRANSLATION_CHAR_LIMIT}
										</Text>
									) : null}
								</Box>
							</Box>

							<Box>
								<Flex justify="space-between" align="center" gap="12px" mb="8px">
									<Text fontSize="sm" color={textColor}>
										Переведенный макрос
									</Text>
									{translated.trim() ? (
										<Button
											size="xs"
											variant="link"
											color="gray.400"
											fontSize="xs"
											fontWeight="400"
											onClick={handleOpenIncorrectMacroModal}
											_hover={{ color: 'gray.500' }}
										>
											Некорректный макрос?
										</Button>
									) : null}
								</Flex>
								<Box position="relative">
									<Button
										size="xs"
										px="10px"
										onClick={handleCopyResult}
										bg="gray.200"
										color="gray.500"
										borderRadius="8px"
										leftIcon={copied ? <FiCheck /> : <FiCopy />}
										fontSize="xs"
										fontWeight="700"
										position="absolute"
										top="10px"
										right="10px"
										zIndex={2}
										_hover={{ bg: 'gray.300' }}
										// isDisabled={!translated}
									>
										{copied ? 'Скопировано.' : 'Копировать'}
									</Button>
									<Textarea
										value={translated}
										placeholder="..."
										minH={{ base: '250px', md: '320px' }}
										bg={inputBg}
										color={textColor}
										borderColor={tableBorder}
										borderRadius="15px"
										resize="none"
										fontSize="sm"
										pt="8px"
										position="relative"
										zIndex={1}
										readOnly
									/>
								</Box>
							</Box>
						</Grid>

						<Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="20px">
							<Flex
								borderWidth="1px"
								borderColor={tableBorder}
								borderRadius="15px"
								px="16px"
								py="12px"
								justify="space-between"
								align={{ base: 'flex-start', sm: 'center' }}
								direction={{ base: 'column', sm: 'row' }}
								gap="12px"
							>
								<Box>
									<Text fontSize="xs" fontWeight="500" color={mutedColor}>
										{getTokenPanelLabel(selectedTokenSource)}:{' '}
										<Text as="span" color={textColor}>
											{formatTokenValue(activeTokenBalance)}
										</Text>
									</Text>
									<Text fontSize="xs" fontWeight="500" color={mutedColor}>
										ТАРИФ:{' '}
										<Link color={textColor} textDecor="underline">
											{getTariffLabel(subscriptionName)}
										</Link>
									</Text>
								</Box>
								<Button
									size="sm"
									px="1rem"
									bg="gray.200"
									color="gray.700"
									fontSize="xs"
									fontWeight="semibold"
									borderRadius="8px"
									rightIcon={<IoArrowForwardSharp />}
									onClick={() => navigate('/lk/tariff')}
									_hover={{ bg: 'gray.300' }}
								>
									ТАРИФЫ
								</Button>
							</Flex>

							<HStack spacing="12px" align="center">
								<Icon as={FiAlertCircle} color={mutedColor} stroke={1} boxSize="48px" mt="2px" />
								<Text fontSize="12px" color={mutedColor}>
									Внимание! Переведенный макрос может содержать неточности и ошибки. Рекомендуем
									проверять результат перевода вручную перед его использованием в своих проектах.
									{` `}
									<Link
										textDecor="underline"
										color={mutedColor}
										onClick={(event) => {
											event.preventDefault();
											setIsDisclaimerOpen(true);
										}}
									>
										Подробнее
									</Link>
								</Text>
							</HStack>
						</Grid>

						<Flex justify="center" mb="22px">
							<Button
								onClick={handleTranslate}
								bg="recode.300"
								color="white"
								borderRadius="15px"
								h="50px"
								minW={{ base: '220px', md: '300px' }}
								fontSize="xs"
								letterSpacing="0.2px"
								_hover={{ bg: 'recode.400' }}
								isLoading={isConverting}
								loadingText="Переводим"
							>
								ПРЕОБРАЗОВАТЬ
							</Button>
						</Flex>

						<ConversionHistory
							title="Последние конвертации"
							amount={historyItems.length}
							captions={['ID', 'ТИП', 'СТАТУС', 'РЕЗУЛЬТАТ ПЕРЕВОДА', 'ЗАТРАЧЕННЫЕ ТОКЕНЫ', 'ДАТА']}
							data={historyItems}
							fixedHeight="520px"
							enablePagination={false}
							showFullHistoryButton={true}
							fullHistoryPath="/lk/conversion-history"
							fullHistoryButtonLabel="Показать полную историю"
						/>
					</>
				)}

				<Link
					as={RouterLink}
					to="/constructor"
					target="_blank"
					display="block"
					borderRadius="15px"
					overflow="hidden"
				>
					<Image
						src={BannerConstructor}
						alt="reCode banner"
						w="100%"
						h="auto"
						objectFit="contain"
						display="block"
					/>
				</Link>
			</Flex>

			<Modal
				isOpen={isDisclaimerOpen}
				onClose={() => setIsDisclaimerOpen(false)}
				isCentered
				size="3xl"
			>
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent
					bg={modalGlassBg}
					border="1px solid"
					borderColor="whiteAlpha.400"
					borderRadius="20px"
					boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
					overflow="hidden"
				>
					<ModalHeader
						px="28px"
						py="20px"
						borderBottom="1px solid"
						borderColor="blackAlpha.200"
						bg={modalSectionBg}
					>
						<Text fontSize="24px" fontWeight="600" color={modalTitleColor} lineHeight="1.1">
							Отказ от ответственности
						</Text>
					</ModalHeader>
					<ModalCloseButton top="20px" right="20px" />
					<ModalBody px="28px" py="22px" bg={modalSectionBg}>
						<Text fontSize="14px" lineHeight="1.6" color={modalTextColor}>
							Наш онлайн-сервис предоставляет возможность автоматизированного перевода кода между
							языками программирования исключительно &quot;как есть&quot; без каких-либо гарантий
							точности, полноты или пригодности результата для конкретных целей использования.
							Пользователь несет полную ответственность за проверку и исправление полученного кода
							перед его применением в своих проектах.
						</Text>
						<Text fontSize="14px" lineHeight="1.6" color={modalTextColor} mt="12px">
							Мы не несем ответственности за любые возможные убытки, ущерб или другие последствия,
							возникшие вследствие использования нашего сервиса, включая, но не ограничиваясь,
							ошибками в результате конвертации, потерей данных или нарушением работы программного
							обеспечения пользователя.
						</Text>
						<Text fontSize="14px" lineHeight="1.6" color={modalTextColor} mt="12px">
							Продолжая использовать наш сервис, вы соглашаетесь с данным отказом от ответственности
							и принимаете все риски, связанные с его использованием.
						</Text>
					</ModalBody>
					<ModalFooter
						px="28px"
						py="18px"
						borderTop="1px solid"
						borderColor="blackAlpha.200"
						bg={modalSectionBg}
					>
						<Button
							colorScheme="recode"
							borderRadius="12px"
							onClick={() => setIsDisclaimerOpen(false)}
						>
							Понятно
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<IncorrectMacroModal
				isOpen={isIncorrectMacroModalOpen}
				onClose={() => setIsIncorrectMacroModalOpen(false)}
				conversionId={incorrectMacroSnapshot.conversionId}
				source={incorrectMacroSnapshot.source}
				translated={incorrectMacroSnapshot.translated}
				targetLanguage={incorrectMacroSnapshot.targetLanguage}
			/>
		</>
	);
}
