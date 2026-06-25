const DADATA_PARTY_SUGGEST_URL =
	'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party';

export function hasDadataApiKey() {
	return Boolean(import.meta.env.VITE_DADATA_API_KEY);
}

export async function suggestParties(query, count = 5) {
	const token = import.meta.env.VITE_DADATA_API_KEY;
	const trimmedQuery = query.trim();

	if (!token || trimmedQuery.length < 2) {
		return [];
	}

	const response = await fetch(DADATA_PARTY_SUGGEST_URL, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Token ${token}`,
		},
		body: JSON.stringify({
			query: trimmedQuery,
			count,
			status: ['ACTIVE'],
		}),
	});

	if (!response.ok) {
		throw new Error('Не удалось загрузить подсказки организаций');
	}

	const payload = await response.json();
	return payload.suggestions || [];
}

export function mapPartySuggestion(suggestion) {
	const data = suggestion?.data || {};
	const names = data.name || {};
	const address = data.address || {};

	return {
		entityType: data.type === 'INDIVIDUAL' ? 'ip' : 'company',
		fullName: names.full_with_opf || suggestion?.unrestricted_value || suggestion?.value || '',
		shortName: names.short_with_opf || suggestion?.value || '',
		inn: data.inn || '',
		kpp: data.kpp || '',
		ogrn: data.ogrn || '',
		okpo: data.okpo || '',
		legalAddress: address.unrestricted_value || address.value || '',
		managementName: data.management?.name || '',
		managementPost: data.management?.post || '',
	};
}
