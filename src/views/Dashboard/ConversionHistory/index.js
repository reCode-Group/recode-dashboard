import { Alert, AlertIcon, Button, Flex, Spinner } from '@chakra-ui/react';
import ConversionHistory from 'components/Tables/ConversionHistory';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrganizationConversions, getUserConversions } from 'services/conversions';
import { mapConversion } from 'utils/conversions';

function ConversionHistoryPage() {
	const location = useLocation();
	const queryScope = useMemo(
		() => new URLSearchParams(location.search).get('scope'),
		[location.search]
	);
	const isOrganizationScope = queryScope === 'organization';
	const [conversions, setConversions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	const loadConversions = useCallback(async () => {
		setIsLoading(true);
		setError('');

		try {
			const payload = isOrganizationScope
				? await getOrganizationConversions(100)
				: await getUserConversions(100);
			setConversions((payload?.items || []).map(mapConversion));
		} catch (requestError) {
			setError(requestError.message || 'Не удалось загрузить историю конвертаций');
		} finally {
			setIsLoading(false);
		}
	}, [isOrganizationScope]);

	useEffect(() => {
		loadConversions();
	}, [loadConversions]);

	if (isLoading) {
		return (
			<Flex direction="column" minH="60vh" align="center" justify="center">
				<Spinner color="recode.300" size="xl" />
			</Flex>
		);
	}

	if (error) {
		return (
			<Flex direction="column" gap="16px" pt={{ base: '120px', md: '75px' }}>
				<Alert status="error" borderRadius="12px">
					<AlertIcon />
					{error}
				</Alert>
				<Button alignSelf="flex-start" colorScheme="recode" onClick={loadConversions}>
					Повторить загрузку
				</Button>
			</Flex>
		);
	}

	return (
		<Flex direction="column" pt={{ base: '120px', md: '75px' }} h={{ base: '85vh', md: '100vh' }}>
			<ConversionHistory
				title={isOrganizationScope ? 'История конвертаций компании' : 'История конвертаций'}
				amount={conversions.length}
				captions={['ID', 'Тип', 'Статус', 'Результат перевода', 'Затраченные токены', 'Дата']}
				data={conversions}
				enablePagination={true}
				initialRowsPerPage={50}
				showFullHistoryButton={false}
				emptyText="Конвертаций пока нет"
			/>
		</Flex>
	);
}

export default ConversionHistoryPage;
