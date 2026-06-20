// Chakra imports
import { Flex, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import BarChart from 'components/Charts/BarChart';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
// Custom icons
import { TokensRemainIcon } from 'components/Icons/Icons';
import { RocketIcon } from 'components/Icons/Icons.js';
import { useEffect, useMemo, useState } from 'react';
import { getUserConversions } from 'services/conversions';
import { getUserSubscription } from 'services/subscription';
import ChartStatistics from './ChartStatistics';

const MONTHS_TO_SHOW = 6;
const CONVERSIONS_PAGE_SIZE = 100;
const DONE_STATUS = 'done';
const NO_SUBSCRIPTION_MESSAGES = [
	'subscription not found',
	'subscription is not active',
	'ErrNoSubscription',
	'ErrSubscriptionNotActive',
];
const MONTH_LABELS = [
	'\u042f\u043d\u0432',
	'\u0424\u0435\u0432',
	'\u041c\u0430\u0440',
	'\u0410\u043f\u0440',
	'\u041c\u0430\u0439',
	'\u0418\u044e\u043d',
	'\u0418\u044e\u043b',
	'\u0410\u0432\u0433',
	'\u0421\u0435\u043d',
	'\u041e\u043a\u0442',
	'\u041d\u043e\u044f',
	'\u0414\u0435\u043a',
];

function formatTokenValue(value) {
	return new Intl.NumberFormat('ru-RU').format(Number(value) || 0).replace(/,/g, ' ');
}

function getMonthKey(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthLabel(date) {
	return MONTH_LABELS[date.getMonth()];
}

function getLastMonths(count) {
	const currentMonth = new Date();
	currentMonth.setDate(1);
	currentMonth.setHours(0, 0, 0, 0);

	return Array.from({ length: count }, (_, index) => {
		const month = new Date(currentMonth);
		month.setMonth(currentMonth.getMonth() - (count - index - 1));
		return {
			date: month,
			key: getMonthKey(month),
			label: getMonthLabel(month),
		};
	});
}

function isNoSubscriptionError(error) {
	const message = error?.message || '';
	return NO_SUBSCRIPTION_MESSAGES.some((knownMessage) => message.includes(knownMessage));
}

function getProgressValue(value, maxValue) {
	if (!maxValue) return 0;
	return Math.max(0, Math.min(100, (value / maxValue) * 100));
}

function isOlderThanRange(conversion, rangeStart) {
	const createdAt = new Date(conversion?.created_at);
	return !Number.isNaN(createdAt.getTime()) && createdAt < rangeStart;
}

async function loadConversionsForRange(rangeStart) {
	const conversions = [];
	let cursor;

	do {
		const payload = await getUserConversions(CONVERSIONS_PAGE_SIZE, cursor);
		const items = payload?.items || [];
		conversions.push(...items);

		const hasOlderItems = items.some((item) => isOlderThanRange(item, rangeStart));
		cursor = hasOlderItems ? null : payload?.next_cursor;
	} while (cursor);

	return conversions;
}

function aggregateConversions(conversions, months) {
	const currentMonthKey = months[months.length - 1].key;
	const monthlyTokens = months.reduce((acc, month) => ({ ...acc, [month.key]: 0 }), {});
	const monthlyMacros = months.reduce((acc, month) => ({ ...acc, [month.key]: 0 }), {});

	conversions.forEach((conversion) => {
		if (conversion?.status !== DONE_STATUS) return;

		const createdAt = new Date(conversion.created_at);
		if (Number.isNaN(createdAt.getTime())) return;

		const monthKey = getMonthKey(createdAt);
		if (!Object.prototype.hasOwnProperty.call(monthlyTokens, monthKey)) return;

		monthlyTokens[monthKey] += Number(conversion.total_tokens) || 0;
		monthlyMacros[monthKey] += 1;
	});

	const tokensByMonth = months.map((month) => monthlyTokens[month.key] || 0);
	const macrosByMonth = months.map((month) => monthlyMacros[month.key] || 0);

	return {
		tokensByMonth,
		macrosByMonth,
		spentThisMonth: monthlyTokens[currentMonthKey] || 0,
		macrosThisMonth: monthlyMacros[currentMonthKey] || 0,
		maxMonthlyTokens: Math.max(...tokensByMonth, 0),
		maxMonthlyMacros: Math.max(...macrosByMonth, 0),
	};
}

const TokenUsageStatistics = () => {
	const iconBoxInside = useColorModeValue('white', 'white');
	const textColor = useColorModeValue('gray.700', 'white');
	const months = useMemo(() => getLastMonths(MONTHS_TO_SHOW), []);
	const [subscription, setSubscription] = useState({
		packageTokens: 0,
		tokensRemain: 0,
	});
	const [usageStats, setUsageStats] = useState({
		tokensByMonth: months.map(() => 0),
		spentThisMonth: 0,
		macrosThisMonth: 0,
		maxMonthlyTokens: 0,
		maxMonthlyMacros: 0,
	});

	useEffect(() => {
		let isMounted = true;

		async function loadSubscription() {
			try {
				const payload = await getUserSubscription();
				if (!isMounted) return;

				setSubscription({
					packageTokens: Number(payload?.package_tokens) || 0,
					tokensRemain: Number(payload?.tokens_remain) || 0,
				});
			} catch (error) {
				if (!isMounted) return;

				if (isNoSubscriptionError(error)) {
					setSubscription({ packageTokens: 0, tokensRemain: 0 });
					return;
				}

				setSubscription({ packageTokens: 0, tokensRemain: 0 });
			}
		}

		loadSubscription();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		let isMounted = true;
		const rangeStart = months[0].date;

		async function loadUsageStats() {
			try {
				const conversions = await loadConversionsForRange(rangeStart);
				if (!isMounted) return;

				setUsageStats(aggregateConversions(conversions, months));
			} catch (error) {
				if (!isMounted) return;

				setUsageStats({
					tokensByMonth: months.map(() => 0),
					spentThisMonth: 0,
					macrosThisMonth: 0,
					maxMonthlyTokens: 0,
					maxMonthlyMacros: 0,
				});
			}
		}

		loadUsageStats();

		return () => {
			isMounted = false;
		};
	}, [months]);

	const chartMaxValue = usageStats.maxMonthlyTokens || subscription.packageTokens || 1;
	const tokensRemainProgress = getProgressValue(subscription.tokensRemain, subscription.packageTokens);
	const macrosProgress = getProgressValue(usageStats.macrosThisMonth, usageStats.maxMonthlyMacros);

	return (
		<Card p="16px">
			<CardBody>
				<Flex direction="column" w="100%">
					<BarChart
						categories={months.map((month) => month.label)}
						maxValue={chartMaxValue}
						variant="usage"
						series={[
							{
								name: '\u0422\u043e\u043a\u0435\u043d\u043e\u0432',
								data: usageStats.tokensByMonth,
							},
						]}
					/>
					<Flex direction="column" mt="24px" mb="36px" alignSelf="flex-start">
						<Text fontSize="lg" color={textColor} fontWeight="bold" mb="6px">
							{'\u0420\u0430\u0441\u0445\u043e\u0434 \u0442\u043e\u043a\u0435\u043d\u043e\u0432'}
						</Text>
						<Text fontSize="md" fontWeight="medium" color="gray.400">
							<Text as="span" color="red.400" fontWeight="bold">
								{formatTokenValue(usageStats.spentThisMonth)}
							</Text>{' '}
							{'\u0437\u0430 \u044d\u0442\u043e\u0442 \u043c\u0435\u0441\u044f\u0446'}
						</Text>
					</Flex>
					<SimpleGrid gap={{ sm: '12px' }} columns={2}>
						<ChartStatistics
							title={'\u0422\u043e\u043a\u0435\u043d\u043e\u0432 \u043e\u0441\u0442\u0430\u043b\u043e\u0441\u044c'}
							amount={`${formatTokenValue(subscription.tokensRemain)} / ${formatTokenValue(
								subscription.packageTokens
							)}`}
							percentage={tokensRemainProgress}
							icon={<TokensRemainIcon h="15px" w="15px" color={iconBoxInside} />}
						/>
						<ChartStatistics
							title={'\u041c\u0430\u043a\u0440\u043e\u0441\u043e\u0432 \u043f\u0435\u0440\u0435\u0432\u0435\u0434\u0435\u043d\u043e'}
							amount={formatTokenValue(usageStats.macrosThisMonth)}
							percentage={macrosProgress}
							icon={<RocketIcon h="15px" w="15px" color={iconBoxInside} />}
						/>
					</SimpleGrid>
				</Flex>
			</CardBody>
		</Card>
	);
};

export default TokenUsageStatistics;
