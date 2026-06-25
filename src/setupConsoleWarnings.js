if (import.meta.env.DEV) {
	const originalConsoleError = console.error;

	console.error = (...args) => {
		const message = args
			.map((arg) => (typeof arg === 'string' ? arg : ''))
			.join(' ');

		const isReactDomRenderLibraryWarning = message.includes(
			'ReactDOM.render is no longer supported in React 18'
		);
		const isChakraDefaultPropsWarning =
			message.includes(
				'Support for defaultProps will be removed from function components in a future major release.'
			) &&
			(message.includes('@chakra-ui_react') ||
				message.includes('ChakraProvider2') ||
				message.includes('Portal') ||
				message.includes('Modal'));

		if (isReactDomRenderLibraryWarning || isChakraDefaultPropsWarning) {
			return;
		}

		originalConsoleError(...args);
	};
}
