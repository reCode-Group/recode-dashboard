import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import { useMemo, useState } from 'react';

const tariffs = [
	{
		id: 'standard',
		name: 'Стандарт',
		description: '10 сотрудников, 200 000 токенов',
		monthPrice: '2 900 ₽/мес.',
		yearPrice: '29 000 ₽/год',
	},
	{
		id: 'pro',
		name: 'Профи',
		description: '50 сотрудников, 1 000 000 токенов',
		monthPrice: '6 900 ₽/мес.',
		yearPrice: '69 000 ₽/год',
	},
	{
		id: 'enterprise',
		name: 'Корпоративный',
		description: 'Индивидуальные лимиты и SLA',
		monthPrice: 'По запросу',
		yearPrice: 'По запросу',
	},
];

const periods = [
	{ id: 'month', label: 'Месяц' },
	{ id: 'year', label: 'Год' },
];

function SegmentedControl({ value, onChange }) {
	const activeBg = useColorModeValue('white', 'gray.700');
	const inactiveBg = useColorModeValue('transparent', 'transparent');
	const containerBg = useColorModeValue('gray.100', 'whiteAlpha.100');
	const activeTextColor = useColorModeValue('gray.700', 'white');
	const inactiveTextColor = useColorModeValue('gray.500', 'gray.400');

	return (
		<Flex bg={containerBg} p="4px" borderRadius="12px" gap="4px">
			{periods.map((period) => {
				const isActive = period.id === value;
				return (
					<Button
						key={period.id}
						onClick={() => onChange(period.id)}
						size="sm"
						variant="unstyled"
						h="32px"
						px="14px"
						borderRadius="8px"
						bg={isActive ? activeBg : inactiveBg}
						color={isActive ? activeTextColor : inactiveTextColor}
						fontSize="sm"
						fontWeight="semibold"
					>
						{period.label}
					</Button>
				);
			})}
		</Flex>
	);
}

function OtherTariffs() {
	const [period, setPeriod] = useState('month');
	const textColor = useColorModeValue('gray.700', 'white');
	const mutedColor = useColorModeValue('gray.500', 'gray.400');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const selectedBorderColor = useColorModeValue('recode.300', 'recode.300');
	const cardBg = useColorModeValue('white', 'gray.700');

	const tariffsWithPrice = useMemo(
		() =>
			tariffs.map((tariff) => ({
				...tariff,
				price: period === 'month' ? tariff.monthPrice : tariff.yearPrice,
			})),
		[period]
	);

	return (
		<Card p="1.5rem" bg={cardBg}>
			<CardHeader pb="8px">
				<Flex align="center" justify="space-between" gap="12px" wrap="wrap" width="100%">
					<Text fontSize="lg" color={textColor} fontWeight="bold">
						Другие тарифы
					</Text>
					<SegmentedControl size={'md'} p value={period} onChange={setPeriod} />
				</Flex>
			</CardHeader>
			<CardBody pt="8px">
				<Flex direction="column" gap="12px">
					{tariffsWithPrice.map((tariff, index) => (
						<Flex
							key={tariff.id}
							direction="column"
							gap="6px"
							border="1px solid"
							borderColor={index === 0 ? selectedBorderColor : borderColor}
							borderRadius="12px"
							px="14px"
							py="12px"
						>
							<Flex justify="space-between" align="baseline" gap="12px">
								<Text color={textColor} fontWeight="semibold">
									{tariff.name}
								</Text>
								<Text color={textColor} fontSize="sm" fontWeight="semibold" whiteSpace="nowrap">
									{tariff.price}
								</Text>
							</Flex>
							<Text color={mutedColor} fontSize="sm" fontWeight="medium">
								{tariff.description}
							</Text>
						</Flex>
					))}
				</Flex>
			</CardBody>
		</Card>
	);
}

export default OtherTariffs;
