/*eslint-disable*/
import { HamburgerIcon } from '@chakra-ui/icons';
// chakra imports
import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Link,
	Stack,
	Text,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import IconBox from 'components/Icons/IconBox';
import { Separator } from 'components/Separator/Separator';
import { SidebarHelp } from 'components/Sidebar/SidebarHelp';
import React from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import {
	getSidebarRouteTarget,
	isSidebarRouteActive,
	shouldHideSidebarRoute,
} from 'utils/adminAccess';

function SidebarResponsive(props) {
	// to check for active links and opened collapses
	let location = useLocation();
	// this is for the rest of the collapses
	const [state, setState] = React.useState({});
	const mainPanel = React.useRef();
	// verifies if routeName is the one active (in browser input)
	const createLinks = (routes) => {
		// Chakra Color Mode
		const activeBg = useColorModeValue('white', 'gray.700');
		const inactiveBg = useColorModeValue('white', 'gray.700');
		const activeColor = useColorModeValue('gray.700', 'white');
		const inactiveColor = useColorModeValue('gray.400', 'gray.400');
		const activeShadow = '0px 3.5px 5.5px rgba(0, 0, 0, 0.02)';

		return routes.map((prop, key) => {
			if (
				prop.redirect ||
				prop.hiddenInSidebar ||
				shouldHideSidebarRoute(prop, props.viewerContext)
			) {
				return null;
			}
			if (prop.category) {
				var st = {};
				st[prop['state']] = !state[prop.state];
				return (
					<div key={prop.name}>
						<Text
							color={activeColor}
							fontWeight="bold"
							mb={{
								xl: '12px',
							}}
							mx="auto"
							ps={{
								sm: '10px',
								xl: '16px',
							}}
							py="12px"
						>
							{prop.name}
						</Text>
						{createLinks(prop.views)}
					</div>
				);
			}
			const routePath = prop.layout + prop.path;
			const targetPath = getSidebarRouteTarget(prop, props.viewerContext);
			const isActive = isSidebarRouteActive(prop, location.pathname);
			return (
				<Button
					as={NavLink}
					to={targetPath}
					key={`${prop.name}-${targetPath}`}
					boxSize="initial"
					justifyContent="flex-start"
					alignItems="center"
					mb={{
						xl: '12px',
					}}
					mx={{
						xl: 'auto',
					}}
					ps={{
						sm: '10px',
						xl: '16px',
					}}
					py="12px"
					borderRadius="15px"
					w="100%"
					_active={{
						bg: 'inherit',
						transform: 'none',
						borderColor: 'transparent',
					}}
					_focus={{
						boxShadow: 'none',
					}}
				>
					{isActive ? (
						<Flex
							bg={activeBg}
							boxShadow={activeShadow}
							_hover="none"
							w="100%"
							borderRadius="15px"
							align="center"
						>
							{typeof prop.icon === 'string' ? (
								<Icon>{prop.icon}</Icon>
							) : (
								<IconBox bg="recode.300" color="white" h="30px" w="30px" me="12px">
									{prop.icon}
								</IconBox>
							)}
							<Text color={activeColor} my="auto" fontSize="sm">
								{prop.name}
							</Text>
						</Flex>
					) : (
						<Flex
							bg="transparent"
							_hover="none"
							w="100%"
							borderRadius="15px"
							align="center"
						>
							{typeof prop.icon === 'string' ? (
								<Icon>{prop.icon}</Icon>
							) : (
								<IconBox bg={inactiveBg} color="recode.300" h="30px" w="30px" me="12px">
									{prop.icon}
								</IconBox>
							)}
							<Text color={inactiveColor} my="auto" fontSize="sm">
								{prop.name}
							</Text>
						</Flex>
					)}
				</Button>
			);
		});
	};

	const { logoText, routes, ...rest } = props;

	var links = <>{createLinks(routes)}</>;
	//  BRAND
	//  Chakra Color Mode
	let hamburgerColor = useColorModeValue('gray.500', 'gray.200');
	if (props.secondary === true) {
		hamburgerColor = 'white';
	}
	var brand = (
		<Box pt={'35px'} mb="8px">
			<Link
				as={RouterLink}
				to="/"
				display="flex"
				lineHeight="100%"
				mb="30px"
				fontWeight="bold"
				justifyContent="center"
				alignItems="center"
				fontSize="11px"
			>
				{/* <reCodePlatformLogo w="32px" h="32px" me="10px" />
          <Text fontSize="sm" mt="3px">
            dfs
          </Text> */}
			</Link>
			<Separator></Separator>
		</Box>
	);

	// SIDEBAR
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();
	// Color variables
	return (
		<Flex
			display={{ sm: 'flex', xl: 'none' }}
			ref={mainPanel}
			alignItems="center"
			justifyContent="flex-end"
		>
			<HamburgerIcon
				color={hamburgerColor}
				w="24px"
				h="24px"
				ref={btnRef}
				colorScheme="recode"
				onClick={onOpen}
			/>
			<Drawer isOpen={isOpen} onClose={onClose} placement="right" finalFocusRef={btnRef}>
				<DrawerOverlay />
				<DrawerContent w="250px" maxW="250px" borderRadius="16px 0 0 16px">
					<DrawerCloseButton _focus={{ boxShadow: 'none' }} _hover={{ boxShadow: 'none' }} />
					<DrawerBody maxW="250px" px="1rem">
						<Box maxW="100%" h="100%">
							<Box>{brand}</Box>
							<Stack direction="column" mb="40px">
								<Box>{links}</Box>
							</Stack>
							<SidebarHelp></SidebarHelp>
						</Box>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</Flex>
	);
}

export default SidebarResponsive;
