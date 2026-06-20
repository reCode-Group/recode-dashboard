// Chakra imports
import { Alert, AlertIcon, Button, Flex, Grid, Spinner, useColorModeValue } from '@chakra-ui/react';
import avatar4 from 'assets/img/avatars/avatar4.png';
import ProfileBgImage from 'assets/img/ProfileBackground.png';
import ConversionHistory from 'components/Tables/ConversionHistory';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCube } from 'react-icons/fa';
import { IoDocumentsSharp } from 'react-icons/io5';
import { useLocation } from 'react-router-dom';
import { invoicesData } from 'variables/general';
import DocumentsFull from 'views/Dashboard/Billing/components/DocumentsFull';
import SupportTicketList from 'views/Dashboard/Support/components/SupportTicketList';
import { getUserConversions } from 'services/conversions';
import { getOrganizationDetails } from 'services/organization';
import { getCurrentUser } from 'services/auth';
import Header from './components/Header';
import PlatformSettings from './components/PlatformSettings';
import ProfileInformation from './components/ProfileInformation';

const emptyValue = 'Не указано';

function getFullName(user) {
	const parts = [user?.surname, user?.name, user?.lastname].filter(Boolean);
	return parts.length > 0 ? parts.join(' ') : emptyValue;
}

function getDisplayName(user) {
	return getFullName(user) !== emptyValue ? getFullName(user) : user?.email || 'Профиль';
}

function getRoleLabel(role) {
	if (role === 'director') return 'Руководитель';
	if (role === 'employee') return 'Сотрудник';
	return emptyValue;
}

function formatDate(value) {
	if (!value) return emptyValue;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return emptyValue;
	return date.toLocaleDateString('ru-RU');
}

function mapConversion(row) {
	const origin = row.origin_language || row.origin_code || '-';
	const target = row.target_language || row.target_code || '-';

	return {
		id: row.id,
		type: `${origin} → ${target}`,
		tokens_remain: row.total_tokens,
		result_url: '',
		status: row.status || emptyValue,
		date: formatDate(row.created_at),
	};
}

function Profile() {
	const location = useLocation();
	const bgProfile = useColorModeValue(
		'hsla(0,0%,100%,.8)',
		'linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)'
	);
	const loadingColor = useColorModeValue('recode.300', 'recode.200');
	const queryTab = useMemo(() => new URLSearchParams(location.search).get('tab'), [location.search]);
	const [activeTab, setActiveTab] = useState(queryTab === 'documents' ? 'documents' : 'overview');
	const [user, setUser] = useState(null);
	const [organization, setOrganization] = useState(null);
	const [conversions, setConversions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (queryTab === 'documents' || queryTab === 'overview') {
			setActiveTab(queryTab);
		}
	}, [queryTab]);

	const loadProfile = useCallback(async () => {
		setIsLoading(true);
		setError('');

		try {
			const currentUser = await getCurrentUser();
			setUser(currentUser);

			const [organizationResult, conversionsResult] = await Promise.all([
				currentUser.has_organization
					? getOrganizationDetails().catch(() => null)
					: Promise.resolve(null),
				getUserConversions(9).catch(() => ({ items: [] })),
			]);

			setOrganization(organizationResult);
			setConversions((conversionsResult?.items || []).map(mapConversion));
		} catch (requestError) {
			setError(requestError.message || 'Не удалось загрузить данные профиля');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	const tabs = [
		{
			id: 'overview',
			name: 'ОБЗОР',
			icon: <FaCube w="100%" h="100%" />,
		},
		{
			id: 'documents',
			name: 'ДОКУМЕНТЫ',
			icon: <IoDocumentsSharp w="100%" h="100%" />,
		},
	];

	if (isLoading) {
		return (
			<Flex minH="50vh" align="center" justify="center">
				<Spinner color={loadingColor} size="xl" />
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
				<Button alignSelf="flex-start" colorScheme="recode" onClick={loadProfile}>
					Повторить загрузку
				</Button>
			</Flex>
		);
	}

	const displayName = getDisplayName(user);
	const fullName = getFullName(user);
	const companyName = organization?.full_name || emptyValue;
	const roleName = getRoleLabel(user?.organization_role);
	const mobile = emptyValue;

	return (
		<Flex direction="column">
			<Header
				backgroundHeader={ProfileBgImage}
				backgroundProfile={bgProfile}
				avatarImage={avatar4}
				name={displayName}
				email={user?.email || emptyValue}
				tabs={tabs}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			{activeTab === 'documents' ? (
				<DocumentsFull title={'Отчеты'} data={invoicesData} />
			) : (
				<>
					<Grid templateColumns={{ sm: '1fr', xl: 'repeat(3, 1fr)' }} gap="22px">
						<ProfileInformation
							title={'Данные'}
							company={companyName}
							role={roleName}
							name={fullName}
							mobile={mobile}
							email={user?.email || emptyValue}
						/>
						<PlatformSettings
							title={'Настройки платформы'}
							subtitle1={'АККАУНТ'}
							subtitle2={'ПЕРСОНАЛИЗАЦИЯ'}
						/>
						<SupportTicketList title={'Открытые тикеты'} />
					</Grid>
					<Grid
						templateColumns={{ sm: '1fr' }}
						templateRows={{ sm: '1fr auto', md: '1fr', lg: '1fr' }}
						gap="24px"
						mt="24px"
					>
						<ConversionHistory
							title={'Последние конвертации'}
							amount={conversions.length}
							captions={['ID', 'Тип', 'Статус', 'Результат перевода', 'Затраченные токены', 'Дата']}
							data={conversions}
							enablePagination={true}
							showFullHistoryButton={true}
							emptyText="Конвертаций пока нет"
						/>
					</Grid>
				</>
			)}
		</Flex>
	);
}

export default Profile;
