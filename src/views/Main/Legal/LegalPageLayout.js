import {
	Box,
	Heading,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';

export default function LegalPageLayout({ title, subtitle, updatedAt, sections }) {
	const titleColor = useColorModeValue('gray.700', 'white');
	const mutedColor = useColorModeValue('gray.500', 'gray.300');

	return (
		<Box py={{ base: '120px', md: '150px' }}>
			<Text color="recode.500" fontWeight="700" fontSize="xs" letterSpacing="0.8px">
				ЮРИДИЧЕСКАЯ ИНФОРМАЦИЯ
			</Text>
			<Heading mt="10px" fontSize={{ base: '30px', md: '40px' }} lineHeight="1.15" color={titleColor}>
				{title}
			</Heading>
			<Text mt="10px" color={mutedColor} maxW="860px" fontSize={{ base: 'sm', md: 'md' }}>
				{subtitle}
			</Text>
			<Text mt="12px" fontSize="sm" color={mutedColor}>
				Актуально на: {updatedAt}
			</Text>

			<Stack spacing={{ base: '22px', md: '28px' }} mt={{ base: '24px', md: '34px' }} maxW="860px">
				{sections.map((section, index) => (
					<Box key={section.id} id={section.id}>
						<Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} color={titleColor} mb="10px">
							{index + 1}. {section.title}
						</Heading>
						<Stack spacing="10px">
							{section.paragraphs.map((paragraph, paragraphIndex) => (
								<Text key={`${section.id}-${paragraphIndex}`} color={titleColor} fontSize="md" lineHeight="1.85">
									{paragraph}
								</Text>
							))}
						</Stack>
					</Box>
				))}
			</Stack>
		</Box>
	);
}
