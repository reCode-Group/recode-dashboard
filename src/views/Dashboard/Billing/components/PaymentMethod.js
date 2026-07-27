import {
	Box,
	Button,
	Divider,
	Flex,
	Image,
	Text,
	Tooltip,
	useColorModeValue,
	useToast,
} from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import { useMemo, useState } from 'react';

import statementLogo from 'assets/img/payment-methods/statement.png';
import tbankLogo from 'assets/img/payment-methods/tbank.png';

export const PAYMENT_METHODS = {
	tbank: {
		id: 'tbank',
		title: 'Онлайн через Т-Банк',
		icon: tbankLogo,
		iconW: '69px',
		iconH: '25px',
	},
	statement: {
		id: 'statement',
		title: 'Выписка счёта',
		icon: statementLogo,
		iconW: '24px',
		iconH: '22px',
	},
};

const DEFAULT_METHODS = [PAYMENT_METHODS.tbank, PAYMENT_METHODS.statement];

const EXPLANATIONS = {
	personal: {
		tbank: {
			commissionText: 'Безопасно',
			commissionLabel: 'на защищённой форме Т-Банка',
			processingText: 'онлайн',
			processingLabel: 'после подтверждения банком',
			bullets: [
				'Доступные способы оплаты будут показаны на форме Т-Банка.',
				'Онлайн-покупка пополняет ваш личный баланс.',
				'После подтверждения банком тариф и личный баланс обновятся автоматически.',
			],
		},
		statement: {
			commissionText: '0%',
			commissionLabel: 'определяется банком',
			processingText: '3-4',
			processingLabel: 'рабочих дня',
			bullets: [
				'Счёт выставляется на данные плательщика, указанные в личной карточке аккаунта.',
				'При формировании платёжного поручения обязательно укажите номер счёта и логин аккаунта.',
				'Зачисление средств на личный баланс производится в будние дни после поступления средств на расчётный счёт.',
			],
		},
	},
	organization: {
		statement: {
			commissionText: '0%',
			commissionLabel: 'определяется банком',
			processingText: '3-4',
			processingLabel: 'рабочих дня',
			bullets: [
				'Счёт выставляется на организацию и пополняет баланс организации.',
				'После зачисления директор сможет распределить токены между сотрудниками.',
				'При формировании платёжного поручения обязательно укажите номер счёта и логин аккаунта.',
				'Зачисление средств производится в будние дни после поступления оплаты на расчётный счёт.',
			],
		},
		tbank: {
			commissionText: 'Безопасно',
			commissionLabel: 'на защищённой форме Т-Банка',
			processingText: 'онлайн',
			processingLabel: 'после подтверждения банком',
			bullets: [
				'Онлайн-оплата доступна для личного счёта.',
				'Для пополнения счёта организации выберите выписку счёта.',
			],
		},
	},
};

const TEMPORARILY_UNAVAILABLE_METHOD_IDS = new Set();

export const AccountFundingSwitcher = ({
	options = [],
	value,
	onChange,
	title = 'Счёт пополнения',
	description = 'Выберите, куда зачислить купленные токены',
	variant = 'expanded',
}) => {
	const visibleOptions = useMemo(() => options.filter(Boolean), [options]);
	const toast = useToast();
	const textColor = useColorModeValue('#2D3748', 'white');
	const mutedColor = useColorModeValue('gray.500', 'gray.300');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const cardBg = useColorModeValue('white', 'gray.700');
	const accentBg = useColorModeValue('blue.50', 'whiteAlpha.100');
	const segmentBg = useColorModeValue('white', 'whiteAlpha.100');
	const activeSegmentBg = useColorModeValue('#005DE0', '#3182CE');
	const inactiveHoverBg = useColorModeValue('gray.50', 'whiteAlpha.200');
	const compactSummaryBg = useColorModeValue('gray.50', 'whiteAlpha.100');

	if (visibleOptions.length <= 1) {
		return null;
	}

	const isCompact = variant === 'compact';
	const isOrganizationAccount = value === 'organization';

	return (
		<Box
			p={isCompact ? '4px' : '0'}
			bg={isCompact ? cardBg : 'transparent'}
			border={isCompact ? '1px solid' : '0'}
			borderColor={borderColor}
			borderRadius={isCompact ? '14px' : '0'}
			w="100%"
		>
			<Flex
				align={isCompact ? 'stretch' : { base: 'stretch', md: 'center' }}
				gap={isCompact ? '0' : '32px'}
				direction={isCompact ? 'column' : { base: 'column', md: 'row' }}
				p={isCompact ? '0' : { base: '16px', md: '18px 20px' }}
				bg={isCompact ? 'transparent' : cardBg}
				borderRadius={isCompact ? '14px' : '16px'}
				w="100%"
			>
				<Flex
					p="4px"
					gap="4px"
					bg={compactSummaryBg}
					borderColor={borderColor}
					borderRadius={isCompact ? '10px' : '14px'}
					w={isCompact ? '100%' : { base: '100%', md: 'auto' }}
					flexShrink={0}
				>
					{visibleOptions.map((option) => {
						const isActive = value === option.id;

						return (
							<Button
								key={option.id}
								h={'44px'}
								minW={isCompact ? '0' : { base: '0', md: '132px' }}
								flex={isCompact ? '1' : { base: '1', md: '0 0 auto' }}
								px="14px"
								borderRadius="10px"
								border="1px solid"
								borderColor={borderColor}
								bg={isActive ? activeSegmentBg : segmentBg}
								color={isActive ? 'white' : textColor}
								boxShadow={isActive ? 'md' : 'none'}
								fontSize="sm"
								fontWeight="medium"
								_hover={{ bg: isActive ? activeSegmentBg : inactiveHoverBg }}
								_active={{ bg: isActive ? activeSegmentBg : inactiveHoverBg }}
								onClick={() => {
									if (isActive) {
										return;
									}

									onChange?.(option.id);
									toast({
										id: 'payment-account-select-tariff',
										title: 'Теперь выберите тариф',
										description: 'Нажмите на подходящий пакет токенов, чтобы перейти к оплате.',
										status: 'info',
										position: 'bottom-right',
										duration: 4500,
										isClosable: true,
									});
								}}
							>
								{option.label}
							</Button>
						);
					})}
				</Flex>

				{isCompact ? null : (
					<>
						<Divider
							display={{ base: 'none', md: 'block' }}
							orientation="vertical"
							h="46px"
							borderColor={borderColor}
						/>
						<Box minW="0">
							<Text color={textColor} fontSize="md" fontWeight="bold" lineHeight="1.25">
								{title}
							</Text>
							<Text mt="4px" color={mutedColor} fontSize="sm" lineHeight="1.45" noOfLines={1}>
								{description}
							</Text>
						</Box>
					</>
				)}
			</Flex>

			{isCompact ? (
				<Box mt="8px" p="12px" borderRadius="10px" bg={compactSummaryBg}>
					<Text fontSize="sm" color={textColor} fontWeight="bold">
						{isOrganizationAccount ? 'Выбран: Счёт организации' : 'Выбран: Личный счёт'}
					</Text>
					<Text mt="4px" fontSize="sm" lineHeight="1.5" color={mutedColor}>
						{isOrganizationAccount
							? 'Токены будут зачислены на баланс организации и станут доступны для распределения сотрудникам.'
							: 'Токены будут зачислены на ваш личный баланс.'}
					</Text>
				</Box>
			) : null}
		</Box>
	);
};

const PaymentMethod = ({
	title = 'Способ оплаты',
	titleFontSize = 'lg',
	showExplanations = false,
	value,
	defaultValue = 'statement',
	onChange,
	methods = DEFAULT_METHODS,
	accountType = 'personal',
}) => {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const toast = useToast();
	const selectedMethod = value ?? internalValue;
	const textColor = useColorModeValue('#2D3748', 'white');
	const mutedColor = useColorModeValue('gray.500', 'gray.300');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const cardBg = useColorModeValue('white', 'gray.700');
	const activeBorderColor = '#005DE0';
	const summaryColor = useColorModeValue('#38A169', 'green.300');
	const bulletColor = useColorModeValue('#4A5568', 'gray.200');
	const iconSurface = useColorModeValue('transparent', 'whiteAlpha.700');

	const availableMethods = useMemo(() => methods.filter(Boolean), [methods]);
	const effectiveSelectedMethod = availableMethods.some((method) => method.id === selectedMethod)
		? selectedMethod
		: availableMethods[0]?.id;
	const explanation = useMemo(() => {
		const accountExplanations = EXPLANATIONS[accountType] ?? EXPLANATIONS.personal;
		return accountExplanations[effectiveSelectedMethod] ?? accountExplanations.statement;
	}, [accountType, effectiveSelectedMethod]);

	const handleSelect = (id) => {
		if (TEMPORARILY_UNAVAILABLE_METHOD_IDS.has(id)) {
			return;
		}

		if (value === undefined) {
			setInternalValue(id);
		}
		if (onChange) {
			onChange(id);
		}
		if (!showExplanations) {
			toast({
				id: 'payment-method-select-tariff',
				title: 'Теперь выберите тариф',
				description: 'Нажмите на подходящий пакет токенов, чтобы перейти к оплате.',
				status: 'info',
				position: 'bottom-right',
				duration: 4500,
				isClosable: true,
			});
		}
	};

	return (
		<Card p="24px" bg={cardBg}>
			<CardHeader p="0" pb="12px">
				<Text fontSize={titleFontSize} lineHeight="1.2" color={textColor} fontWeight="bold">
					{title}
				</Text>
			</CardHeader>
			<CardBody p="0" style={{ flexDirection: 'column' }}>
				<Flex
					direction={{ base: 'column', md: 'row' }}
					wrap={{ base: 'nowrap', md: 'wrap' }}
					gap="8px"
				>
					{availableMethods.map((method) => {
						const isActive = effectiveSelectedMethod === method.id;
						const isTemporarilyUnavailable = TEMPORARILY_UNAVAILABLE_METHOD_IDS.has(method.id);
						const methodCard = (
							<Flex
								key={method.id}
								align="center"
								gap="8px"
								h={{ base: 'auto', md: '50px' }}
								minH="50px"
								px="12px"
								py={{ base: '10px', md: '0' }}
								border="2px solid"
								borderColor={isActive ? activeBorderColor : borderColor}
								borderRadius="15px"
								cursor={isTemporarilyUnavailable ? 'not-allowed' : 'pointer'}
								opacity={isTemporarilyUnavailable ? 0.55 : 1}
								w={{ base: '100%', md: 'auto' }}
								onClick={() => handleSelect(method.id)}
							>
								<Flex
									px="4px"
									h="24px"
									borderRadius="6px"
									align="center"
									justify="center"
									bg={iconSurface}
									flexShrink={0}
								>
									<Image
										src={method.icon}
										alt={method.title}
										w={method.iconW || '24px'}
										h={method.iconH || '24px'}
										objectFit="contain"
									/>
								</Flex>
								<Text
									color={mutedColor}
									whiteSpace={{ base: 'normal', md: 'nowrap' }}
									noOfLines={{ base: 1, md: undefined }}
								>
									{method.title}
								</Text>
							</Flex>
						);

						if (isTemporarilyUnavailable) {
							return (
								<Tooltip key={method.id} label="Временно недоступно" hasArrow>
									<Box>{methodCard}</Box>
								</Tooltip>
							);
						}

						return methodCard;
					})}
				</Flex>

				{showExplanations ? (
					<Box mt="16px">
						<Flex align="center" gap="8px" wrap="wrap">
							<Text color={summaryColor} fontSize="20px" lineHeight="1.4" fontWeight="bold">
								{explanation.commissionText}
							</Text>
							<Text color={mutedColor} fontSize="20px" lineHeight="1.4">
								{explanation.commissionLabel}
							</Text>
							<Text color={summaryColor} fontSize="20px" lineHeight="1.4" fontWeight="bold">
								{explanation.processingText}
							</Text>
							<Text color={mutedColor} fontSize="20px" lineHeight="1.4">
								{explanation.processingLabel}
							</Text>
						</Flex>
						<Flex direction="column" mt="10px" gap="8px">
							{explanation.bullets.map((bullet) => (
								<Flex key={bullet} align="flex-start" gap="8px">
									<Box w="6px" h="6px" mt="8px" borderRadius="full" bg="#3182CE" flexShrink={0} />
									<Text fontSize="13px" lineHeight="1.5" color={bulletColor}>
										{bullet}
									</Text>
								</Flex>
							))}
						</Flex>
					</Box>
				) : null}
			</CardBody>
		</Card>
	);
};

export default PaymentMethod;
