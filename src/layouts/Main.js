// chakra imports
import { Box, ChakraProvider, Portal } from '@chakra-ui/react';
import Footer from 'components/Footer/Footer.js';
import { MAIN_CONTAINER_MAX_WIDTH, MAIN_CONTAINER_PADDING_X } from 'constants/layout';
// core components
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AuthNavbar from 'components/Navbars/AuthNavbar.js';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import theme from 'theme/theme.js';

export default function MainLayout(props) {
	const { ...rest } = props;
	const location = useLocation();
	const isDocumentationRoute = location.pathname === '/documentation';
	const isLandingRoute = location.pathname === '/';
	const contentMaxWidth = isDocumentationRoute || isLandingRoute ? '100%' : MAIN_CONTAINER_MAX_WIDTH;
	const contentPaddingX = isDocumentationRoute || isLandingRoute ? '0px' : MAIN_CONTAINER_PADDING_X;
	// ref for the wrapper div
	const wrapper = React.createRef();
	React.useEffect(() => {
		document.body.style.overflow = 'unset';
		// Specify how to clean up after this effect:
		return function cleanup() {};
	});

	const navRef = React.useRef();

	return (
		<ChakraProvider theme={theme} resetCss={false}>
			<Box ref={navRef} w="100%">
				{!isDocumentationRoute && (
					<Portal containerRef={navRef}>
						<AuthNavbar
							secondary={false}
							logoText="RECODE DASHBOARD"
							usePublicDrawer={true}
						/>
					</Portal>
				)}
				<Box w="100%">
					<Box ref={wrapper} w="100%" maxW={contentMaxWidth} px={contentPaddingX} mx="auto">
						<Outlet />
					</Box>
				</Box>
				{!isDocumentationRoute && !isLandingRoute && (
					<Box px={MAIN_CONTAINER_PADDING_X} mx="auto" width="100%" maxW={MAIN_CONTAINER_MAX_WIDTH}>
						<Footer />
					</Box>
				)}
			</Box>
		</ChakraProvider>
	);
}
