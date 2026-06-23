import { apiRequest } from './apiClient';

export function getUserSubscription() {
	return apiRequest('/api/user/subscription', {
		method: 'GET',
	});
}

export function getTokenPackages() {
	return apiRequest('/api/token-packages', {
		method: 'GET',
	});
}
