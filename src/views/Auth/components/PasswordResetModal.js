import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { confirmPasswordReset, requestPasswordReset } from 'services/auth';
import PasswordStrength, { getPasswordStrength } from './PasswordStrength';
import useResendCooldown from '../hooks/useResendCooldown';

const PASSWORD_FLOW_COPY = {
	forgot: {
		emailTitle: 'Восстановление пароля',
		confirmTitle: 'Создание нового пароля',
		emailDescription:
			'Введите email, указанный при регистрации. Отправим на него код восстановления.',
		confirmDescription: 'Введите код из письма и задайте новый пароль для входа.',
		codeLabel: 'Код восстановления',
		codeSent: (email) => `Код восстановления отправлен на ${email}. Он действует 15 минут.`,
		codeResent: (email) => `Новый код восстановления отправлен на ${email}. Он действует 15 минут.`,
		invalidCode: 'Неверный или просроченный код восстановления',
		sendCodeError: 'Не удалось отправить код восстановления. Попробуйте позже',
		genericError: 'Не удалось восстановить пароль',
		successNotice: 'Пароль успешно изменён. Теперь вы можете войти с новым паролем',
		backButton: 'Изменить email',
		submitButton: 'Изменить пароль',
	},
	change: {
		emailTitle: 'Смена пароля',
		confirmTitle: 'Новый пароль',
		emailDescription:
			'Отправим код подтверждения на email вашего аккаунта. После проверки кода вы сможете задать новый пароль.',
		confirmDescription: 'Введите код из письма и задайте новый пароль для аккаунта.',
		codeLabel: 'Код подтверждения',
		codeSent: (email) => `Код подтверждения отправлен на ${email}. Он действует 15 минут.`,
		codeResent: (email) => `Новый код подтверждения отправлен на ${email}. Он действует 15 минут.`,
		invalidCode: 'Неверный или просроченный код подтверждения',
		sendCodeError: 'Не удалось отправить код подтверждения. Попробуйте позже',
		genericError: 'Не удалось сменить пароль',
		successNotice: 'Пароль успешно изменён.',
		backButton: 'Назад',
		submitButton: 'Сменить пароль',
	},
};

function getPasswordResetError(error, copy) {
	const message = error.message || '';
	if (message.includes('invalid or expired password reset code')) {
		return copy.invalidCode;
	}
	if (message.includes('Invalid input')) {
		return 'Проверьте правильность введённых данных';
	}
	if (message.includes('Cannot send password reset code')) {
		return copy.sendCodeError;
	}
	if (message.includes('Cannot reset password')) {
		return 'Не удалось изменить пароль. Попробуйте позже';
	}
	if (message.includes('Too Many Requests')) {
		return 'Слишком много запросов. Подождите и попробуйте снова';
	}
	return message || copy.genericError;
}

function PasswordResetModal({
	isOpen,
	onClose,
	initialEmail = '',
	mode = 'forgot',
	isEmailLocked = false,
	closeOnSuccess = true,
	onSuccess,
}) {
	const copy = PASSWORD_FLOW_COPY[mode] || PASSWORD_FLOW_COPY.forgot;
	const emailInputRef = useRef();
	const modalBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.94)');
	const modalSectionBg = useColorModeValue('rgba(255, 255, 255, 0.6)', 'rgba(23, 25, 35, 0.72)');
	const modalBodyBg = useColorModeValue('white', 'gray.800');
	const modalBorderColor = useColorModeValue(
		'rgba(255, 255, 255, 0.3)',
		'rgba(255, 255, 255, 0.16)'
	);
	const modalDividerColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.12)');
	const modalTitleColor = useColorModeValue('#1f2937', 'white');
	const modalDescriptionColor = useColorModeValue('#6b7280', 'gray.200');
	const modalInputBg = useColorModeValue('white', 'rgba(255, 255, 255, 0.05)');
	const modalInputBorder = useColorModeValue('#d1d5db', '#4a5568');
	const modalInputHoverBorder = useColorModeValue('#9ca3af', '#718096');
	const modalInputFocusBorder = useColorModeValue('#313860', 'recode.200');
	const modalInputColor = useColorModeValue('#1f2937', 'white');
	const modalPlaceholderColor = useColorModeValue('gray.400', 'gray.400');
	const modalCloseBg = useColorModeValue('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.08)');
	const modalCloseHoverBg = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.16)');
	const modalCloseColor = useColorModeValue('#6b7280', 'gray.300');
	const modalCancelBg = useColorModeValue('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.08)');
	const modalCancelHoverBg = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.16)');
	const modalCancelColor = useColorModeValue('#4b5563', 'gray.200');
	const [step, setStep] = useState('email');
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
	const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const {
		remainingSeconds,
		isCoolingDown,
		startCooldown,
		resetCooldown,
	} = useResendCooldown(30);
	const isBusy = isSubmitting || isResending;

	const clearForm = () => {
		setStep('email');
		setEmail((initialEmail || '').trim().toLowerCase());
		setCode('');
		setNewPassword('');
		setIsNewPasswordFocused(false);
		setNewPasswordConfirmation('');
		setShowNewPassword(false);
		setError('');
		setMessage('');
		setIsResending(false);
		resetCooldown();
	};

	useEffect(() => {
		if (isOpen) {
			clearForm();
		}
		// resetCooldown is stable, and this effect intentionally resets only on open/input email changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialEmail, isOpen]);

	const handleClose = () => {
		if (isBusy) {
			return;
		}
		onClose();
		clearForm();
	};

	const handleRequest = async (event) => {
		event.preventDefault();
		const normalizedEmail = email.trim().toLowerCase();

		if (!normalizedEmail) {
			setError('Введите корректную почту');
			return;
		}

		setIsSubmitting(true);
		setError('');
		setMessage('');

		try {
			await requestPasswordReset(normalizedEmail);
			setEmail(normalizedEmail);
			setStep('confirm');
			setMessage(copy.codeSent(normalizedEmail));
			startCooldown();
		} catch (requestError) {
			setError(getPasswordResetError(requestError, copy));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleResend = async () => {
		if (isCoolingDown || isBusy) {
			return;
		}

		setIsResending(true);
		setError('');

		try {
			await requestPasswordReset(email);
			setCode('');
			setMessage(copy.codeResent(email));
			startCooldown();
		} catch (requestError) {
			setError(getPasswordResetError(requestError, copy));
		} finally {
			setIsResending(false);
		}
	};

	const handleConfirm = async (event) => {
		event.preventDefault();
		if (isResending) {
			return;
		}
		const trimmedCode = code.trim();

		if (!/^\d{6}$/.test(trimmedCode)) {
			setError('Введите шестизначный код');
			return;
		}
		if (!getPasswordStrength(newPassword).isValid) {
			setError('Пароль пока слишком простой');
			return;
		}
		if (newPassword !== newPasswordConfirmation) {
			setError('Пароли не совпадают');
			return;
		}

		setIsSubmitting(true);
		setError('');

		try {
			await confirmPasswordReset(email, trimmedCode, newPassword);
			onSuccess?.(email);
			if (closeOnSuccess) {
				onClose();
				clearForm();
				return;
			}
			setStep('success');
			setMessage(copy.successNotice);
			setCode('');
			setNewPassword('');
			setNewPasswordConfirmation('');
			resetCooldown();
		} catch (requestError) {
			setError(getPasswordResetError(requestError, copy));
		} finally {
			setIsSubmitting(false);
		}
	};

	const goBack = () => {
		if (step === 'email') {
			handleClose();
			return;
		}
		setStep('email');
		setCode('');
		setNewPassword('');
		setNewPasswordConfirmation('');
		setError('');
		setMessage('');
		resetCooldown();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			initialFocusRef={isEmailLocked ? undefined : emailInputRef}
			isCentered
			closeOnOverlayClick={!isBusy}
			closeOnEsc={!isBusy}
		>
			<ModalOverlay bg="rgba(0, 0, 0, 0.5)" backdropFilter="blur(4px)" />
			<ModalContent
				as="form"
				onSubmit={step === 'email' ? handleRequest : handleConfirm}
				maxW="500px"
				maxH="90vh"
				bg={modalBg}
				backdropFilter="blur(20px)"
				border="1px solid"
				borderColor={modalBorderColor}
				borderRadius="20px"
				boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
				overflow={{ base: 'hidden', lg: 'visible' }}
				mx="20px"
			>
				<ModalHeader
					px={{ base: '20px', md: '32px' }}
					py="24px"
					bg={modalSectionBg}
					borderBottom="1px solid"
					borderColor={modalDividerColor}
					borderTopRadius="20px"
				>
					<Box maxW="calc(100% - 52px)">
						<Text fontSize="24px" fontWeight="600" color={modalTitleColor} lineHeight="1.25">
							{step === 'email' ? copy.emailTitle : copy.confirmTitle}
						</Text>
						<Text
							mt="6px"
							color={modalDescriptionColor}
							fontSize="14px"
							fontWeight="400"
							lineHeight="1.5"
						>
							{step === 'email' ? copy.emailDescription : copy.confirmDescription}
						</Text>
					</Box>
				</ModalHeader>
				<ModalCloseButton
					isDisabled={isBusy}
					top="20px"
					right={{ base: '20px', md: '32px' }}
					w="40px"
					h="40px"
					borderRadius="50%"
					bg={modalCloseBg}
					color={modalCloseColor}
					_hover={{ bg: modalCloseHoverBg, color: modalTitleColor }}
				/>
				<ModalBody
					px={{ base: '20px', md: '30px' }}
					py="28px"
					bg={modalBodyBg}
					overflowY={{ base: 'auto', lg: 'visible' }}
				>
					{error ? (
						<Alert status="error" borderRadius="12px" mb="20px" fontSize="sm">
							<AlertIcon />
							{error}
						</Alert>
					) : null}
					{message ? (
						<Alert status={step === 'success' ? 'success' : 'info'} borderRadius="12px" mb="20px" fontSize="sm">
							<AlertIcon />
							{message}
						</Alert>
					) : null}
					{step === 'email' ? (
						<FormControl isRequired={!isEmailLocked}>
							<FormLabel fontSize="sm" fontWeight="500" color={modalTitleColor}>
								Email
							</FormLabel>
							<Input
								ref={emailInputRef}
								type="email"
								placeholder="Ваша почта"
								size="lg"
								borderRadius="10px"
								borderWidth="2px"
								borderColor={modalInputBorder}
								bg={modalInputBg}
								color={modalInputColor}
								fontSize="sm"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								isDisabled={isSubmitting || isEmailLocked}
								autoComplete="email"
								_hover={{ borderColor: modalInputHoverBorder }}
								_focus={{ borderColor: modalInputFocusBorder, boxShadow: 'none' }}
								_placeholder={{ color: modalPlaceholderColor }}
							/>
						</FormControl>
					) : step === 'confirm' ? (
						<>
							<FormControl isRequired mb="20px">
								<FormLabel fontSize="sm" fontWeight="500" color={modalTitleColor}>
									{copy.codeLabel}
								</FormLabel>
								<Input
									type="text"
									inputMode="numeric"
									placeholder="000000"
									size="lg"
									borderRadius="10px"
									borderWidth="2px"
									borderColor={modalInputBorder}
									bg={modalInputBg}
									color={modalInputColor}
									fontSize="sm"
									value={code}
									onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
									isDisabled={isBusy}
									autoComplete="one-time-code"
									_hover={{ borderColor: modalInputHoverBorder }}
									_focus={{ borderColor: modalInputFocusBorder, boxShadow: 'none' }}
									_placeholder={{ color: modalPlaceholderColor }}
								/>
								<Flex align="center" gap="5px" wrap="wrap" mt="10px">
									<Text color={modalDescriptionColor} fontSize="sm">
										Не пришло письмо?
									</Text>
									<Button
										type="button"
										variant="link"
										color="recode.300"
										fontSize="sm"
										fontWeight="600"
										onClick={handleResend}
										isDisabled={isCoolingDown || isBusy}
										isLoading={isResending}
										loadingText="Отправляем"
									>
										{isCoolingDown
											? `Отправить повторно через 00:${String(remainingSeconds).padStart(2, '0')}`
											: 'Отправить повторно'}
									</Button>
								</Flex>
							</FormControl>
							<FormControl isRequired mb="20px" position="relative">
								<FormLabel fontSize="sm" fontWeight="500" color={modalTitleColor}>
									Новый пароль
								</FormLabel>
								<InputGroup size="lg">
									<Input
										type={showNewPassword ? 'text' : 'password'}
										placeholder="Не менее 8 символов"
										borderRadius="10px"
										borderWidth="2px"
										borderColor={modalInputBorder}
										bg={modalInputBg}
										color={modalInputColor}
										fontSize="sm"
										value={newPassword}
										onChange={(event) => setNewPassword(event.target.value)}
										onFocus={() => setIsNewPasswordFocused(true)}
										onBlur={() => setIsNewPasswordFocused(false)}
										isDisabled={isSubmitting}
										autoComplete="new-password"
										minLength={8}
										pr="3rem"
										_hover={{ borderColor: modalInputHoverBorder }}
										_focus={{ borderColor: modalInputFocusBorder, boxShadow: 'none' }}
										_placeholder={{ color: modalPlaceholderColor }}
									/>
									<InputRightElement width="3rem" h="100%">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											minW="auto"
											h="auto"
											p="0"
											onClick={() => setShowNewPassword((value) => !value)}
											isDisabled={isSubmitting}
											aria-label={showNewPassword ? 'Скрыть пароль' : 'Показать пароль'}
										>
											{showNewPassword ? (
												<ViewOffIcon color="gray.400" />
											) : (
												<ViewIcon color="gray.400" />
											)}
										</Button>
									</InputRightElement>
								</InputGroup>
								<PasswordStrength password={newPassword} isActive={isNewPasswordFocused} />
							</FormControl>
							<FormControl isRequired>
								<FormLabel fontSize="sm" fontWeight="500" color={modalTitleColor}>
									Повторите новый пароль
								</FormLabel>
								<Input
									type={showNewPassword ? 'text' : 'password'}
									placeholder="Повторите пароль"
									size="lg"
									borderRadius="10px"
									borderWidth="2px"
									borderColor={modalInputBorder}
									bg={modalInputBg}
									color={modalInputColor}
									fontSize="sm"
									value={newPasswordConfirmation}
									onChange={(event) => setNewPasswordConfirmation(event.target.value)}
									isDisabled={isSubmitting}
									autoComplete="new-password"
									minLength={8}
									_hover={{ borderColor: modalInputHoverBorder }}
									_focus={{ borderColor: modalInputFocusBorder, boxShadow: 'none' }}
									_placeholder={{ color: modalPlaceholderColor }}
								/>
							</FormControl>
						</>
					) : null}
				</ModalBody>
				<ModalFooter
					gap="16px"
					justifyContent="space-between"
					px={{ base: '20px', md: '32px' }}
					py="20px"
					bg={modalSectionBg}
					borderTop="1px solid"
					borderColor={modalDividerColor}
					borderBottomRadius="20px"
				>
					<Button
						type="button"
						onClick={step === 'success' ? handleClose : goBack}
						isDisabled={isBusy}
						flex="1"
						px="24px"
						h="45px"
						borderRadius="12px"
						bg={modalCancelBg}
						color={modalCancelColor}
						fontSize="15px"
						fontWeight="500"
						_hover={{ bg: modalCancelHoverBg }}
					>
						{step === 'email' ? 'Отмена' : step === 'success' ? 'Закрыть' : copy.backButton}
					</Button>
					{step !== 'success' ? (
						<Button
							type="submit"
							px="24px"
							h="45px"
							borderRadius="12px"
							bgGradient="linear(135deg, #313860 0%, #151928 100%)"
							color="white"
							fontSize="15px"
							fontWeight="500"
							flex="1"
							isLoading={isSubmitting}
							isDisabled={isResending}
							loadingText={step === 'email' ? 'Отправляем' : 'Сохраняем'}
							_hover={{ filter: 'saturate(0.5)' }}
							_active={{ filter: 'brightness(0.85)' }}
						>
							{step === 'email' ? 'Получить код' : copy.submitButton}
						</Button>
					) : null}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default PasswordResetModal;
