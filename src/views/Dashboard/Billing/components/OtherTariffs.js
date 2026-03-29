// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';

const tariffs = [
	{ name: 'Стандарт', price: '2 900 ₽ / мес' },
	{ name: 'Профи', price: '6 900 ₽ / мес' },
	{ name: 'Корпоративный', price: 'По запросу' },
];

function OtherTariffs() {
	const textColor = useColorModeValue('gray.700', 'white');
	const mutedColor = useColorModeValue('gray.500', 'gray.400');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

	return (
		<Card p="1.5rem" bg="white">
			<CardHeader pb="8px">
				<Text fontSize="lg" color={textColor} fontWeight="bold">
					Другие тарифы
				</Text>
			</CardHeader>
			<CardBody pt="8px">
				<Flex direction="column" gap="12px">
					{tariffs.map((tariff) => (
						<Flex
							key={tariff.name}
							justify="space-between"
							align="center"
							border="1px solid"
							borderColor={borderColor}
							borderRadius="12px"
							px="12px"
							py="10px"
						>
							<Text color={textColor} fontWeight="semibold">
								{tariff.name}
							</Text>
							<Text color={mutedColor} fontSize="sm" fontWeight="medium">
								{tariff.price}
							</Text>
						</Flex>
					))}
				</Flex>
			</CardBody>
		</Card>
	);
}

export default OtherTariffs;
