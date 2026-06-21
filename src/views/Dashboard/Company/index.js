import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Icon,
	Spinner,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import ProfileBgImage from 'assets/img/ProfileBackground.png';
import ConversionHistory from 'components/Tables/ConversionHistory';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCog, FaUsers } from 'react-icons/fa';
import { IoDocumentsSharp } from 'react-icons/io5';
import { useHistory, useLocation } from 'react-router-dom';
import { getCurrentUser } from 'services/auth';
import { getOrganizationConversions } from 'services/conversions';
import { getOrganizationDetails } from 'services/organization';
import { mapConversion } from 'utils/conversions';
import { invoicesData } from 'variables/general';
import Documents from 'views/Dashboard/Billing/components/Documents';
import EmployeeTable from 'views/Dashboard/Tables/components/EmployeeTable';
import CompanyInformation from './components/CompanyInformation';
import CompanySettings from './components/CompanySettings';

const emptyValue = 'Не указано';

const conversionDateFormat = {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
};

function getCompanyName(organization) {
	return organization?.short_name || organization?.full_name || emptyValue;
}

function getCompanyAddress(organization) {
	return organization?.address || organization?.post_address || emptyValue;
}

function Company() {
	const history = useHistory();
	const location = useLocation();
	const queryTab = useMemo(() => new URLSearchParams(location.search).get('tab'), [location.search]);
	const [activeTab, setActiveTab] = useState(
		queryTab === 'employees' || queryTab === 'documents' ? queryTab : 'settings'
	);
	const [organization, setOrganization] = useState(null);
	const [conversions, setConversions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	const textColor = useColorModeValue('gray.700', 'white');
	const borderProfileColor = useColorModeValue('white', 'rgba(255, 255, 255, 0.31)');
	const navGlassBg = useColorModeValue(
		'linear-gradient(165.45deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)',
		'linear-gradient(165.45deg, rgba(26, 32, 44, 0.82) 0%, rgba(26, 32, 44, 0.8) 110.84%)'
	);

	const loadCompany = useCallback(async () => {
		setIsLoading(true);
		setError('');

		try {
			const currentUser = await getCurrentUser();
			if (!currentUser.has_organization) {
				history.replace('/admin/company/reg');
				return;
			}

			const [organizationResult, conversionsResult] = await Promise.all([
				getOrganizationDetails(),
				getOrganizationConversions(9).catch(() => ({ items: [] })),
			]);

			setOrganization(organizationResult);
			setConversions(
				(conversionsResult?.items || []).map((conversion) =>
					mapConversion(conversion, { dateFormat: conversionDateFormat })
				)
			);
		} catch (requestError) {
			setError(requestError.message || 'Не удалось загрузить данные компании');
		} finally {
			setIsLoading(false);
		}
	}, [history]);

	useEffect(() => {
		loadCompany();
	}, [loadCompany]);

	useEffect(() => {
		if (queryTab === 'settings' || queryTab === 'employees' || queryTab === 'documents') {
			setActiveTab(queryTab);
		}
	}, [queryTab]);

	const tabs = [
		{ id: 'settings', name: 'НАСТРОЙКИ', icon: <FaCog /> },
		{ id: 'employees', name: 'СОТРУДНИКИ', icon: <FaUsers /> },
		{ id: 'documents', name: 'ДОКУМЕНТЫ', icon: <IoDocumentsSharp /> },
	];

	if (isLoading) {
		return (
			<Flex direction="column" minH="60vh" align="center" justify="center">
				<Spinner color="recode.300" size="xl" />
			</Flex>
		);
	}

	if (error) {
		return (
			<Flex direction="column" my={{ base: '120px', md: '75px' }} mx="1.5rem">
				<Alert status="error" borderRadius="12px">
					<AlertIcon />
					<Flex align="center" justify="space-between" gap="12px" w="100%">
						<Text>{error}</Text>
						<Button size="sm" onClick={loadCompany}>
							Повторить
						</Button>
					</Flex>
				</Alert>
			</Flex>
		);
	}

	return (
		<Flex direction="column">
			<Box
				bgImage={ProfileBgImage}
				w="100%"
				h="300px"
				borderRadius="25px"
				bgPosition="50%"
				bgRepeat="no-repeat"
			/>

			<Grid
				templateColumns={{ base: '1fr', xl: '493px minmax(0, 1fr)' }}
				gap="22px"
				alignItems="start"
				mt={{ base: '24px', xl: '-64px' }}
				mx="1.5rem"
				w={{ base: 'calc(100% - 3rem)', xl: '95%' }}
				alignSelf="center"
			>
				<GridItem>
					<CompanyInformation
						title="Информация"
						company={getCompanyName(organization)}
						email={organization?.email || emptyValue}
						fullName={organization?.full_name}
						responsibleFullName={emptyValue}
						legalAddress={getCompanyAddress(organization)}
						inn={organization?.inn || emptyValue}
						kpp={organization?.kpp || emptyValue}
						ogrn={organization?.ogrn || emptyValue}
						phone={emptyValue}
						tokensRemain={organization?.tokens_remain}
						employeesCount={organization?.employees_count}
					/>
				</GridItem>

				<GridItem>
					<Box
						minH={{ xl: '113px' }}
						p="16px"
						borderRadius="15px"
						backdropFilter="saturate(200%) blur(50px)"
						boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
						border="2px solid"
						borderColor={borderProfileColor}
						bg={navGlassBg}
						display="flex"
						alignItems="center"
					>
						<Flex direction={{ base: 'column', lg: 'row' }} gap={{ base: '8px', lg: '12px' }}>
							{tabs.map((tab) => {
								const isActive = activeTab === tab.id;
								return (
									<Button
										key={tab.id}
										p="0px"
										bg="transparent"
										onClick={() => setActiveTab(tab.id)}
										_hover={{ bg: 'none' }}
									>
										<Flex
											align="center"
											w={{ sm: '100%', lg: '135px' }}
											bg={isActive ? 'hsla(0,0%,100%,.3)' : 'transparent'}
											borderRadius="15px"
											justifyContent="center"
											py={isActive ? '12px' : '10px'}
											boxShadow={
												isActive
													? 'inset 0 0 1px 1px hsl(0deg 0% 100% / 90%), 0 20px 27px 0 rgb(0 0 0 / 5%)'
													: 'none'
											}
											border={isActive ? '1px solid' : 'none'}
											borderColor={isActive ? 'gray.200' : 'transparent'}
										>
											<Icon as={tab.icon.type || tab.icon} color={textColor} />
											<Text fontSize="xs" color={textColor} fontWeight="bold" ms="6px">
												{tab.name}
											</Text>
										</Flex>
									</Button>
								);
							})}
						</Flex>
					</Box>

					<Grid mt="24px">
						{activeTab === 'documents' ? (
							<Documents title="Документы компании" data={invoicesData} fixedHeight="403px" />
						) : activeTab === 'employees' ? (
							<EmployeeTable
								withPageContainer={false}
								showFullListButton={true}
								title="Сотрудники"
								hiddenColumns={['role']}
								fixedHeight="403px"
								enforceOrganizationGuard={false}
							/>
						) : (
							<CompanySettings title="Настройки компании" />
						)}
					</Grid>
				</GridItem>

				<GridItem colSpan={{ base: 1, xl: 2 }}>
					<Grid templateColumns={{ sm: '1fr' }} gap="24px" mt="24px">
						<ConversionHistory
							title="Последние конвертации"
							amount={conversions.length}
							captions={['ID', 'Тип', 'Статус', 'Результат перевода', 'Затраченные токены', 'Дата']}
							data={conversions}
							enablePagination={true}
							showFullHistoryButton={true}
							fullHistoryPath="/admin/conversion-history?scope=organization"
						/>
					</Grid>
				</GridItem>
			</Grid>
		</Flex>
	);
}

export default Company;
