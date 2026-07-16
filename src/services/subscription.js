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

export function initSubscriptionPayment(tokenPackageId) {
	return apiRequest('/api/subscription/payment/init', {
		method: 'POST',
		body: JSON.stringify({ token_package_id: Number(tokenPackageId) }),
	});
}
