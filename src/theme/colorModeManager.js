const COOKIE_KEY = 'recode-color-mode';
const LEGACY_STORAGE_KEY = 'chakra-ui-color-mode';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function normalizeColorMode(value) {
	return value === 'light' || value === 'dark' ? value : undefined;
}

function readCookieColorMode() {
	if (typeof document === 'undefined') {
		return undefined;
	}

	const cookie = document.cookie.split('; ').find((item) => item.startsWith(`${COOKIE_KEY}=`));

	return normalizeColorMode(cookie?.slice(COOKIE_KEY.length + 1));
}

function readLegacyColorMode() {
	if (typeof window === 'undefined') {
		return undefined;
	}

	try {
		return normalizeColorMode(window.localStorage.getItem(LEGACY_STORAGE_KEY));
	} catch (error) {
		return undefined;
	}
}

function writeLegacyColorMode(colorMode) {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		window.localStorage.setItem(LEGACY_STORAGE_KEY, colorMode);
	} catch (error) {
		// The shared cookie remains the source of truth when localStorage is unavailable.
	}
}

function writeCookieColorMode(colorMode) {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return;
	}

	const hostname = window.location.hostname;
	const isSharedDomain = hostname === 'recode-group.ru' || hostname.endsWith('.recode-group.ru');
	const attributes = [
		`${COOKIE_KEY}=${colorMode}`,
		'Path=/',
		`Max-Age=${COOKIE_MAX_AGE}`,
		'SameSite=Lax',
	];

	if (isSharedDomain) {
		attributes.push('Domain=recode-group.ru');
	}

	if (window.location.protocol === 'https:') {
		attributes.push('Secure');
	}

	document.cookie = attributes.join('; ');
}

export const sharedColorModeManager = {
	type: 'cookie',
	get(initialColorMode = 'light') {
		const cookieColorMode = readCookieColorMode();

		if (cookieColorMode) {
			writeLegacyColorMode(cookieColorMode);
			return cookieColorMode;
		}

		const colorMode = readLegacyColorMode() || normalizeColorMode(initialColorMode) || 'light';
		writeCookieColorMode(colorMode);
		return colorMode;
	},
	set(value) {
		const colorMode = normalizeColorMode(value);

		if (!colorMode) {
			return;
		}

		writeLegacyColorMode(colorMode);
		writeCookieColorMode(colorMode);
	},
};
