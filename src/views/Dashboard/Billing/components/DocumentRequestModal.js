import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	IconButton,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Progress,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { getCurrentUser } from 'services/auth';
import { sendSupportRequest } from 'services/supportEmail';

function buildSupportMessage({ documentType, date, code, price }, accountEmail) {
	return [
		`Тип документа: ${documentType}`,
		`Отчётный период: ${date}`,
		`Код отчёта: ${code}`,
		`Сумма: ${price} ₽`,
		`Email для ответа: ${accountEmail || 'email аккаунта пользователя'}`,
		'Источник запроса: раздел «Отчёты» личного кабинета.',
		'Пожалуйста, подготовьте PDF-документ и отправьте его на указанный email.',
	].join('\n');
}

export default function DocumentRequestModal({ request, onClose }) {
	const [submitState, setSubmitState] = useState('idle');
	const [requestError, setRequestError] = useState('');
	const [accountEmail, setAccountEmail] = useState('');
	const [isEmailLoading, setIsEmailLoading] = useState(false);
	const [emailError, setEmailError] = useState('');
	const titleColor = useColorModeValue('gray.800', 'white');
	const subtitleColor = useColorModeValue('gray.500', 'gray.300');
	const glassBg = useColorModeValue('rgba(255, 255, 255, 0.96)', 'rgba(26, 32, 44, 0.94)');
	const sectionBg = useColorModeValue('white', 'gray.800');
	const dividerColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
	const detailsBg = useColorModeValue('gray.50', 'whiteAlpha.100');
	const successAlertBg = useColorModeValue('green.50', 'green.900');
	const successAlertColor = useColorModeValue('green.700', 'green.100');

	const isOpen = Boolean(request);
	const isSending = submitState === 'sending';
	const isSuccess = submitState === 'success';

	useEffect(() => {
		setSubmitState('idle');
		setRequestError('');
	}, [request]);

	useEffect(() => {
		if (!isOpen || accountEmail) return undefined;

		let isMounted = true;
		setIsEmailLoading(true);
		setEmailError('');

		getCurrentUser()
			.then((user) => {
				if (!isMounted) return;
				setAccountEmail(user?.email || '');
				if (!user?.email) {
					setEmailError('Email не указан в аккаунте.');
				}
			})
			.catch(() => {
				if (!isMounted) return;
				setEmailError('Не удалось определить email аккаунта.');
			})
			.finally(() => {
				if (isMounted) setIsEmailLoading(false);
			});

		return () => {
			isMounted = false;
		};
	}, [accountEmail, isOpen]);

	const handleSubmit = async () => {
		if (!request) return;

		setSubmitState('sending');
		setRequestError('');

		try {
			await sendSupportRequest({
				subject: `Запрос PDF-документа: ${request.documentType} — ${request.code}`,
				description: buildSupportMessage(request, accountEmail),
			});
			setSubmitState('success');
		} catch (error) {
			setSubmitState('error');
			setRequestError(error.message || 'Не удалось отправить запрос документа.');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={isSending ? () => {} : onClose} isCentered size="lg">
			<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
			<ModalContent bg={glassBg} borderRadius="20px" overflow="hidden">
				<ModalHeader borderBottom="1px solid" borderColor={dividerColor} bg={sectionBg}>
					<Flex justify="space-between" align="flex-start" gap="16px">
						<Box>
							<Text fontSize="xl" fontWeight="600" color={titleColor}>
								{isSuccess ? 'Запрос успешно отправлен' : 'Запросить PDF-документ'}
							</Text>
							<Text mt="4px" fontSize="sm" color={subtitleColor}>
								{isSuccess
									? `Оператор обработает обращение и ответит на ${
											accountEmail || 'email вашего аккаунта'
									  }.`
									: 'Проверьте данные перед отправкой обращения.'}
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

				<ModalBody py="24px" bg={sectionBg}>
					{isSuccess ? (
						<Alert
							status="success"
							borderRadius="12px"
							bg={successAlertBg}
							color={successAlertColor}
						>
							<AlertIcon />
							<Text>Обращение передано в техподдержку.</Text>
						</Alert>
					) : (
						<Stack spacing="16px">
							<Box>
								<Text color={titleColor}>
									После отправки оператор подготовит документ и ответит на:
								</Text>
								<Text mt="4px" color={titleColor} fontWeight="600">
									{isEmailLoading
										? 'Определяем email аккаунта...'
										: accountEmail || emailError || 'Email вашего аккаунта'}
								</Text>
							</Box>
							<Stack spacing="8px" p="16px" borderRadius="12px" bg={detailsBg}>
								<Text color={titleColor}>
									<strong>Документ:</strong> {request?.documentType}
								</Text>
								<Text color={titleColor}>
									<strong>Период:</strong> {request?.date}
								</Text>
								<Text color={titleColor}>
									<strong>Код:</strong> {request?.code}
								</Text>
								<Text color={titleColor}>
									<strong>Сумма:</strong> {request?.price} ₽
								</Text>
							</Stack>

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

				<ModalFooter borderTop="1px solid" borderColor={dividerColor} bg={sectionBg}>
					{isSuccess ? (
						<Button colorScheme="recode" onClick={onClose}>
							Закрыть
						</Button>
					) : (
						<Flex gap="10px">
							<Button variant="ghost" onClick={onClose} isDisabled={isSending}>
								Отмена
							</Button>
							<Button
								colorScheme="recode"
								onClick={handleSubmit}
								isLoading={isSending}
								isDisabled={isEmailLoading}
							>
								Отправить запрос
							</Button>
						</Flex>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
