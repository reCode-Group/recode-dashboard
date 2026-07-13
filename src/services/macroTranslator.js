import { apiRequest } from './apiClient';

export function convertFreeMacro(payload) {
	return apiRequest('/api/convert/free', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export function convertPaidMacro(payload) {
	return apiRequest('/api/convert/paid', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}
