import { Navigate, Outlet } from 'react-router-dom';
import { hasAuthState } from 'services/session';
import { routePaths } from '../routePaths';

export function RequireGuest() {
	if (hasAuthState()) {
		return <Navigate to={routePaths.dashboard.home()} replace />;
	}

	return <Outlet />;
}
