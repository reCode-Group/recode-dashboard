import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import BgSignUp from 'assets/img/BgSignUp.png';
import { SberIdIcon, YandexIdIcon } from 'components/Icons/Icons';
import AuthNavbar from 'components/Navbars/AuthNavbar.js';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { login, register, sendVerificationCode, verifyCode } from 'services/auth';
import { markAuthenticated, setPendingProfileEmail, setPendingProfileName } from 'services/session';
import PasswordStrength, { getPasswordStrength } from './components/PasswordStrength';
import useResendCooldown from './hooks/useResendCooldown';

function getFriendlyError(error) {
	const message = error.message || '';
	if (message.includes('wrong verification code')) {
		return 'Неверный код подтверждения';
	}
	if (message.includes('already verified') || message.includes('already exists')) {
		return 'Аккаунт с этой почтой уже зарегистрирован';
	}
	if (message.includes('Invalid input')) {
		return 'Проверьте имя, почту и пароль';
	}
	if (message.includes('Cannot send verification code')) {
		return 'Не удалось отправить код подтверждения';
	}
	if (message.includes('Too Many Requests')) {
		return 'Слишком много запросов. Подождите пару секунд и попробуйте снова';
	}
	return message || 'Не удалось завершить регистрацию';
}

function SignUp() {
	const navigate = useNavigate();
	const titleColor = useColorModeValue('recode.300', 'recode.200');
	const textColor = useColorModeValue('gray.700', 'white');
	const secondTextColor = useColorModeValue('gray.400', 'white');
	const bgColor = useColorModeValue('white', 'gray.700');
	const bgIcons = useColorModeValue('gray.50', 'rgba(255, 255, 255, 0.1)');
	const iconColor = useColorModeValue('black', 'lightgray');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [code, setCode] = useState('');
	const [step, setStep] = useState('account');
	const [error, setError] = useState('');
	const [notice, setNotice] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isResendingCode, setIsResendingCode] = useState(false);
	const { remainingSeconds, isCoolingDown, startCooldown, resetCooldown } = useResendCooldown(30);

	const normalizedEmail = email.trim().toLowerCase();
	const trimmedName = name.trim();

	const handleAccountSubmit = async (event) => {
		event.preventDefault();

		if (!trimmedName || !normalizedEmail || !password) {
			setError('Введите имя, почту и пароль');
			return;
		}
		if (!getPasswordStrength(password).isValid) {
			setError('Пароль пока слишком простой');
			return;
		}

		setIsSubmitting(true);
		setError('');
		setNotice('');

		try {
			await register(normalizedEmail, password, trimmedName);
			await sendVerificationCode(normalizedEmail);
			setStep('verify');
			setNotice('Код подтверждения отправлен на вашу почту ' + normalizedEmail);
			startCooldown();
		} catch (requestError) {
			setError(getFriendlyError(requestError));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleResendVerificationCode = async () => {
		if (isCoolingDown || isResendingCode || isSubmitting) {
			return;
		}

		setIsResendingCode(true);
		setError('');

		try {
			await sendVerificationCode(normalizedEmail);
			setCode('');
			setNotice('Новый код подтверждения отправлен на ' + normalizedEmail);
			startCooldown();
		} catch (requestError) {
			setError(getFriendlyError(requestError));
		} finally {
			setIsResendingCode(false);
		}
	};

	const handleCodeSubmit = async (event) => {
		event.preventDefault();
		if (isResendingCode) {
			return;
		}
		const trimmedCode = code.trim();
		if (!trimmedCode) {
			setError('Введите код подтверждения');
			return;
		}

		setIsSubmitting(true);
		setError('');
		setNotice('');

		try {
			await verifyCode(normalizedEmail, trimmedCode);
			await login(normalizedEmail, password);
			markAuthenticated();
			setPendingProfileEmail(normalizedEmail);
			setPendingProfileName(trimmedName);
			navigate('/lk/profile/complete', { replace: true });
		} catch (requestError) {
			setError(getFriendlyError(requestError));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Flex direction="column" alignSelf="center" justifySelf="center">
			<AuthNavbar secondary={true} logoText="RECODE DASHBOARD" />
			<Box
				position="absolute"
				minH={{ base: '70vh', md: '50vh' }}
				w={{ md: 'calc(100vw - 50px)' }}
				borderRadius={{ md: '15px' }}
				left="0"
				right="0"
				bgRepeat="no-repeat"
				overflow="hidden"
				zIndex="-1"
				top="0"
				bgImage={BgSignUp}
				bgSize="cover"
				mx={{ md: 'auto' }}
				mt={{ md: '14px' }}
			></Box>
			<Flex
				direction="column"
				textAlign="center"
				justifyContent="center"
				align="center"
				mt="8.5rem"
				mb="30px"
			>
				<Text fontSize="4xl" color="white" fontWeight="bold">
					Добро пожаловать!
				</Text>
				<Text
					fontSize="md"
					color="white"
					fontWeight="normal"
					mt="10px"
					mb="26px"
					w={{ base: '90%', sm: '60%', lg: '40%', xl: '60%' }}
				>
					Используйте форму ниже для бесплатной регистрации на платформе
				</Text>
			</Flex>
			<Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
				<Flex
					as="form"
					onSubmit={step === 'account' ? handleAccountSubmit : handleCodeSubmit}
					direction="column"
					w="445px"
					background="transparent"
					borderRadius="15px"
					p="40px"
					mx={{ base: '100px' }}
					bg={bgColor}
					boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
				>
					<Text fontSize="xl" color={textColor} fontWeight="bold" textAlign="center" mb="22px">
						{step === 'account' ? 'Регистрация' : 'Подтверждение почты'}
					</Text>
					{step === 'account' ? (
						<HStack spacing="15px" justify="center" mb="25px">
							<Flex
								justify="center"
								align="center"
								h="70px"
								p="20px"
								borderRadius="15px"
								border="1px solid lightgray"
								cursor="not-allowed"
								opacity={0.55}
								transition="all .25s ease"
								_hover={{ bg: bgIcons }}
							>
								<SberIdIcon color={iconColor} w="105px" h="105px" />
							</Flex>
							<Flex
								justify="center"
								align="center"
								p="20px"
								h="70px"
								borderRadius="15px"
								border="1px solid lightgray"
								cursor="not-allowed"
								opacity={0.55}
								transition="all .25s ease"
								_hover={{ bg: bgIcons }}
							>
								<YandexIdIcon color={iconColor} w="100px" h="23px" />
							</Flex>
						</HStack>
					) : null}
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
					{step === 'account' ? (
						<>
							<FormControl isRequired>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
									Имя
								</FormLabel>
								<Input
									fontSize="sm"
									borderRadius="15px"
									type="text"
									placeholder="Ваше имя"
									mb="24px"
									size="lg"
									value={name}
									onChange={(event) => setName(event.target.value)}
									isDisabled={isSubmitting}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
									Email
								</FormLabel>
								<Input
									fontSize="sm"
									borderRadius="15px"
									type="email"
									placeholder="Ваша рабочая почта"
									mb="24px"
									size="lg"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									isDisabled={isSubmitting}
								/>
							</FormControl>
							<FormControl isRequired position="relative" mb={{ base: 0, lg: '24px' }}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
									Пароль
								</FormLabel>
								<InputGroup size="lg">
									<Input
										fontSize="sm"
										borderRadius="15px"
										type={showPassword ? 'text' : 'password'}
										placeholder="Ваш пароль"
										size="lg"
										value={password}
										onChange={(event) => setPassword(event.target.value)}
										onFocus={() => setIsPasswordFocused(true)}
										onBlur={() => setIsPasswordFocused(false)}
										isDisabled={isSubmitting}
										pr="3rem"
									/>
									<InputRightElement width="3rem" h="100%">
										<Button
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
								<PasswordStrength password={password} isActive={isPasswordFocused} mb="24px" />
							</FormControl>
						</>
					) : (
						<>
							<FormControl isRequired>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
									Код подтверждения
								</FormLabel>
								<Input
									fontSize="sm"
									borderRadius="15px"
									type="text"
									inputMode="numeric"
									placeholder="0000"
									mb="12px"
									size="lg"
									value={code}
									onChange={(event) => setCode(event.target.value)}
									isDisabled={isSubmitting || isResendingCode}
								/>
							</FormControl>
							<Flex justify="center" align="center" gap="5px" wrap="wrap" mb="24px">
								<Text color={secondTextColor} fontSize="sm">
									Не пришло письмо?
								</Text>
								<Button
									type="button"
									variant="link"
									color={titleColor}
									fontSize="sm"
									fontWeight="600"
									onClick={handleResendVerificationCode}
									isDisabled={isCoolingDown || isResendingCode || isSubmitting}
									isLoading={isResendingCode}
									loadingText="Отправляем"
								>
									{isCoolingDown
										? `Отправить повторно через 00:${String(remainingSeconds).padStart(2, '0')}`
										: 'Отправить повторно'}
								</Button>
							</Flex>
						</>
					)}
					<Button
						type="submit"
						bg="recode.300"
						fontSize="xs"
						color="white"
						w="100%"
						h="45"
						mb="24px"
						isLoading={isSubmitting}
						isDisabled={step === 'verify' && isResendingCode}
						loadingText={step === 'account' ? 'Отправляем код' : 'Проверяем код'}
						_hover={{
							bg: 'recode.200',
						}}
						_active={{
							bg: 'recode.400',
						}}
					>
						{step === 'account' ? 'Зарегистрироваться' : 'Продолжить'}
					</Button>
					{step === 'verify' ? (
						<Button
							variant="ghost"
							size="sm"
							mb="18px"
							isDisabled={isSubmitting || isResendingCode}
							onClick={() => {
								setStep('account');
								setCode('');
								setError('');
								setNotice('');
								resetCooldown();
							}}
						>
							Изменить данные
						</Button>
					) : null}
					<Flex
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						maxW="100%"
						mt="0px"
					>
						<Text color={secondTextColor} fontWeight="regular">
							Уже есть аккаунт?
							<Link
								as={RouterLink}
								to="/auth/login-page"
								color={titleColor}
								ms="5px"
								fontWeight="bold"
							>
								Войти
							</Link>
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default SignUp;
