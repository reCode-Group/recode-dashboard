import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import signInImage from 'assets/img/signInImage.png';
import { SberIdIcon, YandexIdIcon } from 'components/Icons/Icons';
import { useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { confirmPasswordReset, login, requestPasswordReset } from 'services/auth';
import { markAuthenticated } from 'services/session';
import PasswordStrength, { getPasswordStrength } from './components/PasswordStrength';
import useResendCooldown from './hooks/useResendCooldown';

function getFriendlyError(error) {
	const message = error.message || '';
	if (message.includes('wrong credentials')) {
		return 'Неверная почта или пароль';
	}
	if (message.includes('Invalid input')) {
		return 'Введите корректную почту и пароль';
	}
	if (message.includes('Too Many Requests')) {
		return 'Слишком много запросов. Подождите пару секунд и попробуйте снова';
	}
	return message || 'Не удалось войти';
}

function getPasswordResetError(error) {
	const message = error.message || '';
	if (message.includes('invalid or expired password reset code')) {
		return 'Неверный или просроченный код восстановления';
	}
	if (message.includes('Invalid input')) {
		return 'Проверьте правильность введённых данных';
	}
	if (message.includes('Cannot send password reset code')) {
		return 'Не удалось отправить код восстановления. Попробуйте позже';
	}
	if (message.includes('Cannot reset password')) {
		return 'Не удалось изменить пароль. Попробуйте позже';
	}
	if (message.includes('Too Many Requests')) {
		return 'Слишком много запросов. Подождите и попробуйте снова';
	}
	return message || 'Не удалось восстановить пароль';
}

function SignIn() {
	const navigate = useNavigate();
	const location = useLocation();
	const resetModal = useDisclosure();
	const resetEmailInputRef = useRef();
	const titleColor = useColorModeValue('recode.300', 'recode.200');
	const textColor = useColorModeValue('gray.400', 'white');
	const forgotPasswordColor = useColorModeValue('gray.500', 'gray.300');
	const bgIcons = useColorModeValue('gray.50', 'rgba(255, 255, 255, 0.1)');
	const iconColor = useColorModeValue('black', 'lightgray');
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
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [notice, setNotice] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [resetStep, setResetStep] = useState('email');
	const [resetEmail, setResetEmail] = useState('');
	const [resetCode, setResetCode] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
	const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [resetError, setResetError] = useState('');
	const [resetMessage, setResetMessage] = useState('');
	const [isResetSubmitting, setIsResetSubmitting] = useState(false);
	const [isResetResending, setIsResetResending] = useState(false);
	const {
		remainingSeconds: resetRemainingSeconds,
		isCoolingDown: isResetCoolingDown,
		startCooldown: startResetCooldown,
		resetCooldown: resetResetCooldown,
	} = useResendCooldown(30);
	const isResetBusy = isResetSubmitting || isResetResending;

	const handleSubmit = async (event) => {
		event.preventDefault();
		const normalizedEmail = email.trim().toLowerCase();

		if (!normalizedEmail || !password) {
			setError('Введите почту и пароль');
			return;
		}

		setIsSubmitting(true);
		setError('');
		setNotice('');

		try {
			await login(normalizedEmail, password);
			markAuthenticated();
			const requestedPath = location.state?.from?.pathname;
			const destination = requestedPath === '/constructor' ? '/constructor' : '/lk/dashboard';
			navigate(destination, { replace: true });
		} catch (requestError) {
			setError(getFriendlyError(requestError));
		} finally {
			setIsSubmitting(false);
		}
	};

	const clearResetForm = () => {
		setResetStep('email');
		setResetEmail('');
		setResetCode('');
		setNewPassword('');
		setIsNewPasswordFocused(false);
		setNewPasswordConfirmation('');
		setShowNewPassword(false);
		setResetError('');
		setResetMessage('');
		setIsResetResending(false);
		resetResetCooldown();
	};

	const openResetModal = () => {
		clearResetForm();
		setResetEmail(email.trim().toLowerCase());
		setNotice('');
		resetModal.onOpen();
	};

	const closeResetModal = () => {
		if (isResetBusy) {
			return;
		}
		resetModal.onClose();
		clearResetForm();
	};

	const handleResetRequest = async (event) => {
		event.preventDefault();
		const normalizedEmail = resetEmail.trim().toLowerCase();

		if (!normalizedEmail) {
			setResetError('Введите корректную почту');
			return;
		}

		setIsResetSubmitting(true);
		setResetError('');
		setResetMessage('');

		try {
			await requestPasswordReset(normalizedEmail);
			setResetEmail(normalizedEmail);
			setResetStep('confirm');
			setResetMessage(`Код восстановления отправлен на ${normalizedEmail}. Он действует 15 минут.`);
			startResetCooldown();
		} catch (requestError) {
			setResetError(getPasswordResetError(requestError));
		} finally {
			setIsResetSubmitting(false);
		}
	};

	const handleResetResend = async () => {
		if (isResetCoolingDown || isResetBusy) {
			return;
		}

		setIsResetResending(true);
		setResetError('');

		try {
			await requestPasswordReset(resetEmail);
			setResetCode('');
			setResetMessage(
				`Новый код восстановления отправлен на ${resetEmail}. Он действует 15 минут.`
			);
			startResetCooldown();
		} catch (requestError) {
			setResetError(getPasswordResetError(requestError));
		} finally {
			setIsResetResending(false);
		}
	};

	const handleResetConfirm = async (event) => {
		event.preventDefault();
		if (isResetResending) {
			return;
		}
		const trimmedCode = resetCode.trim();

		if (!/^\d{6}$/.test(trimmedCode)) {
			setResetError('Введите шестизначный код');
			return;
		}
		if (!getPasswordStrength(newPassword).isValid) {
			setResetError('Пароль пока слишком простой');
			return;
		}
		if (newPassword !== newPasswordConfirmation) {
			setResetError('Пароли не совпадают');
			return;
		}

		setIsResetSubmitting(true);
		setResetError('');

		try {
			await confirmPasswordReset(resetEmail, trimmedCode, newPassword);
			setEmail(resetEmail);
			setPassword('');
			setError('');
			setNotice('Пароль успешно изменён. Теперь вы можете войти с новым паролем');
			resetModal.onClose();
			clearResetForm();
		} catch (requestError) {
			setResetError(getPasswordResetError(requestError));
		} finally {
			setIsResetSubmitting(false);
		}
	};

	return (
		<Flex position="relative" mb="40px">
			<Flex
				h={{ sm: 'initial', md: '75vh', lg: '85vh' }}
				w="100%"
				maxW="1044px"
				mx="auto"
				justifyContent="space-between"
				mb="30px"
				pt={{ sm: '100px', md: '0px' }}
			>
				<Flex
					alignItems="center"
					justifyContent="start"
					style={{ userSelect: 'none' }}
					w={{ base: '100%', md: '50%', lg: '42%' }}
				>
					<Flex
						as="form"
						onSubmit={handleSubmit}
						direction="column"
						w="100%"
						background="transparent"
						p="48px"
						mt={{ md: '150px', lg: '80px' }}
					>
						<Heading color={titleColor} fontSize="32px" mb="10px" ms="4px">
							С возвращением!
						</Heading>
						<Text mb="36px" ms="4px" color={textColor} fontWeight="medium" fontSize="14px">
							Введите почту и пароль для входа
						</Text>
						{error ? (
							<Alert status="error" borderRadius="12px" mb="20px" fontSize="sm">
								<AlertIcon />
								{error}
							</Alert>
						) : null}
						{notice ? (
							<Alert status="success" borderRadius="12px" mb="20px" fontSize="sm">
								<AlertIcon />
								{notice}
							</Alert>
						) : null}
						<FormControl isRequired>
							<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
								Email
							</FormLabel>
							<Input
								borderRadius="15px"
								mb="24px"
								fontSize="sm"
								type="email"
								placeholder="Ваша почта"
								size="lg"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								isDisabled={isSubmitting}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
								Пароль
							</FormLabel>
							<InputGroup size="lg" mb="24px">
								<Input
									borderRadius="15px"
									fontSize="sm"
									type={showPassword ? 'text' : 'password'}
									placeholder="Ваш пароль"
									size="lg"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									isDisabled={isSubmitting}
									pr="3rem"
								/>
								<InputRightElement width="3rem" h="100%">
									<Button
										type="button"
										variant="ghost"
										size="sm"
										minW="auto"
										h="auto"
										p="0"
										onClick={() => setShowPassword((value) => !value)}
										isDisabled={isSubmitting}
										aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
										_hover={{ bg: 'transparent' }}
										_active={{ bg: 'transparent' }}
									>
										{showPassword ? (
											<ViewOffIcon color="gray.400" />
										) : (
											<ViewIcon color="gray.400" />
										)}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Flex justify="flex-end" mt="-12px" mb="12px">
							<Button
								type="button"
								variant="link"
								color={forgotPasswordColor}
								fontSize="sm"
								fontWeight="medium"
								onClick={openResetModal}
								isDisabled={isSubmitting}
							>
								Забыли пароль?
							</Button>
						</Flex>
						<Button
							fontSize="xs"
							fontWeight="medium"
							type="submit"
							bg="recode.300"
							w="100%"
							h="45"
							mb="20px"
							color="white"
							mt="12px"
							isLoading={isSubmitting}
							loadingText="Входим"
							_hover={{
								bg: 'recode.200',
							}}
							_active={{
								bg: 'recode.400',
							}}
						>
							Войти
						</Button>
						<Flex align="center" gap="12px" mb="18px" mt="4px">
							<Box flex="1" h="1px" bg="gray.200" />
							<Text
								color="gray.400"
								fontSize="xs"
								fontWeight="semibold"
								textTransform="uppercase"
								letterSpacing="0.12em"
							>
								или войти через
							</Text>
							<Box flex="1" h="1px" bg="gray.200" />
						</Flex>
						<Box mb="24px">
							<HStack spacing="15px" justify="space-between">
								<Flex
									justify="center"
									align="center"
									h="70px"
									p="20px"
									minW="132px"
									borderRadius="15px"
									border="1px solid"
									borderColor="gray.200"
									bg="white"
									flex="1"
									cursor="not-allowed"
									opacity={0.72}
									transition="all .25s ease"
									_hover={{ bg: bgIcons, borderColor: 'gray.300' }}
								>
									<SberIdIcon color={iconColor} w="105px" h="105px" />
								</Flex>
								<Flex
									justify="center"
									align="center"
									h="70px"
									p="20px"
									minW="132px"
									flex="1"
									borderRadius="15px"
									border="1px solid"
									borderColor="gray.200"
									bg="white"
									cursor="not-allowed"
									opacity={0.72}
									transition="all .25s ease"
									_hover={{ bg: bgIcons, borderColor: 'gray.300' }}
								>
									<YandexIdIcon color={iconColor} w="100px" h="23px" />
								</Flex>
							</HStack>
						</Box>
						<Flex flexDirection="column" justifyContent="center" maxW="100%" mt="0px">
							<Text color={textColor} fontWeight="medium">
								Нет аккаунта?
								<Link
									as={RouterLink}
									to="/auth/sign-up"
									color={titleColor}
									ms="5px"
									fontWeight="bold"
								>
									Регистрация
								</Link>
							</Text>
						</Flex>
					</Flex>
				</Flex>
				<Box
					display={{ base: 'none', md: 'block' }}
					overflowX="hidden"
					h="100%"
					w="40vw"
					position="absolute"
					right="0px"
				>
					<Box
						bgImage={signInImage}
						w="100%"
						h="100%"
						bgSize="cover"
						bgPosition="50%"
						position="absolute"
						borderBottomLeftRadius="20px"
					></Box>
				</Box>
			</Flex>
			<Modal
				isOpen={resetModal.isOpen}
				onClose={closeResetModal}
				initialFocusRef={resetEmailInputRef}
				isCentered
				closeOnOverlayClick={!isResetBusy}
				closeOnEsc={!isResetBusy}
			>
				<ModalOverlay bg="rgba(0, 0, 0, 0.5)" backdropFilter="blur(4px)" />
				<ModalContent
					as="form"
					onSubmit={resetStep === 'email' ? handleResetRequest : handleResetConfirm}
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
								{resetStep === 'email' ? 'Восстановление пароля' : 'Создание нового пароля'}
							</Text>
							<Text
								mt="6px"
								color={modalDescriptionColor}
								fontSize="14px"
								fontWeight="400"
								lineHeight="1.5"
							>
								{resetStep === 'email'
									? 'Введите email, указанный при регистрации. Отправим на него код восстановления.'
									: 'Введите код из письма и задайте новый пароль для входа.'}
							</Text>
						</Box>
					</ModalHeader>
					<ModalCloseButton
						isDisabled={isResetBusy}
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
						{resetError ? (
							<Alert status="error" borderRadius="12px" mb="20px" fontSize="sm">
								<AlertIcon />
								{resetError}
							</Alert>
						) : null}
						{resetMessage ? (
							<Alert status="info" borderRadius="12px" mb="20px" fontSize="sm">
								<AlertIcon />
								{resetMessage}
							</Alert>
						) : null}
						{resetStep === 'email' ? (
							<FormControl isRequired>
								<FormLabel fontSize="sm" fontWeight="500" color={modalTitleColor}>
									Email
								</FormLabel>
								<Input
									ref={resetEmailInputRef}
									type="email"
									placeholder="Ваша почта"
									size="lg"
									borderRadius="10px"
									borderWidth="2px"
									borderColor={modalInputBorder}
									bg={modalInputBg}
									color={modalInputColor}
									fontSize="sm"
									value={resetEmail}
									onChange={(event) => setResetEmail(event.target.value)}
									isDisabled={isResetSubmitting}
									autoComplete="email"
									_hover={{ borderColor: modalInputHoverBorder }}
									_focus={{ borderColor: modalInputFocusBorder, boxShadow: 'none' }}
									_placeholder={{ color: modalPlaceholderColor }}
								/>
							</FormControl>
						) : (
							<>
								<FormControl isRequired mb="20px">
									<FormLabel fontSize="sm" fontWeight="500" color={modalTitleColor}>
										Код восстановления
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
										value={resetCode}
										onChange={(event) =>
											setResetCode(event.target.value.replace(/\D/g, '').slice(0, 6))
										}
										isDisabled={isResetBusy}
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
											color={titleColor}
											fontSize="sm"
											fontWeight="600"
											onClick={handleResetResend}
											isDisabled={isResetCoolingDown || isResetBusy}
											isLoading={isResetResending}
											loadingText="Отправляем"
										>
											{isResetCoolingDown
												? `Отправить повторно через 00:${String(resetRemainingSeconds).padStart(
														2,
														'0'
												  )}`
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
											isDisabled={isResetSubmitting}
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
												isDisabled={isResetSubmitting}
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
										isDisabled={isResetSubmitting}
										autoComplete="new-password"
										minLength={8}
										_hover={{ borderColor: modalInputHoverBorder }}
										_focus={{ borderColor: modalInputFocusBorder, boxShadow: 'none' }}
										_placeholder={{ color: modalPlaceholderColor }}
									/>
								</FormControl>
							</>
						)}
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
							onClick={() => {
								if (resetStep === 'email') {
									closeResetModal();
									return;
								}
								setResetStep('email');
								setResetCode('');
								setNewPassword('');
								setNewPasswordConfirmation('');
								setResetError('');
								setResetMessage('');
								resetResetCooldown();
							}}
							isDisabled={isResetBusy}
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
							{resetStep === 'email' ? 'Отмена' : 'Изменить email'}
						</Button>
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
							isLoading={isResetSubmitting}
							isDisabled={isResetResending}
							loadingText={resetStep === 'email' ? 'Отправляем' : 'Сохраняем'}
							_hover={{ filter: 'saturate(0.5)' }}
							_active={{ filter: 'brightness(0.85)' }}
						>
							{resetStep === 'email' ? 'Получить код' : 'Изменить пароль'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	);
}

export default SignIn;
