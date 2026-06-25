import { Alert, AlertIcon, Button, Flex, Grid, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { formatTariffPrice, formatTokenValue } from 'utils/subscription';

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

function OtherTariffs({ title = 'Другие тарифы', tariffs = [], isLoading = false, error = '', onRetry }) {
	const [period, setPeriod] = useState('month');
	const titleColor = useColorModeValue('#2D3748', 'white');
	const mutedColor = useColorModeValue('#A0AEC0', 'gray.400');
	const borderColor = useColorModeValue('#E2E8F0', 'whiteAlpha.300');
	const cardBg = useColorModeValue('white', 'gray.700');
	const subtitleColor = useColorModeValue('gray.500', 'gray.400');

	const renderedTariffs = tariffs.map((tariff) => ({
		id: tariff.id,
		name: String(tariff.name || 'Тариф').toUpperCase(),
		tokensLabel: `${formatTokenValue(tariff.amount)}/мес.`,
		priceLabel:
			period === 'year'
				? formatTariffPrice(Number(tariff.price) * 12, '₽/год')
				: formatTariffPrice(tariff.price),
	}));

	return (
		<Card p="24px" bg={cardBg} h={{ base: 'auto', lg: '100%' }}>
			<CardHeader p="0" pb="4px">
				<Flex align="center" justify="flex-start" gap="12px" w="100%" wrap="wrap">
					<Text fontSize="18px" lineHeight="1.4" color={titleColor} fontWeight="bold">
						{title}
					</Text>
					<PeriodSwitcher value={period} onChange={setPeriod} />
				</Flex>
			</CardHeader>
			<CardBody p="0" pt="0" h={{ base: 'auto', lg: '100%' }} display="flex" flexDirection="column">
				{isLoading ? (
					<Flex flex="1" minH="220px" align="center" justify="center">
						<Spinner color="recode.300" />
					</Flex>
				) : error ? (
					<Alert status="error" borderRadius="12px" flexDirection="column" alignItems="flex-start">
						<AlertIcon />
						<Text mb="12px">{error}</Text>
						{onRetry ? (
							<Button size="sm" onClick={onRetry}>
								Повторить
							</Button>
						) : null}
					</Alert>
				) : renderedTariffs.length === 0 ? (
					<Flex flex="1" minH="220px" align="center" justify="center">
						<Text color={subtitleColor} textAlign="center">
							Другие тарифы пока недоступны
						</Text>
					</Flex>
				) : (
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' }}
						gap="12px"
						w="100%"
						h="100%"
					>
						{renderedTariffs.map((tariff) => (
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
									{Number(tariff.id) === 2 ? (
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
											Хит
										</Flex>
									) : null}
								</Flex>

								<Text fontSize="12px" color={mutedColor} fontWeight="normal">
									ТОКЕНОВ
								</Text>
								<Text fontSize="14px" color={titleColor} fontWeight="bold" mb="14px">
									{tariff.tokensLabel}
								</Text>

								<Text fontSize="12px" color={mutedColor} fontWeight="normal">
									СТОИМОСТЬ
								</Text>
								<Text fontSize="14px" color={titleColor} fontWeight="bold" mb="14px">
									{tariff.priceLabel}
								</Text>

								<Button
									as={RouterLink}
									to="/lk/billing/pay"
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
								>
									ВЫБРАТЬ
								</Button>
							</Flex>
						))}
					</Grid>
				)}
			</CardBody>
		</Card>
	);
}

export default OtherTariffs;
