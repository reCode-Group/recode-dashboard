import { apiRequest, buildApiUrl } from './apiClient';

export const SUPPORT_EMAIL = 'help@recode-group.ru';

export function sendSupportRequest({ subject, description }) {
	return apiRequest('/api/support/requests', {
		method: 'POST',
		body: JSON.stringify({
			subject: subject.trim(),
			message: description.trim(),
		}),
	});
}

export function getAllowedAttachmentTypes() {
	return [
		'image/png',
		'image/jpeg',
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	];
}

export async function sendSupportEmail({ subject, description, files = [] }) {
	const formData = new FormData();
	formData.append('subject', subject);
	formData.append('message', description);
	files.forEach((file) => {
		formData.append('attachments', file);
	});

	const response = await fetch(buildApiUrl('/api/support/email'), {
		method: 'POST',
		credentials: 'include',
		body: formData,
	});

	const payload = await response.text();
	if (!response.ok) {
		throw new Error(payload || 'Не удалось отправить письмо.');
	}

	try {
		return payload ? JSON.parse(payload) : { ok: true };
	} catch (error) {
		return { ok: true };
	}
}
