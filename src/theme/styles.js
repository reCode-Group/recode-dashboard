import { mode } from '@chakra-ui/theme-tools';

export const globalStyles = {
	colors: {
		gray: {
			700: '#1f2733'
		},
		recode: {
      200: "#005de0",
      300: "#005de0",
      400: "#005de0",
      500: "#005de0",  // ваш основной цвет
      600: "#005de0",  // ваш основной цвет
    },
	},
	styles: {
		global: (props) => ({
			body: {
				bg: mode('#F8F9FA', 'gray.800')(props),
				fontFamily: "'Roboto', sans-serif"
			},
			html: {
				fontFamily: "'Roboto', sans-serif"
			}
		})
	}
};
