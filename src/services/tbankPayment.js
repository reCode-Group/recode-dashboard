const TBANK_INTEGRATION_SCRIPT_ID = 'tbank-payment-integration';
const TBANK_INTEGRATION_SCRIPT_URL = 'https://integrationjs.t-static.ru/integration.js';

let integrationScriptPromise;

export function getTBankTerminalKey() {
	return String(import.meta.env.VITE_TBANK_TERMINAL_KEY || '').trim();
}

export function loadTBankPaymentIntegration() {
	if (window.PaymentIntegration?.init) {
		return Promise.resolve(window.PaymentIntegration);
	}

	if (integrationScriptPromise) {
		return integrationScriptPromise;
	}

	integrationScriptPromise = new Promise((resolve, reject) => {
		const existingScript = document.getElementById(TBANK_INTEGRATION_SCRIPT_ID);
		if (existingScript) {
			existingScript.remove();
		}
		const script = document.createElement('script');

		const handleLoad = () => {
			if (window.PaymentIntegration?.init) {
				resolve(window.PaymentIntegration);
				return;
			}

			integrationScriptPromise = undefined;
			reject(new Error('Скрипт оплаты Т-Банка загрузился некорректно'));
		};

		const handleError = () => {
			script.remove();
			integrationScriptPromise = undefined;
			reject(new Error('Не удалось загрузить форму оплаты Т-Банка'));
		};

		script.addEventListener('load', handleLoad, { once: true });
		script.addEventListener('error', handleError, { once: true });

		script.id = TBANK_INTEGRATION_SCRIPT_ID;
		script.src = TBANK_INTEGRATION_SCRIPT_URL;
		script.async = true;
		document.body.appendChild(script);
	});

	return integrationScriptPromise;
}

export async function mountTBankPaymentForm({
	container,
	paymentUrl,
	integrationName,
	onLoaded,
	onStatusChange,
}) {
	const terminalKey = getTBankTerminalKey();
	if (!terminalKey) {
		throw new Error('Онлайн-оплата не настроена: отсутствует ключ терминала');
	}

	const PaymentIntegration = await loadTBankPaymentIntegration();
	const integration = await PaymentIntegration.init({
		terminalKey,
		product: 'eacq',
		features: { iframe: {} },
	});
	const iframeIntegration = await integration.iframe.create(integrationName, {
		loadedCallback: onLoaded,
		status: {
			changedCallback: onStatusChange,
		},
	});

	await iframeIntegration.mount(container, paymentUrl);

	return async () => {
		await integration.iframe.remove(integrationName);
	};
}
