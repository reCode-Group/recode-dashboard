import { mode } from '@chakra-ui/theme-tools';

export const globalStyles = {
	colors: {
		gray: {
			700: '#1f2733',
		},
		recode: {
			100: '#3c8dff',
			200: '#0066f5',
			300: '#005de0',
			400: '#0051c2',
			500: '#005de0',
			600: '#005de0',
		},
	},
	styles: {
		global: (props) => ({
			body: {
				bg: mode('#F8F9FA', 'gray.800')(props),
				fontFamily: "'Roboto', sans-serif",
			},
			html: {
				fontFamily: "'Roboto', sans-serif",
			},
		}),
	},
};
