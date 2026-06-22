import {
	Box,
	Button,
	Flex,
	Heading,
	Image,
	SimpleGrid,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { BLOG_ARTICLES } from './data';

export default function BlogPage() {
	const history = useHistory();
	const cardBg = useColorModeValue('white', 'gray.700');
	const cardBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
	const titleColor = useColorModeValue('gray.700', 'white');
	const subtitleColor = useColorModeValue('gray.500', 'gray.300');

	return (
		<Flex
			direction="column"
			pt={{ base: '120px', md: '150px' }}
			pb={{ base: '56px', md: '72px' }}
			height="100vh"
		>
			<Box mb={{ base: '28px', md: '36px' }}>
				<Heading
					mt="14px"
					fontSize={{ base: '30px', md: '38px' }}
					lineHeight="1.2"
					color={titleColor}
				>
					Блог
				</Heading>
				<Text mt="10px" color={subtitleColor} maxW="760px" fontSize={{ base: 'sm', md: 'md' }}>
					Подборка материалов по разработке и сопровождению макросов VBA: от базовых автоматизаций
					до оптимизации и безопасной миграции.
				</Text>
			</Box>

			<SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing="18px">
				{BLOG_ARTICLES.map((article) => (
					<Box
						key={article.slug}
						textAlign="left"
						bg={cardBg}
						borderWidth="1px"
						borderColor={cardBorder}
						borderRadius="16px"
						overflow="hidden"
						display="flex"
						flexDirection="column"
						transition="all 0.2s ease-in-out"
						_hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
					>
						<Image
							src={article.previewImage}
							alt={article.title}
							w="100%"
							h="140px"
							objectFit="cover"
						/>
						<Box p="14px" display="flex" flexDirection="column" flex="1">
							<Heading as="h2" fontSize="md" lineHeight="1.35" color={titleColor} mb="8px">
								{article.title}
							</Heading>
							<Text fontSize="sm" mb="12px" color={subtitleColor} noOfLines={2}>
								{article.description}
							</Text>
							<Button
								mt="auto"
								pt="10px"
								pb="10px"
								size="sm"
								bg="white"
								color="gray.700"
								borderWidth="1px"
								borderColor="gray.300"
								borderRadius="10px"
								_hover={{ bg: 'gray.50' }}
								onClick={() => history.push(`/blog/${article.slug}`)}
							>
								Читать
							</Button>
						</Box>
					</Box>
				))}
			</SimpleGrid>
		</Flex>
	);
}
