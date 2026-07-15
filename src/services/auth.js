import { apiRequest } from './apiClient';

export function login(email, password) {
	return apiRequest('/api/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	});
}

export function register(email, password, name) {
	return apiRequest('/api/register', {
		method: 'POST',
		body: JSON.stringify({ name, email, password }),
	});
}

export function sendVerificationCode(email) {
	return apiRequest('/api/verification-code/send', {
		method: 'POST',
		body: JSON.stringify({ email }),
	});
}

export function verifyCode(email, code) {
	return apiRequest('/api/verification-code/verify', {
		method: 'POST',
		body: JSON.stringify({ email, code }),
	});
}

export function requestPasswordReset(email) {
	return apiRequest('/api/password-reset/request', {
		method: 'POST',
		body: JSON.stringify({ email }),
	});
}

export function confirmPasswordReset(email, code, password) {
	return apiRequest('/api/password-reset/confirm', {
		method: 'POST',
		body: JSON.stringify({ email, code, password }),
	});
}

export function completeRegistration(profile) {
	return apiRequest('/api/registration/complete', {
		method: 'POST',
		body: JSON.stringify(profile),
	});
}

export function getCurrentUser() {
	return apiRequest('/api/user/details', {
		method: 'GET',
	});
}

export function getEmployeesCount() {
	return apiRequest('/api/user/employees/count', {
		method: 'GET',
	});
}
