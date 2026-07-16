import { apiRequest } from './apiClient';

export function sendSupportRequest({ subject, description }) {
	return apiRequest('/api/support/requests', {
		method: 'POST',
		body: JSON.stringify({
			subject: subject.trim(),
			message: description.trim(),
		}),
	});
}
