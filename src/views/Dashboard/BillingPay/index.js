import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	Input,
	Select,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import PaymentMethod from 'views/Dashboard/Billing/components/PaymentMethod';

const TARIFFS = [
	{ id: 'basic', label: 'Базовый', monthlyPrice: 10000 },
	{ id: 'standard', label: 'Стандарт', monthlyPrice: 20000 },
	{ id: 'premium', label: 'Премиум', monthlyPrice: 50000 },
];

const PERIODS = [
	{ id: '1', label: '1 месяц', value: 1 },
	{ id: '3', label: '3 месяца', value: 3 },
	{ id: '6', label: '6 месяцев', value: 6 },
	{ id: '12', label: '12 месяцев', value: 12 },
];

const formatAmount = (value) => {
	const formatted = new Intl.NumberFormat('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
	return formatted;
};

function BillingPay() {
	const [tariffId, setTariffId] = useState('basic');
	const [periodId, setPeriodId] = useState('1');
	const [inn, setInn] = useState('0239951661');
	const [paymentMethodId, setPaymentMethodId] = useState('statement');

	const titleColor = useColorModeValue('gray.700', 'white');
	const subtitleColor = useColorModeValue('gray.400', 'gray.300');
	const labelColor = useColorModeValue('gray.700', 'gray.100');
	const inputTextColor = useColorModeValue('gray.500', 'gray.200');
	const inputBg = useColorModeValue('white', 'whiteAlpha.50');
	const readonlyBg = useColorModeValue('gray.200', 'whiteAlpha.200');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

	const selectedTariff = useMemo(() => TARIFFS.find((item) => item.id === tariffId) || TARIFFS[0], [
		tariffId,
	]);
	const selectedPeriod = useMemo(() => PERIODS.find((item) => item.id === periodId) || PERIODS[0], [
		periodId,
	]);
	const paymentAmount = useMemo(
		() => formatAmount(selectedTariff.monthlyPrice * selectedPeriod.value),
		[selectedPeriod.value, selectedTariff.monthlyPrice]
	);

	const inputStyles = {
		borderRadius: '15px',
		fontSize: 'sm',
		size: 'lg',
		color: inputTextColor,
		borderColor,
	};

	return (
		<Flex direction="column" pt={{ base: '120px', md: '75px' }} height="100vh">
			<Grid templateColumns={{ base: '1fr', xl: '1fr 1.5fr' }} gap="12px" alignItems="start">
				<GridItem>
					<Box maxW="500px">
						<Text fontSize="32px" lineHeight="1.3" fontWeight="bold" color={titleColor}>
							Оплата услуг
						</Text>
						<Text mt="4px" fontSize="14px" lineHeight="1.4" fontWeight="bold" color={subtitleColor}>
							Принимаются платежи только из Российской Федерации
						</Text>

						<Flex mt="22px" direction="column" gap="16px">
							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Тариф
								</FormLabel>
								<Select
									value={tariffId}
									onChange={(event) => setTariffId(event.target.value)}
									bg={inputBg}
									{...inputStyles}
								>
									{TARIFFS.map((tariff) => (
										<option key={tariff.id} value={tariff.id}>
											{tariff.label}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Сумма платежа, ₽
								</FormLabel>
								<Input value={paymentAmount} readOnly bg={readonlyBg} {...inputStyles} />
							</FormControl>

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Заплатить за
								</FormLabel>
								<Select
									value={periodId}
									onChange={(event) => setPeriodId(event.target.value)}
									bg={inputBg}
									{...inputStyles}
								>
									{PERIODS.map((period) => (
										<option key={period.id} value={period.id}>
											{period.label}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									ИНН
								</FormLabel>
								<Input
									value={inn}
									onChange={(event) => setInn(event.target.value)}
									placeholder="0239951661"
									bg={inputBg}
									{...inputStyles}
								/>
							</FormControl>

							<Button
								mt="8px"
								h="45px"
								borderRadius="12px"
								bg="#005DE0"
								color="white"
								fontSize="xs"
								fontWeight="medium"
								letterSpacing="0.02em"
								_hover={{ bg: '#0A54BE' }}
								_active={{ bg: '#0A54BE' }}
							>
								ВЫПИСАТЬ СЧЕТ
							</Button>
						</Flex>
					</Box>
				</GridItem>

				<GridItem>
					<PaymentMethod
						title="Способ оплаты"
						titleFontSize="32px"
						showExplanations
						value={paymentMethodId}
						onChange={setPaymentMethodId}
					/>
				</GridItem>
			</Grid>
		</Flex>
	);
}

export default BillingPay;
