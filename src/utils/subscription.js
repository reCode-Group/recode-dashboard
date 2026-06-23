const NO_SUBSCRIPTION_MESSAGES = [
	'subscription not found',
	'subscription is not active',
	'ErrNoSubscription',
	'ErrSubscriptionNotActive',
];

export function formatTokenValue(value) {
	return new Intl.NumberFormat('ru-RU').format(Number(value) || 0).replace(/,/g, ' ');
}

export function formatTariffPrice(value, suffix = '₽/мес.') {
	const amount = Number(value);
	if (!Number.isFinite(amount) || amount <= 0) {
		return '—';
	}

	return `${formatTokenValue(amount)} ${suffix}`;
}

export function formatPaymentAmount(value) {
	return new Intl.NumberFormat('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(Number(value) || 0);
}

export function formatSubscriptionDate(value) {
	if (!value) {
		return '—';
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return '—';
	}

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(date);
}

export function isNoSubscriptionError(error) {
	const message = error?.message || '';
	return NO_SUBSCRIPTION_MESSAGES.some((knownMessage) => message.includes(knownMessage));
}

export function normalizeTokenPackages(payload) {
	return Array.isArray(payload?.token_packages) ? payload.token_packages : [];
}

export function buildCurrentTariffCardData(subscription) {
	const packageTokens = Number(subscription?.package_tokens) || 0;
	const tokensRemain = Number(subscription?.tokens_remain) || 0;
	const hasSubscription = Boolean(subscription);
	const isActive = Boolean(subscription?.is_active);

	return {
		title: 'Ваш тариф',
		tariffName: hasSubscription ? String(subscription?.package_name || 'Тариф не указан').toUpperCase() : 'НЕТ ТАРИФА',
		statusLabel: hasSubscription ? (isActive ? 'Активен' : 'Не активен') : 'Не подключен',
		statusColor: hasSubscription && isActive ? '#48BB78' : '#A0AEC0',
		validUntil: {
			name: 'ДЕЙСТВИТЕЛЕН ДО',
			data: hasSubscription ? formatSubscriptionDate(subscription?.expires_at) : '—',
		},
		tokenBalance: {
			name: 'ОСТАТОК ТОКЕНОВ',
			code: `${formatTokenValue(tokensRemain)} / ${formatTokenValue(packageTokens)}`,
		},
		monthlyCost: {
			name: 'СТОИМОСТЬ',
			code: hasSubscription ? formatTariffPrice(subscription?.package_price) : '—',
		},
	};
}
