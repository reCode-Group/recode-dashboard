import { apiRequest } from './apiClient';

const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENTS_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set(['.pdf', '.docx', '.jpg', '.png']);

function isAllowedAttachment(attachment) {
	const extension = `.${attachment.name.split('.').pop()?.toLowerCase() || ''}`;
	return ALLOWED_FILE_EXTENSIONS.has(extension);
}

export function sendSupportRequest({ subject, description, attachments = [] }) {
	if (attachments.length > MAX_ATTACHMENTS) {
		throw new Error('Можно прикрепить не более 3 файлов.');
	}
	if (attachments.some((attachment) => !isAllowedAttachment(attachment))) {
		throw new Error('Допустимые форматы: PDF, DOCX, JPG и PNG.');
	}
	if (attachments.reduce((total, attachment) => total + attachment.size, 0) > MAX_ATTACHMENTS_SIZE) {
		throw new Error('Общий размер вложений не должен превышать 5 МБ.');
	}

	const formData = new FormData();
	formData.append('subject', subject.trim());
	formData.append('message', description.trim());
	attachments.forEach((attachment) => formData.append('files', attachment));

	return apiRequest('/api/support/requests', {
		method: 'POST',
		body: formData,
	});
}
