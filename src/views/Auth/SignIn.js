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
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import signInImage from 'assets/img/signInImage.png';
import { SberIdIcon, YandexIdIcon } from 'components/Icons/Icons';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { login } from 'services/auth';
import { markAuthenticated } from 'services/session';

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

function SignIn() {
	const navigate = useNavigate();
	const titleColor = useColorModeValue('recode.300', 'recode.200');
	const textColor = useColorModeValue('gray.400', 'white');
	const bgIcons = useColorModeValue('gray.50', 'rgba(255, 255, 255, 0.1)');
	const iconColor = useColorModeValue('black', 'lightgray');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const normalizedEmail = email.trim().toLowerCase();

		if (!normalizedEmail || !password) {
			setError('Введите почту и пароль');
			return;
		}

		setIsSubmitting(true);
		setError('');

		try {
			await login(normalizedEmail, password);
			markAuthenticated();
			navigate('/lk/dashboard', { replace: true });
		} catch (requestError) {
			setError(getFriendlyError(requestError));
		} finally {
			setIsSubmitting(false);
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
		</Flex>
	);
}

export default SignIn;
