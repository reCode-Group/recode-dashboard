import { Box, Button, Flex, Grid, GridItem, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import ProfileBgImage from 'assets/img/ProfileBackground.png';
import ConversionHistory from 'components/Tables/ConversionHistory';
import { useEffect, useMemo, useState } from 'react';
import { FaCog, FaUsers } from 'react-icons/fa';
import { IoDocumentsSharp } from 'react-icons/io5';
import { useLocation } from 'react-router-dom';
import { dashboardTableData, invoicesData } from 'variables/general';
import DocumentsFull from 'views/Dashboard/Billing/components/DocumentsFull';
import EmployeeTable from 'views/Dashboard/Tables/components/EmployeeTable';
import CompanyInformation from './components/CompanyInformation';
import CompanySettings from './components/CompanySettings';

function Company() {
	const location = useLocation();
	const queryTab = useMemo(() => new URLSearchParams(location.search).get('tab'), [
		location.search,
	]);
	const [activeTab, setActiveTab] = useState(
		queryTab === 'employees' || queryTab === 'documents' ? queryTab : 'settings'
	);

	const textColor = useColorModeValue('gray.700', 'white');
	const borderProfileColor = useColorModeValue('white', 'rgba(255, 255, 255, 0.31)');
	const navGlassBg = useColorModeValue(
		'linear-gradient(165.45deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)',
		'linear-gradient(165.45deg, rgba(26, 32, 44, 0.82) 0%, rgba(26, 32, 44, 0.8) 110.84%)'
	);

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
						title={'Информация'}
						company={'ООО «РЕКОД»'}
						email={'one@recode.su'}
						description={
							'Описание компании ... Может быть длинным и может быть коротким, пофиг кароче'
						}
						fullName={'ООО «РЕКОД РЕШЕНИЯ»'}
						legalAddress={'620000, г. Екатеринбург, ул. Малышева, д. 51, офис 1204'}
						inn={'770356092098'}
						ogrn={'8786543679887665'}
						phone={'+7 (900) 356-92-98'}
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
							<DocumentsFull title={'Документы компании'} data={invoicesData} fixedHeight="346px" />
						) : activeTab === 'employees' ? (
							<EmployeeTable
								withPageContainer={false}
								showFullListButton="false"
								title={'Сотрудники'}
								hiddenColumns={['role']}
							/>
						) : (
							<CompanySettings title={'Настройки компании'} />
						)}
					</Grid>
				</GridItem>

				<GridItem colSpan={{ base: 1, xl: 2 }}>
					<Grid templateColumns={{ sm: '1fr' }} gap="24px" mt="24px">
						<ConversionHistory
							title={'Последние конвертации'}
							amount={9}
							captions={['ID', 'Дата', 'Результат перевода', 'Затраченные токены', 'Статус']}
							data={dashboardTableData}
							enablePagination={true}
							showFullHistoryButton={true}
						/>
					</Grid>
				</GridItem>
			</Grid>
		</Flex>
	);
}

export default Company;
