const DEFAULT_RETRY_DELAY_MS = 2200;
const API_BASE_URL = import.meta.env.DEV
	? ''
	: String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

function wait(ms) {
	return new Promise((resolve) => {
		window.setTimeout(resolve, ms);
	});
}

function buildApiUrl(path) {
	if (!API_BASE_URL || /^https?:\/\//i.test(path)) {
		return path;
	}

	return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function parseResponse(response) {
	const text = await response.text();
	if (!text) {
		return null;
	}

	try {
		return JSON.parse(text);
	} catch (error) {
		return text;
	}
}

function getErrorMessage(payload, fallback) {
	if (!payload) {
		return fallback;
	}
	if (typeof payload === 'string') {
		return payload;
	}
	return payload.error || payload.message || fallback;
}

function getRetryDelay(response) {
	const retryAfter = Number(response.headers.get('Retry-After'));
	if (Number.isFinite(retryAfter) && retryAfter > 0) {
		return retryAfter * 1000;
	}
	return DEFAULT_RETRY_DELAY_MS;
}

export async function apiRequest(path, options = {}) {
	const { retryOnRateLimit = true, ...requestOptions } = options;
	const response = await fetch(buildApiUrl(path), {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...(requestOptions.headers || {}),
		},
		...requestOptions,
	});

	if (response.status === 429 && retryOnRateLimit) {
		await wait(getRetryDelay(response));
		return apiRequest(path, { ...options, retryOnRateLimit: false });
	}

	const payload = await parseResponse(response);
	if (!response.ok) {
		throw new Error(getErrorMessage(payload, 'Не удалось выполнить запрос'));
	}

	return payload;
}

export { buildApiUrl };
