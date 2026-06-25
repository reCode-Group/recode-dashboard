import { Box, ChakraProvider, Spinner } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getCurrentUser } from 'services/auth';
import { clearAuthState, getPendingProfileEmail, hasAuthState } from 'services/session';
import theme from 'theme/theme.js';
import { getAdminRouteRedirect } from 'utils/adminAccess';

function LoadingScreen() {
	return (
		<ChakraProvider theme={theme} resetCss={false}>
			<Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
				<Spinner color="recode.300" size="xl" />
			</Box>
		</ChakraProvider>
	);
}

export function RequireAuth() {
	const location = useLocation();
	const [status, setStatus] = useState('checking');
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		let isMounted = true;

		async function checkAccess() {
			if (!hasAuthState()) {
				if (isMounted) {
					setStatus('unauthorized');
				}
				return;
			}

			if (location.pathname === '/lk/profile/complete' && getPendingProfileEmail()) {
				if (isMounted) {
					setCurrentUser(null);
					setStatus('authorized');
				}
				return;
			}

			try {
				const currentUser = await getCurrentUser();
				const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
				const nextRedirect = getAdminRouteRedirect(normalizedPath, currentUser);

				if (!isMounted) {
					return;
				}

				setCurrentUser(currentUser);
				setStatus('authorized');
			} catch (error) {
				clearAuthState();
				if (isMounted) {
					setCurrentUser(null);
					setStatus('unauthorized');
				}
			}
		}

		checkAccess();

		return () => {
			isMounted = false;
		};
	}, []);

	const redirectTo = useMemo(() => {
		if (status !== 'authorized') {
			return null;
		}

		const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
		const nextRedirect = getAdminRouteRedirect(normalizedPath, currentUser);

		return nextRedirect && nextRedirect !== normalizedPath ? nextRedirect : null;
	}, [currentUser, location.pathname, status]);

	if (status === 'checking') {
		return <LoadingScreen />;
	}

	if (status === 'unauthorized') {
		return <Navigate to="/auth/login-page" replace />;
	}

	if (redirectTo) {
		return <Navigate to={redirectTo} replace />;
	}

	return <Outlet />;
}
