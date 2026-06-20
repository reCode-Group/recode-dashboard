const emptyValue = 'Не указано';

const CONVERSION_STATUS_LABELS = {
	done: 'Завершен',
	failed: 'Ошибка',
};

export function getConversionStatusLabel(status) {
	return CONVERSION_STATUS_LABELS[status] || emptyValue;
}

export function formatConversionDate(value, options) {
	if (!value) return emptyValue;

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return emptyValue;

	if (options) {
		return new Intl.DateTimeFormat('ru-RU', options).format(date);
	}

	return date.toLocaleDateString('ru-RU');
}

export function mapConversion(row, options = {}) {
	const origin = row.origin_language || row.origin_code || '-';
	const target = row.target_language || row.target_code || '-';

	return {
		id: row.id,
		type: `${origin} → ${target}`,
		tokens_remain: row.total_tokens,
		result_url: '',
		rawStatus: row.status,
		status: getConversionStatusLabel(row.status),
		sourceCode: row.origin_code || '',
		translatedCode: row.target_code || '',
		date: formatConversionDate(row.created_at, options.dateFormat),
	};
}
