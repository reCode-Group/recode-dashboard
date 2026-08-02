import {
	Alert,
	AlertIcon,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { sendSupportRequest } from 'services/supportEmail';

const emptyValue = 'Не указано';

function buildProfileChangeDescription({ currentFullName, currentPhone, nextFullName, nextPhone, email, role, company }) {
	return [
		'Пользователь отправил заявку на изменение контактных данных в профиле.',
		'',
		'Данные пользователя:',
		`Email: ${email || emptyValue}`,
		`Роль: ${role || emptyValue}`,
		`Компания: ${company || emptyValue}`,
		'',
		'Что нужно изменить:',
		`ФИО: ${currentFullName || emptyValue} -> ${nextFullName || emptyValue}`,
		`Телефон: ${currentPhone || emptyValue} -> ${nextPhone || emptyValue}`,
	].join('\n');
}

export default function ProfileEditRequestModal({
	isOpen,
	onClose,
	currentFullName,
	currentPhone,
	email,
	role,
	company,
}) {
	const [fullName, setFullName] = useState('');
	const [phone, setPhone] = useState('');
	const [submitState, setSubmitState] = useState('idle');
	const [fieldErrors, setFieldErrors] = useState({});
	const [requestError, setRequestError] = useState('');

	const inputBg = useColorModeValue('white', 'whiteAlpha.100');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const mutedColor = useColorModeValue('gray.500', 'gray.300');

	const isSending = submitState === 'sending';
	const isSuccess = submitState === 'success';

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setFullName(currentFullName === emptyValue ? '' : currentFullName || '');
		setPhone(currentPhone === emptyValue ? '' : currentPhone || '');
		setSubmitState('idle');
		setFieldErrors({});
		setRequestError('');
	}, [currentFullName, currentPhone, isOpen]);

	const handleSubmit = async () => {
		const nextFullName = fullName.trim();
		const nextPhone = phone.trim();
		const nextFieldErrors = {};

		if (!nextFullName) {
			nextFieldErrors.fullName = 'Напишите ФИО полностью.';
		}
		if (!nextPhone) {
			nextFieldErrors.phone = 'Добавьте номер телефона для связи.';
		}

		if (Object.keys(nextFieldErrors).length > 0) {
			setFieldErrors(nextFieldErrors);
			setRequestError('');
			return;
		}

		if (nextFullName === currentFullName && nextPhone === currentPhone) {
			setRequestError('Изменений пока нет. Проверьте ФИО или телефон и отправьте заявку еще раз.');
			setFieldErrors({});
			return;
		}

		setSubmitState('sending');
		setFieldErrors({});
		setRequestError('');

		try {
			await sendSupportRequest({
				subject: 'Запрос на изменение данных профиля',
				description: buildProfileChangeDescription({
					currentFullName,
					currentPhone,
					nextFullName,
					nextPhone,
					email,
					role,
					company,
				}),
			});
			setSubmitState('success');
		} catch (requestError) {
			setSubmitState('error');
			setRequestError(
				requestError.message || 'Не получилось отправить заявку. Проверьте подключение и попробуйте еще раз.'
			);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={isSending ? () => {} : onClose} isCentered size="lg">
			<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
			<ModalContent borderRadius="16px">
				<ModalHeader pb="8px">
					<Text fontSize="20px" fontWeight="700">
						Изменить данные
					</Text>
					<Text mt="6px" fontSize="sm" fontWeight="400" color={mutedColor}>
						Отправим заявку в поддержку. После проверки данные обновят в профиле.
					</Text>
				</ModalHeader>
				<ModalCloseButton isDisabled={isSending} />
				<ModalBody>
					<Stack spacing="16px">
						{isSuccess ? (
							<Alert status="success" borderRadius="12px">
								<AlertIcon />
								<Text>Заявка отправлена. Мы проверим данные и обновим профиль.</Text>
							</Alert>
						) : null}

						{requestError ? (
							<Alert status="error" borderRadius="12px">
								<AlertIcon />
								<Text>{requestError}</Text>
							</Alert>
						) : null}

						{!isSuccess ? (
							<>
								<FormControl isInvalid={Boolean(fieldErrors.fullName)}>
									<FormLabel color={mutedColor}>ФИО</FormLabel>
									<Input
										value={fullName}
										onChange={(event) => setFullName(event.target.value)}
										placeholder="Иванов Иван Иванович"
										bg={inputBg}
										borderColor={borderColor}
										borderRadius="12px"
										isDisabled={isSending}
									/>
									{fieldErrors.fullName ? <FormErrorMessage>{fieldErrors.fullName}</FormErrorMessage> : null}
								</FormControl>

								<FormControl isInvalid={Boolean(fieldErrors.phone)}>
									<FormLabel color={mutedColor}>Телефон</FormLabel>
									<Input
										value={phone}
										onChange={(event) => setPhone(event.target.value)}
										placeholder="+7 900 000-00-00"
										bg={inputBg}
										borderColor={borderColor}
										borderRadius="12px"
										isDisabled={isSending}
									/>
									{fieldErrors.phone ? <FormErrorMessage>{fieldErrors.phone}</FormErrorMessage> : null}
								</FormControl>
							</>
						) : null}
					</Stack>
				</ModalBody>

				<ModalFooter gap="10px">
					<Button variant="ghost" borderRadius="12px" onClick={onClose} isDisabled={isSending}>
						{isSuccess ? 'Закрыть' : 'Отмена'}
					</Button>
					{!isSuccess ? (
						<Button colorScheme="recode" borderRadius="12px" onClick={handleSubmit} isLoading={isSending}>
							Отправить заявку
						</Button>
					) : null}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
