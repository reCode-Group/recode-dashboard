import { apiRequest } from './apiClient';

export function getUserConversions(limit = 9, cursor) {
	const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 9;
	const cursorParam = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
	return apiRequest(`/api/conversions?limit=${safeLimit}${cursorParam}`, {
		method: 'GET',
	});
}

export function getOrganizationConversions(limit = 9, cursor) {
	const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 9;
	const cursorParam = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
	return apiRequest(`/api/conversions/organization?limit=${safeLimit}${cursorParam}`, {
		method: 'GET',
	});
}
