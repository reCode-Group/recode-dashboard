import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	Input,
	Select,
	Spinner,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { getTokenPackages } from 'services/subscription';
import { formatPaymentAmount, normalizeTokenPackages } from 'utils/subscription';
import PaymentMethod from 'views/Dashboard/Billing/components/PaymentMethod';

const PERIODS = [
	{ id: '1', label: '1 месяц', value: 1 },
	{ id: '3', label: '3 месяца', value: 3 },
	{ id: '6', label: '6 месяцев', value: 6 },
	{ id: '12', label: '12 месяцев', value: 12 },
];

function BillingPay() {
	const [tariffs, setTariffs] = useState([]);
	const [tariffId, setTariffId] = useState('');
	const [periodId, setPeriodId] = useState('1');
	const [inn, setInn] = useState('0239951661');
	const [paymentMethodId, setPaymentMethodId] = useState('tbank');
	const [isLoadingTariffs, setIsLoadingTariffs] = useState(true);
	const [tariffsError, setTariffsError] = useState('');

	const titleColor = useColorModeValue('gray.700', 'white');
	const subtitleColor = useColorModeValue('gray.400', 'gray.300');
	const labelColor = useColorModeValue('gray.700', 'gray.100');
	const inputTextColor = useColorModeValue('gray.500', 'gray.200');
	const inputBg = useColorModeValue('white', 'whiteAlpha.50');
	const readonlyBg = useColorModeValue('gray.200', 'whiteAlpha.400');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

	useEffect(() => {
		let isMounted = true;

		async function loadTariffs() {
			setIsLoadingTariffs(true);
			setTariffsError('');

			try {
				const payload = await getTokenPackages();
				if (!isMounted) return;

				const tokenPackages = normalizeTokenPackages(payload);
				setTariffs(tokenPackages);
				setTariffId((currentTariffId) => {
					if (tokenPackages.some((item) => String(item.id) === currentTariffId)) {
						return currentTariffId;
					}

					return tokenPackages[0] ? String(tokenPackages[0].id) : '';
				});
			} catch (error) {
				if (!isMounted) return;

				setTariffs([]);
				setTariffsError(error.message || 'Не удалось загрузить тарифы');
			} finally {
				if (!isMounted) return;
				setIsLoadingTariffs(false);
			}
		}

		loadTariffs();

		return () => {
			isMounted = false;
		};
	}, []);

	const selectedTariff = useMemo(() => tariffs.find((item) => String(item.id) === tariffId) || tariffs[0], [
		tariffs,
		tariffId,
	]);
	const selectedPeriod = useMemo(() => PERIODS.find((item) => item.id === periodId) || PERIODS[0], [
		periodId,
	]);
	const isStatementMethod = paymentMethodId === 'statement';
	const submitButtonLabel = isStatementMethod ? 'ВЫПИСАТЬ СЧЕТ' : 'ОПЛАТИТЬ';
	const paymentAmount = useMemo(
		() => formatPaymentAmount((Number(selectedTariff?.price) || 0) * selectedPeriod.value),
		[selectedPeriod.value, selectedTariff?.price]
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
							{tariffsError ? (
								<Alert status="error" borderRadius="12px">
									<AlertIcon />
									{tariffsError}
								</Alert>
							) : null}

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Тариф
								</FormLabel>
								<Select
									value={tariffId}
									onChange={(event) => setTariffId(event.target.value)}
									bg={inputBg}
									placeholder={isLoadingTariffs ? 'Загрузка...' : 'Выберите тариф'}
									isDisabled={isLoadingTariffs || tariffs.length === 0}
									{...inputStyles}
								>
									{tariffs.map((tariff) => (
										<option key={tariff.id} value={tariff.id}>
											{tariff.name}
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

							{isStatementMethod ? (
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
							) : null}

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
								isDisabled={isLoadingTariffs || tariffs.length === 0}
								leftIcon={isLoadingTariffs ? <Spinner size="sm" /> : undefined}
							>
								{submitButtonLabel}
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
