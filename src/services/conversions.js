import { apiRequest } from './apiClient';

export function getUserConversions(limit = 9) {
	const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 9;
	return apiRequest(`/api/conversions?limit=${safeLimit}`, {
		method: 'GET',
	});
}

export function getOrganizationConversions(limit = 9) {
	const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 9;
	return apiRequest(`/api/conversions/organization?limit=${safeLimit}`, {
		method: 'GET',
	});
}
