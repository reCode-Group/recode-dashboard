import { RepeatIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	ChakraProvider,
	Text,
	VStack,
	useColorModeValue,
} from '@chakra-ui/react';
import { Component, useEffect, useState } from 'react';
import { useRouteError } from 'react-router-dom';

import recodeLogoColoredSvg from 'assets/svg/recode-logo-colored.svg?raw';
import { sharedColorModeManager } from 'theme/colorModeManager.js';
import theme from 'theme/theme.js';

function getOnlineStatus() {
	if (typeof navigator === 'undefined') {
		return true;
	}
	return navigator.onLine;
}

function useOnlineStatus() {
	const [isOnline, setIsOnline] = useState(getOnlineStatus);

	useEffect(() => {
		function syncOnlineStatus() {
			setIsOnline(getOnlineStatus());
		}

		window.addEventListener('online', syncOnlineStatus);
		window.addEventListener('offline', syncOnlineStatus);

		return () => {
			window.removeEventListener('online', syncOnlineStatus);
			window.removeEventListener('offline', syncOnlineStatus);
		};
	}, []);

	return isOnline;
}

function reloadPage() {
	window.location.reload();
}

function RecodeInlineLogo() {
	return (
		<Box
			aria-label="reCode"
			role="img"
			w={{ base: '150px', md: '176px' }}
			sx={{
				svg: {
					display: 'block',
					width: '100%',
					height: 'auto',
				},
			}}
			dangerouslySetInnerHTML={{ __html: recodeLogoColoredSvg }}
		/>
	);
}

function ErrorContent() {
	const isOnline = useOnlineStatus();
	const pageBg = useColorModeValue('#F8F9FA', 'gray.900');
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.100', 'whiteAlpha.200');
	const titleColor = useColorModeValue('gray.800', 'white');
	const textColor = useColorModeValue('gray.600', 'gray.300');

	const title = isOnline ? 'Не удалось загрузить страницу' : 'Нет подключения к интернету';
	const description = isOnline
		? 'Похоже, страница загрузилась с ошибкой. Обновите ее, чтобы продолжить работу.'
		: 'Проверьте соединение и повторите загрузку. Мы вернем вас к работе, как только интернет появится.';

	return (
		<Box
			minH="100vh"
			bg={pageBg}
			display="flex"
			alignItems="center"
			justifyContent="center"
			px={{ base: '20px', md: '32px' }}
			py="48px"
		>
			<VStack
				bg={cardBg}
				border="1px solid"
				borderColor={borderColor}
				borderRadius="24px"
				boxShadow="0 22px 60px rgba(15, 23, 42, 0.12)"
				maxW="520px"
				w="100%"
				spacing="32px"
				px={{ base: '24px', md: '44px' }}
				py={{ base: '34px', md: '46px' }}
				textAlign="center"
			>
				<RecodeInlineLogo />
				<VStack spacing="10px">
					<Text as="h1" color={titleColor} fontSize={{ base: '24px', md: '30px' }} fontWeight="500">
						{title}
					</Text>
					<Text
						color={textColor}
						fontSize={{ base: '15px', md: '16px' }}
						lineHeight="1.7"
						maxW="420px"
					>
						{description}
					</Text>
				</VStack>
				<Button
					leftIcon={<RepeatIcon />}
					bg="recode.300"
					color="white"
					_hover={{ bg: 'recode.400' }}
					_active={{ bg: 'recode.500' }}
					onClick={reloadPage}
					minW="168px"
					h="44px"
				>
					Повторить
				</Button>
			</VStack>
		</Box>
	);
}

export function AppErrorScreen() {
	return (
		<ChakraProvider theme={theme} colorModeManager={sharedColorModeManager} resetCss={false}>
			<ErrorContent />
		</ChakraProvider>
	);
}

export class AppErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		if (import.meta.env.DEV) {
			console.error(error, errorInfo);
		}
	}

	render() {
		if (this.state.hasError) {
			return <AppErrorScreen />;
		}

		return this.props.children;
	}
}

export function RouterErrorElement() {
	useRouteError();
	return <AppErrorScreen />;
}
