// Chakra imports
import { Box, Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import { useHistory } from 'react-router-dom';
// react icons
import { BsArrowRight } from 'react-icons/bs';

const WorkWithTheRockets = ({ title, description, backgroundImage }) => {
	const history = useHistory();
	let mainText = useColorModeValue('gray.700', 'gray.700');
	let secondaryText = useColorModeValue('gray.500', 'gray.500');

	return (
		<Card minHeight="290.5px" h="100%" display="flex" p="1rem">
			<CardBody
				p="0px"
				backgroundImage={backgroundImage}
				bgPosition="center"
				bgRepeat="no-repeat"
				w="100%"
				flex="1"
				minH="258.5px"
				bgSize="cover"
				position="relative"
				borderRadius="15px"
			>
				<Box
					// bg='linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.88) 100%)'
					w="100%"
					position="absolute"
					inset="0"
					borderRadius="inherit"
				></Box>
				<Flex
					position="absolute"
					inset="0"
					flexDirection="column"
					color="white"
					p="1.5rem 1.2rem 1.2rem 1.2rem"
					lineHeight="1.6"
				>
					<Text fontSize="xl" fontWeight="bold" pb=".3rem" color={mainText}>
						{title}
					</Text>
					<Text fontSize="xs" fontWeight="normal" w={{ lg: '50%' }} color={secondaryText}>
						{description}
					</Text>
					<Flex align="center" mt="auto">
						<Button p="0px" variant="no-hover" bg="transparent" onClick={() => history.push('/')}>
							<Text
								fontSize="sm"
								fontWeight="bold"
								color={mainText}
								_hover={{ me: '4px' }}
								transition="all .5s ease"
							>
								Заказать
							</Text>
							<Icon
								as={BsArrowRight}
								w="20px"
								h="20px"
								fontSize="xl"
								color={mainText}
								transition="all .5s ease"
								mx=".3rem"
								cursor="pointer"
								_hover={{ transform: 'translateX(20%)' }}
								pb="2px"
							/>
						</Button>
					</Flex>
				</Flex>
			</CardBody>
		</Card>
	);
};

export default WorkWithTheRockets;
