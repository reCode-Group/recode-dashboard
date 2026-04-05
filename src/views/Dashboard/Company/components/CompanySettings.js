import { Flex, Grid, Switch, Text, useColorModeValue } from '@chakra-ui/react';
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
		{ label: 'Параметр 1', checked: true },
		{ label: 'Параметр 2', checked: false },
		{ label: 'Параметр 3', checked: true },
		{ label: 'Параметр 4', checked: true },
		{ label: 'Параметр 5', checked: true },
		{ label: 'Параметр 6', checked: false },
	];

	const notificationOptions = [
		{ label: 'Параметр 1', checked: true },
		{ label: 'Параметр 2', checked: false },
	];

	const managementOptions = [
		{ label: 'Параметр 4', checked: false },
		{ label: 'Параметр 5', checked: false },
	];

	const renderRow = (item, key) => (
		<Flex key={key} align="center" mb="20px">
			<Switch colorScheme="recode" me="10px" isChecked={item.checked} />
			<Text noOfLines={1} fontSize="md" color="gray.500" fontWeight="400">
				{item.label}
			</Text>
		</Flex>
	);

	return (
		<Card
			p="16px"
			minH={{ xl: '346px' }}
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
