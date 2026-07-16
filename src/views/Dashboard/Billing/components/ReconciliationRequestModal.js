import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Progress,
	Stack,
	Text,
	Textarea,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { sendSupportRequest } from 'services/supportEmail';

const MAX_COMMENT_LENGTH = 1000;

function toDateInputValue(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function getDefaultPeriod() {
	const today = new Date();
	return {
		dateFrom: `${today.getFullYear()}-01-01`,
		dateTo: toDateInputValue(today),
	};
}

function formatDate(value) {
	const [year, month, day] = value.split('-');
	return [day, month, year].filter(Boolean).join('.');
}

function getOrganizationName(organization) {
	return organization?.short_name || organization?.full_name || 'Организация';
}

function buildSupportMessage({ organization, user, dateFrom, dateTo, comment }) {
	const lines = [
		'Тип документа: Акт сверки взаиморасчётов',
		`Период: ${formatDate(dateFrom)} — ${formatDate(dateTo)}`,
		`Организация: ${organization.full_name || getOrganizationName(organization)}`,
		`ID организации: ${organization.id}`,
		`ИНН: ${organization.inn || 'не указан'}`,
	];

	if (organization.kpp) {
		lines.push(`КПП: ${organization.kpp}`);
	}

	lines.push(
		`Email для ответа: ${user.email}`,
		'Формат документа: PDF',
		'Источник запроса: раздел «Отчёты» личного кабинета.'
	);

	if (comment.trim()) {
		lines.push(`Комментарий пользователя: ${comment.trim()}`);
	}

	lines.push('Пожалуйста, подготовьте акт сверки и отправьте его на указанный email.');
	return lines.join('\n');
}

export default function ReconciliationRequestModal({ isOpen, onClose, user, organization }) {
	const defaultPeriod = useMemo(getDefaultPeriod, []);
	const [dateFrom, setDateFrom] = useState(defaultPeriod.dateFrom);
	const [dateTo, setDateTo] = useState(defaultPeriod.dateTo);
	const [comment, setComment] = useState('');
	const [formError, setFormError] = useState('');
	const [submitState, setSubmitState] = useState('idle');
	const [requestError, setRequestError] = useState('');

	const titleColor = useColorModeValue('gray.800', 'white');
	const subtitleColor = useColorModeValue('gray.500', 'gray.300');
	const modalBg = useColorModeValue('white', 'gray.800');
	const dividerColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
	const detailsBg = useColorModeValue('gray.50', 'whiteAlpha.100');
	const inputBg = useColorModeValue('white', 'whiteAlpha.100');
	const inputBorderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const successAlertBg = useColorModeValue('green.50', 'green.900');
	const successAlertColor = useColorModeValue('green.700', 'green.100');

	const isSending = submitState === 'sending';
	const isSuccess = submitState === 'success';
	const today = defaultPeriod.dateTo;

	useEffect(() => {
		if (!isOpen) return;

		const nextPeriod = getDefaultPeriod();
		setDateFrom(nextPeriod.dateFrom);
		setDateTo(nextPeriod.dateTo);
		setComment('');
		setFormError('');
		setSubmitState('idle');
		setRequestError('');
	}, [isOpen]);

	const validate = () => {
		if (!dateFrom || !dateTo) return 'Укажите начало и окончание периода.';
		if (dateFrom > dateTo) return 'Дата начала не может быть позже даты окончания.';
		if (dateTo > today) return 'Дата окончания не может быть в будущем.';
		if (!organization) return 'Не удалось определить организацию.';
		if (!user?.email) return 'В аккаунте не указан email для ответа.';
		return '';
	};

	const handleSubmit = async () => {
		const validationError = validate();
		if (validationError) {
			setFormError(validationError);
			return;
		}

		setFormError('');
		setRequestError('');
		setSubmitState('sending');

		try {
			const organizationReference = organization.inn || `ID ${organization.id}`;
			const period = `${formatDate(dateFrom)}–${formatDate(dateTo)}`;
			await sendSupportRequest({
				subject: `Запрос акта сверки: ${organizationReference} — ${period}`,
				description: buildSupportMessage({ organization, user, dateFrom, dateTo, comment }),
			});
			setSubmitState('success');
		} catch (error) {
			setSubmitState('error');
			setRequestError(error.message || 'Не удалось отправить запрос акта сверки.');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={isSending ? () => {} : onClose} isCentered size="2xl">
			<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
			<ModalContent bg={modalBg} borderRadius="20px" overflow="hidden" maxH="90vh">
				<ModalHeader borderBottom="1px solid" borderColor={dividerColor}>
					<Flex justify="space-between" align="flex-start" gap="16px">
						<Box>
							<Text fontSize="xl" fontWeight="600" color={titleColor}>
								{isSuccess ? 'Запрос успешно отправлен' : 'Запросить акт сверки'}
							</Text>
							<Text mt="4px" fontSize="sm" color={subtitleColor}>
								{isSuccess
									? `Оператор подготовит документ и ответит на ${user?.email}.`
									: 'Укажите период и проверьте реквизиты организации.'}
							</Text>
						</Box>
						<IconButton
							aria-label="Закрыть"
							icon={<FiX />}
							variant="ghost"
							borderRadius="full"
							onClick={onClose}
							isDisabled={isSending}
						/>
					</Flex>
				</ModalHeader>

				<ModalBody py="24px" overflowY="auto">
					{isSuccess ? (
						<Alert
							status="success"
							borderRadius="12px"
							bg={successAlertBg}
							color={successAlertColor}
						>
							<AlertIcon />
							<Box>
								<Text fontWeight="600">Обращение передано оператору.</Text>
								<Text fontSize="sm">Ответ придёт на {user?.email}.</Text>
							</Box>
						</Alert>
					) : (
						<Stack spacing="20px">
							<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="16px">
								<FormControl isRequired isInvalid={Boolean(formError)}>
									<FormLabel color={titleColor}>Период с</FormLabel>
									<Input
										type="date"
										value={dateFrom}
										max={today}
										onChange={(event) => setDateFrom(event.target.value)}
										isDisabled={isSending}
										bg={inputBg}
										borderColor={inputBorderColor}
									/>
								</FormControl>
								<FormControl isRequired isInvalid={Boolean(formError)}>
									<FormLabel color={titleColor}>Период по</FormLabel>
									<Input
										type="date"
										value={dateTo}
										min={dateFrom || undefined}
										max={today}
										onChange={(event) => setDateTo(event.target.value)}
										isDisabled={isSending}
										bg={inputBg}
										borderColor={inputBorderColor}
									/>
								</FormControl>
							</Grid>
							{formError ? (
								<Text fontSize="sm" color="red.500">
									{formError}
								</Text>
							) : null}

							<Stack spacing="8px" p="16px" borderRadius="12px" bg={detailsBg}>
								<Text color={titleColor}>
									<strong>Организация:</strong> {getOrganizationName(organization)}
								</Text>
								<Text color={titleColor}>
									<strong>ИНН:</strong> {organization?.inn || 'Не указан'}
								</Text>
								{organization?.kpp ? (
									<Text color={titleColor}>
										<strong>КПП:</strong> {organization.kpp}
									</Text>
								) : null}
								<Text color={titleColor}>
									<strong>Email для ответа:</strong> {user?.email || 'Не указан'}
								</Text>
							</Stack>

							<FormControl>
								<FormLabel color={titleColor}>Комментарий для оператора</FormLabel>
								<Textarea
									value={comment}
									onChange={(event) => setComment(event.target.value)}
									placeholder="Например: нужен акт с детализацией по платежам"
									maxLength={MAX_COMMENT_LENGTH}
									minH="110px"
									resize="vertical"
									isDisabled={isSending}
									bg={inputBg}
									borderColor={inputBorderColor}
								/>
								<Text mt="4px" textAlign="right" fontSize="xs" color={subtitleColor}>
									{comment.length}/{MAX_COMMENT_LENGTH}
								</Text>
							</FormControl>

							{isSending ? (
								<Box>
									<Text mb="8px" fontSize="sm" color={subtitleColor}>
										Отправляем запрос...
									</Text>
									<Progress size="sm" isIndeterminate borderRadius="full" colorScheme="recode" />
								</Box>
							) : null}

							{submitState === 'error' ? (
								<Alert status="error" borderRadius="12px">
									<AlertIcon />
									<Text>{requestError}</Text>
								</Alert>
							) : null}
						</Stack>
					)}
				</ModalBody>

				<ModalFooter borderTop="1px solid" borderColor={dividerColor}>
					{isSuccess ? (
						<Button colorScheme="recode" onClick={onClose}>
							Закрыть
						</Button>
					) : (
						<Flex gap="10px">
							<Button variant="ghost" onClick={onClose} isDisabled={isSending}>
								Отмена
							</Button>
							<Button colorScheme="recode" onClick={handleSubmit} isLoading={isSending}>
								Отправить запрос
							</Button>
						</Flex>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
