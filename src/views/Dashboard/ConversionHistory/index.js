import { Flex } from '@chakra-ui/react';
import ConversionHistory from 'components/Tables/ConversionHistory';
import { dashboardTableData } from 'variables/general';

function ConversionHistoryPage() {
	return (
		<Flex direction="column" pt={{ base: '120px', md: '75px' }} h={{ base: '85vh', md: '100vh' }}>
			<ConversionHistory
				title={'История переводов'}
				amount={dashboardTableData.length}
				captions={['ID', 'Тип', 'Статус', 'Результат перевода', 'Затраченные токены', 'Дата']}
				data={dashboardTableData}
				enablePagination={true}
				initialRowsPerPage={50}
				showFullHistoryButton={false}
			/>
		</Flex>
	);
}

export default ConversionHistoryPage;
