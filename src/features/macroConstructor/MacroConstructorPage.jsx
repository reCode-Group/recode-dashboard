import { useEffect } from 'react';
import App from './src/App.jsx';
import './app/styles/core.css';
import './app/styles/main.css';
import './app/styles/modals.css';

const MATERIAL_SYMBOLS_LINK_ID = 'macro-constructor-material-symbols';
const MATERIAL_SYMBOLS_HREF =
	'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap';

export default function MacroConstructorPage() {
	useEffect(() => {
		if (document.getElementById(MATERIAL_SYMBOLS_LINK_ID)) {
			return undefined;
		}

		const link = document.createElement('link');
		link.id = MATERIAL_SYMBOLS_LINK_ID;
		link.rel = 'stylesheet';
		link.href = MATERIAL_SYMBOLS_HREF;
		document.head.appendChild(link);

		return () => {
			link.remove();
		};
	}, []);

	return <App />;
}
