import { LockIcon, RepeatIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'services/auth';
import { clearAuthState, hasAuthState } from 'services/session';
import { getUserSubscription } from 'services/subscription';
import { isNoSubscriptionError } from 'utils/subscription';
import { routePaths } from '../routePaths';

const MINIMUM_TOKEN_PACKAGE_ID = 2;
const IS_DEVELOPMENT = import.meta.env.DEV;

function AccessLoadingScreen() {
	const background = useColorModeValue('gray.50', 'gray.900');

	return (
		<Flex minH="100vh" align="center" justify="center" bg={background}>
			<Spinner color="recode.300" size="xl" thickness="4px" />
		</Flex>
	);
}

function AccessModal({ status, onRetry }) {
	const navigate = useNavigate();
	const isError = status === 'error';
	const pageBackground = useColorModeValue('gray.50', 'gray.900');
	const modalBackground = useColorModeValue('white', 'gray.800');
	const footerBackground = useColorModeValue('gray.50', 'gray.700');
	const titleColor = useColorModeValue('#1F2937', 'white');
	const descriptionColor = useColorModeValue('#6B7280', 'gray.300');
	const dividerColor = useColorModeValue('gray.100', 'whiteAlpha.200');
	const iconBackground = useColorModeValue(
		isError ? 'orange.50' : 'blue.50',
		isError ? 'orange.900' : 'blue.900'
	);
	const iconColor = useColorModeValue(
		isError ? 'orange.500' : '#005DE0',
		isError ? 'orange.200' : 'blue.200'
	);
	const overlayBackground = useColorModeValue('blackAlpha.600', 'blackAlpha.800');
	const secondaryColor = useColorModeValue('gray.700', 'gray.100');
	const secondaryHoverBackground = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

	return (
		<Box minH="100vh" bg={pageBackground}>
			<Modal
				isOpen
				onClose={() => {}}
				isCentered
				closeOnEsc={false}
				closeOnOverlayClick={false}
				returnFocusOnClose={false}
				size="md"
			>
				<ModalOverlay bg={overlayBackground} backdropFilter="blur(6px)" />
				<ModalContent
					mx="20px"
					bg={modalBackground}
					border="1px solid"
					borderColor={dividerColor}
					borderRadius="20px"
					overflow="hidden"
					boxShadow="2xl"
				>
					<ModalHeader px={{ base: 6, md: 8 }} pt={{ base: 7, md: 8 }} pb={3}>
						<Flex
							w="48px"
							h="48px"
							align="center"
							justify="center"
							borderRadius="14px"
							bg={iconBackground}
							color={iconColor}
							mb={5}
						>
							<Icon as={isError ? RepeatIcon : LockIcon} boxSize={5} />
						</Flex>
						<Heading
							as="h1"
							fontSize={{ base: '22px', md: '24px' }}
							lineHeight="1.3"
							color={titleColor}
						>
							{isError
								? 'Не удалось проверить доступ'
								: 'Конструктор доступен на расширенных тарифах'}
						</Heading>
					</ModalHeader>
					<ModalBody px={{ base: 6, md: 8 }} pb={6}>
						<Text color={descriptionColor} fontSize="15px" lineHeight="1.65">
							{isError
								? 'Возникла ошибка при проверке тарифа. Попробуйте повторить запрос через несколько секунд.'
								: 'Ваш текущий тариф не включает Конструктор макросов. Выберите подходящий тариф, чтобы создавать и редактировать макросы.'}
						</Text>
					</ModalBody>
					<ModalFooter
						px={{ base: 6, md: 8 }}
						py={5}
						bg={footerBackground}
						borderTop="1px solid"
						borderColor={dividerColor}
						gap={3}
						flexDirection={{ base: 'column-reverse', sm: 'row' }}
					>
						<Button
							w={{ base: '100%', sm: 'auto' }}
							variant="ghost"
							color={secondaryColor}
							borderRadius="12px"
							_hover={{ bg: secondaryHoverBackground }}
							onClick={() => navigate(routePaths.dashboard.home(), { replace: true })}
						>
							В личный кабинет
						</Button>
						<Button
							w={{ base: '100%', sm: 'auto' }}
							colorScheme="blue"
							bg="#005DE0"
							borderRadius="12px"
							leftIcon={isError ? <RepeatIcon /> : undefined}
							onClick={
								isError ? onRetry : () => navigate(routePaths.dashboard.tariff(), { replace: true })
							}
						>
							{isError ? 'Повторить' : 'Выбрать тариф'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}

export function RequireMacroConstructorAccess() {
	const location = useLocation();
	const [status, setStatus] = useState('checking');
	const [currentUser, setCurrentUser] = useState(null);
	const [retryKey, setRetryKey] = useState(0);

	useEffect(() => {
		let isMounted = true;

		async function checkAccess() {
			if (!hasAuthState()) {
				if (isMounted) setStatus('unauthorized');
				return;
			}

			setStatus('checking');

			let user;
			try {
				user = await getCurrentUser();
			} catch {
				clearAuthState();
				if (isMounted) {
					setCurrentUser(null);
					setStatus('unauthorized');
				}
				return;
			}

			if (!isMounted) return;
			setCurrentUser(user);

			if (IS_DEVELOPMENT) {
				setStatus('authorized');
				return;
			}

			try {
				const subscription = await getUserSubscription();
				if (!isMounted) return;

				const tokenPackageId = Number(subscription?.token_package_id);
				setStatus(tokenPackageId >= MINIMUM_TOKEN_PACKAGE_ID ? 'authorized' : 'blocked');
			} catch (error) {
				if (!isMounted) return;
				setStatus(isNoSubscriptionError(error) ? 'blocked' : 'error');
			}
		}

		checkAccess();

		return () => {
			isMounted = false;
		};
	}, [retryKey]);

	if (status === 'checking') {
		return <AccessLoadingScreen />;
	}

	if (status === 'unauthorized') {
		return <Navigate to={routePaths.auth.login()} replace state={{ from: location }} />;
	}

	if (status === 'blocked' || status === 'error') {
		return <AccessModal status={status} onRetry={() => setRetryKey((value) => value + 1)} />;
	}

	return <Outlet context={{ currentUser }} />;
}
