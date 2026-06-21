import { apiRequest } from './apiClient';

export function convertPaidMacro(payload) {
	return apiRequest('/api/convert/paid', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}
