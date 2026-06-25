// Chakra Imports
import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Flex,
	Link,
	useColorModeValue,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AdminNavbarLinks from './AdminNavbarLinks';

export default function AdminNavbar(props) {
	const [scrolled, setScrolled] = useState(false);
	const { variant, children, fixed, secondary, brandText, onOpen, hasLeftInset, ...rest } = props;

	// Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
	let mainText = useColorModeValue('gray.700', 'gray.200');
	let secondaryText = useColorModeValue('gray.400', 'gray.200');
	let navbarPosition = 'absolute';
	let navbarFilter = 'none';
	let navbarBackdrop = 'blur(21px)';
	let navbarShadow = 'none';
	let navbarBg = 'none';
	let navbarBorder = 'transparent';
	let secondaryMargin = '0px';
	let paddingX = '15px';
	let leftInsetPadding = '0px';
	const scrolledNavbarShadow = useColorModeValue('0px 7px 23px rgba(0, 0, 0, 0.05)', 'none');
	const scrolledNavbarBg = useColorModeValue(
		'linear-gradient(112.83deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)',
		'linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)'
	);
	const scrolledNavbarBorder = useColorModeValue('#FFFFFF', 'rgba(255, 255, 255, 0.31)');
	const scrolledNavbarFilter = useColorModeValue(
		'none',
		'drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))'
	);
	if (props.fixed === true)
		if (scrolled === true) {
			navbarPosition = 'fixed';
			navbarShadow = scrolledNavbarShadow;
			navbarBg = scrolledNavbarBg;
			navbarBorder = scrolledNavbarBorder;
			navbarFilter = scrolledNavbarFilter;
		}
	if (props.secondary) {
		navbarBackdrop = 'none';
		navbarPosition = 'absolute';
		mainText = 'white';
		secondaryText = 'white';
		secondaryMargin = '22px';
		paddingX = '30px';
	}
	if (hasLeftInset) {
		leftInsetPadding = '24px';
	}
	const changeNavbar = () => {
		if (window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	};
	useEffect(() => {
		window.addEventListener('scroll', changeNavbar, { passive: true });
		return () => window.removeEventListener('scroll', changeNavbar);
	}, []);
	return (
		<Flex
			position={navbarPosition}
			boxShadow={navbarShadow}
			bg={navbarBg}
			borderColor={navbarBorder}
			filter={navbarFilter}
			backdropFilter={navbarBackdrop}
			borderWidth="1.5px"
			borderStyle="solid"
			transitionDelay="0s, 0s, 0s, 0s"
			transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
			transition-property="box-shadow, background-color, filter, border"
			transitionTimingFunction="linear, linear, linear, linear"
			justifyContent={{ xl: 'center' }}
			alignItems={{ xl: 'center' }}
			borderRadius="16px"
			display="flex"
			minH="75px"
			lineHeight="25.6px"
			mt={secondaryMargin}
			py="8px"
			px={{
				sm: paddingX,
				md: '16px',
			}}
			right="30px"
			top="18px"
			w={{ sm: 'calc(100vw - 60px)', xl: 'calc(100vw - 60px - 275px)' }}
		>
			<Flex
				w="100%"
				flexDirection={{
					sm: 'column',
					md: 'row',
				}}
				alignItems={{ sm: 'start', md: 'center' }}
				ps={{ base: '0px', md: leftInsetPadding }}
			>
				<Box mb={{ sm: '8px', md: '0px' }} fontSize="xs" w={{ base: '100%', md: 'auto' }}>
					<Flex align={{ base: 'center', md: 'stretch' }} justify="space-between" gap="12px">
						<Box minW="0">
							<Breadcrumb>
								<BreadcrumbItem color={mainText}>
									<BreadcrumbLink as={RouterLink} to="/lk/dashboard" color={secondaryText}>
										Личный кабинет
									</BreadcrumbLink>
								</BreadcrumbItem>

								<BreadcrumbItem color={mainText}>
									<BreadcrumbLink as="span" color={mainText} cursor="default">
										{brandText}
									</BreadcrumbLink>
								</BreadcrumbItem>
							</Breadcrumb>
							{/* Here we create navbar brand, based on route name */}
							<Link
								as={RouterLink}
								to="/lk/dashboard"
								color={mainText}
								bg="inherit"
								borderRadius="inherit"
								fontWeight="bold"
								fontSize={24}
								_hover={{ color: { mainText } }}
								_active={{
									bg: 'inherit',
									transform: 'none',
									borderColor: 'transparent',
								}}
								_focus={{
									boxShadow: 'none',
								}}
							>
								{brandText}
							</Link>
						</Box>
						<Box display={{ base: 'flex', md: 'none' }} flexShrink={0} alignItems="center">
							<AdminNavbarLinks
								onOpen={props.onOpen}
								logoText={props.logoText}
								secondary={props.secondary}
								fixed={props.fixed}
								viewerContext={props.viewerContext}
								showOnlyMobileMenu={true}
							/>
						</Box>
					</Flex>
				</Box>
				<Box ms="auto" w={{ sm: '100%', md: 'unset' }} display={{ base: 'none', md: 'block' }}>
					<AdminNavbarLinks
						onOpen={props.onOpen}
						logoText={props.logoText}
						secondary={props.secondary}
						fixed={props.fixed}
						viewerContext={props.viewerContext}
					/>
				</Box>
			</Flex>
		</Flex>
	);
}

AdminNavbar.propTypes = {
	brandText: PropTypes.string,
	variant: PropTypes.string,
	secondary: PropTypes.bool,
	fixed: PropTypes.bool,
	hasLeftInset: PropTypes.bool,
	onOpen: PropTypes.func,
};
