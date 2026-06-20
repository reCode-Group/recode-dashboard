// Chakra imports
import {
	Flex,
	Grid,
	Image,
	SimpleGrid,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
// assets
import peopleImage from 'assets/img/people-image.png';
import logoRecode from 'assets/svg/recode-logo-white.svg';
import BarChart from 'components/Charts/BarChart';
// Custom icons
import { EmployersIcon, TokensRemainIcon } from 'components/Icons/Icons';
import { PlusIcon, WalletIcon } from 'components/Icons/Icons.js';
import ConversionHistory from 'components/Tables/ConversionHistory';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCurrentUser, getEmployeesCount } from 'services/auth';
import { getUserSubscription } from 'services/subscription';
import { dashboardTableData } from 'variables/general';
import CreateSupportTicketModal from 'views/Dashboard/Support/components/CreateSupportTicketModal';
import ActiveUsers from './components/ActiveUsers';
import BuiltByDevelopers from './components/BuiltByDevelopers';
import MiniStatistics from './components/MiniStatistics';
import SalesOverview from './components/SalesOverview';
import WorkWithTheRockets from './components/WorkWithTheRockets';

const NO_SUBSCRIPTION_MESSAGES = [
	'subscription not found',
	'subscription is not active',
	'ErrNoSubscription',
	'ErrSubscriptionNotActive',
];
const COMPANY_ADMIN_ROLES = ['admin', 'director'];

function formatTokenValue(value) {
	return new Intl.NumberFormat('ru-RU').format(Number(value) || 0).replace(/,/g, ' ');
}

function isNoSubscriptionError(error) {
	const message = error?.message || '';
	return NO_SUBSCRIPTION_MESSAGES.some((knownMessage) => message.includes(knownMessage));
}

function isCompanyAdminUser(user) {
	return user?.has_organization && COMPANY_ADMIN_ROLES.includes(user?.organization_role);
}

export default function Dashboard() {
	const iconBoxInside = useColorModeValue('white', 'white');
	const history = useHistory();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isCompanyAdmin, setIsCompanyAdmin] = useState(null);
	const [employeesCount, setEmployeesCount] = useState('...');
	const [subscriptionStats, setSubscriptionStats] = useState({
		packageName: 'Загрузка...',
		tokensRemain: '...',
	});

	useEffect(() => {
		let isMounted = true;

		async function loadSubscription() {
			try {
				const subscription = await getUserSubscription();
				if (!isMounted) return;

				setSubscriptionStats({
					packageName: subscription?.package_name || 'Нет тарифа',
					tokensRemain: formatTokenValue(subscription?.tokens_remain),
				});
			} catch (error) {
				if (!isMounted) return;

				setSubscriptionStats({
					packageName: isNoSubscriptionError(error) ? 'Нет тарифа' : 'Нет данных',
					tokensRemain: '0',
				});
			}
		}

		loadSubscription();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		let isMounted = true;

		async function loadUserOrganizationStats() {
			try {
				const currentUser = await getCurrentUser();
				const canViewEmployees = isCompanyAdminUser(currentUser);
				if (!isMounted) return;

				setIsCompanyAdmin(Boolean(canViewEmployees));
				if (!canViewEmployees) {
					setEmployeesCount('0');
					return;
				}

				try {
					const employeesPayload = await getEmployeesCount();
					if (!isMounted) return;

					setEmployeesCount(formatTokenValue(employeesPayload?.count));
				} catch (error) {
					if (!isMounted) return;

					setEmployeesCount('0');
				}
			} catch (error) {
				if (!isMounted) return;

				setIsCompanyAdmin(false);
				setEmployeesCount('0');
			}
		}

		loadUserOrganizationStats();

		return () => {
			isMounted = false;
		};
	}, []);

	const showEmployeesStats = isCompanyAdmin === true;
	const isSupportStatsWide = isCompanyAdmin === false;

	return (
		<Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
			<SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
				<MiniStatistics
					title={'Тариф'}
					amount={subscriptionStats.packageName}
					icon={<WalletIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
				/>
				<MiniStatistics
					title={'Остаток токенов'}
					amount={subscriptionStats.tokensRemain}
					icon={<TokensRemainIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
				/>
				{showEmployeesStats ? (
					<MiniStatistics
						title={'Количество сотрудников'}
						amount={employeesCount}
						icon={<EmployersIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
					/>
				) : null}
				<MiniStatistics
					title={'Техподдержка'}
					amount={'Обращений нет'}
					icon={<PlusIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
					gridColumn={isSupportStatsWide ? { md: '1 / -1', xl: 'span 2' } : undefined}
					enableIconAction={true}
					wideAction={isSupportStatsWide}
					actionText="Создать"
					onIconAction={onOpen}
					iconActionLabel='Open support ticket modal'
				/>
			</SimpleGrid>
			<Grid
				templateColumns={{ md: '1fr', lg: '1.8fr 1.2fr' }}
				templateRows={{ md: '1fr auto', lg: '1fr' }}
				my="26px"
				gap="24px"
			>
				<BuiltByDevelopers
					title={'Создан для Вас'}
					name={'Платформа Рекод'}
					description={
						<>
							Управляйте компанией, добавляйте сотрудников и распределяйте токены.
							<br />
							Покупайте тарифы, переводите макросы и отслеживайте статистику: история переводов,
							расход токенов.
						</>
					}
					image={
						<Image
							src={logoRecode}
							alt="recode logo"
							width={180}
							minWidth={{ md: '300px', lg: 'auto' }}
						/>
					}
				/>
				<WorkWithTheRockets
					backgroundImage={peopleImage}
					title={'Сайт для бизнеса за 1 день'}
					description={
						'Современный адаптивный сайт с готовым набором инструментов под ваш бизнес и поддержка 24/7 от 750 руб./мес.'
					}
				/>
			</Grid>
			<Grid
				templateColumns={{ sm: '1fr', lg: '1.3fr 1.7fr' }}
				templateRows={{ sm: 'repeat(2, 1fr)', lg: '1fr' }}
				gap="24px"
				mb={{ lg: '26px' }}
			>
				<ActiveUsers title={'Расход токенов'} percentage={2300} chart={<BarChart />} />
				<SalesOverview title={'Операции над токенами'} />
			</Grid>
			<Grid
				templateColumns={{ sm: '1fr' }}
				templateRows={{ sm: '1fr auto', md: '1fr', lg: '1fr' }}
				gap="24px"
				minW="0"
			>
				<Flex minW="0" w="100%">
					<ConversionHistory
					title={'Конвертации'}
					amount={30}
					captions={['ID', 'Тип', 'Статус', 'Результат перевода', 'Затраченные токены', 'Дата']}
					data={dashboardTableData}
					enablePagination={false}
					initialRowsPerPage={5}
					showFullHistoryButton={true}
					/>
				</Flex>
			</Grid>

			<CreateSupportTicketModal
				isOpen={isOpen}
				onClose={onClose}
				onNavigateToTickets={() => history.push('/admin/support')}
				onTicketCreated={() => {}}
			/>
		</Flex>
	);
}
