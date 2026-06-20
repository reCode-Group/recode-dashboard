import { apiRequest } from './apiClient';

export function getUserSubscription() {
	return apiRequest('/api/user/subscription', {
		method: 'GET',
	});
}
