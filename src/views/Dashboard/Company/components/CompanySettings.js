import { Flex, Grid, Switch, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';

const CompanySettings = ({ title }) => {
	const textColor = useColorModeValue('gray.700', 'white');
	const borderProfileColor = useColorModeValue('white', 'rgba(255, 255, 255, 0.31)');
	const glassBg = useColorModeValue(
		'linear-gradient(165.45deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)',
		'linear-gradient(165.45deg, rgba(26, 32, 44, 0.82) 0%, rgba(26, 32, 44, 0.8) 110.84%)'
	);

	const companyOptions = [
		{
			label: 'Скрыть финансовые разделы от сотрудников',
			tooltip: 'Сотрудники не будут видеть баланс, оплаты и финансовую историю компании.',
			checked: true,
		},
		{
			label: 'Разрешить вход только подтвержденным пользователям',
			tooltip: 'Доступ к платформе останется только у сотрудников с подтвержденным аккаунтом.',
			checked: true,
		},
		{
			label: 'Запретить сотрудникам переводить токены',
			tooltip: 'Сотрудники не смогут переводить токены между своими счетами и другими пользователями.',
			checked: true,
		},
		{
			label: 'Сохранять историю конвертаций',
			tooltip: 'Включает хранение истории операций конвертации для контроля и сверки.',
			checked: false,
		},
	];

	const notificationOptions = [
		{
			label: 'Уведомлять о низком остатке токенов',
			tooltip: 'Отправляет уведомление, когда остаток токенов компании опускается ниже порога.',
			checked: true,
		},
		{
			label: 'Отправлять письмо при добавлении сотрудника',
			tooltip: 'После добавления сотрудника на его почту будет отправлено письмо с уведомлением.',
			checked: false,
		},
	];

	const managementOptions = [
		{
			label: 'Автовыдача токенов новым сотрудникам',
			tooltip: 'Новым сотрудникам токены будут начисляться автоматически по правилам компании.',
			checked: false,
		},
	];

	const renderRow = (item, key) => (
		<Flex key={key} align="center" mb="20px">
			<Switch colorScheme="recode" me="10px" isChecked={item.checked} />
			<Tooltip
				label={item.tooltip}
				hasArrow
				placement="top-start"
				bg="gray.700"
				color="white"
				borderRadius="10px"
				px="12px"
				py="8px"
				maxW="320px"
			>
				<Text noOfLines={2} fontSize="md" color="gray.500" fontWeight="400" cursor="help">
					{item.label}
				</Text>
			</Tooltip>
		</Flex>
	);

	return (
		<Card
			p="16px"
			h="100%"
			backdropFilter="saturate(200%) blur(10.5px)"
			boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
			border="1.5px solid"
			borderColor={borderProfileColor}
			bg={glassBg}
		>
			<CardHeader p="12px 5px" mb="12px">
				<Text fontSize="lg" color={textColor} fontWeight="bold">
					{title}
				</Text>
			</CardHeader>
			<CardBody px="5px">
				<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="120px">
					<Flex direction="column">
						<Text fontSize="sm" color="gray.500" fontWeight="600" mb="20px">
							КОМПАНИЯ
						</Text>
						{companyOptions.map((item, index) => renderRow(item, `company-${index}`))}
					</Flex>

					<Flex direction="column">
						<Text fontSize="sm" color="gray.500" fontWeight="600" mb="20px">
							УВЕДОМЛЕНИЯ
						</Text>
						{notificationOptions.map((item, index) => renderRow(item, `notification-${index}`))}

						<Text fontSize="sm" color="gray.500" fontWeight="600" m="6px 0px 20px 0px">
							УПРАВЛЕНИЕ
						</Text>
						{managementOptions.map((item, index) => renderRow(item, `management-${index}`))}
					</Flex>
				</Grid>
			</CardBody>
		</Card>
	);
};

export default CompanySettings;
