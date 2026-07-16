// chakra imports
import { Box, ChakraProvider, Portal } from '@chakra-ui/react';
import Footer from 'components/Footer/Footer.js';
// core components
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AuthNavbar from 'components/Navbars/AuthNavbar.js';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { sharedColorModeManager } from 'theme/colorModeManager.js';
import theme from 'theme/theme.js';

export default function Pages(props) {
	const { ...rest } = props;
	const location = useLocation();
	const isSignUpPage = location.pathname === '/auth/sign-up';
	// ref for the wrapper div
	const wrapper = React.createRef();
	React.useEffect(() => {
		document.body.style.overflow = 'unset';
		// Specify how to clean up after this effect:
		return function cleanup() {};
	});
	const navRef = React.useRef();
	return (
		<ChakraProvider theme={theme} colorModeManager={sharedColorModeManager} resetCss={false}>
			<Box ref={navRef} w="100%">
				{!isSignUpPage ? (
					<Portal containerRef={navRef}>
						<AuthNavbar
							secondary={false}
							logoText="RECODE DASHBOARD"
							usePublicDrawer={true}
						/>
					</Portal>
				) : null}
				<Box w="100%">
					<Box ref={wrapper} w="100%">
						<Outlet />
					</Box>
				</Box>
				<Box px="24px" mx="auto" width="1044px" maxW="100%">
					<Footer />
				</Box>
			</Box>
		</ChakraProvider>
	);
}
