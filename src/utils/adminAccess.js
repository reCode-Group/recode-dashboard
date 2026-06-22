export const PROFILE_COMPLETE_PATH = '/lk/profile/complete';
export const DASHBOARD_PATH = '/lk/dashboard';

const PROFILE_PATH = '/lk/profile';
const BILLING_PATH = '/lk/billing';
const BILLING_PAY_PATH = '/lk/billing/pay';
const TARIFF_PATH = '/lk/tariff';
const COMPANY_PATH = '/lk/company';
const COMPANY_REG_PATH = '/lk/company/reg';
const EMPLOYEES_PATH = '/lk/employees';

const REGISTRATION_RESTRICTED_PATHS = new Set([
	PROFILE_PATH,
	BILLING_PATH,
	BILLING_PAY_PATH,
	TARIFF_PATH,
	COMPANY_PATH,
	COMPANY_REG_PATH,
	EMPLOYEES_PATH,
]);

const EMPLOYEE_HIDDEN_PATHS = new Set([COMPANY_PATH]);
const COMPANY_HIDDEN_PATHS = new Set([EMPLOYEES_PATH]);

export function isDirector(user) {
	return user?.has_organization === true && user?.organization_role === 'director';
}

export function isEmployee(user) {
	return user?.has_organization === true && user?.organization_role !== 'director';
}

export function shouldHideSidebarRoute(route, user) {
	const fullPath = `${route.layout}${route.path}`;

	if (fullPath === EMPLOYEES_PATH) {
		return user?.is_completed !== true || user?.has_organization !== true || !isDirector(user);
	}

	if (fullPath === COMPANY_PATH) {
		return isEmployee(user);
	}

	return false;
}

export function getSidebarRouteTarget(route, user) {
	const fullPath = `${route.layout}${route.path}`;

	if (
		user?.is_completed === false &&
		REGISTRATION_RESTRICTED_PATHS.has(fullPath) &&
		!COMPANY_HIDDEN_PATHS.has(fullPath)
	) {
		return PROFILE_COMPLETE_PATH;
	}

	return fullPath;
}

export function isSidebarRouteActive(route, currentPath) {
	const fullPath = `${route.layout}${route.path}`;

	if (fullPath === PROFILE_PATH) {
		return currentPath === PROFILE_PATH || currentPath === PROFILE_COMPLETE_PATH;
	}

	if (fullPath === COMPANY_PATH) {
		return currentPath === COMPANY_PATH || currentPath === COMPANY_REG_PATH;
	}

	return currentPath === fullPath;
}

export function getAdminRouteRedirect(path, user) {
	if (!user) {
		return null;
	}

	if (path === PROFILE_COMPLETE_PATH) {
		return null;
	}

	if (user.is_completed === false && REGISTRATION_RESTRICTED_PATHS.has(path)) {
		return PROFILE_COMPLETE_PATH;
	}

	if (path === EMPLOYEES_PATH && (user.has_organization !== true || !isDirector(user))) {
		return DASHBOARD_PATH;
	}

	if (EMPLOYEE_HIDDEN_PATHS.has(path) && isEmployee(user)) {
		return DASHBOARD_PATH;
	}

	return null;
}
