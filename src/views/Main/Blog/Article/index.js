import {
	AspectRatio,
	Box,
	Button,
	Flex,
	Grid,
	Heading,
	Image,
	Link,
	SimpleGrid,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useHistory, useParams } from 'react-router-dom';
import { BLOG_ARTICLES, getBlogArticleBySlug } from '../data';

export default function BlogArticlePage() {
	const history = useHistory();
	const { slug } = useParams();
	const article = getBlogArticleBySlug(slug);
	const titleColor = useColorModeValue('gray.700', 'white');
	const mutedColor = useColorModeValue('gray.500', 'gray.300');
	const panelBg = useColorModeValue('white', 'gray.700');
	const panelBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
	const [relatedArticles, setRelatedArticles] = useState([]);

	useEffect(() => {
		const shuffledArticles = [...BLOG_ARTICLES].sort(() => Math.random() - 0.5);
		setRelatedArticles(shuffledArticles.slice(0, 4));
	}, [slug]);

	if (!article) {
		return (
			<Flex
				direction="column"
				align="flex-start"
				pt={{ base: '120px', md: '150px' }}
				pb={{ base: '56px', md: '72px' }}
				gap="14px"
			>
				<Text color={mutedColor}>Статья не найдена</Text>
				<Button onClick={() => history.push('/blog')} bg="recode.500" color="white">
					Вернуться в блог
				</Button>
			</Flex>
		);
	}

	return (
		<Flex direction="column" pt={{ base: '120px', md: '150px' }} pb={{ base: '56px', md: '72px' }}>
			<Link as={RouterLink} to="/blog" color="recode.500" fontSize="sm" mb="14px">
				← Назад к блогу
			</Link>

			<Heading as="h1" fontSize={{ base: '30px', md: '38px' }} lineHeight="1.2" color={titleColor}>
				{article.title}
			</Heading>
			<Text mt="10px" color={mutedColor} fontSize={{ base: 'sm', md: 'md' }} maxW="820px">
				{article.subtitle}
			</Text>

			<Grid
				templateColumns={{ base: '1fr', lg: 'minmax(0, 2.2fr) minmax(240px, 1fr)' }}
				gap="24px"
				mt="24px"
			>
				<Box>
					<Image
						src={article.heroImage}
						alt={article.title}
						w="100%"
						h={{ base: '200px', md: '320px' }}
						objectFit="cover"
						borderRadius="18px"
						mb={{ base: '24px', md: '30px' }}
					/>

					<Box maxW="820px">
						{article.content.map((paragraph, index) => (
							<Text
								key={`${article.slug}-${index}`}
								fontSize={{ base: 'md', md: 'lg' }}
								lineHeight="1.95"
								color={titleColor}
								mb={index === article.content.length - 1 ? '0' : { base: '20px', md: '26px' }}
							>
								{paragraph}
							</Text>
						))}
					</Box>
				</Box>

				<Box position={{ base: 'static', lg: 'sticky' }} top={{ lg: '110px' }} alignSelf="start">
					<AspectRatio ratio={1}>
						<Box
							bg={panelBg}
							borderWidth="1px"
							borderColor={panelBorder}
							borderRadius="16px"
							p="16px"
							display="flex"
							flexDirection="column"
							justifyContent="space-between"
						>
							<Box>
								<Text
									fontSize="xs"
									fontWeight="700"
									letterSpacing="0.5px"
									color="recode.500"
									mb="10px"
								>
									РЕКЛАМА
								</Text>
								<Heading
									as="h3"
									fontSize={{ base: 'lg', md: 'xl' }}
									lineHeight="1.3"
									color={titleColor}
								>
									Переводите VBA-макросы в современные языки
								</Heading>
								<Text fontSize="sm" color={mutedColor} mt="10px">
									Платформа reCode ускоряет миграцию кода и снижает риски ручного переписывания.
								</Text>
							</Box>

							<Button
								bg="white"
								color="gray.700"
								borderWidth="1px"
								borderColor="gray.300"
								_hover={{ bg: 'gray.50' }}
							>
								Попробовать сервис
							</Button>
						</Box>
					</AspectRatio>
				</Box>
			</Grid>

			<Box my="75px">
				<Heading as="h2" fontSize={{ base: '22px', md: '28px' }} color={titleColor} mb="14px">
					Читайте также
				</Heading>
				<SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing="16px">
					{relatedArticles.map((relatedArticle) => (
						<Box
							key={relatedArticle.slug}
							bg={panelBg}
							borderWidth="1px"
							borderColor={panelBorder}
							borderRadius="14px"
							overflow="hidden"
							display="flex"
							flexDirection="column"
							transition="all 0.2s ease-in-out"
							_hover={{ transform: 'translateY(-3px)', boxShadow: 'md' }}
						>
							<Image
								src={relatedArticle.previewImage}
								alt={relatedArticle.title}
								w="100%"
								h="130px"
								objectFit="cover"
							/>
							<Box p="12px" display="flex" flexDirection="column" flex="1">
								<Heading as="h3" fontSize="md" lineHeight="1.35" color={titleColor} mb="8px">
									{relatedArticle.title}
								</Heading>
								<Text fontSize="sm" mb="12px" color={mutedColor} noOfLines={2}>
									{relatedArticle.description}
								</Text>
								<Button
									as={RouterLink}
									to={`/blog/${relatedArticle.slug}`}
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
								>
									Читать
								</Button>
							</Box>
						</Box>
					))}
				</SimpleGrid>
			</Box>
		</Flex>
	);
}
