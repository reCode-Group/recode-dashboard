export const inputStyles = {
	components: {
		Input: {
			defaultProps: {
				size: 'lg',
				focusBorderColor: 'recode.300',
			},
			baseStyle: (props) => ({
				field: {
					borderRadius: '15px',
					fontSize: 'sm',
					color: props.colorMode === 'dark' ? 'white' : 'black',
					bg: props.colorMode === 'dark' ? 'whiteAlpha.50' : 'white',
					_placeholder: {
						color: 'gray.400',
					},
					_focusVisible: {
						borderColor: 'recode.300',
						boxShadow: '0 0 0 1px var(--chakra-colors-recode-300)',
					},
				},
			}),
		},
	},
};
