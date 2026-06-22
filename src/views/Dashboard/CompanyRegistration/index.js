import { CheckIcon } from '@chakra-ui/icons';
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	GridItem,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	List,
	ListItem,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Switch,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCurrentUser } from 'services/auth';
import { hasDadataApiKey, mapPartySuggestion, suggestParties } from 'services/dadata';
import { createOrganization } from 'services/organization';

const initialForm = {
	fullName: '',
	shortName: '',
	inn: '',
	kpp: '',
	ogrn: '',
	okpo: '',
	legalAddress: '',
	contactFio: '',
	contactPosition: '',
	contactPhone: '',
	contactEmail: '',
};

function normalizeDigits(value) {
	return value.replace(/\D/g, '');
}

function scrollToPageTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getErrorMessage(error) {
	const message = error.message || '';
	if (message.includes('user already in organization')) {
		return 'Компания уже привязана к аккаунту';
	}
	if (message.includes('Invalid input')) {
		return 'Проверьте реквизиты организации';
	}
	if (message.includes('Forbidden')) {
		return 'Недостаточно прав для привязки компании';
	}
	return message || 'Не удалось привязать компанию';
}

function CompanyRegistration() {
	const history = useHistory();
	const [currentUser, setCurrentUser] = useState(null);
	const [entityType, setEntityType] = useState('company');
	const [sameAsOwner, setSameAsOwner] = useState(false);
	const [form, setForm] = useState(initialForm);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedSuggestion, setSelectedSuggestion] = useState(null);
	const [suggestions, setSuggestions] = useState([]);
	const [suggestError, setSuggestError] = useState('');
	const [isSuggestLoading, setIsSuggestLoading] = useState(false);
	const [isChecking, setIsChecking] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isClearModalOpen, setIsClearModalOpen] = useState(false);
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
	const [submitError, setSubmitError] = useState('');
	const [submitAttempted, setSubmitAttempted] = useState(false);

	const titleColor = useColorModeValue('gray.700', 'white');
	const subtitleColor = useColorModeValue('gray.400', 'gray.300');
	const cardBg = useColorModeValue('white', 'gray.700');
	const cardBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
	const sectionTitleColor = useColorModeValue('gray.700', 'white');
	const labelColor = useColorModeValue('gray.700', 'gray.100');
	const inputTextColor = useColorModeValue('black', 'white');
	const inputBg = useColorModeValue('white', 'whiteAlpha.50');
	const placeholderColor = useColorModeValue('gray.400', 'gray.400');
	const mutedTextColor = useColorModeValue('gray.500', 'gray.300');
	const searchCardBg = useColorModeValue('gray.50', 'whiteAlpha.50');
	const searchAccentBg = useColorModeValue('white', 'whiteAlpha.100');
	const suggestionHoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
	const selectedSuggestionBg = useColorModeValue('green.50', 'green.900');
	const selectedSuggestionBorder = useColorModeValue('green.200', 'green.500');

	const dadataEnabled = hasDadataApiKey();
	const isIp = entityType === 'ip';
	const innLabel = isIp ? 'ИНН ИП' : 'ИНН';
	const innPlaceholder = isIp ? '123456789012' : '7700000000';
	const ogrnLabel = isIp ? 'ОГРНИП' : 'ОГРН';
	const ogrnPlaceholder = isIp ? '123456789012345' : '1027700132195';
	const kppHelpText = 'Для ИП КПП не требуется.';

	const inputStyles = {
		borderRadius: '15px',
		fontSize: 'sm',
		size: 'lg',
		color: inputTextColor,
		borderColor: cardBorder,
		bg: inputBg,
		focusBorderColor: 'recode.300',
		_focusVisible: {
			borderColor: 'recode.300',
			boxShadow: '0 0 0 1px var(--chakra-colors-recode-300)',
		},
		_placeholder: {
			color: placeholderColor,
		},
	};

	const handleEntityTypeChange = (nextType) => {
		setEntityType(nextType);
		setForm((prev) => ({
			...prev,
			kpp: nextType === 'ip' ? '' : prev.kpp,
		}));
		if (selectedSuggestion && selectedSuggestion.entityType !== nextType) {
			setSelectedSuggestion(null);
		}
	};

	useEffect(() => {
		let isMounted = true;

		async function checkOrganization() {
			try {
				const user = await getCurrentUser();
				if (isMounted) {
					setCurrentUser(user);
				}
				if (user.has_organization) {
					history.replace('/lk/company');
					return;
				}
			} finally {
				if (isMounted) {
					setIsChecking(false);
				}
			}
		}

		checkOrganization();

		return () => {
			isMounted = false;
		};
	}, [history]);

	useEffect(() => {
		const selectedTitle = selectedSuggestion
			? selectedSuggestion.shortName || selectedSuggestion.fullName
			: '';

		if (
			!dadataEnabled ||
			searchQuery.trim().length < 2 ||
			(selectedTitle && selectedTitle === searchQuery.trim())
		) {
			setSuggestions([]);
			setSuggestError('');
			return;
		}

		let isMounted = true;
		const timer = window.setTimeout(async () => {
			setIsSuggestLoading(true);
			setSuggestError('');

			try {
				const nextSuggestions = await suggestParties(searchQuery, 5);
				if (isMounted) {
					setSuggestions(nextSuggestions);
				}
			} catch (error) {
				if (isMounted) {
					setSuggestions([]);
					setSuggestError(error.message || 'Не удалось загрузить подсказки');
				}
			} finally {
				if (isMounted) {
					setIsSuggestLoading(false);
				}
			}
		}, 450);

		return () => {
			isMounted = false;
			window.clearTimeout(timer);
		};
	}, [dadataEnabled, searchQuery, selectedSuggestion]);

	const finalEmail = sameAsOwner
		? currentUser?.email || form.contactEmail.trim() || ''
		: form.contactEmail.trim();
	const finalResponsibleName = sameAsOwner ? currentUser?.name || form.contactFio : form.contactFio;
	const finalResponsiblePosition = sameAsOwner ? 'Владелец текущего профиля' : form.contactPosition;
	const finalResponsiblePhone = sameAsOwner
		? currentUser?.phone || form.contactPhone
		: form.contactPhone;

	const errors = useMemo(() => {
		const nextErrors = {};
		if (!form.fullName.trim()) {
			nextErrors.fullName = 'Укажите полное наименование';
		}
		if (!form.shortName.trim()) {
			nextErrors.shortName = 'Укажите сокращенное наименование';
		}
		if (!form.inn.trim()) {
			nextErrors.inn = 'Укажите ИНН';
		} else if (normalizeDigits(form.inn).length !== (isIp ? 12 : 10)) {
			nextErrors.inn = isIp
				? 'ИНН ИП должен содержать 12 цифр'
				: 'ИНН организации должен содержать 10 цифр';
		}
		if (!isIp && !form.kpp.trim()) {
			nextErrors.kpp = 'Укажите КПП';
		} else if (!isIp && normalizeDigits(form.kpp).length !== 9) {
			nextErrors.kpp = 'КПП должен содержать 9 цифр';
		}
		if (!form.ogrn.trim()) {
			nextErrors.ogrn = isIp ? 'Укажите ОГРНИП' : 'Укажите ОГРН';
		} else if (normalizeDigits(form.ogrn).length !== (isIp ? 15 : 13)) {
			nextErrors.ogrn = isIp ? 'ОГРНИП должен содержать 15 цифр' : 'ОГРН должен содержать 13 цифр';
		}
		if (!form.okpo.trim()) {
			nextErrors.okpo = 'Укажите ОКПО';
		} else if (normalizeDigits(form.okpo).length !== (isIp ? 10 : 8)) {
			nextErrors.okpo = isIp
				? 'ОКПО ИП должен содержать 10 цифр'
				: 'ОКПО организации должен содержать 8 цифр';
		}
		if (!form.legalAddress.trim()) {
			nextErrors.legalAddress = 'Укажите юридический адрес';
		}
		if (!finalResponsibleName?.trim()) {
			nextErrors.contactFio = 'Укажите ФИО ответственного лица';
		}
		if (!finalResponsiblePosition?.trim()) {
			nextErrors.contactPosition = 'Укажите должность';
		}
		if (!finalResponsiblePhone?.trim()) {
			nextErrors.contactPhone = 'Укажите контактный телефон';
		}
		if (!finalEmail.trim()) {
			nextErrors.contactEmail = 'Укажите корпоративную почту';
		}
		return nextErrors;
	}, [
		currentUser,
		finalEmail,
		finalResponsibleName,
		finalResponsiblePhone,
		finalResponsiblePosition,
		form,
		isIp,
		sameAsOwner,
	]);

	const hasErrors = Object.keys(errors).length > 0;
	const previewRows = [
		['Тип', isIp ? 'Индивидуальный предприниматель' : 'Юридическое лицо'],
		['Полное наименование', form.fullName],
		['Сокращенное наименование', form.shortName],
		[innLabel, form.inn],
		...(isIp ? [] : [['КПП', form.kpp]]),
		[ogrnLabel, form.ogrn],
		['ОКПО', form.okpo],
		['Юридический адрес', form.legalAddress],
		['ФИО ответственного лица', finalResponsibleName],
		['Должность', finalResponsiblePosition],
		['Контактный телефон', finalResponsiblePhone],
		['Корпоративная почта', finalEmail],
	];

	const handleFieldChange = (field) => (event) => {
		const rawValue = event.target.value;
		const value = ['inn', 'kpp', 'ogrn', 'okpo'].includes(field)
			? normalizeDigits(rawValue)
			: rawValue;
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSuggestionSelect = (suggestion) => {
		const mapped = mapPartySuggestion(suggestion);
		setEntityType(mapped.entityType || 'company');
		setForm((prev) => ({
			...prev,
			fullName: mapped.fullName,
			shortName: mapped.shortName,
			inn: mapped.inn,
			kpp: mapped.entityType === 'ip' ? '' : mapped.kpp,
			ogrn: mapped.ogrn,
			okpo: mapped.okpo || prev.okpo,
			legalAddress: mapped.legalAddress,
			contactFio: prev.contactFio || mapped.managementName,
			contactPosition: prev.contactPosition || mapped.managementPost,
		}));
		setSearchQuery(mapped.shortName || mapped.fullName);
		setSelectedSuggestion(mapped);
		setSuggestions([]);
	};

	const handleSearchButtonClick = () => {
		const trimmedQuery = searchQuery.trim();
		if (!trimmedQuery) {
			return;
		}
		if (trimmedQuery !== searchQuery) {
			setSearchQuery(trimmedQuery);
		}
	};

	const handleClearForm = () => {
		setEntityType('company');
		setForm(initialForm);
		setSearchQuery('');
		setSelectedSuggestion(null);
		setSuggestions([]);
		setSuggestError('');
		setSubmitError('');
		setSubmitAttempted(false);
		setSameAsOwner(false);
		setIsClearModalOpen(false);
		setIsPreviewModalOpen(false);
		scrollToPageTop();
	};

	const handleOpenPreview = () => {
		setSubmitAttempted(true);

		if (hasErrors || isSubmitting) {
			setSubmitError('Заполните все обязательные поля формы');
			scrollToPageTop();
			return;
		}

		setSubmitError('');
		setIsPreviewModalOpen(true);
	};

	const handleSubmit = async () => {
		setSubmitAttempted(true);
		setSubmitError('');

		if (hasErrors || isSubmitting) {
			return;
		}

		setIsSubmitting(true);
		try {
			await createOrganization({
				full_name: form.fullName.trim(),
				inn: form.inn.trim() || null,
				ogrn: form.ogrn.trim() || null,
				kpp: isIp ? null : form.kpp.trim(),
				okpo: form.okpo.trim() || null,
				post_address: form.legalAddress.trim() || null,
				address: form.legalAddress.trim() || null,
				short_name: form.shortName.trim() || null,
				email: finalEmail || null,
			});
			setIsPreviewModalOpen(false);
			history.replace('/lk/company');
		} catch (error) {
			const message = getErrorMessage(error);
			setSubmitError(message);
			scrollToPageTop();
			if (message === 'Компания уже привязана к аккаунту') {
				history.replace('/lk/company');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isChecking) {
		return (
			<Flex minH="50vh" align="center" justify="center">
				<Spinner color="recode.300" size="xl" />
			</Flex>
		);
	}

	return (
		<Flex direction="column" py={{ base: '120px', md: '75px' }} minH="100vh">
			<Box maxW="1000px" w="100%">
				<Text fontSize="32px" lineHeight="1.3" fontWeight="bold" color={titleColor}>
					Подключение организации
				</Text>
				<Text
					mt="4px"
					mb="24px"
					fontSize="14px"
					lineHeight="1.4"
					fontWeight="bold"
					color={subtitleColor}
				>
					Заполните реквизиты для привязки организации к аккаунту
				</Text>

				<Flex direction="column" gap="16px">
					{submitError ? (
						<Alert status="error" borderRadius="12px">
							<AlertIcon />
							{submitError}
						</Alert>
					) : null}

					<Box
						bg={searchCardBg}
						border="1px solid"
						borderColor={cardBorder}
						borderRadius="18px"
						p={{ base: '16px', md: '18px' }}
					>
						<Text
							fontSize="20px"
							lineHeight="1.3"
							fontWeight="bold"
							color={sectionTitleColor}
							mb="16px"
						>
							Поиск по ИНН или названию <span className="text-[#A0AEC0]">(юр. лицо или ИП)</span>
						</Text>
						<FormControl>
							<HStack align="stretch" spacing="10px">
								<InputGroup size="md">
									<Input
										pr="110px"
										placeholder="Например, ООО Ромашка или 2631012682"
										value={searchQuery}
										onChange={(event) => {
											const nextValue = event.target.value;
											setSearchQuery(nextValue);
											if (
												selectedSuggestion &&
												nextValue !== (selectedSuggestion.shortName || selectedSuggestion.fullName)
											) {
												setSelectedSuggestion(null);
											}
										}}
										isDisabled={!dadataEnabled}
										{...inputStyles}
										bg={searchAccentBg}
									/>
									<InputRightElement width="102px" h="100%" pr="6px">
										<Button
											size="sm"
											w="94px"
											borderRadius="10px"
											colorScheme="recode"
											onClick={handleSearchButtonClick}
											isDisabled={!dadataEnabled || searchQuery.trim().length < 2}
											isLoading={isSuggestLoading}
										>
											Найти
										</Button>
									</InputRightElement>
								</InputGroup>
							</HStack>
							{selectedSuggestion ? (
								<Flex
									mt="10px"
									align="center"
									justify="space-between"
									gap="12px"
									border="1px solid"
									borderColor={selectedSuggestionBorder}
									bg={selectedSuggestionBg}
									borderRadius="12px"
									px="12px"
									py="10px"
								>
									<Box>
										<Flex align="center" gap="8px" mb="2px">
											<CheckIcon color="green.400" boxSize={4} />
											<Text fontSize="sm" fontWeight="bold" color={sectionTitleColor}>
												{selectedSuggestion.shortName || selectedSuggestion.fullName}
											</Text>
										</Flex>
										<Text fontSize="12px" color={mutedTextColor}>
											ИНН {selectedSuggestion.inn || '-'}
											{selectedSuggestion.entityType === 'ip'
												? ` · ОГРНИП ${selectedSuggestion.ogrn || '-'}`
												: ` · КПП ${selectedSuggestion.kpp || '-'} · ОГРН ${
														selectedSuggestion.ogrn || '-'
												  }`}
										</Text>
									</Box>
									<Button
										size="sm"
										variant="ghost"
										onClick={() => {
											setSelectedSuggestion(null);
											setSearchQuery('');
										}}
									>
										Сменить
									</Button>
								</Flex>
							) : null}
							{!dadataEnabled ? (
								<Text mt="8px" fontSize="12px" color={mutedTextColor}>
									Подсказки отключены: пожалуйста свяжитесь с администратором сайта для решения
									проблемы. Ручной ввод доступен.
								</Text>
							) : null}
							{suggestError ? (
								<Text mt="8px" fontSize="12px" color="red.500">
									{suggestError}
								</Text>
							) : null}
							{isSuggestLoading ? (
								<Flex mt="10px" align="center" gap="8px" color={mutedTextColor}>
									<Spinner size="sm" />
									<Text fontSize="12px">Ищем организации...</Text>
								</Flex>
							) : null}
							{suggestions.length > 0 ? (
								<List
									mt="10px"
									border="1px solid"
									borderColor={cardBorder}
									borderRadius="12px"
									overflow="hidden"
								>
									{suggestions.map((suggestion) => {
										const mapped = mapPartySuggestion(suggestion);
										return (
											<ListItem
												key={`${mapped.inn}-${mapped.kpp}-${mapped.ogrn}`}
												px="12px"
												py="10px"
												cursor="pointer"
												_hover={{ bg: suggestionHoverBg }}
												onClick={() => handleSuggestionSelect(suggestion)}
											>
												<Text fontSize="sm" fontWeight="bold" color={sectionTitleColor}>
													{mapped.shortName || mapped.fullName}
												</Text>
												<Text fontSize="12px" color={mutedTextColor}>
													ИНН {mapped.inn || '-'}
													{mapped.entityType === 'ip'
														? ` · ОГРНИП ${mapped.ogrn || '-'}`
														: ` · КПП ${mapped.kpp || '-'} · ОГРН ${mapped.ogrn || '-'}`}
												</Text>
											</ListItem>
										);
									})}
								</List>
							) : null}
						</FormControl>
					</Box>

					<Box bg={cardBg} borderRadius="15px" p="24px">
						<Text
							fontSize="20px"
							lineHeight="1.3"
							fontWeight="bold"
							color={sectionTitleColor}
							mb="16px"
						>
							Реквизиты организации
						</Text>
						<Flex mb="16px" gap="8px" wrap="wrap">
							<Button
								size="sm"
								variant={isIp ? 'outline' : 'solid'}
								colorScheme="recode"
								onClick={() => handleEntityTypeChange('company')}
							>
								Юридическое лицо
							</Button>
							<Button
								size="sm"
								variant={isIp ? 'solid' : 'outline'}
								colorScheme="recode"
								onClick={() => handleEntityTypeChange('ip')}
							>
								ИП
							</Button>
						</Flex>
						<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="16px">
							<GridItem colSpan={{ base: 1, md: 2 }}>
								<FormControl isInvalid={submitAttempted && Boolean(errors.fullName)}>
									<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
										Полное наименование
									</FormLabel>
									<Input
										placeholder="ООО Ромашка"
										value={form.fullName}
										onChange={handleFieldChange('fullName')}
										{...inputStyles}
									/>
									<FormErrorMessage>{errors.fullName}</FormErrorMessage>
								</FormControl>
							</GridItem>

							<FormControl isInvalid={submitAttempted && Boolean(errors.shortName)}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Сокращенное наименование
								</FormLabel>
								<Input
									placeholder="ООО Ромашка"
									value={form.shortName}
									onChange={handleFieldChange('shortName')}
									{...inputStyles}
								/>
								<FormErrorMessage>{errors.shortName}</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={submitAttempted && Boolean(errors.inn)}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									{innLabel}
								</FormLabel>
								<Input
									placeholder={innPlaceholder}
									value={form.inn}
									onChange={handleFieldChange('inn')}
									maxLength={isIp ? 12 : 10}
									{...inputStyles}
								/>
								<FormErrorMessage>{errors.inn}</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={submitAttempted && Boolean(errors.kpp)} isDisabled={isIp}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									КПП
								</FormLabel>
								<Input
									placeholder="770001001"
									value={form.kpp}
									onChange={handleFieldChange('kpp')}
									maxLength={9}
									{...inputStyles}
								/>
								{isIp ? (
									<Text mt="8px" fontSize="12px" color={mutedTextColor}>
										{kppHelpText}
									</Text>
								) : null}
								<FormErrorMessage>{errors.kpp}</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={submitAttempted && Boolean(errors.ogrn)}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									{ogrnLabel}
								</FormLabel>
								<Input
									placeholder={ogrnPlaceholder}
									value={form.ogrn}
									onChange={handleFieldChange('ogrn')}
									maxLength={isIp ? 15 : 13}
									{...inputStyles}
								/>
								<FormErrorMessage>{errors.ogrn}</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={submitAttempted && Boolean(errors.okpo)}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									ОКПО
								</FormLabel>
								<Input
									placeholder="1234567890"
									value={form.okpo}
									onChange={handleFieldChange('okpo')}
									maxLength={isIp ? 10 : 8}
									{...inputStyles}
								/>
								<FormErrorMessage>{errors.okpo}</FormErrorMessage>
							</FormControl>
						</Grid>
					</Box>

					<Box bg={cardBg} borderRadius="15px" p="24px">
						<Text
							fontSize="20px"
							lineHeight="1.3"
							fontWeight="bold"
							color={sectionTitleColor}
							mb="16px"
						>
							Адрес
						</Text>
						<FormControl isInvalid={submitAttempted && Boolean(errors.legalAddress)}>
							<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
								Юридический адрес
							</FormLabel>
							<Input
								placeholder="г. Москва, ул. Примерная, д. 1"
								value={form.legalAddress}
								onChange={handleFieldChange('legalAddress')}
								{...inputStyles}
							/>
							<Text mt="8px" fontSize="12px" color={mutedTextColor}>
								Юридический адрес нужен для заполнения карточки организации и проверки реквизитов
								при подключении к платежному аккаунту.
							</Text>
							<FormErrorMessage>{errors.legalAddress}</FormErrorMessage>
						</FormControl>
					</Box>

					<Box bg={cardBg} borderRadius="15px" p="24px">
						<Text
							fontSize="20px"
							lineHeight="1.3"
							fontWeight="bold"
							color={sectionTitleColor}
							mb="16px"
						>
							Контактное лицо
						</Text>

						<Flex
							align={{ base: 'flex-start', md: 'center' }}
							justify="space-between"
							direction={{ base: 'column', md: 'row' }}
							gap="8px"
							mb="16px"
						>
							<FormControl display="flex" alignItems="center">
								<FormLabel mb="0" fontWeight="normal" fontSize="sm" color={mutedTextColor}>
									Совпадает с владельцем текущего профиля?
								</FormLabel>
								<Switch
									colorScheme="blue"
									isChecked={sameAsOwner}
									onChange={(e) => setSameAsOwner(e.target.checked)}
								/>
							</FormControl>
						</Flex>

						<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="16px">
							<GridItem colSpan={{ base: 1, md: 2 }}>
								<FormControl
									isDisabled={sameAsOwner}
									isInvalid={submitAttempted && Boolean(errors.contactFio)}
								>
									<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
										ФИО ответственного лица
									</FormLabel>
									<Input
										placeholder="Иванов Иван Иванович"
										value={form.contactFio}
										onChange={handleFieldChange('contactFio')}
										{...inputStyles}
									/>
									<FormErrorMessage>{errors.contactFio}</FormErrorMessage>
								</FormControl>
							</GridItem>

							<FormControl
								isDisabled={sameAsOwner}
								isInvalid={submitAttempted && Boolean(errors.contactPosition)}
							>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Должность
								</FormLabel>
								<Input
									placeholder="Руководитель"
									value={form.contactPosition}
									onChange={handleFieldChange('contactPosition')}
									{...inputStyles}
								/>
								<FormErrorMessage>{errors.contactPosition}</FormErrorMessage>
							</FormControl>

							<FormControl
								isDisabled={sameAsOwner}
								isInvalid={submitAttempted && Boolean(errors.contactPhone)}
							>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Контактный телефон
								</FormLabel>
								<Input
									placeholder="+7 (___) ___-__-__"
									value={form.contactPhone}
									onChange={handleFieldChange('contactPhone')}
									{...inputStyles}
								/>
								<FormErrorMessage>{errors.contactPhone}</FormErrorMessage>
							</FormControl>

							<FormControl
								isDisabled={sameAsOwner}
								isInvalid={submitAttempted && Boolean(errors.contactEmail)}
							>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Корпоративная почта
								</FormLabel>
								<Input
									placeholder="company@example.ru"
									value={form.contactEmail}
									onChange={handleFieldChange('contactEmail')}
									{...inputStyles}
								/>
								<FormErrorMessage>{errors.contactEmail}</FormErrorMessage>
							</FormControl>
						</Grid>
						<Text mt="12px" fontSize="12px" color={mutedTextColor}>
							ФИО, должность, телефон и корпоративная почта нужны, чтобы мы знали, кто отвечает за
							подключение организации, и могли связаться по вопросам доступа, документов и настроек.
							<span className="underline">Эти данные хранятся в зашифрованном виде.</span>
						</Text>
					</Box>

					<Flex justify="flex-end" gap="12px" wrap="wrap">
						<Button
							borderColor={cardBorder}
							color={sectionTitleColor}
							h="45px"
							px="24px"
							onClick={() => setIsClearModalOpen(true)}
							isDisabled={isSubmitting}
						>
							Очистить поля
						</Button>
						<Button
							colorScheme="recode"
							bg="recode.300"
							color="white"
							h="45px"
							px="32px"
							onClick={handleOpenPreview}
							_hover={{ bg: 'recode.400' }}
						>
							Привязать компанию
						</Button>
					</Flex>
				</Flex>
			</Box>
			<Modal
				isOpen={isPreviewModalOpen}
				onClose={() => {
					if (!isSubmitting) {
						setIsPreviewModalOpen(false);
					}
				}}
				isCentered
				size="lg"
			>
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px">
					<ModalHeader color={sectionTitleColor}>Проверьте данные компании</ModalHeader>
					<ModalBody>
						<Flex direction="column" gap="10px">
							{previewRows.map(([label, value]) => (
								<Flex
									key={label}
									justify="space-between"
									align="flex-start"
									gap="16px"
									py="8px"
									borderBottom="1px solid"
									borderColor={cardBorder}
								>
									<Text minW="190px" fontSize="sm" color={mutedTextColor}>
										{label}
									</Text>
									<Text
										flex="1"
										textAlign="right"
										fontSize="sm"
										color={sectionTitleColor}
										fontWeight="bold"
									>
										{value?.trim?.() ? value : 'Не заполнено'}
									</Text>
								</Flex>
							))}
						</Flex>
					</ModalBody>
					<ModalFooter gap="12px">
						<Button
							variant="ghost"
							onClick={() => setIsPreviewModalOpen(false)}
							isDisabled={isSubmitting}
						>
							Назад
						</Button>
						<Button
							colorScheme="recode"
							bg="recode.300"
							color="white"
							onClick={handleSubmit}
							isLoading={isSubmitting}
							loadingText="Привязываем"
							_hover={{ bg: 'recode.400' }}
						>
							Подтвердить и привязать
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal
				isOpen={isClearModalOpen}
				onClose={() => setIsClearModalOpen(false)}
				isCentered
				size="md"
			>
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px">
					<ModalHeader color={sectionTitleColor}>Очистить поля?</ModalHeader>
					<ModalBody color={mutedTextColor}>
						Все введенные реквизиты и данные контактного лица будут удалены из формы.
					</ModalBody>
					<ModalFooter gap="12px">
						<Button variant="ghost" onClick={() => setIsClearModalOpen(false)}>
							Отмена
						</Button>
						<Button colorScheme="red" onClick={handleClearForm}>
							Очистить
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	);
}

export default CompanyRegistration;
