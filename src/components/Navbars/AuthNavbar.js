import { HamburgerIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	Flex,
	HStack,
	Image,
	Link,
	Stack,
	Text,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import recode_logo_colored from 'assets/svg/recode-logo-colored.svg';
import recode_logo_white from 'assets/svg/recode-logo-white.svg';
import SidebarResponsive from 'components/Sidebar/SidebarResponsive';
import { MAIN_CONTAINER_MAX_WIDTH, MAIN_NAVBAR_WIDTH } from 'constants/layout';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import routes from 'routes.js';

const PUBLIC_NAV_ITEMS = [
	{ to: '/', label: 'О ПРОЕКТЕ' },
	{ to: '/macro-translator', label: 'ПЕРЕВОДЧИК', beta: true },
	{ to: '/documentation', label: 'РЕСУРСЫ' },
	{ to: '/blog', label: 'БЛОГ' },
	{ to: '/contacts#support', label: 'ТЕХПОДДЕРЖКА' },
];

function NavItemLabel({ beta, betaColor, label }) {
	return (
		<Text>
			{label}
			{beta ? (
				<Text as="span" fontSize="8px" fw="bold" color={betaColor} verticalAlign="super" ml={0.5}>
					Бета
				</Text>
			) : null}
		</Text>
	);
}

export default function AuthNavbar(props) {
	const location = useLocation();
	const isLandingPage = location.pathname === '/';
	const [isTopOnLanding, setIsTopOnLanding] = React.useState(true);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const drawerButtonRef = React.useRef();
	const { logoText, secondary, usePublicDrawer, ...rest } = props;

	React.useEffect(() => {
		if (secondary || !isLandingPage) {
			setIsTopOnLanding(false);
			return undefined;
		}

		const handleScroll = () => {
			setIsTopOnLanding(window.scrollY <= 8);
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => window.removeEventListener('scroll', handleScroll);
	}, [secondary, isLandingPage]);

	let navbarIcon = useColorModeValue('gray.700', 'gray.200');
	let navbarBg = useColorModeValue(
		'linear-gradient(112.83deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 110.84%)',
		'linear-gradient(112.83deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 110.84%)'
	);
	let navbarBorder = useColorModeValue('1.5px solid #FFFFFF', '1.5px solid rgba(255, 255, 255, 0.31)');
	let navbarShadow = useColorModeValue('0px 7px 23px rgba(0, 0, 0, 0.05)', 'none');
	let navbarFilter = useColorModeValue('none', 'drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))');
	let navbarBackdrop = 'blur(18px)';
	let bgButton = useColorModeValue('linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)', 'gray.800');
	let navbarPosition = 'fixed';
	let colorButton = 'white';

	if (secondary === true) {
		navbarIcon = 'white';
		navbarBg = 'none';
		navbarBorder = 'none';
		navbarShadow = 'initial';
		navbarFilter = 'initial';
		navbarBackdrop = 'none';
		bgButton = 'white';
		colorButton = 'gray.700';
		navbarPosition = 'absolute';
	}

	const shouldUseTopLandingOffset = !secondary && isLandingPage && isTopOnLanding;
	const navbarTop = shouldUseTopLandingOffset
		? { base: '14px', md: '18px', xl: '120px' }
		: { base: '8px', md: '12px', xl: '16px' };
	const betaColor = secondary === true ? 'white' : 'recode.300';

	const brand = (
		<Link
			href={`${process.env.PUBLIC_URL}/#/`}
			target="_blank"
			display="flex"
			lineHeight="100%"
			fontWeight="bold"
			justifyContent="center"
			alignItems="center"
		>
			<Image
				src={secondary === true ? recode_logo_white : recode_logo_colored}
				alt="reCode Platform Logo"
				width={{ base: 108, sm: 118, md: 125 }}
			/>
		</Link>
	);

	const linksAuth = (
		<HStack display={{ sm: 'none', lg: 'flex' }}>
			{PUBLIC_NAV_ITEMS.map((item) => (
				<NavLink to={item.to} key={item.to}>
					<Button
						fontSize="sm"
						fontWeight="medium"
						ms="0px"
						px="0px"
						me={{ sm: '2px', md: '16px' }}
						color={navbarIcon}
						variant="transparent-with-icon"
					>
						<NavItemLabel beta={item.beta} betaColor={betaColor} label={item.label} />
					</Button>
				</NavLink>
			))}
		</HStack>
	);

	const publicDrawer = (
		<Flex display={{ base: 'flex', lg: 'none' }} alignItems="center" justifyContent="flex-end">
			<HamburgerIcon
				color={navbarIcon}
				w="24px"
				h="24px"
				ref={drawerButtonRef}
				cursor="pointer"
				onClick={onOpen}
			/>
			<Drawer isOpen={isOpen} onClose={onClose} placement="right" finalFocusRef={drawerButtonRef}>
				<DrawerOverlay />
				<DrawerContent w="250px" maxW="250px" borderRadius="16px 0 0 16px">
					<DrawerCloseButton _focus={{ boxShadow: 'none' }} _hover={{ boxShadow: 'none' }} />
					<DrawerBody px="1rem" py="24px">
						<Stack direction="column" spacing="6px" mt="36px">
							{PUBLIC_NAV_ITEMS.map((item) => (
								<NavLink to={item.to} key={`drawer-${item.to}`} onClick={onClose}>
									<Button
										boxSize="initial"
										justifyContent="flex-start"
										alignItems="center"
										bg="transparent"
										w="100%"
										py="12px"
										px="12px"
										borderRadius="15px"
										_hover={{ bg: 'gray.50' }}
										_active={{ bg: 'gray.50', transform: 'none', borderColor: 'transparent' }}
										_focus={{ boxShadow: 'none' }}
									>
										<Text color="gray.700" fontSize="sm" fontWeight="medium" textAlign="left">
											<NavItemLabel beta={item.beta} betaColor="recode.300" label={item.label} />
										</Text>
									</Button>
								</NavLink>
							))}
							<Link href="/lk/dashboard" onClick={onClose} _hover={{ textDecoration: 'none' }}>
								<Button
									bg="recode.300"
									color="white"
									fontSize="sm"
									fontWeight="medium"
									borderRadius="35px"
									w="100%"
									h="44px"
									mt="12px"
									_hover={{ bg: 'recode.200' }}
									_active={{ bg: 'recode.400' }}
								>
									Личный кабинет
								</Button>
							</Link>
						</Stack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</Flex>
	);

	return (
		<Flex
			position={navbarPosition}
			top={navbarTop}
			left="50%"
			transform="translate(-50%, 0px)"
			background={navbarBg}
			border={navbarBorder}
			boxShadow={navbarShadow}
			filter={navbarFilter}
			backdropFilter={navbarBackdrop}
			borderRadius="15px"
			px={{ base: '14px', sm: '16px', md: '20px', xl: '24px' }}
			py={{ base: '10px', sm: '12px', md: '16px', xl: '22px' }}
			mx="auto"
			w={MAIN_NAVBAR_WIDTH}
			maxW={MAIN_CONTAINER_MAX_WIDTH}
			alignItems="center"
			zIndex={1000}
			transition="top 0.2s ease"
		>
			<Flex w="100%" justifyContent={{ sm: 'start', lg: 'space-between' }}>
				{brand}
				<Box ms={{ base: 'auto', lg: '0px' }} display={{ base: 'flex', lg: 'none' }}>
					{usePublicDrawer ? (
						publicDrawer
					) : (
						<SidebarResponsive logoText={logoText} secondary={secondary} routes={routes} {...rest} />
					)}
				</Box>
				{linksAuth}
				<Link href="/lk/dashboard">
					<Button
						bg={bgButton}
						color={colorButton}
						fontSize="xs"
						fontWeight="medium"
						variant="no-hover"
						borderRadius="35px"
						px="30px"
						display={{
							sm: 'none',
							lg: 'flex',
						}}
					>
						Личный кабинет
					</Button>
				</Link>
			</Flex>
		</Flex>
	);
}

AuthNavbar.propTypes = {
	color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
	brandText: PropTypes.string,
	usePublicDrawer: PropTypes.bool,
};
