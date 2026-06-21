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
	Link,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import BgSignUp from 'assets/img/BgSignUp.png';
import { SberIdIcon, YandexIdIcon } from 'components/Icons/Icons';
import { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { login, register, sendVerificationCode, verifyCode } from 'services/auth';
import { markAuthenticated, setPendingProfileEmail, setPendingProfileName } from 'services/session';

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
	const history = useHistory();
	const titleColor = useColorModeValue('recode.300', 'recode.200');
	const textColor = useColorModeValue('gray.700', 'white');
	const secondTextColor = useColorModeValue('gray.400', 'white');
	const bgColor = useColorModeValue('white', 'gray.700');
	const bgIcons = useColorModeValue('gray.50', 'rgba(255, 255, 255, 0.1)');
	const iconColor = useColorModeValue('black', 'lightgray');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [code, setCode] = useState('');
	const [step, setStep] = useState('account');
	const [error, setError] = useState('');
	const [notice, setNotice] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const normalizedEmail = email.trim().toLowerCase();
	const trimmedName = name.trim();

	const handleAccountSubmit = async (event) => {
		event.preventDefault();

		if (!trimmedName || !normalizedEmail || !password) {
			setError('Введите имя, почту и пароль');
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
		} catch (requestError) {
			setError(getFriendlyError(requestError));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCodeSubmit = async (event) => {
		event.preventDefault();
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
			history.replace('/admin/profile/complete');
		} catch (requestError) {
			setError(getFriendlyError(requestError));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden">
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
							<FormControl isRequired>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
									Пароль
								</FormLabel>
								<Input
									fontSize="sm"
									borderRadius="15px"
									type="password"
									placeholder="Ваш пароль"
									mb="24px"
									size="lg"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									isDisabled={isSubmitting}
								/>
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
									mb="24px"
									size="lg"
									value={code}
									onChange={(event) => setCode(event.target.value)}
									isDisabled={isSubmitting}
								/>
							</FormControl>
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
							isDisabled={isSubmitting}
							onClick={() => {
								setStep('account');
								setCode('');
								setError('');
								setNotice('');
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
