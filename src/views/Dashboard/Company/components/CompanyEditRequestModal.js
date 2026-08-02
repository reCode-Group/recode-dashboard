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
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { sendSupportRequest } from 'services/supportEmail';

const emptyValue = 'Не указано';

const tabs = [
	{
		id: 'general',
		label: 'Реквизиты',
		title: 'Реквизиты',
		description: 'Названия, ИНН, ОГРН/ОГРНИП, ОКПО и КПП для юридического лица.',
		subject: 'Запрос на изменение реквизитов компании',
	},
	{
		id: 'additional',
		label: 'Контакты',
		title: 'Контакты',
		description: 'Юридический адрес, почта компании и данные ответственного лица.',
		subject: 'Запрос на изменение контактных данных компании',
	},
	{
		id: 'director',
		label: 'Руководитель',
		title: 'Смена руководителя',
		description: 'Укажите аккаунт и ФИО нового руководителя компании.',
		subject: 'Запрос на смену руководителя компании',
	},
];

const initialForm = {
	entityType: 'company',
	fullName: '',
	shortName: '',
	inn: '',
	kpp: '',
	ogrn: '',
	okpo: '',
	legalAddress: '',
	orgEmail: '',
	responsibleFullName: '',
	responsiblePosition: '',
	responsiblePhone: '',
	responsibleEmail: '',
	newDirectorEmail: '',
	newDirectorFullName: '',
};

const initialSubmitState = {
	general: 'idle',
	additional: 'idle',
	director: 'idle',
};

const initialRequestErrors = {
	general: '',
	additional: '',
	director: '',
};

const labels = {
	entityType: 'Тип',
	fullName: 'Полное наименование',
	shortName: 'Сокращенное наименование',
	inn: 'ИНН',
	kpp: 'КПП',
	ogrn: 'ОГРН / ОГРНИП',
	okpo: 'ОКПО',
	legalAddress: 'Юридический адрес',
	orgEmail: 'Email компании',
	responsibleFullName: 'ФИО ответственного',
	responsiblePosition: 'Должность ответственного',
	responsiblePhone: 'Телефон ответственного',
	responsibleEmail: 'Email ответственного',
	newDirectorEmail: 'Email аккаунта нового руководителя',
	newDirectorFullName: 'ФИО нового руководителя',
};

function getRequisiteLength(field, entityType) {
	if (field === 'inn') return entityType === 'ip' ? 12 : 10;
	if (field === 'kpp') return 9;
	if (field === 'ogrn') return entityType === 'ip' ? 15 : 13;
	if (field === 'okpo') return entityType === 'ip' ? 10 : 8;
	return undefined;
}

function normalizeValue(value) {
	if (value === emptyValue || value === null || value === undefined) {
		return '';
	}
	return String(value).trim();
}

function normalizeDigits(value) {
	return normalizeValue(value).replace(/\D/g, '');
}

function getUserFullName(user) {
	return [user?.surname, user?.name, user?.lastname]
		.map((part) => part?.trim())
		.filter(Boolean)
		.join(' ');
}

function getRoleLabel(role) {
	if (role === 'director') return 'Руководитель';
	if (role === 'employee') return 'Сотрудник';
	return emptyValue;
}

function inferEntityType(organization) {
	const inn = normalizeDigits(organization?.inn);
	const kpp = normalizeDigits(organization?.kpp);
	return !kpp && inn.length === 12 ? 'ip' : 'company';
}

function getInitialForm(organization) {
	const entityType = inferEntityType(organization);
	return {
		...initialForm,
		entityType,
		fullName: normalizeValue(organization?.full_name),
		shortName: normalizeValue(organization?.short_name),
		inn: normalizeDigits(organization?.inn),
		kpp: normalizeDigits(organization?.kpp),
		ogrn: normalizeDigits(organization?.ogrn),
		okpo: normalizeDigits(organization?.okpo),
		legalAddress: normalizeValue(organization?.address || organization?.post_address),
		orgEmail: normalizeValue(organization?.email),
		responsibleFullName: normalizeValue(organization?.responsible_full_name),
		responsiblePosition: normalizeValue(organization?.responsible_position),
		responsiblePhone: normalizeValue(organization?.responsible_phone),
		responsibleEmail: normalizeValue(organization?.responsible_email),
	};
}

function getEntityTypeLabel(entityType) {
	return entityType === 'ip' ? 'Индивидуальный предприниматель' : 'Юридическое лицо';
}

function getFieldValue(field, form) {
	if (field === 'entityType') {
		return getEntityTypeLabel(form.entityType);
	}
	return normalizeValue(form[field]);
}

function getFieldsForTab(tabId, entityType) {
	if (tabId === 'general') {
		return [
			'entityType',
			'fullName',
			'shortName',
			'inn',
			...(entityType === 'ip' ? [] : ['kpp']),
			'ogrn',
			'okpo',
		];
	}
	if (tabId === 'additional') {
		return [
			'legalAddress',
			'orgEmail',
			'responsibleFullName',
			'responsiblePosition',
			'responsiblePhone',
			'responsibleEmail',
		];
	}
	return ['newDirectorEmail', 'newDirectorFullName'];
}

function buildTabChanges(tabId, currentForm, form) {
	return getFieldsForTab(tabId, form.entityType)
		.map((field) => ({
			field,
			label: labels[field],
			currentValue:
				tabId === 'director' ? emptyValue : getFieldValue(field, currentForm),
			nextValue: getFieldValue(field, form),
		}))
		.filter((change) => change.currentValue !== change.nextValue);
}

function validateTab(tabId, form, changes) {
	const nextErrors = {};
	const changedFields = new Set(changes.map((change) => change.field));

	if (tabId === 'general' && changedFields.has('inn')) {
		const length = form.entityType === 'ip' ? 12 : 10;
		if (normalizeDigits(form.inn).length !== length) {
			nextErrors.inn =
				form.entityType === 'ip'
					? 'ИНН ИП должен содержать 12 цифр.'
					: 'ИНН организации должен содержать 10 цифр.';
		}
	}
	if (
		tabId === 'general' &&
		changedFields.has('kpp') &&
		form.entityType !== 'ip' &&
		normalizeDigits(form.kpp).length !== 9
	) {
		nextErrors.kpp = 'КПП должен содержать 9 цифр.';
	}
	if (tabId === 'general' && changedFields.has('ogrn')) {
		const length = form.entityType === 'ip' ? 15 : 13;
		if (normalizeDigits(form.ogrn).length !== length) {
			nextErrors.ogrn =
				form.entityType === 'ip'
					? 'ОГРНИП должен содержать 15 цифр.'
					: 'ОГРН должен содержать 13 цифр.';
		}
	}
	if (tabId === 'general' && changedFields.has('okpo')) {
		const length = form.entityType === 'ip' ? 10 : 8;
		if (normalizeDigits(form.okpo).length !== length) {
			nextErrors.okpo =
				form.entityType === 'ip'
					? 'ОКПО ИП должен содержать 10 цифр.'
					: 'ОКПО организации должен содержать 8 цифр.';
		}
	}
	if (tabId === 'director' && !form.newDirectorEmail.trim()) {
		nextErrors.newDirectorEmail = 'Укажите email аккаунта нового руководителя.';
	}
	if (tabId === 'director' && !form.newDirectorFullName.trim()) {
		nextErrors.newDirectorFullName = 'Укажите ФИО нового руководителя.';
	}

	return nextErrors;
}

function buildDescription({ tab, user, organization, changes }) {
	const lines = [
		`Пользователь отправил заявку: ${tab.title}.`,
		'',
		'Отправитель:',
		`Email: ${user?.email || emptyValue}`,
		`ФИО: ${getUserFullName(user) || emptyValue}`,
		`Роль: ${getRoleLabel(user?.organization_role)}`,
		'',
		'Текущая компания:',
		`Название: ${organization?.short_name || organization?.full_name || emptyValue}`,
		`Полное наименование: ${organization?.full_name || emptyValue}`,
		`ИНН: ${organization?.inn || emptyValue}`,
		'',
		'Изменения:',
	];

	changes.forEach((change) => {
		lines.push(`${change.label}: ${change.currentValue || emptyValue} -> ${change.nextValue || emptyValue}`);
	});

	return lines.join('\n');
}

function Field({ label, error, children }) {
	const mutedColor = useColorModeValue('gray.500', 'gray.300');
	return (
		<FormControl isInvalid={Boolean(error)}>
			<FormLabel color={mutedColor}>{label}</FormLabel>
			{children}
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
}

function CurrentValue({ label, value }) {
	const mutedColor = useColorModeValue('gray.500', 'gray.300');
	return (
		<Box>
			<Text fontSize="xs" color={mutedColor} fontWeight="700">
				{label}
			</Text>
			<Text fontSize="sm" mt="2px">
				{value || emptyValue}
			</Text>
		</Box>
	);
}

export default function CompanyEditRequestModal({ isOpen, onClose, organization, user }) {
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const [form, setForm] = useState(initialForm);
	const [currentForm, setCurrentForm] = useState(initialForm);
	const [fieldErrors, setFieldErrors] = useState({});
	const [requestErrors, setRequestErrors] = useState(initialRequestErrors);
	const [submitStates, setSubmitStates] = useState(initialSubmitState);

	const inputBg = useColorModeValue('white', 'whiteAlpha.100');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const mutedColor = useColorModeValue('gray.500', 'gray.300');
	const tabListBg = useColorModeValue('gray.100', 'whiteAlpha.100');

	const activeTab = tabs[activeTabIndex];
	const changes = useMemo(
		() => buildTabChanges(activeTab.id, currentForm, form),
		[activeTab.id, currentForm, form]
	);
	const activeSubmitState = submitStates[activeTab.id];
	const requestError = requestErrors[activeTab.id];
	const isSending = activeSubmitState === 'sending';
	const isIp = form.entityType === 'ip';

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const nextForm = getInitialForm(organization);
		setForm(nextForm);
		setCurrentForm(nextForm);
		setActiveTabIndex(0);
		setFieldErrors({});
		setRequestErrors(initialRequestErrors);
		setSubmitStates(initialSubmitState);
	}, [isOpen, organization]);

	const handleFieldChange = (field) => (event) => {
		const maxLength = getRequisiteLength(field, form.entityType);
		const value = ['inn', 'kpp', 'ogrn', 'okpo'].includes(field)
			? normalizeDigits(event.target.value).slice(0, maxLength)
			: event.target.value;
		setForm((prev) => ({ ...prev, [field]: value }));
		setRequestErrors((prev) => ({ ...prev, [activeTab.id]: '' }));
	};

	const handleEntityTypeChange = (nextType) => {
		setForm((prev) => ({ ...prev, entityType: nextType }));
		setRequestErrors((prev) => ({ ...prev, general: '' }));
	};

	const handleTabChange = (nextIndex) => {
		setActiveTabIndex(nextIndex);
		setFieldErrors({});
	};

	const handleSubmit = async () => {
		if (changes.length === 0) {
			setRequestErrors((prev) => ({
				...prev,
				[activeTab.id]: 'В этой вкладке изменений пока нет. Обновите нужные поля и отправьте отдельную заявку.',
			}));
			setFieldErrors({});
			return;
		}

		const nextErrors = validateTab(activeTab.id, form, changes);
		if (Object.keys(nextErrors).length > 0) {
			setFieldErrors(nextErrors);
			setRequestErrors((prev) => ({
				...prev,
				[activeTab.id]: 'Проверьте поля с подсказками и отправьте заявку еще раз.',
			}));
			return;
		}

		setSubmitStates((prev) => ({ ...prev, [activeTab.id]: 'sending' }));
		setFieldErrors({});
		setRequestErrors((prev) => ({ ...prev, [activeTab.id]: '' }));

		try {
			await sendSupportRequest({
				subject: activeTab.subject,
				description: buildDescription({ tab: activeTab, user, organization, changes }),
			});
			setSubmitStates((prev) => ({ ...prev, [activeTab.id]: 'success' }));
		} catch (error) {
			setSubmitStates((prev) => ({ ...prev, [activeTab.id]: 'error' }));
			setRequestErrors((prev) => ({
				...prev,
				[activeTab.id]: error.message || 'Не получилось отправить заявку. Проверьте подключение и попробуйте еще раз.',
			}));
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={isSending ? () => {} : onClose} isCentered size="5xl">
			<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
			<ModalContent borderRadius="16px" maxH="90vh">
				<ModalHeader pb="8px">
					<Text fontSize="20px" fontWeight="700">
						Изменить данные компании
					</Text>
					<Text mt="6px" fontSize="sm" fontWeight="400" color={mutedColor}>
						Выберите раздел и отправьте отдельную заявку.
					</Text>
				</ModalHeader>
				<ModalCloseButton isDisabled={isSending} />
				<ModalBody overflowY="auto">
					<Stack spacing="18px">
						<Tabs index={activeTabIndex} onChange={handleTabChange} variant="unstyled" isFitted>
							<TabList bg={tabListBg} borderRadius="12px" p="4px" gap="4px">
								{tabs.map((tab) => (
									<Tab
										key={tab.id}
										h="40px"
										borderRadius="9px"
										color={mutedColor}
										whiteSpace="nowrap"
										_selected={{ bg: 'recode.500', color: 'white', boxShadow: 'sm' }}
										fontWeight="700"
										fontSize="sm"
									>
										{tab.label}
									</Tab>
								))}
							</TabList>

							<Box mt="18px" mb="12px">
								<Text fontSize="lg" fontWeight="700">
									{activeTab.title}
								</Text>
							</Box>

							<TabPanels minH={{ base: '320px', md: '390px' }}>
								<TabPanel px="0">
									<Stack spacing="14px">
										{submitStates.general === 'success' ? (
											<Alert status="success" borderRadius="12px">
												<AlertIcon />
												<Text>
													Заявка по реквизитам отправлена. Поддержка проверит изменения и обновит данные компании.
												</Text>
											</Alert>
										) : null}
										{requestErrors.general ? (
											<Alert status="error" borderRadius="12px">
												<AlertIcon />
												<Text>{requestErrors.general}</Text>
											</Alert>
										) : null}
										<Stack spacing="16px">
											<Flex gap="8px" wrap="wrap">
												<Button
													size="sm"
													borderRadius="10px"
													colorScheme={form.entityType === 'company' ? 'recode' : 'gray'}
													variant={form.entityType === 'company' ? 'solid' : 'outline'}
													onClick={() => handleEntityTypeChange('company')}
												>
													Юридическое лицо
												</Button>
												<Button
													size="sm"
													borderRadius="10px"
													colorScheme={form.entityType === 'ip' ? 'recode' : 'gray'}
													variant={form.entityType === 'ip' ? 'solid' : 'outline'}
													onClick={() => handleEntityTypeChange('ip')}
												>
													ИП
												</Button>
											</Flex>
											<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="14px">
												<Field label="Полное наименование" error={fieldErrors.fullName}>
													<Input value={form.fullName} onChange={handleFieldChange('fullName')} bg={inputBg} borderColor={borderColor} borderRadius="12px" />
												</Field>
												<Field label="Сокращенное наименование" error={fieldErrors.shortName}>
													<Input value={form.shortName} onChange={handleFieldChange('shortName')} bg={inputBg} borderColor={borderColor} borderRadius="12px" />
												</Field>
												<Field label={isIp ? 'ИНН ИП' : 'ИНН'} error={fieldErrors.inn}>
													<Input
														value={form.inn}
														onChange={handleFieldChange('inn')}
														bg={inputBg}
														borderColor={borderColor}
														borderRadius="12px"
														maxLength={getRequisiteLength('inn', form.entityType)}
													/>
												</Field>
												{!isIp ? (
													<Field label="КПП" error={fieldErrors.kpp}>
														<Input
															value={form.kpp}
															onChange={handleFieldChange('kpp')}
															bg={inputBg}
															borderColor={borderColor}
															borderRadius="12px"
															maxLength={getRequisiteLength('kpp', form.entityType)}
														/>
													</Field>
												) : (
													<CurrentValue label="КПП" value="Для ИП не требуется" />
												)}
												<Field label={isIp ? 'ОГРНИП' : 'ОГРН'} error={fieldErrors.ogrn}>
													<Input
														value={form.ogrn}
														onChange={handleFieldChange('ogrn')}
														bg={inputBg}
														borderColor={borderColor}
														borderRadius="12px"
														maxLength={getRequisiteLength('ogrn', form.entityType)}
													/>
												</Field>
												<Field label="ОКПО" error={fieldErrors.okpo}>
													<Input
														value={form.okpo}
														onChange={handleFieldChange('okpo')}
														bg={inputBg}
														borderColor={borderColor}
														borderRadius="12px"
														maxLength={getRequisiteLength('okpo', form.entityType)}
													/>
												</Field>
											</Grid>
										</Stack>
									</Stack>
								</TabPanel>

								<TabPanel px="0">
									<Stack spacing="14px">
										{submitStates.additional === 'success' ? (
											<Alert status="success" borderRadius="12px">
												<AlertIcon />
												<Text>
													Заявка по контактам отправлена. Можно перейти в другую вкладку и отправить еще одну заявку.
												</Text>
											</Alert>
										) : null}
										{requestErrors.additional ? (
											<Alert status="error" borderRadius="12px">
												<AlertIcon />
												<Text>{requestErrors.additional}</Text>
											</Alert>
										) : null}
										<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="14px">
											<Field label="Юридический адрес" error={fieldErrors.legalAddress}>
												<Input value={form.legalAddress} onChange={handleFieldChange('legalAddress')} bg={inputBg} borderColor={borderColor} borderRadius="12px" />
											</Field>
											<Field label="Email компании" error={fieldErrors.orgEmail}>
												<Input value={form.orgEmail} onChange={handleFieldChange('orgEmail')} bg={inputBg} borderColor={borderColor} borderRadius="12px" />
											</Field>
											<Field label="ФИО ответственного" error={fieldErrors.responsibleFullName}>
												<Input value={form.responsibleFullName} onChange={handleFieldChange('responsibleFullName')} bg={inputBg} borderColor={borderColor} borderRadius="12px" />
											</Field>
											<Field label="Должность ответственного" error={fieldErrors.responsiblePosition}>
												<Input value={form.responsiblePosition} onChange={handleFieldChange('responsiblePosition')} bg={inputBg} borderColor={borderColor} borderRadius="12px" />
											</Field>
											<Field label="Телефон ответственного" error={fieldErrors.responsiblePhone}>
												<Input value={form.responsiblePhone} onChange={handleFieldChange('responsiblePhone')} bg={inputBg} borderColor={borderColor} borderRadius="12px" />
											</Field>
											<Field label="Email ответственного" error={fieldErrors.responsibleEmail}>
												<Input value={form.responsibleEmail} onChange={handleFieldChange('responsibleEmail')} bg={inputBg} borderColor={borderColor} borderRadius="12px" />
											</Field>
										</Grid>
									</Stack>
								</TabPanel>

								<TabPanel px="0">
									<Stack spacing="14px">
										{submitStates.director === 'success' ? (
											<Alert status="success" borderRadius="12px">
												<AlertIcon />
												<Text>
													Заявка на смену руководителя отправлена. Поддержка проверит аккаунт и подтвердит передачу прав.
												</Text>
											</Alert>
										) : null}
										{requestErrors.director ? (
											<Alert status="error" borderRadius="12px">
												<AlertIcon />
												<Text>{requestErrors.director}</Text>
											</Alert>
										) : null}
										<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="14px">
											<Field label="Email аккаунта нового руководителя" error={fieldErrors.newDirectorEmail}>
												<Input value={form.newDirectorEmail} onChange={handleFieldChange('newDirectorEmail')} placeholder="director@example.ru" bg={inputBg} borderColor={borderColor} borderRadius="12px" />
											</Field>
											<Field label="ФИО нового руководителя" error={fieldErrors.newDirectorFullName}>
												<Input value={form.newDirectorFullName} onChange={handleFieldChange('newDirectorFullName')} placeholder="Иванов Иван Иванович" bg={inputBg} borderColor={borderColor} borderRadius="12px" />
											</Field>
										</Grid>
									</Stack>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Stack>
				</ModalBody>

				<ModalFooter gap="10px">
					<Button variant="ghost" borderRadius="12px" onClick={onClose} isDisabled={isSending}>
						Отмена
					</Button>
					<Button colorScheme="recode" borderRadius="12px" onClick={handleSubmit} isLoading={isSending}>
						Отправить заявку
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
