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
	Input,
	List,
	ListItem,
	Spinner,
	Switch,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createOrganization } from 'services/organization';
import { getCurrentUser } from 'services/auth';
import { hasDadataApiKey, mapPartySuggestion, suggestParties } from 'services/dadata';

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

function getErrorMessage(error) {
	const message = error.message || '';
	if (message.includes('user already in organization')) {
		return 'Компания уже привязана к аккаунту';
	}
	if (message.includes('Invalid input')) {
		return 'Проверьте реквизиты компании';
	}
	if (message.includes('Forbidden')) {
		return 'Недостаточно прав для привязки компании';
	}
	return message || 'Не удалось привязать компанию';
}

function CompanyRegistration() {
	const history = useHistory();
	const [currentUser, setCurrentUser] = useState(null);
	const [sameAsOwner, setSameAsOwner] = useState(false);
	const [form, setForm] = useState(initialForm);
	const [searchQuery, setSearchQuery] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [suggestError, setSuggestError] = useState('');
	const [isSuggestLoading, setIsSuggestLoading] = useState(false);
	const [isChecking, setIsChecking] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState('');
	const [submitAttempted, setSubmitAttempted] = useState(false);

	const titleColor = useColorModeValue('gray.700', 'white');
	const subtitleColor = useColorModeValue('gray.400', 'gray.300');
	const cardBg = useColorModeValue('white', 'gray.700');
	const cardBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
	const sectionTitleColor = useColorModeValue('gray.700', 'white');
	const labelColor = useColorModeValue('gray.700', 'gray.100');
	const inputTextColor = useColorModeValue('gray.500', 'gray.200');
	const inputBg = useColorModeValue('white', 'whiteAlpha.50');
	const mutedTextColor = useColorModeValue('gray.500', 'gray.300');
	const suggestionHoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

	const dadataEnabled = hasDadataApiKey();

	const inputStyles = {
		borderRadius: '15px',
		fontSize: 'sm',
		size: 'lg',
		color: inputTextColor,
		borderColor: cardBorder,
		bg: inputBg,
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
					history.replace('/admin/company');
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
		if (!dadataEnabled || searchQuery.trim().length < 2) {
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
	}, [dadataEnabled, searchQuery]);

	const errors = useMemo(() => {
		const nextErrors = {};
		if (!form.fullName.trim()) {
			nextErrors.fullName = 'Укажите полное наименование';
		}
		if (!form.kpp.trim()) {
			nextErrors.kpp = 'Укажите КПП';
		} else if (normalizeDigits(form.kpp).length !== 9) {
			nextErrors.kpp = 'КПП должен содержать 9 цифр';
		}
		if (form.inn.trim() && normalizeDigits(form.inn).length !== 10) {
			nextErrors.inn = 'ИНН организации должен содержать 10 цифр';
		}
		if (form.ogrn.trim() && normalizeDigits(form.ogrn).length !== 13) {
			nextErrors.ogrn = 'ОГРН должен содержать 13 цифр';
		}
		if (form.okpo.trim() && normalizeDigits(form.okpo).length !== 10) {
			nextErrors.okpo = 'ОКПО должен содержать 10 цифр';
		}
		return nextErrors;
	}, [form]);

	const hasErrors = Object.keys(errors).length > 0;

	const handleFieldChange = (field) => (event) => {
		const rawValue = event.target.value;
		const value = ['inn', 'kpp', 'ogrn', 'okpo'].includes(field)
			? normalizeDigits(rawValue)
			: rawValue;
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSuggestionSelect = (suggestion) => {
		const mapped = mapPartySuggestion(suggestion);
		setForm((prev) => ({
			...prev,
			fullName: mapped.fullName,
			shortName: mapped.shortName,
			inn: mapped.inn,
			kpp: mapped.kpp,
			ogrn: mapped.ogrn,
			okpo: mapped.okpo || prev.okpo,
			legalAddress: mapped.legalAddress,
			contactFio: prev.contactFio || mapped.managementName,
			contactPosition: prev.contactPosition || mapped.managementPost,
		}));
		setSearchQuery(mapped.shortName || mapped.fullName);
		setSuggestions([]);
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
				kpp: form.kpp.trim(),
				okpo: form.okpo.trim() || null,
				post_address: form.legalAddress.trim() || null,
				address: form.legalAddress.trim() || null,
				short_name: form.shortName.trim() || null,
				email: sameAsOwner
					? currentUser?.email || form.contactEmail.trim() || null
					: form.contactEmail.trim() || null,
			});
			history.replace('/admin/company');
		} catch (error) {
			const message = getErrorMessage(error);
			setSubmitError(message);
			if (message === 'Компания уже привязана к аккаунту') {
				history.replace('/admin/company');
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
				<Text mt="4px" mb="24px" fontSize="14px" lineHeight="1.4" fontWeight="bold" color={subtitleColor}>
					Заполните реквизиты для привязки компании к аккаунту
				</Text>

				<Flex direction="column" gap="16px">
					{submitError ? (
						<Alert status="error" borderRadius="12px">
							<AlertIcon />
							{submitError}
						</Alert>
					) : null}

					<Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="15px" p="24px">
						<Text fontSize="20px" lineHeight="1.3" fontWeight="bold" color={sectionTitleColor} mb="16px">
							Поиск по ИНН или названию
						</Text>
						<FormControl>
							<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
								Название, ИНН, ОГРН или КПП
							</FormLabel>
							<Input
								placeholder="Например, Сбербанк или 7707083893"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								isDisabled={!dadataEnabled}
								{...inputStyles}
							/>
							{!dadataEnabled ? (
								<Text mt="8px" fontSize="12px" color={mutedTextColor}>
									Подсказки отключены: добавьте REACT_APP_DADATA_API_KEY в .env. Ручной ввод доступен.
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
								<List mt="10px" border="1px solid" borderColor={cardBorder} borderRadius="12px" overflow="hidden">
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
													ИНН {mapped.inn || '-'} · КПП {mapped.kpp || '-'} · ОГРН {mapped.ogrn || '-'}
												</Text>
											</ListItem>
										);
									})}
								</List>
							) : null}
						</FormControl>
					</Box>

					<Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="15px" p="24px">
						<Text fontSize="20px" lineHeight="1.3" fontWeight="bold" color={sectionTitleColor} mb="16px">
							Реквизиты компании
						</Text>
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

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Сокращенное наименование
								</FormLabel>
								<Input
									placeholder="ООО Ромашка"
									value={form.shortName}
									onChange={handleFieldChange('shortName')}
									{...inputStyles}
								/>
							</FormControl>

							<FormControl isInvalid={submitAttempted && Boolean(errors.inn)}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									ИНН
								</FormLabel>
								<Input
									placeholder="7700000000"
									value={form.inn}
									onChange={handleFieldChange('inn')}
									maxLength={10}
									{...inputStyles}
								/>
								<FormErrorMessage>{errors.inn}</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={submitAttempted && Boolean(errors.kpp)}>
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
								<FormErrorMessage>{errors.kpp}</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={submitAttempted && Boolean(errors.ogrn)}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									ОГРН
								</FormLabel>
								<Input
									placeholder="1027700132195"
									value={form.ogrn}
									onChange={handleFieldChange('ogrn')}
									maxLength={13}
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
									maxLength={10}
									{...inputStyles}
								/>
								<FormErrorMessage>{errors.okpo}</FormErrorMessage>
							</FormControl>
						</Grid>
					</Box>

					<Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="15px" p="24px">
						<Text fontSize="20px" lineHeight="1.3" fontWeight="bold" color={sectionTitleColor} mb="16px">
							Адрес
						</Text>
						<FormControl>
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
								Адрес будет передан в backend как юридический и почтовый.
							</Text>
						</FormControl>
					</Box>

					<Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="15px" p="24px">
						<Text fontSize="20px" lineHeight="1.3" fontWeight="bold" color={sectionTitleColor} mb="16px">
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
								<Switch colorScheme="blue" isChecked={sameAsOwner} onChange={(e) => setSameAsOwner(e.target.checked)} />
							</FormControl>
						</Flex>

						<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="16px">
							<GridItem colSpan={{ base: 1, md: 2 }}>
								<FormControl isDisabled={sameAsOwner}>
									<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
										ФИО ответственного лица
									</FormLabel>
									<Input
										placeholder="Иванов Иван Иванович"
										value={form.contactFio}
										onChange={handleFieldChange('contactFio')}
										{...inputStyles}
									/>
								</FormControl>
							</GridItem>

							<FormControl isDisabled={sameAsOwner}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Должность
								</FormLabel>
								<Input
									placeholder="Руководитель"
									value={form.contactPosition}
									onChange={handleFieldChange('contactPosition')}
									{...inputStyles}
								/>
							</FormControl>

							<FormControl isDisabled={sameAsOwner}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Контактный телефон
								</FormLabel>
								<Input
									placeholder="+7 (___) ___-__-__"
									value={form.contactPhone}
									onChange={handleFieldChange('contactPhone')}
									{...inputStyles}
								/>
							</FormControl>

							<FormControl isDisabled={sameAsOwner}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Корпоративная почта
								</FormLabel>
								<Input
									placeholder="company@example.ru"
									value={form.contactEmail}
									onChange={handleFieldChange('contactEmail')}
									{...inputStyles}
								/>
							</FormControl>
						</Grid>
						<Text mt="12px" fontSize="12px" color={mutedTextColor}>
							В backend будет отправлена только корпоративная почта. ФИО, должность и телефон остаются локальными полями формы.
						</Text>
					</Box>

					<Flex justify="flex-end">
						<Button
							colorScheme="recode"
							bg="recode.300"
							color="white"
							h="45px"
							px="32px"
							isLoading={isSubmitting}
							loadingText="Привязываем"
							onClick={handleSubmit}
							_hover={{ bg: 'recode.400' }}
						>
							Привязать компанию
						</Button>
					</Flex>
				</Flex>
			</Box>
		</Flex>
	);
}

export default CompanyRegistration;
