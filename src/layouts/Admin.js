// Chakra imports
import { Box, ChakraProvider, Portal, Spinner, useDisclosure } from '@chakra-ui/react';
import Configurator from 'components/Configurator/Configurator';
import Footer from 'components/Footer/Footer.js';
// Layout components
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import Sidebar from 'components/Sidebar';
import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import routes from 'routes.js';
import { getCurrentUser } from 'services/auth';
import { clearPendingProfileEmail } from 'services/session';
// Custom Chakra theme
import { sharedColorModeManager } from 'theme/colorModeManager.js';
import theme from 'theme/theme.js';
import FixedPlugin from '../components/FixedPlugin/FixedPlugin';
// Custom components
import MainPanel from '../components/Layout/MainPanel';
import PanelContainer from '../components/Layout/PanelContainer';
import PanelContent from '../components/Layout/PanelContent';

function RouteFallback() {
	return (
		<Box minH="50vh" display="flex" alignItems="center" justifyContent="center">
			<Spinner color="recode.300" size="xl" />
		</Box>
	);
}

export default function Dashboard(props) {
	const { ...rest } = props;
	const location = useLocation();
	const isUiConfiguratorEnabled = import.meta.env.MODE !== 'production';
	// states and functions
	const [sidebarVariant, setSidebarVariant] = useState('transparent');
	const [fixed, setFixed] = useState(false);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [viewerContext, setViewerContext] = useState(null);
	// functions for changing the states from components
	const getRoute = () => {
		return window.location.pathname !== '/lk/full-screen-maps';
	};
	const getCurrentPath = () => {
		const rawPath = window.location.pathname || '';
		const noQuery = rawPath.split('?')[0];
		const normalized = noQuery.replace(/\/+$/, '');
		if (normalized) {
			return normalized;
		}
		const rawHash = window.location.hash || '';
		const hashPath = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
		const hashNoQuery = hashPath.split('?')[0];
		const normalizedHash = hashNoQuery.replace(/\/+$/, '');
		return normalizedHash || '/';
	};
	const isRouteActive = (route) => {
		const routePath = `${route.layout}${route.path}`;
		const normalizedRoute = routePath.replace(/\/+$/, '');
		const currentPath = getCurrentPath();
		if (currentPath === (normalizedRoute || '/')) {
			return true;
		}
		// Fallback for hash-based paths (e.g. /#/lk/profile)
		const hashPrefixedPath = `/#${currentPath}`;
		const hashPrefixedNormalizedRoute = `/#${normalizedRoute}`;
		return hashPrefixedPath === (hashPrefixedNormalizedRoute || '/#');
	};
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
				if (isRouteActive(routes[i])) {
					return routes[i].name;
				}
			}
		}
		return activeRoute;
	};
	// This changes navbar state(fixed or not)
	const getActiveNavbar = (routes) => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].category) {
				let categoryActiveNavbar = getActiveNavbar(routes[i].views);
				if (categoryActiveNavbar !== activeNavbar) {
					return categoryActiveNavbar;
				}
			} else {
				if (isRouteActive(routes[i])) {
					if (routes[i].secondaryNavbar) {
						return routes[i].secondaryNavbar;
					}
				}
			}
		}
		return activeNavbar;
	};
	const hasNavbarLeftInset = () => {
		const currentPath = getCurrentPath();
		return currentPath === '/lk/profile' || currentPath === '/lk/company';
	};
	const { isOpen, onOpen, onClose } = useDisclosure();
	useEffect(() => {
		let isMounted = true;

		async function loadViewerContext() {
			try {
				const currentUser = await getCurrentUser();

				if (!isMounted) {
					return;
				}
				setViewerContext(currentUser);
				clearPendingProfileEmail();
				setIsCheckingAuth(false);
			} catch (error) {
				if (isMounted) {
					setViewerContext(null);
					setIsCheckingAuth(false);
				}
			}
		}

		loadViewerContext();

		return () => {
			isMounted = false;
		};
	}, [location.hash, location.pathname]);
	// Chakra Color Mode
	if (isCheckingAuth) {
		return (
			<ChakraProvider theme={theme} colorModeManager={sharedColorModeManager} resetCss={false}>
				<Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
					<Spinner color="recode.300" size="xl" />
				</Box>
			</ChakraProvider>
		);
	}

	return (
		<ChakraProvider theme={theme} colorModeManager={sharedColorModeManager} resetCss={false}>
			<Sidebar
				routes={routes}
				viewerContext={viewerContext}
				logoText={'RECODE DASHBOARD'}
				display="none"
				sidebarVariant={sidebarVariant}
				{...rest}
			/>
			<MainPanel
				w={{
					base: '100%',
					xl: 'calc(100% - 275px)',
				}}
			>
				<Portal>
					<AdminNavbar
						logoText={'RECODE DASHBOARD'}
						brandText={getActiveRoute(routes)}
						secondary={getActiveNavbar(routes)}
						hasLeftInset={hasNavbarLeftInset()}
						fixed={fixed}
						viewerContext={viewerContext}
						{...rest}
					/>
				</Portal>
				{getRoute() ? (
					<PanelContent>
						<PanelContainer>
							<Suspense fallback={<RouteFallback />}>
								<Outlet />
							</Suspense>
						</PanelContainer>
					</PanelContent>
				) : null}
				<Footer />
				{isUiConfiguratorEnabled ? (
					<>
						<Portal>
							<FixedPlugin secondary={getActiveNavbar(routes)} fixed={fixed} onOpen={onOpen} />
						</Portal>
						<Configurator
							secondary={getActiveNavbar(routes)}
							isOpen={isOpen}
							onClose={onClose}
							isChecked={fixed}
							onSwitch={(value) => {
								setFixed(value);
							}}
							onOpaque={() => setSidebarVariant('opaque')}
							onTransparent={() => setSidebarVariant('transparent')}
						/>
					</>
				) : null}
			</MainPanel>
		</ChakraProvider>
	);
}
