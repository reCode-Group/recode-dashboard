import { Button, Flex, Grid, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const tariffs = [
	{
		id: 'standard',
		name: 'СТАНДАРТ',
		badge: 'Хит',
		tokens: '50 000',
		price: {
			month: '20 000 руб./мес.',
			year: '200 000 руб./год',
		},
	},
	{
		id: 'premium',
		name: 'ПРЕМИУМ',
		tokens: '100 000',
		price: {
			month: '50 000 руб./мес.',
			year: '500 000 руб./год',
		},
	},
];

function PeriodSwitcher({ value, onChange }) {
	const borderColor = useColorModeValue('#E2E8F0', 'whiteAlpha.300');
	const activeBg = 'linear-gradient(135deg, #313860 2.25%, #151928 79.87%)';
	const inactiveText = useColorModeValue('#A0AEC0', 'gray.400');

	return (
		<Flex border="1px solid" borderColor={borderColor} borderRadius="8px" p="2px" h="30px">
			<Button
				variant="unstyled"
				h="25px"
				minW="55px"
				px="10px"
				borderRadius="6px"
				fontSize="10px"
				fontWeight="medium"
				color={value === 'year' ? 'white' : inactiveText}
				bg={value === 'year' ? activeBg : 'white'}
				onClick={() => onChange('year')}
			>
				ГОД
			</Button>
			<Button
				variant="unstyled"
				h="25px"
				minW="55px"
				px="10px"
				borderRadius="6px"
				fontSize="10px"
				fontWeight="medium"
				color={value === 'month' ? 'white' : inactiveText}
				bg={value === 'month' ? activeBg : 'white'}
				onClick={() => onChange('month')}
			>
				МЕСЯЦ
			</Button>
		</Flex>
	);
}

function OtherTariffs() {
	const [period, setPeriod] = useState('month');
	const history = useHistory();
	const titleColor = useColorModeValue('#2D3748', 'white');
	const mutedColor = useColorModeValue('#A0AEC0', 'gray.400');
	const borderColor = useColorModeValue('#E2E8F0', 'whiteAlpha.300');
	const cardBg = useColorModeValue('white', 'gray.700');

	return (
		<Card p="24px" bg={cardBg} h={{ base: 'auto', lg: '100%' }}>
			<CardHeader p="0" pb="12px">
				<Flex align="center" justify="space-between" gap="12px" w="100%">
					<Text fontSize="18px" lineHeight="1.4" color={titleColor} fontWeight="bold">
						Другие тарифы
					</Text>
					<PeriodSwitcher value={period} onChange={setPeriod} />
				</Flex>
			</CardHeader>
			<CardBody
				p="0"
				pt="6px"
				h={{ base: 'auto', lg: '100%' }}
				display="flex"
				flexDirection="column"
			>
				<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="12px" w="100%" h="100%">
					{tariffs.map((tariff) => (
						<Flex
							key={tariff.id}
							direction="column"
							border="1px solid"
							borderColor={borderColor}
							borderRadius="15px"
							p="20px"
							minH="178px"
							w="100%"
							flex="1"
						>
							<Flex justify="space-between" align="center" gap="4px" mb="12px">
								<Text fontSize="18px" lineHeight="1.4" fontWeight="bold" color={titleColor}>
									{tariff.name}
								</Text>
								{tariff.badge ? (
									<Flex
										bg="#48BB78"
										color="white"
										borderRadius="12px"
										px="8px"
										h="20px"
										align="center"
										fontSize="10px"
										fontWeight="bold"
									>
										{tariff.badge}
									</Flex>
								) : null}
							</Flex>

							<Text fontSize="12px" color={mutedColor} fontWeight="normal">
								ТОКЕНОВ
							</Text>
							<Text fontSize="14px" color={titleColor} fontWeight="bold" mb="14px">
								{`${tariff.tokens}/мес.`}
							</Text>

							<Text fontSize="12px" color={mutedColor} fontWeight="normal">
								СТОИМОСТЬ
							</Text>
							<Text fontSize="14px" color={titleColor} fontWeight="bold" mb="14px">
								{tariff.price[period]}
							</Text>

							<Button
								variant="outline"
								alignSelf="flex-start"
								mt="auto"
								borderColor="#005DE0"
								color="#005DE0"
								borderRadius="999px"
								h="28px"
								minW="88px"
								px="16px"
								fontSize="10px"
								fontWeight="bold"
								bg="white"
								_hover={{ bg: 'white', opacity: 0.9 }}
								_active={{ bg: 'white' }}
								onClick={() => history.push('/lk/billing/pay')}
							>
								ВЫБРАТЬ
							</Button>
						</Flex>
					))}
				</Grid>
			</CardBody>
		</Card>
	);
}

export default OtherTariffs;
