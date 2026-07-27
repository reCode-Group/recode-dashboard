function formatPeriodDate(value) {
	if (!value) {
		return '';
	}

	const date = new Date(`${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) {
		return value;
	}

	const month = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(date);
	const year = new Intl.DateTimeFormat('ru-RU', { year: 'numeric' }).format(date);
	return `${month.charAt(0).toUpperCase()}${month.slice(1)}, ${year}`;
}

export function formatMonthlySpendingAmount(totalKopecks, currency = 'RUB') {
	const amount = Number(totalKopecks) / 100;
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: currency || 'RUB',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(Number.isFinite(amount) ? amount : 0);
}

export function mapMonthlySpendingReport(item) {
	return {
		id: item?.id || '',
		period: formatPeriodDate(item?.period_start),
		amount: formatMonthlySpendingAmount(item?.total_kopecks, item?.currency),
	};
}

export function normalizeMonthlySpendingReports(payload) {
	return Array.isArray(payload?.items) ? payload.items.map(mapMonthlySpendingReport) : [];
}
