import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Icon,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
	useToast,
} from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import TablesTableRow from 'components/Tables/TablesTableRow';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { getCurrentUser } from 'services/auth';
import {
	activateOrganizationEmployee,
	addExistingOrganizationEmployee,
	createOrganizationEmployee,
	deactivateOrganizationEmployee,
	getOrganizationDetails,
	getOrganizationEmployees,
	transferTokensToEmployee,
} from 'services/organization';

const defaultCaptions = ['Пользователь', 'Роль', 'Статус', 'Остаток токенов', ''];
const defaultColumnKeys = ['user', 'role', 'status', 'tokens', 'actions'];
const ROLE_LABELS = {
	director: 'Руководитель',
	employee: 'Сотрудник',
};
const STATUS_LABELS = {
	active: 'Активен',
	invited: 'Приглашен',
	disabled: 'Отключен',
};

function formatTokenValue(value) {
	return new Intl.NumberFormat('ru-RU').format(Number(value) || 0).replace(/,/g, ' ');
}

function getEmployeeName(employee) {
	const parts = [employee.surname, employee.name].filter(Boolean);
	return parts.length > 0 ? parts.join(' ') : employee.email;
}

function mapEmployee(employee) {
	return {
		organizationMemberID: employee.organization_member_id,
		name: getEmployeeName(employee),
		email: employee.email,
		subdomain: `ID ${employee.user_id}`,
		domain: ROLE_LABELS[employee.role] || employee.role || 'Сотрудник',
		status: STATUS_LABELS[employee.status] || employee.status || 'Неизвестно',
		rawStatus: employee.status,
		date: formatTokenValue(employee.tokens_remain),
		tokensRemain: employee.tokens_remain || 0,
	};
}

function getErrorMessage(error) {
	const message = error.message || '';
	if (message.includes('Forbidden')) return 'Недостаточно прав для управления сотрудниками';
	if (message.includes('employee email already exists'))
		return 'Сотрудник с таким Email уже существует';
	if (message.includes('employee not found')) return 'Сотрудник не найден';
	if (message.includes('already disabled')) return 'Сотрудник уже отключен';
	if (message.includes('already active')) return 'Сотрудник уже активирован';
	if (message.includes('not enough organization tokens'))
		return 'Недостаточно токенов на счете организации';
	if (message.includes('Invalid input')) return 'Проверьте заполнение формы, есть ошибки';
	return message || 'Не удалось выполнить действие';
}

const EmployeeTable = ({
	title = 'Таблица сотрудников',
	captions = defaultCaptions,
	withPageContainer = true,
	hiddenColumns = [],
	showFullListButton = false,
	onFullListClick,
	fullListPath = '/employees',
	fixedHeight = '550px',
	enforceOrganizationGuard = true,
}) => {
	const history = useHistory();
	const textColor = useColorModeValue('gray.700', 'white');
	const cardBg = useColorModeValue('white', 'gray.700');
	const glassBg = useColorModeValue('rgba(255, 255, 255, 0.92)', 'rgba(26, 32, 44, 0.9)');
	const sectionBg = useColorModeValue('rgba(255, 255, 255, 0.72)', 'rgba(26, 32, 44, 0.65)');
	const modalSubtitleColor = useColorModeValue('gray.500', 'gray.300');
	const modalInputBg = useColorModeValue('white', 'whiteAlpha.100');
	const modalInputBorderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const toast = useToast();
	const hiddenColumnsSet = new Set(hiddenColumns);
	const scrollRef = useRef(null);

	const [rows, setRows] = useState([]);
	const [organizationBalance, setOrganizationBalance] = useState(0);
	const [hasScrollbar, setHasScrollbar] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isExistingModalOpen, setIsExistingModalOpen] = useState(false);
	const [transferTarget, setTransferTarget] = useState(null);
	const [firstName, setFirstName] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [existingEmail, setExistingEmail] = useState('');
	const [tokens, setTokens] = useState(0);
	const [formError, setFormError] = useState('');

	const loadEmployees = useCallback(async () => {
		setIsLoading(true);
		setError('');

		try {
			if (enforceOrganizationGuard) {
				const user = await getCurrentUser();
				if (!user.has_organization) {
					history.replace('/lk/company/reg');
					return;
				}
			}

			const [employeePayload, organizationPayload] = await Promise.all([
				getOrganizationEmployees(),
				getOrganizationDetails().catch(() => null),
			]);
			setRows((employeePayload.employees || []).map(mapEmployee));
			setOrganizationBalance(organizationPayload?.tokens_remain || 0);
		} catch (requestError) {
			setError(getErrorMessage(requestError));
		} finally {
			setIsLoading(false);
		}
	}, [enforceOrganizationGuard, history]);

	useEffect(() => {
		loadEmployees();
	}, [loadEmployees]);

	useEffect(() => {
		const element = scrollRef.current;
		if (!element) return;
		let frameId = null;
		let lastHasScrollbar = null;

		const updateScrollbarState = () => {
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
			}
			frameId = requestAnimationFrame(() => {
				const nextHasScrollbar = element.scrollHeight > element.clientHeight;
				if (nextHasScrollbar !== lastHasScrollbar) {
					lastHasScrollbar = nextHasScrollbar;
					setHasScrollbar((prev) => (prev === nextHasScrollbar ? prev : nextHasScrollbar));
				}
			});
		};

		updateScrollbarState();

		const resizeObserver = new ResizeObserver(updateScrollbarState);
		resizeObserver.observe(element);
		window.addEventListener('resize', updateScrollbarState);

		return () => {
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
			}
			resizeObserver.disconnect();
			window.removeEventListener('resize', updateScrollbarState);
		};
	}, [rows, hiddenColumns]);

	const visibleCaptions = captions.filter((_, idx) => {
		const columnKey = defaultColumnKeys[idx] ?? `column-${idx}`;
		return !hiddenColumnsSet.has(columnKey);
	});
	const normalizedVisibleCaptions = visibleCaptions.map((caption, idx) => {
		const visibleColumnKeys = defaultColumnKeys.filter((key) => !hiddenColumnsSet.has(key));
		return visibleColumnKeys[idx] === 'actions' ? 'Управление' : caption;
	});

	const resolvedFullListPath = fullListPath.startsWith('/lk/')
		? fullListPath
		: `/lk${fullListPath.startsWith('/') ? fullListPath : `/${fullListPath}`}`;
	const handleFullListClick = onFullListClick ?? (() => history.push(resolvedFullListPath));

	const resetCreateForm = () => {
		setFirstName('');
		setSurname('');
		setEmail('');
		setFormError('');
	};

	const closeCreateModal = () => {
		setIsCreateModalOpen(false);
		resetCreateForm();
	};

	const closeExistingModal = () => {
		setIsExistingModalOpen(false);
		setExistingEmail('');
		setFormError('');
	};

	const closeTransferModal = () => {
		setTransferTarget(null);
		setTokens(0);
		setFormError('');
	};

	const emailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

	const validateCreateForm = () => {
		if (!firstName.trim() || !surname.trim() || !email.trim()) {
			return 'Заполните имя, фамилию и email.';
		}
		if (!emailIsValid(email)) {
			return 'Укажите корректный email.';
		}
		return '';
	};

	const handleCreateEmployee = async () => {
		const validationError = validateCreateForm();
		if (validationError) {
			setFormError(validationError);
			return;
		}

		setIsSaving(true);
		setFormError('');
		try {
			await createOrganizationEmployee({
				email: email.trim(),
				name: firstName.trim(),
				surname: surname.trim(),
			});
			closeCreateModal();
			await loadEmployees();
			toast({
				title: 'Сотрудник успешно добавлен',
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'top-right',
			});
		} catch (requestError) {
			setFormError(getErrorMessage(requestError));
		} finally {
			setIsSaving(false);
		}
	};

	const handleAddExistingEmployee = async () => {
		if (!emailIsValid(existingEmail)) {
			setFormError('Укажите корректный email.');
			return;
		}

		setIsSaving(true);
		setFormError('');
		try {
			await addExistingOrganizationEmployee(existingEmail.trim());
			closeExistingModal();
			await loadEmployees();
			toast({
				title: 'Сотрудник успешно добавлен',
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'top-right',
			});
		} catch (requestError) {
			setFormError(getErrorMessage(requestError));
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeactivate = async (row) => {
		setIsSaving(true);
		setError('');
		try {
			await deactivateOrganizationEmployee(row.email);
			await loadEmployees();
		} catch (requestError) {
			setError(getErrorMessage(requestError));
		} finally {
			setIsSaving(false);
		}
	};

	const handleActivate = async (row) => {
		setIsSaving(true);
		setError('');
		try {
			await activateOrganizationEmployee(row.email);
			await loadEmployees();
		} catch (requestError) {
			setError(getErrorMessage(requestError));
		} finally {
			setIsSaving(false);
		}
	};

	const handleTransferTokens = async () => {
		if (!transferTarget || tokens <= 0) {
			setFormError('Укажите количество токенов больше нуля.');
			return;
		}
		if (tokens > organizationBalance) {
			setFormError('Недостаточно токенов на счете организации.');
			return;
		}

		setIsSaving(true);
		setFormError('');
		try {
			await transferTokensToEmployee(transferTarget.organizationMemberID, tokens);
			closeTransferModal();
			await loadEmployees();
		} catch (requestError) {
			setFormError(getErrorMessage(requestError));
		} finally {
			setIsSaving(false);
		}
	};

	const renderEmailModal = () => (
		<Modal isOpen={isExistingModalOpen} onClose={closeExistingModal} isCentered size="xl">
			<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
			<ModalContent
				bg={glassBg}
				border="1px solid"
				borderColor="whiteAlpha.400"
				borderRadius="20px"
				overflow="hidden"
			>
				<ModalHeader
					px="32px"
					py="24px"
					borderBottom="1px solid"
					borderColor="blackAlpha.200"
					bg={sectionBg}
				>
					<Text fontSize="24px" fontWeight="600" color={textColor} lineHeight="1.1">
						Привязать существующего сотрудника
					</Text>
					<Text mt="6px" fontSize="14px" color={modalSubtitleColor}>
						Введите Email уже зарегистрированного пользователя.
					</Text>
				</ModalHeader>
				<ModalBody px="32px" py="24px" bg={sectionBg}>
					<Flex direction="column" gap="14px">
						{formError ? (
							<Alert status="error" borderRadius="12px">
								<AlertIcon />
								<Text>{formError}</Text>
							</Alert>
						) : null}
						<FormControl isInvalid={Boolean(formError) && !emailIsValid(existingEmail)}>
							<FormLabel fontSize="14px" color={modalSubtitleColor} mb="8px">
								Email
							</FormLabel>
							<Input
								type="email"
								value={existingEmail}
								onChange={(event) => setExistingEmail(event.target.value)}
								placeholder="name@company.ru"
								bg={modalInputBg}
								borderColor={modalInputBorderColor}
								borderRadius="12px"
								h="46px"
							/>
							<FormErrorMessage>Укажите корректный email</FormErrorMessage>
						</FormControl>
					</Flex>
				</ModalBody>
				<ModalFooter
					px="32px"
					py="20px"
					borderTop="1px solid"
					borderColor="blackAlpha.200"
					bg={sectionBg}
				>
					<Flex w="100%" justify="space-between" gap="12px">
						<Button variant="ghost" onClick={closeExistingModal}>
							Отмена
						</Button>
						<Button colorScheme="recode" onClick={handleAddExistingEmployee} isLoading={isSaving}>
							Отправить запрос
						</Button>
					</Flex>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);

	const tableContent = (
		<Card
			h={fixedHeight}
			minH={fixedHeight}
			display="flex"
			flexDirection="column"
			overflow="hidden"
		>
			<CardHeader p="6px 0px 22px 0px">
				<Flex align="center" justify="space-between" gap="12px" width="100%">
					<Text fontSize="xl" color={textColor} fontWeight="bold">
						{title}
					</Text>
					{showFullListButton && (
						<Button
							colorScheme="recode"
							borderColor="recode.300"
							color="recode.300"
							variant="outline"
							fontSize="xs"
							p="8px 30px"
							onClick={handleFullListClick}
						>
							Весь список
						</Button>
					)}
				</Flex>
			</CardHeader>
			<CardBody style={{ flexDirection: 'column' }} flex="1" minH="0">
				{error ? (
					<Alert status="error" borderRadius="12px" mb="14px">
						<AlertIcon />
						<Flex align="center" justify="space-between" gap="12px" w="100%">
							<Text>{error}</Text>
							<Button size="sm" onClick={loadEmployees}>
								Повторить
							</Button>
						</Flex>
					</Alert>
				) : null}

				<Box
					ref={scrollRef}
					w="100%"
					flex="1"
					minH="0"
					overflow="auto"
					pr={{ base: '0px', lg: hasScrollbar ? '14px' : '0px' }}
					sx={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
				>
					{isLoading ? (
						<Flex h="100%" minH="220px" align="center" justify="center">
							<Spinner color="recode.300" size="lg" />
						</Flex>
					) : (
						<Table variant="simple" color={textColor} minW={{ base: '640px', md: '100%' }}>
							<Thead position="sticky" top="0" zIndex="1" bg={cardBg}>
								<Tr my=".8rem" pl="0px" color="gray.400">
									{normalizedVisibleCaptions.map((caption, idx) => (
										<Th
											color="gray.400"
											key={idx}
											ps={idx === 0 ? '0px' : null}
											position="sticky"
											top="0"
											zIndex="1"
											bg={cardBg}
										>
											{caption}
										</Th>
									))}
								</Tr>
							</Thead>
							<Tbody>
								{rows.length === 0 ? (
									<Tr>
										<Td colSpan={visibleCaptions.length} ps="0px" border="none">
											<Text fontSize="sm" color="gray.500" fontWeight="normal">
												Сотрудников пока нет
											</Text>
										</Td>
									</Tr>
								) : (
									rows.map((row) => (
										<TablesTableRow
											key={`${row.email}-${row.organizationMemberID}`}
											name={row.name}
											logo={row.logo}
											email={row.email}
											subdomain={row.subdomain}
											domain={row.domain}
											status={row.status}
											date={row.date}
											hiddenColumns={hiddenColumns}
											onEdit={() => setTransferTarget(row)}
											onActivate={row.rawStatus === 'disabled' ? () => handleActivate(row) : null}
											onDeactivate={
												row.rawStatus === 'disabled' ? null : () => handleDeactivate(row)
											}
										/>
									))
								)}
							</Tbody>
						</Table>
					)}
				</Box>
				<Flex gap="20px" wrap="wrap">
					<Button
						leftIcon={<Icon as={FaPlus} boxSize="10px" />}
						variant="solid"
						size="lg"
						height="32px"
						width="220px"
						color="recode.300"
						fontSize="sm"
						_hover={{ bg: 'transparent', color: 'recode.300' }}
						_active={{ bg: 'transparent' }}
						p="0px"
						fontWeight="bold"
						onClick={() => setIsCreateModalOpen(true)}
					>
						СОЗДАТЬ СОТРУДНИКА
					</Button>
					<Button
						variant="ghost"
						bg="transparent"
						border="none"
						color="gray.600"
						fontSize="sm"
						_hover={{ bg: 'transparent', color: 'gray.500' }}
						_active={{ bg: 'transparent' }}
						p="0px"
						height="auto"
						fontWeight="bold"
						onClick={() => setIsExistingModalOpen(true)}
					>
						Привязать существующего
					</Button>
				</Flex>
			</CardBody>

			<Modal isOpen={isCreateModalOpen} onClose={closeCreateModal} isCentered size="2xl">
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent
					bg={glassBg}
					border="1px solid"
					borderColor="whiteAlpha.400"
					borderRadius="20px"
					overflow="hidden"
				>
					<ModalHeader
						px="32px"
						py="24px"
						borderBottom="1px solid"
						borderColor="blackAlpha.200"
						bg={sectionBg}
					>
						<Text fontSize="24px" fontWeight="600" color={textColor} lineHeight="1.1">
							Создание профиля сотрудника
						</Text>
						<Text mt="6px" fontSize="14px" color={modalSubtitleColor}>
							Пароль будет сгенерирован автоматически и отправлен на указанную почту сотрудника.
						</Text>
					</ModalHeader>
					<ModalBody px="32px" py="24px" bg={sectionBg}>
						<Flex direction="column" gap="14px">
							{formError ? (
								<Alert status="error" borderRadius="12px">
									<AlertIcon />
									<Text>{formError}</Text>
								</Alert>
							) : null}
							<FormControl isInvalid={Boolean(formError) && !surname.trim()}>
								<FormLabel fontSize="14px" color={modalSubtitleColor} mb="8px">
									Фамилия
								</FormLabel>
								<Input
									value={surname}
									onChange={(event) => setSurname(event.target.value)}
									placeholder="Иванов"
									bg={modalInputBg}
									borderColor={modalInputBorderColor}
									borderRadius="12px"
									h="46px"
								/>
								<FormErrorMessage>Укажите фамилию</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={Boolean(formError) && !firstName.trim()}>
								<FormLabel fontSize="14px" color={modalSubtitleColor} mb="8px">
									Имя
								</FormLabel>
								<Input
									value={firstName}
									onChange={(event) => setFirstName(event.target.value)}
									placeholder="Иван"
									bg={modalInputBg}
									borderColor={modalInputBorderColor}
									borderRadius="12px"
									h="46px"
								/>
								<FormErrorMessage>Укажите имя</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={Boolean(formError) && !email.trim()}>
								<FormLabel fontSize="14px" color={modalSubtitleColor} mb="8px">
									Email
								</FormLabel>
								<Input
									type="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									placeholder="name@company.ru"
									bg={modalInputBg}
									borderColor={modalInputBorderColor}
									borderRadius="12px"
									h="46px"
								/>
								<FormErrorMessage>Укажите email</FormErrorMessage>
							</FormControl>
						</Flex>
					</ModalBody>
					<ModalFooter
						px="32px"
						py="20px"
						borderTop="1px solid"
						borderColor="blackAlpha.200"
						bg={sectionBg}
					>
						<Flex w="100%" justify="space-between" gap="12px">
							<Button variant="ghost" onClick={closeCreateModal}>
								Отмена
							</Button>
							<Button colorScheme="recode" onClick={handleCreateEmployee} isLoading={isSaving}>
								Создать
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{renderEmailModal()}

			<Modal isOpen={Boolean(transferTarget)} onClose={closeTransferModal} isCentered size="xl">
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent
					bg={glassBg}
					border="1px solid"
					borderColor="whiteAlpha.400"
					borderRadius="20px"
					overflow="hidden"
				>
					<ModalHeader
						px="32px"
						py="24px"
						borderBottom="1px solid"
						borderColor="blackAlpha.200"
						bg={sectionBg}
					>
						<Text fontSize="24px" fontWeight="600" color={textColor} lineHeight="1.1">
							Перевести токены
						</Text>
						<Text mt="6px" fontSize="14px" color={modalSubtitleColor}>
							{transferTarget?.name}
						</Text>
					</ModalHeader>
					<ModalBody px="32px" py="24px" bg={sectionBg}>
						<Flex direction="column" gap="14px">
							{formError ? (
								<Alert status="error" borderRadius="12px">
									<AlertIcon />
									<Text>{formError}</Text>
								</Alert>
							) : null}
							<FormControl>
								<FormLabel fontSize="14px" color={modalSubtitleColor} mb="8px">
									Токены: {formatTokenValue(tokens)}
								</FormLabel>
								<Slider
									value={tokens}
									onChange={(value) => setTokens(value)}
									min={0}
									max={organizationBalance}
									step={100}
									colorScheme="recode"
								>
									<SliderTrack bg="blackAlpha.200">
										<SliderFilledTrack />
									</SliderTrack>
									<SliderThumb boxSize={5} />
								</Slider>
								<Text mt="8px" fontSize="12px" color={modalSubtitleColor}>
									Доступно на счете организации: {formatTokenValue(organizationBalance)}
								</Text>
							</FormControl>
						</Flex>
					</ModalBody>
					<ModalFooter
						px="32px"
						py="20px"
						borderTop="1px solid"
						borderColor="blackAlpha.200"
						bg={sectionBg}
					>
						<Flex w="100%" justify="space-between" gap="12px">
							<Button variant="ghost" onClick={closeTransferModal}>
								Отмена
							</Button>
							<Button colorScheme="recode" onClick={handleTransferTokens} isLoading={isSaving}>
								Перевести
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Card>
	);

	if (!withPageContainer) {
		return tableContent;
	}

	return (
		<Flex direction="column" my={{ base: '120px', md: '75px' }} h="85vh">
			{tableContent}
		</Flex>
	);
};

export default EmployeeTable;
