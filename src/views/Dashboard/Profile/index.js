// Chakra imports
import { Flex, Grid, useColorModeValue } from '@chakra-ui/react';
import avatar4 from 'assets/img/avatars/avatar4.png';
import ProfileBgImage from 'assets/img/ProfileBackground.png';
import ConversionHistory from 'components/Tables/ConversionHistory';
import { useEffect, useMemo, useState } from 'react';
import { FaCube } from 'react-icons/fa';
import { IoDocumentsSharp } from 'react-icons/io5';
import { useLocation } from 'react-router-dom';
import { dashboardTableData, invoicesData } from 'variables/general';
import DocumentsFull from 'views/Dashboard/Billing/components/DocumentsFull';
import SupportTicketList from 'views/Dashboard/Support/components/SupportTicketList';
import Header from './components/Header';
import PlatformSettings from './components/PlatformSettings';
import ProfileInformation from './components/ProfileInformation';

function Profile() {
	const location = useLocation();
	const bgProfile = useColorModeValue(
		'hsla(0,0%,100%,.8)',
		'linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)'
	);
	const queryTab = useMemo(() => new URLSearchParams(location.search).get('tab'), [location.search]);
	const [activeTab, setActiveTab] = useState(queryTab === 'documents' ? 'documents' : 'overview');

	useEffect(() => {
		if (queryTab === 'documents' || queryTab === 'overview') {
			setActiveTab(queryTab);
		}
	}, [queryTab]);

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

	return (
		<Flex direction="column">
			<Header
				backgroundHeader={ProfileBgImage}
				backgroundProfile={bgProfile}
				avatarImage={avatar4}
				name={'Виктория Кузнецова'}
				email={'one@recode-group.ru'}
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
							company={'ООО «Рога и Копыта»'}
							role={'Администратор'}
							name={'Виктория Генадиевна Кузнецова'}
							mobile={'+7 (903) 123 1234 123'}
							email={'one@recode-group.ru'}
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
							amount={9}
							captions={['ID', 'Тип', 'Статус', 'Результат перевода', 'Затраченные токены', 'Дата']}
							data={dashboardTableData}
							enablePagination={true}
							showFullHistoryButton={true}
						/>
					</Grid>
				</>
			)}
		</Flex>
	);
}

export default Profile;
