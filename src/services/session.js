const AUTH_STATE_KEY = 'recode_auth_state';
const PENDING_PROFILE_EMAIL_KEY = 'recode_pending_profile_email';
const PENDING_PROFILE_NAME_KEY = 'recode_pending_profile_name';

export function markAuthenticated() {
	window.localStorage.setItem(AUTH_STATE_KEY, 'authenticated');
}

export function clearAuthState() {
	window.localStorage.removeItem(AUTH_STATE_KEY);
	window.localStorage.removeItem(PENDING_PROFILE_EMAIL_KEY);
	window.localStorage.removeItem(PENDING_PROFILE_NAME_KEY);
}

export function hasAuthState() {
	return window.localStorage.getItem(AUTH_STATE_KEY) === 'authenticated';
}

export function setPendingProfileEmail(email) {
	window.localStorage.setItem(PENDING_PROFILE_EMAIL_KEY, email);
}

export function getPendingProfileEmail() {
	return window.localStorage.getItem(PENDING_PROFILE_EMAIL_KEY) || '';
}

export function clearPendingProfileEmail() {
	window.localStorage.removeItem(PENDING_PROFILE_EMAIL_KEY);
}

export function setPendingProfileName(name) {
	window.localStorage.setItem(PENDING_PROFILE_NAME_KEY, name);
}

export function getPendingProfileName() {
	return window.localStorage.getItem(PENDING_PROFILE_NAME_KEY) || '';
}

export function clearPendingProfileName() {
	window.localStorage.removeItem(PENDING_PROFILE_NAME_KEY);
}
