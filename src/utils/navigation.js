export function resolveRouteTarget(target) {
	if (typeof target !== 'string') {
		return target;
	}

	if (!target.startsWith('/') || !target.includes('#')) {
		return target;
	}

	const [pathname, hashFragment] = target.split('#');
	return {
		pathname: pathname || '/',
		hash: hashFragment ? `#${hashFragment}` : '',
	};
}

export function isExternalUrl(target) {
	return typeof target === 'string' && /^(https?:)?\/\//i.test(target);
}

export function openExternalDocument(target) {
	if (!target) {
		return;
	}

	const anchor = document.createElement('a');
	anchor.href = target;
	anchor.target = '_blank';
	anchor.rel = 'noopener noreferrer';
	anchor.click();
}
