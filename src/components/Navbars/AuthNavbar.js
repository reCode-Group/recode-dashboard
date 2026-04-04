// Chakra imports
import { Box, Button, Flex, HStack, Image, Link, Text, useColorModeValue } from '@chakra-ui/react';
import recode_logo_colored from 'assets/svg/recode-logo-colored.svg';
import recode_logo_white from 'assets/svg/recode-logo-white.svg';
import SidebarResponsive from 'components/Sidebar/SidebarResponsive';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import routes from 'routes.js';

export default function AuthNavbar(props) {
	const [open, setOpen] = React.useState(false);
	const handleDrawerToggle = () => {
		setOpen(!open);
	};
	const { logo, logoText, secondary, ...rest } = props;
	// verifies if routeName is the one active (in browser input)
	const activeRoute = (routeName) => {
		return window.location.href.indexOf(routeName) > -1 ? true : false;
	};
	// Chakra color mode
	let navbarIcon = useColorModeValue('gray.700', 'gray.200');
	let mainText = useColorModeValue('gray.700', 'gray.200');
	let navbarBg = useColorModeValue(
		'linear-gradient(112.83deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 110.84%)',
		'linear-gradient(112.83deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 110.84%)'
	);
	let navbarBorder = useColorModeValue(
		'1.5px solid #FFFFFF',
		'1.5px solid rgba(255, 255, 255, 0.31)'
	);
	let navbarShadow = useColorModeValue('0px 7px 23px rgba(0, 0, 0, 0.05)', 'none');
	let navbarFilter = useColorModeValue('none', 'drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))');
	let navbarBackdrop = 'blur(18px)';
	let bgButton = useColorModeValue(
		'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)',
		'gray.800'
	);
	let navbarPosition = 'fixed';
	let colorButton = 'white';
	if (props.secondary === true) {
		navbarIcon = 'white';
		navbarBg = 'none';
		navbarBorder = 'none';
		navbarShadow = 'initial';
		navbarFilter = 'initial';
		navbarBackdrop = 'none';
		bgButton = 'white';
		colorButton = 'gray.700';
		mainText = 'white';
		navbarPosition = 'absolute';
	}
	var brand = (
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
				src={props.secondary === true ? recode_logo_white : recode_logo_colored}
				alt="reCode Platform Logo"
				width={125}
			/>
		</Link>
	);
	var linksAuth = (
		<HStack display={{ sm: 'none', lg: 'flex' }}>
			<NavLink to="/admin/dashboard">
				<Button
					fontSize="sm"
					fontWeight="medium"
					ms="0px"
					me="0px"
					px="0px"
					me={{ sm: '2px', md: '16px' }}
					color={navbarIcon}
					variant="transparent-with-icon"
				>
					<Text>О ПРОЕКТЕ</Text>
				</Button>
			</NavLink>
			<NavLink to="/admin/profile">
				<Button
					fontSize="sm"
					fontWeight="medium"
					ms="0px"
					me="0px"
					px="0px"
					me={{ sm: '2px', md: '16px' }}
					color={navbarIcon}
					variant="transparent-with-icon"
				>
					<Text>
						ПЕРЕВОДЧИК
						<Text
							as="span"
							fontSize="8px"
							fw="bold"
							color={props.secondary === true ? 'white' : 'recode.300'}
							verticalAlign="super"
							ml={0.5}
						>
							Бета
						</Text>
					</Text>
				</Button>
			</NavLink>
			<NavLink to="/main/documentation">
				<Button
					fontSize="sm"
					fontWeight="medium"
					ms="0px"
					me="0px"
					px="0px"
					me={{ sm: '2px', md: '16px' }}
					color={navbarIcon}
					variant="transparent-with-icon"
				>
					<Text>РЕСУРСЫ</Text>
				</Button>
			</NavLink>
			<NavLink to="/main/blog">
				<Button
					fontWeight="medium"
					fontSize="sm"
					ms="0px"
					px="0px"
					me={{ sm: '2px', md: '16px' }}
					color={navbarIcon}
					variant="transparent-with-icon"
				>
					<Text>БЛОГ</Text>
				</Button>
			</NavLink>
			<NavLink to="/auth/signin">
				<Button
					fontSize="sm"
					fontWeight="medium"
					ms="0px"
					px="0px"
					me={{ sm: '2px', md: '16px' }}
					color={navbarIcon}
					variant="transparent-with-icon"
				>
					<Text>ТЕХПОДДЕРЖКА</Text>
				</Button>
			</NavLink>
		</HStack>
	);
	return (
		<Flex
			position={navbarPosition}
			top="16px"
			left="50%"
			transform="translate(-50%, 0px)"
			background={navbarBg}
			border={navbarBorder}
			boxShadow={navbarShadow}
			filter={navbarFilter}
			backdropFilter={navbarBackdrop}
			borderRadius="15px"
			px="24px"
			py="22px"
			mx="auto"
			width="1044px"
			maxW="90%"
			alignItems="center"
			zIndex={1000}
		>
			<Flex w="100%" justifyContent={{ sm: 'start', lg: 'space-between' }}>
				{brand}
				<Box ms={{ base: 'auto', lg: '0px' }} display={{ base: 'flex', lg: 'none' }}>
					<SidebarResponsive
						logoText={props.logoText}
						secondary={props.secondary}
						routes={routes}
						// logo={logo}
						{...rest}
					/>
				</Box>
				{linksAuth}
				<Link href="https://creative-tim.com/product/purity-ui-dashboard">
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
};
