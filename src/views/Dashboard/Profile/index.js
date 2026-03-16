// Chakra imports
import { Flex, Grid, useColorModeValue } from '@chakra-ui/react';
import avatar4 from 'assets/img/avatars/avatar4.png';
import ProfileBgImage from 'assets/img/ProfileBackground.png';
import ConversionHistory from 'components/Tables/ConversionHistory';
import { FaCube, FaPenFancy } from 'react-icons/fa';
import { IoDocumentsSharp } from 'react-icons/io5';
import { useState } from 'react';
import { dashboardTableData } from 'variables/general';
import EmployeeTable from 'views/Dashboard/Tables/components/EmployeeTable';
import Conversations from './components/Conversations';
import Header from './components/Header';
import PlatformSettings from './components/PlatformSettings';
import ProfileInformation from './components/ProfileInformation';

function Profile() {
	const bgProfile = useColorModeValue(
		'hsla(0,0%,100%,.8)',
		'linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)'
	);
	const [activeTab, setActiveTab] = useState('overview');

	const tabs = [
		{
			id: 'overview',
			name: 'ОБЗОР',
			icon: <FaCube w="100%" h="100%" />,
		},
		{
			id: 'company',
			name: 'КОМПАНИЯ',
			icon: <IoDocumentsSharp w="100%" h="100%" />,
		},
		{
			id: 'employees',
			name: 'СОТРУДНИКИ',
			icon: <FaPenFancy w="100%" h="100%" />,
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

			{activeTab === 'employees' ? (
				<EmployeeTable withPageContainer={false} />
			) : (
				<>
					<Grid templateColumns={{ sm: '1fr', xl: 'repeat(3, 1fr)' }} gap="22px">
						<PlatformSettings
							title={'Настройки платформы'}
							subtitle1={'АККАУНТ'}
							subtitle2={'ПЕРСОНАЛИЗАЦИЯ'}
						/>
						<ProfileInformation
							title={'Данные'}
							company={'ООО «Рога и Копыта»'}
							role={'Администратор'}
							name={'Виктория Генадиевна Кузнецова'}
							mobile={'+7 (903) 123 1234 123'}
							email={'one@recode-group.ru'}
						/>
						<Conversations title={'Открытые тикеты'} />
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
