// Chakra imports
import {
	Button,
	Flex,
	Icon,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import TablesTableRow from 'components/Tables/TablesTableRow';
import { FaPlus } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { tablesTableData } from 'variables/general';

const defaultCaptions = ['Пользователь', 'Роль', 'Статус', 'Остаток токенов', ''];
const defaultColumnKeys = ['user', 'role', 'status', 'tokens', 'actions'];

const EmployeeTable = ({
	title = 'Таблица сотрудников',
	captions = defaultCaptions,
	data = tablesTableData,
	withPageContainer = true,
	hiddenColumns = [],
	showFullListButton = false,
	onFullListClick,
	fullListPath = '/employees',
}) => {
	const history = useHistory();
	const textColor = useColorModeValue('gray.700', 'white');
	const hiddenColumnsSet = new Set(hiddenColumns);
	const visibleCaptions = captions.filter((_, idx) => {
		const columnKey = defaultColumnKeys[idx] ?? `column-${idx}`;
		return !hiddenColumnsSet.has(columnKey);
	});
	const resolvedFullListPath = fullListPath.startsWith('/admin/')
		? fullListPath
		: `/admin${fullListPath.startsWith('/') ? fullListPath : `/${fullListPath}`}`;
	const handleFullListClick = onFullListClick ?? (() => history.push(resolvedFullListPath));

	const tableContent = (
		<Card overflowX={{ sm: 'scroll', xl: 'hidden' }}>
			<CardHeader p="6px 0px 22px 0px">
				<Flex align="center" justify="space-between" gap="12px" width="100%">
					<Text fontSize="xl" color={textColor} fontWeight="bold">
						{title}
					</Text>
					{showFullListButton && (
						<Button
							colorScheme="recode"
							borderColor="recode.300"
							color="recode.300"
							variant="outline"
							fontSize="xs"
							p="8px 30px"
							onClick={handleFullListClick}
						>
							Весь список
						</Button>
					)}
				</Flex>
			</CardHeader>
			<CardBody style={{ flexDirection: 'column' }}>
				<Table variant="simple" color={textColor}>
					<Thead>
						<Tr my=".8rem" pl="0px" color="gray.400">
							{visibleCaptions.map((caption, idx) => {
								return (
									<Th color="gray.400" key={idx} ps={idx === 0 ? '0px' : null}>
										{caption}
									</Th>
								);
							})}
						</Tr>
					</Thead>
					<Tbody>
						{data.map((row) => {
							return (
								<TablesTableRow
									key={`${row.email}-${row.name}`}
									name={row.name}
									logo={row.logo}
									email={row.email}
									subdomain={row.subdomain}
									domain={row.domain}
									status={row.status}
									date={row.date}
									hiddenColumns={hiddenColumns}
								/>
							);
						})}
					</Tbody>
				</Table>
				<Flex mt="18px">
					<Button
						leftIcon={<Icon as={FaPlus} boxSize="10px" />}
						variant="ghost"
						bg="transparent"
						border="none"
						color="recode.300"
						fontSize="xs"
						_hover={{ bg: 'transparent', color: 'recode.300' }}
						_active={{ bg: 'transparent' }}
						p="0px"
						height="auto"
						fontWeight="bold"
					>
						ДОБАВИТЬ СОТРУДНИКА
					</Button>
				</Flex>
			</CardBody>
		</Card>
	);

	if (!withPageContainer) {
		return tableContent;
	}

	return (
		<Flex direction="column" pt={{ base: '120px', md: '75px' }}>
			{tableContent}
		</Flex>
	);
};

export default EmployeeTable;
