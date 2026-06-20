import { apiRequest } from './apiClient';

export function getTokenHistory({ limit = 7, cursor, type, accountType } = {}) {
	const params = new URLSearchParams();

	if (Number.isFinite(limit) && limit > 0) {
		params.set('limit', String(Math.min(limit, 100)));
	}
	if (cursor) {
		params.set('cursor', cursor);
	}
	if (type) {
		params.set('type', type);
	}
	if (accountType) {
		params.set('account_type', accountType);
	}

	const query = params.toString();

	return apiRequest(`/api/token-history${query ? `?${query}` : ''}`, {
		method: 'GET',
	});
}
