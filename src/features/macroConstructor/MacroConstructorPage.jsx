import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

export default function MacroConstructorPage() {
	const titleColor = useColorModeValue('gray.700', 'white');
	const textColor = useColorModeValue('gray.500', 'gray.300');
	const panelBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

	return (
		<Box
			mt={{ base: '120px', md: '140px' }}
			mb="40px"
			px={{ base: '20px', md: '28px' }}
			py={{ base: '24px', md: '32px' }}
			bg={panelBg}
			borderWidth="1px"
			borderColor={borderColor}
			borderRadius="24px"
			boxShadow="0px 12px 32px rgba(15, 23, 42, 0.08)"
		>
			<Heading size="lg" color={titleColor} mb="12px">
				Macro Constructor
			</Heading>
			<Text color={textColor} maxW="720px" lineHeight="1.7">
				This route is reserved for the upcoming in-app macro constructor integration. The
				current migration keeps the dashboard on a modern Vite-based build while preserving
				existing behavior.
			</Text>
		</Box>
	);
}
