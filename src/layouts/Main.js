// chakra imports
import { Box, ChakraProvider, Portal } from '@chakra-ui/react';
import Footer from 'components/Footer/Footer.js';
// core components
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AuthNavbar from 'components/Navbars/AuthNavbar.js';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from 'routes.js';
import theme from 'theme/theme.js';

export default function MainLayout(props) {
	const { ...rest } = props;
	// ref for the wrapper div
	const wrapper = React.createRef();
	React.useEffect(() => {
		document.body.style.overflow = 'unset';
		// Specify how to clean up after this effect:
		return function cleanup() {};
	});
	const getActiveRoute = (routes) => {
		let activeRoute = 'reCode Dashboard';
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].collapse) {
				let collapseActiveRoute = getActiveRoute(routes[i].views);
				if (collapseActiveRoute !== activeRoute) {
					return collapseActiveRoute;
				}
			} else if (routes[i].category) {
				let categoryActiveRoute = getActiveRoute(routes[i].views);
				if (categoryActiveRoute !== activeRoute) {
					return categoryActiveRoute;
				}
			} else {
				if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
					return routes[i].name;
				}
			}
		}
		return activeRoute;
	};
	const getActiveNavbar = (routes) => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].category) {
				let categoryActiveNavbar = getActiveNavbar(routes[i].views);
				if (categoryActiveNavbar !== activeNavbar) {
					return categoryActiveNavbar;
				}
			} else {
				if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
					if (routes[i].secondaryNavbar) {
						return routes[i].secondaryNavbar;
					}
				}
			}
		}
		return activeNavbar;
	};

	const getRoutes = (routes) => {
		return routes.map((prop, key) => {
			if (prop.collapse) {
				return getRoutes(prop.views);
			}
			if (prop.category === 'account') {
				return getRoutes(prop.views);
			}
			if (prop.layout === '/auth' || prop.layout === '/main') {
				return <Route exact path={prop.layout + prop.path} component={prop.component} key={key} />;
			} else {
				return null;
			}
		});
	};

	const navRef = React.useRef();

	return (
		<ChakraProvider theme={theme} resetCss={false} w="100%">
			<Box ref={navRef} w="100%">
				<Portal containerRef={navRef}>
					<AuthNavbar secondary={getActiveNavbar(routes)} logoText="RECODE DASHBOARD" />
				</Portal>
				<Box w="100%">
					<Box ref={wrapper} w="1044px" mx="auto">
						<Switch>
							{getRoutes(routes)}
							<Redirect from="/main" to="/main/macro-translator" />
							<Redirect from="/auth" to="/auth/login-page" />
						</Switch>
					</Box>
				</Box>
				<Box px="24px" mx="auto" width="1044px" maxW="100%">
					<Footer />
				</Box>
			</Box>
		</ChakraProvider>
	);
}
