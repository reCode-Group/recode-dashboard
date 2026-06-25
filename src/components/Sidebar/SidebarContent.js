/*eslint-disable*/
// chakra imports
import { Box, Button, Flex, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import IconBox from 'components/Icons/IconBox';
import { RecodePlatformLogo } from 'components/Icons/Icons';
import { Separator } from 'components/Separator/Separator';
import { SidebarHelp } from 'components/Sidebar/SidebarHelp';
import React from 'react';
import { NavLink, Link as RouterLink, useLocation } from 'react-router-dom';
import {
	getSidebarRouteTarget,
	isSidebarRouteActive,
	shouldHideSidebarRoute,
} from 'utils/adminAccess';
// this function creates the links and collapses that appear in the sidebar (left menu)

const SidebarContent = ({ logoText, routes, viewerContext }) => {
	const logoColor = useColorModeValue('black', 'white');
	// to check for active links and opened collapses
	let location = useLocation();
	// this is for the rest of the collapses
	const [state, setState] = React.useState({});

	// verifies if routeName is the one active (in browser input)
	const createLinks = (routes) => {
		// Chakra Color Mode
		const activeBg = useColorModeValue('white', 'gray.700');
		const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.100');
		const activeColor = useColorModeValue('gray.700', 'white');
		const inactiveColor = useColorModeValue('gray.400', 'gray.400');
		const activeShadow = '0px 4px 8px rgba(0, 0, 0, 0.05)';

		return routes.map((prop, key) => {
			if (prop.redirect || prop.hiddenInSidebar || shouldHideSidebarRoute(prop, viewerContext)) {
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
			const targetPath = getSidebarRouteTarget(prop, viewerContext);
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
						xl: '6px',
					}}
					mx={{
						xl: 'auto',
					}}
					py="12px"
					ps={{
						sm: '10px',
						xl: '16px',
					}}
					borderRadius="15px"
					w="100%"
					bg={isActive ? activeBg : 'transparent'}
					boxShadow={isActive ? activeShadow : 'none'}
					_hover={{
						bg: isActive ? activeBg : hoverBg,
					}}
					_active={{
						bg: isActive ? activeBg : hoverBg,
						transform: 'none',
						borderColor: 'transparent',
						boxShadow: isActive ? activeShadow : 'none',
					}}
					_focus={{
						boxShadow: 'none',
					}}
				>
					<Flex bg="transparent" _hover="none" w="100%" borderRadius="15px" align="center">
						{typeof prop.icon === 'string' ? (
							<Icon>{prop.icon}</Icon>
						) : (
							<IconBox
								bg={isActive ? 'recode.300' : 'transparent'}
								color={isActive ? 'white' : 'recode.300'}
								h="30px"
								w="30px"
								me="12px"
							>
								{prop.icon}
							</IconBox>
						)}
						<Text color={isActive ? activeColor : inactiveColor} my="auto" fontSize="sm">
							{prop.name}
						</Text>
					</Flex>
				</Button>
			);
		});
	};

	const links = <>{createLinks(routes)}</>;

	return (
		<>
			<Box pt={'25px'} mb="12px">
				<Link
					as={RouterLink}
					to="/lk/dashboard"
					display="flex"
					lineHeight="100%"
					mb="30px"
					fontWeight="bold"
					justifyContent="center"
					alignItems="center"
					fontSize="11px"
				>
					<RecodePlatformLogo color={logoColor} w="100%" h="32px" />
					{/* <Image 
					src={logo}
					alt="reCode Platform Logo"
					width={2271}
				/> */}
				</Link>
				<Separator></Separator>
			</Box>
			<Stack direction="column" mb="20px">
				<Box>{links}</Box>
			</Stack>
			<SidebarHelp />
		</>
	);
};

export default SidebarContent;
