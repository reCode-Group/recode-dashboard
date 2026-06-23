import { Box, Flex, Image, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser } from 'services/auth';

import mirLogo from 'assets/img/payment-methods/mir.png';
import sbpLogo from 'assets/img/payment-methods/sbp.png';
import statementLogo from 'assets/img/payment-methods/statement.png';
import tbankLogo from 'assets/img/payment-methods/tbank.png';

const DEFAULT_METHODS = [
	{
		id: 'sbp',
		title: 'Система быстрых платежей (СБП)',
		icon: sbpLogo,
		iconW: '56px',
		iconH: '33px',
	},
	{
		id: 'card',
		title: 'Банковская карта',
		icon: mirLogo,
		iconW: '47px',
		iconH: '14px',
	},
	{
		id: 'tbank',
		title: 'Через Т-Банк',
		icon: tbankLogo,
		iconW: '69px',
		iconH: '25px',
	},
	{
		id: 'statement',
		title: 'Выписка счета',
		icon: statementLogo,
		iconW: '24px',
		iconH: '22px',
	},
];

const EXPLANATIONS = {
	statement: {
		commissionText: '0%',
		commissionLabel: 'определяется банком',
		processingText: '3-4',
		processingLabel: 'рабочих дня',
		bullets: [
			'При оплате от юридического лица, не являющегося владельцем аккаунта, укажите в назначении платежа номер счета и логин аккаунта, за который производится оплата.',
			'Данные в счете должны полностью совпадать с данными владельца пополняемого аккаунта, указанными в личной карточке плательщика.',
			'При формировании платежного поручения и назначении платежа обязательно укажите номер счета и логин аккаунта.',
			'При совершении оплаты из-за границы может потребоваться код валютной операции: [20100].',
			'Зачисление средств на баланс аккаунта производится в будние дни после поступления средств на расчетный счет.',
		],
	},
	card: {
		commissionText: 'Комиссия',
		commissionLabel: 'по тарифу банка-эмитента',
		processingText: 'до 10 минут',
		processingLabel: 'в рабочее время',
		bullets: [
			'Поддерживаются карты Mastercard, Visa и МИР, выпущенные банками РФ.',
			'Для успешной оплаты может потребоваться подтверждение 3-D Secure.',
			'Квитанция формируется автоматически и доступна в разделе документов.',
		],
	},
	sbp: {
		commissionText: '0%',
		commissionLabel: 'для большинства банков',
		processingText: 'мгновенно',
		processingLabel: 'после подтверждения',
		bullets: [
			'Оплата выполняется через приложение банка по QR или deep-link.',
			'Лимиты и доступность метода зависят от банка отправителя.',
			'После оплаты баланс обновляется автоматически.',
		],
	},
	tbank: {
		commissionText: '0%',
		commissionLabel: 'по внутреннему тарифу Т-Банка',
		processingText: 'до 5 минут',
		processingLabel: 'в рабочее время',
		bullets: [
			'Оплата выполняется через приложение Т-Банка с подтверждением операции.',
			'Комиссия и лимиты зависят от условий обслуживающего банка.',
			'После успешной оплаты баланс обновляется автоматически.',
		],
	},
};

const TEMPORARILY_UNAVAILABLE_METHOD_IDS = new Set(['sbp', 'card']);
const STATEMENT_METHOD_ID = 'statement';

const PaymentMethod = ({
	title = 'Способ оплаты',
	titleFontSize = 'lg',
	showExplanations = false,
	value,
	defaultValue = 'statement',
	onChange,
	methods = DEFAULT_METHODS,
}) => {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const [currentUser, setCurrentUser] = useState(null);
	const selectedMethod = value ?? internalValue;
	const textColor = useColorModeValue('#2D3748', 'white');
	const mutedColor = useColorModeValue('gray.500', 'gray.300');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const cardBg = useColorModeValue('white', 'gray.700');
	const activeBorderColor = '#005DE0';
	const summaryColor = useColorModeValue('#38A169', 'green.300');
	const bulletColor = useColorModeValue('#4A5568', 'gray.200');
	const iconSurface = useColorModeValue('transparent', 'whiteAlpha.700');
	const canUseStatementPayment =
		currentUser?.has_organization === true &&
		currentUser?.organization_role === 'director' &&
		currentUser?.organization_status === 'active';
	const availableMethods = useMemo(() => {
		if (canUseStatementPayment) {
			return methods;
		}

		return methods.filter((method) => method.id !== STATEMENT_METHOD_ID);
	}, [canUseStatementPayment, methods]);
	const effectiveSelectedMethod =
		!canUseStatementPayment && selectedMethod === STATEMENT_METHOD_ID ? 'tbank' : selectedMethod;

	useEffect(() => {
		let isMounted = true;

		async function loadCurrentUser() {
			try {
				const user = await getCurrentUser();
				if (!isMounted) return;
				setCurrentUser(user);
			} catch (error) {
				if (!isMounted) return;
				setCurrentUser(null);
			}
		}

		loadCurrentUser();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		if (canUseStatementPayment || selectedMethod !== STATEMENT_METHOD_ID) {
			return;
		}

		if (value === undefined) {
			setInternalValue('tbank');
		}
		if (onChange) {
			onChange('tbank');
		}
	}, [canUseStatementPayment, onChange, selectedMethod, value]);

	const explanation = useMemo(() => EXPLANATIONS[effectiveSelectedMethod] ?? EXPLANATIONS.statement, [
		effectiveSelectedMethod,
	]);

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
	};

	return (
		<Card p="24px" bg={cardBg}>
			<CardHeader p="0" pb="12px">
				<Text fontSize={titleFontSize} lineHeight="1.2" color={textColor} fontWeight="bold">
					{title}
				</Text>
			</CardHeader>
			<CardBody p="0" style={{ flexDirection: 'column' }}>
				<Flex wrap="wrap" gap="8px">
					{availableMethods.map((method) => {
						const isActive = effectiveSelectedMethod === method.id;
						const isTemporarilyUnavailable = TEMPORARILY_UNAVAILABLE_METHOD_IDS.has(method.id);
						const methodCard = (
							<Flex
								key={method.id}
								align="center"
								gap="8px"
								h="50px"
								px="12px"
								border="2px solid"
								borderColor={isActive ? activeBorderColor : borderColor}
								borderRadius="15px"
								cursor={isTemporarilyUnavailable ? 'not-allowed' : 'pointer'}
								opacity={isTemporarilyUnavailable ? 0.55 : 1}
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
								<Text color={mutedColor} whiteSpace="nowrap">
									{method.title}
								</Text>
							</Flex>
						);

						if (isTemporarilyUnavailable) {
							return (
								<Tooltip key={method.id} label="Временно не доступно" hasArrow>
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
