import {
	Badge,
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	HStack,
	Image,
	Text,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { useMemo, useState } from 'react';

import mirLogo from 'assets/img/payment-methods/mir.png';
import sbpLogo from 'assets/img/payment-methods/sbp.png';
import statementLogo from 'assets/img/payment-methods/statement.png';
import tbankLogo from 'assets/img/payment-methods/tbank.png';

const periods = [
	{ id: 'month', label: 'Monthly', multiplier: 1, discountLabel: null },
	{ id: 'year', label: 'Yearly', multiplier: 10, discountLabel: 'Save 2 months' },
];

const plans = [
	{
		id: 'standard',
		name: 'Standard',
		tokens: 50000,
		baseMonthlyPrice: 20000,
		badge: 'Popular',
	},
	{
		id: 'premium',
		name: 'Premium',
		tokens: 100000,
		baseMonthlyPrice: 50000,
	},
];

const paymentMethods = [
	{ id: 'sbp', title: 'Fast Payments System', icon: sbpLogo, iconW: '56px', iconH: '33px' },
	{ id: 'card', title: 'Bank card', icon: mirLogo, iconW: '47px', iconH: '14px' },
	{ id: 'tbank', title: 'Via T-Bank', icon: tbankLogo, iconW: '69px', iconH: '25px' },
	{ id: 'statement', title: 'Statement invoice', icon: statementLogo, iconW: '24px', iconH: '22px' },
];

const formatRub = (value) => {
	return new Intl.NumberFormat('ru-RU').format(value);
};

function BillingPay() {
	const [period, setPeriod] = useState('month');
	const [planId, setPlanId] = useState('standard');
	const [paymentMethodId, setPaymentMethodId] = useState('sbp');

	const titleColor = useColorModeValue('#2D3748', 'white');
	const mutedColor = useColorModeValue('#A0AEC0', 'gray.400');
	const borderColor = useColorModeValue('#E2E8F0', 'whiteAlpha.300');
	const activeBorder = useColorModeValue('#005DE0', '#63B3ED');
	const pageBg = useColorModeValue('white', 'gray.800');
	const selectedBg = useColorModeValue('#EBF8FF', 'whiteAlpha.100');
	const iconSurfaceBg = useColorModeValue('gray.50', 'whiteAlpha.100');

	const selectedPlan = useMemo(() => plans.find((plan) => plan.id === planId), [planId]);
	const selectedPeriod = useMemo(() => periods.find((item) => item.id === period), [period]);

	const totalPrice = selectedPlan.baseMonthlyPrice * selectedPeriod.multiplier;
	const priceLabel =
		period === 'month' ? `${formatRub(totalPrice)} RUB / month` : `${formatRub(totalPrice)} RUB / year`;

	return (
		<Flex direction="column" pt={{ base: '120px', md: '75px' }} pb="48px">
			<Grid templateColumns={{ base: '1fr', xl: '2fr 1fr' }} gap="24px">
				<GridItem>
					<Card bg={pageBg} p="24px">
						<CardHeader p="0" mb="18px">
							<Flex direction={{ base: 'column', md: 'row' }} justify="space-between" gap="14px">
								<Box>
									<Text fontSize="26px" lineHeight="1.2" fontWeight="bold" color={titleColor}>
										Pay Tariff
									</Text>
									<Text mt="6px" fontSize="14px" color={mutedColor}>
										Choose plan and billing period
									</Text>
								</Box>
								<HStack spacing="8px" alignSelf={{ base: 'flex-start', md: 'center' }}>
									{periods.map((item) => {
										const isActive = item.id === period;
										return (
											<Button
												key={item.id}
												variant="unstyled"
												h="36px"
												px="14px"
												fontSize="12px"
												fontWeight="bold"
												borderRadius="10px"
												border="1px solid"
												borderColor={isActive ? activeBorder : borderColor}
												color={isActive ? activeBorder : mutedColor}
												bg={isActive ? selectedBg : 'transparent'}
												onClick={() => setPeriod(item.id)}
											>
												{item.label}
											</Button>
										);
									})}
								</HStack>
							</Flex>
						</CardHeader>
						<CardBody p="0">
							<VStack spacing="12px" align="stretch">
								{plans.map((plan) => {
									const isSelected = plan.id === planId;
									const planPrice = plan.baseMonthlyPrice * selectedPeriod.multiplier;
									const planPriceLabel =
										period === 'month'
											? `${formatRub(planPrice)} RUB / month`
											: `${formatRub(planPrice)} RUB / year`;

									return (
										<Flex
											key={plan.id}
											p="18px"
											border="1px solid"
											borderColor={isSelected ? activeBorder : borderColor}
											borderRadius="16px"
											bg={isSelected ? selectedBg : 'transparent'}
											cursor="pointer"
											justify="space-between"
											gap="12px"
											onClick={() => setPlanId(plan.id)}
										>
											<Box>
												<HStack spacing="10px">
													<Text fontSize="20px" fontWeight="bold" color={titleColor}>
														{plan.name}
													</Text>
													{plan.badge ? (
														<Badge borderRadius="999px" px="9px" py="2px" colorScheme="green">
															{plan.badge}
														</Badge>
													) : null}
												</HStack>
												<Text mt="6px" fontSize="13px" color={mutedColor}>
													{`${formatRub(plan.tokens)} tokens / month`}
												</Text>
											</Box>
											<Box textAlign="right">
												<Text fontSize="16px" fontWeight="bold" color={titleColor}>
													{planPriceLabel}
												</Text>
												{period === 'year' && selectedPeriod.discountLabel ? (
													<Text mt="4px" fontSize="12px" color="#48BB78">
														{selectedPeriod.discountLabel}
													</Text>
												) : null}
											</Box>
										</Flex>
									);
								})}
							</VStack>
						</CardBody>
					</Card>

					<Card bg={pageBg} p="24px" mt="24px">
						<CardHeader p="0" mb="12px">
							<Text fontSize="20px" lineHeight="1.2" fontWeight="bold" color={titleColor}>
								Payment Method
							</Text>
						</CardHeader>
						<CardBody p="0">
							<VStack spacing="10px" align="stretch">
								{paymentMethods.map((method) => {
									const isActive = method.id === paymentMethodId;
									return (
										<Flex
											key={method.id}
											align="center"
											justify="space-between"
											px="16px"
											py="13px"
											borderRadius="12px"
											border="1px solid"
											borderColor={isActive ? activeBorder : borderColor}
											bg={isActive ? selectedBg : 'transparent'}
											cursor="pointer"
											onClick={() => setPaymentMethodId(method.id)}
										>
											<HStack spacing="10px">
												<Flex
													w="88px"
													h="36px"
													borderRadius="8px"
													align="center"
													justify="center"
													bg={iconSurfaceBg}
												>
													<Image
														src={method.icon}
														alt={method.title}
														w={method.iconW}
														h={method.iconH}
														objectFit="contain"
													/>
												</Flex>
												<Text fontSize="14px" color={titleColor}>
													{method.title}
												</Text>
											</HStack>
											<Box
												w="18px"
												h="18px"
												borderRadius="full"
												border="2px solid"
												borderColor={isActive ? activeBorder : borderColor}
												bg={isActive ? activeBorder : 'transparent'}
											/>
										</Flex>
									);
								})}
							</VStack>
						</CardBody>
					</Card>
				</GridItem>

				<GridItem>
					<Card bg={pageBg} p="24px" position={{ base: 'static', xl: 'sticky' }} top="95px">
						<CardHeader p="0" mb="14px">
							<Text fontSize="20px" lineHeight="1.2" fontWeight="bold" color={titleColor}>
								Order Summary
							</Text>
						</CardHeader>
						<CardBody p="0">
							<VStack spacing="12px" align="stretch">
								<Flex justify="space-between" gap="8px">
									<Text fontSize="14px" color={mutedColor}>
										Selected tariff
									</Text>
									<Text fontSize="14px" fontWeight="bold" color={titleColor}>
										{selectedPlan.name}
									</Text>
								</Flex>
								<Flex justify="space-between" gap="8px">
									<Text fontSize="14px" color={mutedColor}>
										Billing period
									</Text>
									<Text fontSize="14px" fontWeight="bold" color={titleColor}>
										{selectedPeriod.label}
									</Text>
								</Flex>
								<Flex justify="space-between" gap="8px">
									<Text fontSize="14px" color={mutedColor}>
										Payment method
									</Text>
									<Text fontSize="14px" fontWeight="bold" color={titleColor}>
										{paymentMethods.find((item) => item.id === paymentMethodId).title}
									</Text>
								</Flex>
								<Box borderTop="1px solid" borderColor={borderColor} pt="12px">
									<Flex justify="space-between" gap="8px">
										<Text fontSize="14px" color={mutedColor}>
											Total to pay
										</Text>
										<Text fontSize="20px" fontWeight="bold" color={titleColor}>
											{priceLabel}
										</Text>
									</Flex>
								</Box>
								<Button mt="8px" h="42px" borderRadius="12px" bg="#005DE0" color="white">
									Pay Now
								</Button>
							</VStack>
						</CardBody>
					</Card>
				</GridItem>
			</Grid>
		</Flex>
	);
}

export default BillingPay;
