import { Flex, Text } from '@chakra-ui/react';
import Card from 'components/Card/Card';
import Chart from 'react-apexcharts';
import { barChartData, barChartOptions } from 'variables/charts';

const formatUsageValue = (value) => new Intl.NumberFormat('ru-RU').format(Number(value) || 0);

const formatUsageAxisValue = (value) => {
	const numericValue = Number(value) || 0;
	const absoluteValue = Math.abs(numericValue);
	const units = [
		{ threshold: 1_000_000_000, suffix: 'млрд' },
		{ threshold: 1_000_000, suffix: 'млн' },
		{ threshold: 1_000, suffix: 'тыс.' },
	];
	const unit = units.find(({ threshold }) => absoluteValue >= threshold);

	if (!unit) {
		return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(numericValue);
	}

	const compactValue = numericValue / unit.threshold;
	return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(compactValue)} ${
		unit.suffix
	}`;
};

const getUsageChartOptions = () => ({
	chart: {
		parentHeightOffset: 0,
		redrawOnParentResize: true,
		redrawOnWindowResize: true,
	},
	grid: {
		show: true,
		borderColor: 'rgba(255, 255, 255, 0.12)',
		strokeDashArray: 4,
		xaxis: {
			lines: {
				show: false,
			},
		},
		yaxis: {
			lines: {
				show: true,
			},
		},
	},
	plotOptions: {
		bar: {
			borderRadius: 6,
			columnWidth: '52%',
		},
	},
	tooltip: {
		theme: 'dark',
		y: {
			title: {
				formatter: () => '\u0422\u043e\u043a\u0435\u043d\u043e\u0432:',
			},
			formatter: (value) => formatUsageValue(value),
		},
	},
	yaxis: {
		min: 0,
		tickAmount: 4,
		forceNiceScale: true,
		decimalsInFloat: 0,
		labels: {
			formatter: (value) => formatUsageAxisValue(value),
		},
	},
	responsive: [
		{
			breakpoint: 768,
			options: {
				plotOptions: {
					bar: {
						borderRadius: 6,
						columnWidth: '62%',
					},
				},
			},
		},
	],
});

const BarChart = ({ series = barChartData, categories, maxValue, variant = 'default' }) => {
	const hasData = series.some((item) => (item.data || []).some((value) => Number(value) > 0));
	const isUsageVariant = variant === 'usage';
	const usageChartOptions = isUsageVariant ? getUsageChartOptions() : {};
	const chartOptions = {
		...barChartOptions,
		...usageChartOptions,
		chart: {
			...barChartOptions.chart,
			...(usageChartOptions.chart || {}),
		},
		xaxis: {
			...barChartOptions.xaxis,
			categories: categories || barChartOptions.xaxis.categories,
			show: true,
			labels: {
				...barChartOptions.xaxis.labels,
				show: true,
			},
		},
		yaxis: {
			...barChartOptions.yaxis,
			...(usageChartOptions.yaxis || {}),
			labels: {
				...barChartOptions.yaxis.labels,
				...(usageChartOptions.yaxis?.labels || {}),
			},
			max: maxValue,
		},
		plotOptions: {
			...barChartOptions.plotOptions,
			...(usageChartOptions.plotOptions || {}),
			bar: {
				...barChartOptions.plotOptions.bar,
				...(usageChartOptions.plotOptions?.bar || {}),
			},
		},
		tooltip: {
			...barChartOptions.tooltip,
			...(usageChartOptions.tooltip || {}),
		},
		dataLabels: {
			...barChartOptions.dataLabels,
			...(usageChartOptions.dataLabels || {}),
		},
		grid: {
			...barChartOptions.grid,
			...(usageChartOptions.grid || {}),
		},
		responsive: isUsageVariant ? usageChartOptions.responsive : barChartOptions.responsive,
	};

	return (
		<Card
			py="1rem"
			height={{ sm: '200px' }}
			width="100%"
			minW="0"
			bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
			position="relative"
		>
			<Flex
				w="100%"
				minW="0"
				h="100%"
				flex="1 1 auto"
				filter={hasData ? 'none' : 'blur(3px)'}
				opacity={hasData ? 1 : 0.45}
				sx={{
					'& > div, & .apexcharts-canvas, & .apexcharts-svg': {
						width: '100% !important',
					},
				}}
			>
				<Chart options={chartOptions} series={series} type="bar" width="100%" height="100%" />
			</Flex>
			{!hasData ? (
				<Flex
					position="absolute"
					inset="0"
					align="center"
					justify="center"
					bg="rgba(21, 25, 40, 0.18)"
					borderRadius="inherit"
					pointerEvents="none"
				>
					<Text color="white" fontSize="md" fontWeight="bold">
						{'\u041d\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0445'}
					</Text>
				</Flex>
			) : null}
		</Card>
	);
};

export default BarChart;
