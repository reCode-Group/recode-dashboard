// Chakra imports
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
	Select,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Stack,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import TablesTableRow from 'components/Tables/TablesTableRow';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { tablesTableData } from 'variables/general';

const defaultCaptions = ['Пользователь', 'Роль', 'Статус', 'Остаток токенов', ''];
const defaultColumnKeys = ['user', 'role', 'status', 'tokens', 'actions'];
const TOTAL_EMPLOYEE_TOKENS = 50000;
const ROLE_EMPLOYEE = 'Сотрудник';
const STATUS_ACTIVE = 'Активен';
const STATUS_INACTIVE = 'Неактивен';

function parseTokenValue(value) {
	const numericValue = Number(String(value ?? '').replace(/[^\d]/g, ''));
	return Number.isFinite(numericValue) ? numericValue : 0;
}

function formatTokenValue(value) {
	return new Intl.NumberFormat('ru-RU').format(value).replace(/,/g, ' ');
}

const EmployeeTable = ({
	title = 'Таблица сотрудников',
	captions = defaultCaptions,
	data = tablesTableData,
	withPageContainer = true,
	hiddenColumns = [],
	showFullListButton = false,
	onFullListClick,
	fullListPath = '/employees',
	fixedHeight = '550px',
}) => {
	const history = useHistory();
	const textColor = useColorModeValue('gray.700', 'white');
	const cardBg = useColorModeValue('white', 'gray.700');
	const glassBg = useColorModeValue('rgba(255, 255, 255, 0.92)', 'rgba(26, 32, 44, 0.9)');
	const sectionBg = useColorModeValue('rgba(255, 255, 255, 0.72)', 'rgba(26, 32, 44, 0.65)');
	const modalSubtitleColor = useColorModeValue('gray.500', 'gray.300');
	const hiddenColumnsSet = new Set(hiddenColumns);
	const scrollRef = useRef(null);

	const [rows, setRows] = useState(data);
	const [hasScrollbar, setHasScrollbar] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState('create');
	const [editingRowEmail, setEditingRowEmail] = useState('');
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role] = useState(ROLE_EMPLOYEE);
	const [status, setStatus] = useState(STATUS_ACTIVE);
	const [tokens, setTokens] = useState(0);
	const [formError, setFormError] = useState('');

	useEffect(() => {
		setRows(data);
	}, [data]);

	useEffect(() => {
		const element = scrollRef.current;
		if (!element) return;

		const updateScrollbarState = () => {
			setHasScrollbar(element.scrollHeight > element.clientHeight);
		};

		updateScrollbarState();

		const resizeObserver = new ResizeObserver(updateScrollbarState);
		resizeObserver.observe(element);
		window.addEventListener('resize', updateScrollbarState);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener('resize', updateScrollbarState);
		};
	}, [rows, hiddenColumns]);

	const usedTokens = useMemo(() => rows.reduce((sum, row) => sum + parseTokenValue(row.date), 0), [
		rows,
	]);
	const editingOriginalTokens = useMemo(() => {
		if (modalMode !== 'edit' || !editingRowEmail) return 0;
		const editingRow = rows.find((row) => row.email === editingRowEmail);
		return editingRow ? parseTokenValue(editingRow.date) : 0;
	}, [editingRowEmail, modalMode, rows]);
	const availableTokens = Math.max(
		TOTAL_EMPLOYEE_TOKENS - usedTokens + (modalMode === 'edit' ? editingOriginalTokens : 0),
		0
	);

	const visibleCaptions = captions.filter((_, idx) => {
		const columnKey = defaultColumnKeys[idx] ?? `column-${idx}`;
		return !hiddenColumnsSet.has(columnKey);
	});

	const resolvedFullListPath = fullListPath.startsWith('/admin/')
		? fullListPath
		: `/admin${fullListPath.startsWith('/') ? fullListPath : `/${fullListPath}`}`;
	const handleFullListClick = onFullListClick ?? (() => history.push(resolvedFullListPath));

	const resetForm = () => {
		setFullName('');
		setEmail('');
		setPassword('');
		setStatus(STATUS_ACTIVE);
		setTokens(0);
		setFormError('');
		setEditingRowEmail('');
	};

	const closeModal = () => {
		setIsModalOpen(false);
		resetForm();
	};

	const openCreateModal = () => {
		setModalMode('create');
		resetForm();
		setIsModalOpen(true);
	};

	const openEditModal = (row) => {
		setModalMode('edit');
		setEditingRowEmail(row.email);
		setFullName(row.name || '');
		setEmail(row.email || '');
		setPassword('');
		setStatus(row.status || STATUS_ACTIVE);
		setTokens(parseTokenValue(row.date));
		setFormError('');
		setIsModalOpen(true);
	};

	const validateForm = () => {
		if (!fullName.trim() || !email.trim()) {
			return 'Заполните ФИО и email.';
		}
		if (modalMode === 'create' && !password.trim()) {
			return 'Укажите пароль.';
		}
		const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
		if (!emailIsValid) {
			return 'Укажите корректный email.';
		}
		if (tokens > availableTokens) {
			return 'Недостаточно токенов для распределения.';
		}
		if (tokens <= 0) {
			return 'Укажите количество токенов больше нуля.';
		}
		const duplicateEmail = rows.some((row) => {
			if (modalMode === 'edit' && row.email === editingRowEmail) return false;
			return String(row.email).toLowerCase() === email.trim().toLowerCase();
		});
		if (duplicateEmail) {
			return 'Сотрудник с таким email уже существует.';
		}
		return '';
	};

	const handleSubmitModal = () => {
		const validationError = validateForm();
		if (validationError) {
			setFormError(validationError);
			return;
		}

		if (modalMode === 'create') {
			const newEmployee = {
				name: fullName.trim(),
				email: email.trim(),
				subdomain: 'Права ограничены',
				domain: role,
				status,
				date: formatTokenValue(tokens),
			};
			setRows((prev) => [newEmployee, ...prev]);
		} else {
			setRows((prev) =>
				prev.map((row) =>
					row.email === editingRowEmail
						? {
								...row,
								name: fullName.trim(),
								email: email.trim(),
								domain: role,
								status,
								date: formatTokenValue(tokens),
						  }
						: row
				)
			);
		}

		closeModal();
	};

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
				<Box
					ref={scrollRef}
					w="100%"
					flex="1"
					minH="0"
					overflow="auto"
					pr={{ base: '0px', lg: hasScrollbar ? '14px' : '0px' }}
					sx={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
				>
					<Table variant="simple" color={textColor} minW={{ base: '640px', md: '100%' }}>
						<Thead position="sticky" top="0" zIndex="1" bg={cardBg}>
							<Tr my=".8rem" pl="0px" color="gray.400">
								{visibleCaptions.map((caption, idx) => (
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
							{rows.map((row) => (
								<TablesTableRow
									key={`${row.email}-${row.name}`}
									name={row.name}
									logo={row.logo}
									email={row.email}
									subdomain={row.subdomain}
									domain={row.domain}
									status={row.status}
									date={row.date}
									hiddenColumns={hiddenColumns}
									onEdit={() => openEditModal(row)}
								/>
							))}
						</Tbody>
					</Table>
				</Box>
				<Flex mt="18px">
					<Button
						leftIcon={<Icon as={FaPlus} boxSize="10px" />}
						variant="ghost"
						bg="transparent"
						border="none"
						color="recode.300"
						fontSize="xs"
						_hover={{ bg: 'transparent', color: 'recode.300' }}
						_active={{ bg: 'transparent' }}
						p="0px"
						height="auto"
						fontWeight="bold"
						onClick={openCreateModal}
					>
						ДОБАВИТЬ СОТРУДНИКА
					</Button>
				</Flex>
			</CardBody>

			<Modal isOpen={isModalOpen} onClose={closeModal} isCentered size="2xl">
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent
					bg={glassBg}
					border="1px solid"
					borderColor="whiteAlpha.400"
					borderRadius="20px"
					boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
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
							{modalMode === 'create' ? 'Добавить сотрудника' : 'Редактировать сотрудника'}
						</Text>
						<Text mt="6px" fontSize="14px" color={modalSubtitleColor}>
							{modalMode === 'create'
								? 'Распределите токены сотруднику из общего лимита компании.'
								: 'Обновите данные сотрудника и статус аккаунта.'}
						</Text>
					</ModalHeader>
					<ModalBody px="32px" py="24px" bg={sectionBg}>
						<Stack spacing="14px">
							{formError ? (
								<Alert status="error" borderRadius="12px">
									<AlertIcon />
									<Text>{formError}</Text>
								</Alert>
							) : null}

							<FormControl isInvalid={Boolean(formError) && !fullName.trim()}>
								<FormLabel fontSize="14px" color={modalSubtitleColor} mb="8px">
									ФИО
								</FormLabel>
								<Input
									value={fullName}
									onChange={(event) => setFullName(event.target.value)}
									placeholder="Иванов Иван Иванович"
									bg="white"
									borderRadius="12px"
									h="46px"
								/>
								{Boolean(formError) && !fullName.trim() ? (
									<FormErrorMessage>Укажите ФИО</FormErrorMessage>
								) : null}
							</FormControl>

							<FormControl>
								<FormLabel fontSize="14px" color={modalSubtitleColor} mb="8px">
									Роль
								</FormLabel>
								<Select value={role} isDisabled bg="white" borderRadius="12px" h="46px">
									<option value={ROLE_EMPLOYEE}>{ROLE_EMPLOYEE}</option>
								</Select>
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
									bg="white"
									borderRadius="12px"
									h="46px"
								/>
								{Boolean(formError) && !email.trim() ? (
									<FormErrorMessage>Укажите email</FormErrorMessage>
								) : null}
							</FormControl>

							<FormControl
								isInvalid={Boolean(formError) && modalMode === 'create' && !password.trim()}
							>
								<FormLabel fontSize="14px" color={modalSubtitleColor} mb="8px">
									Пароль
								</FormLabel>
								<Input
									type="password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									placeholder={
										modalMode === 'create'
											? 'Введите пароль'
											: 'Оставьте пустым, если менять не нужно'
									}
									bg="white"
									borderRadius="12px"
									h="46px"
								/>
								{Boolean(formError) && modalMode === 'create' && !password.trim() ? (
									<FormErrorMessage>Укажите пароль</FormErrorMessage>
								) : null}
							</FormControl>

							<FormControl>
								<FormLabel fontSize="14px" color={modalSubtitleColor} mb="8px">
									Статус аккаунта
								</FormLabel>
								<Select
									value={status}
									onChange={(event) => setStatus(event.target.value)}
									bg="white"
									borderRadius="12px"
									h="46px"
								>
									<option value={STATUS_ACTIVE}>Активный</option>
									<option value={STATUS_INACTIVE}>Неактивный</option>
								</Select>
							</FormControl>

							<FormControl>
								<FormLabel fontSize="14px" color={modalSubtitleColor} mb="8px">
									Токены: {formatTokenValue(tokens)}
								</FormLabel>
								<Slider
									value={tokens}
									onChange={(value) => setTokens(value)}
									min={0}
									max={availableTokens}
									step={100}
									colorScheme="recode"
								>
									<SliderTrack bg="blackAlpha.200">
										<SliderFilledTrack />
									</SliderTrack>
									<SliderThumb boxSize={5} />
								</Slider>
								<Text mt="8px" fontSize="12px" color={modalSubtitleColor}>
									Доступно для распределения: {formatTokenValue(availableTokens)} /{' '}
									{formatTokenValue(TOTAL_EMPLOYEE_TOKENS)}
								</Text>
							</FormControl>
						</Stack>
					</ModalBody>
					<ModalFooter
						px="32px"
						py="20px"
						borderTop="1px solid"
						borderColor="blackAlpha.200"
						bg={sectionBg}
					>
						<Flex w="100%" justify="space-between" gap="12px">
							<Button variant="ghost" onClick={closeModal}>
								Отмена
							</Button>
							<Button colorScheme="recode" onClick={handleSubmitModal}>
								{modalMode === 'create' ? 'Добавить' : 'Сохранить'}
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
