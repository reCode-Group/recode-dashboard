import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	HStack,
	Spinner,
	Text,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import { useCallback, useEffect, useState } from 'react';
import { getTokenHistory } from 'services/tokenHistory';

const HISTORY_LIMIT = 30;

function formatTokenValue(value) {
	return new Intl.NumberFormat('ru-RU').format(Number(value) || 0).replace(/,/g, ' ');
}

function formatDate(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return 'Дата неизвестна';
	}

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

function normalizeHistoryItem(item) {
	const payload = item?.payload || {};
	const amount = Number(payload.amount) || 0;
	const operationType = payload.operation_type;

	if (item?.type === 'converts') {
		return {
			id: item.id,
			title: 'Перевод макроса',
			description: payload.conversion_id
				? `Конвертация #${payload.conversion_id}`
				: 'Списание за конвертацию',
			metaLabel: payload.as_employee ? 'Аккаунт сотрудника' : 'Личный аккаунт',
			amount,
			direction: 'out',
			createdAt: item.created_at,
		};
	}

	if (item?.type === 'purchase' && operationType === 'subscription_purchase') {
		return {
			id: item.id,
			title: 'Покупка тарифа',
			description: 'Пакет токенов пополнен',
			metaLabel: payload.payment_id ? `Платёж #${payload.payment_id}` : 'Пополнение баланса',
			amount,
			direction: 'in',
			createdAt: item.created_at,
		};
	}

	if (item?.type === 'purchase' && operationType === 'organization_deposit') {
		return {
			id: item.id,
			title: 'Пополнение компании',
			description: 'Токены зачислены на счёт организации',
			metaLabel: payload.organization_id
				? `Организация #${payload.organization_id}`
				: 'Счёт организации',
			amount,
			direction: 'in',
			createdAt: item.created_at,
		};
	}

	if (item?.type === 'user' && operationType === 'organization_member_transfer') {
		return {
			id: item.id,
			title: 'Передача сотруднику',
			description: 'Токены переведены сотруднику',
			metaLabel: payload.organization_member_id
				? `Сотрудник #${payload.organization_member_id}`
				: 'Перевод сотруднику',
			amount,
			direction: 'out',
			createdAt: item.created_at,
		};
	}

	return {
		id: item?.id,
		title: 'Операция с токенами',
		description: `Тип: ${item?.type || 'unknown'}`,
		metaLabel: 'Требует уточнения',
		amount,
		direction: amount >= 0 ? 'out' : 'in',
		createdAt: item?.created_at,
	};
}

function getDirectionStyles(direction) {
	if (direction === 'in') {
		return { color: 'green.400', sign: '+' };
	}

	return { color: 'red.400', sign: '-' };
}

const TokenOperationsFeed = ({ viewerContext }) => {
	const textColor = useColorModeValue('gray.700', 'white');
	const mutedColor = useColorModeValue('gray.500', 'gray.400');
	const borderColor = useColorModeValue('gray.100', 'whiteAlpha.200');
	const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
	const badgeBg = useColorModeValue('white', 'gray.600');
	const scrollbarThumb = useColorModeValue('rgba(160, 174, 192, 0.9)', 'rgba(255, 255, 255, 0.28)');
	const scrollbarTrack = useColorModeValue(
		'rgba(226, 232, 240, 0.75)',
		'rgba(255, 255, 255, 0.08)'
	);
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	const loadHistory = useCallback(async () => {
		setIsLoading(true);
		setError('');

		try {
			const payload = await getTokenHistory({
				limit: HISTORY_LIMIT,
			});
			const normalizedItems = (payload?.items || []).map(normalizeHistoryItem);

			setItems(normalizedItems);
			setError('');
		} catch (requestError) {
			setError(requestError.message || 'Не удалось загрузить историю операций');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadHistory();
	}, [loadHistory]);

	const subtitle =
		viewerContext?.has_organization && viewerContext?.organization_role === 'director'
			? 'Показаны 30 последних операций по доступным счетам компании'
			: 'Показаны 30 последних операций по вашему счёту';

	return (
		<Card
			p="28px 24px"
			mb={{ sm: '26px', lg: '0px' }}
			h={{ base: 'auto', lg: '440px' }}
			display="flex"
			flexDirection="column"
			minH="0"
			overflow="hidden"
		>
			<CardHeader mb="20px" px="0">
				<Flex direction="column" alignSelf="flex-start">
					<Text fontSize="lg" color={textColor} fontWeight="bold" mb="6px">
						Операции с токенами
					</Text>
					<Text fontSize="sm" color={mutedColor} fontWeight="medium">
						{subtitle}
					</Text>
				</Flex>
			</CardHeader>

			{isLoading ? (
				<Flex minH="260px" align="center" justify="center">
					<Spinner color="recode.300" />
				</Flex>
			) : error ? (
				<Alert
					status="error"
					borderRadius="12px"
					flexDirection="column"
					alignItems="flex-start"
					gap="12px"
				>
					<HStack align="flex-start" spacing="12px">
						<AlertIcon mt="2px" />
						<Text color={textColor}>{error}</Text>
					</HStack>
					<Button size="sm" onClick={() => loadHistory()}>
						Повторить
					</Button>
				</Alert>
			) : !items.length ? (
				<Flex minH="220px" align="center" justify="center">
					<Text color={mutedColor} fontWeight="medium">
						Операций пока нет
					</Text>
				</Flex>
			) : (
				<Box
					flex="1"
					minH="0"
					h={{ base: '420px', lg: '0' }}
					overflowY="auto"
					pt="10px"
					pb="10px"
					pr="6px"
					borderTop="1px solid"
					borderBottom="1px solid"
					borderColor={borderColor}
					sx={{
						WebkitOverflowScrolling: 'touch',
						'&::-webkit-scrollbar': {
							width: '8px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: scrollbarThumb,
							borderRadius: '999px',
						},
						'&::-webkit-scrollbar-track': {
							background: scrollbarTrack,
							borderRadius: '999px',
						},
						scrollbarWidth: 'thin',
						scrollbarColor: `${scrollbarThumb} ${scrollbarTrack}`,
					}}
				>
					<VStack spacing="8px" align="stretch">
						{items.map((item, index) => {
							const directionStyles = getDirectionStyles(item.direction);

							return (
								<Flex
									key={item.id}
									justify="space-between"
									align="center"
									gap="12px"
									p="10px 12px"
									border="1px solid"
									borderColor={borderColor}
									borderRadius="14px"
									bg={hoverBg}
								>
									<Flex align="center" minW="0" flex="1" gap="12px">
										<Text
											color={mutedColor}
											fontSize="sm"
											fontWeight="bold"
											w="40px"
											h="40px"
											display="flex"
											alignItems="center"
											justifyContent="center"
											textAlign="center"
											flexShrink={0}
											border="1px solid"
											borderColor={borderColor}
											borderRadius="12px"
											bg={badgeBg}
										>
											{items.length - index}
										</Text>
										<Flex direction="column" minW="0" flex="1" justify="center" ms="4px">
											<Text
												color={textColor}
												fontWeight="bold"
												fontSize="sm"
												lineHeight="1.25"
												noOfLines={1}
											>
												{item.title}
												<Text as="span" color={mutedColor} fontWeight="medium">
													{' '}
													[{item.description}]
												</Text>
											</Text>
											<Text color={mutedColor} fontSize="xs" mt="4px" noOfLines={1}>
												{item.metaLabel} • {formatDate(item.createdAt)}
											</Text>
										</Flex>
									</Flex>
									<Text
										color={directionStyles.color}
										fontWeight="bold"
										fontSize="lg"
										lineHeight="1.2"
										whiteSpace="nowrap"
									>
										{directionStyles.sign}
										{formatTokenValue(item.amount)}
									</Text>
								</Flex>
							);
						})}
					</VStack>
				</Box>
			)}
		</Card>
	);
};

export default TokenOperationsFeed;
