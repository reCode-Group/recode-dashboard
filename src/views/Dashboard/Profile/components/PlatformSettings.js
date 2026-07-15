// Chakra imports
import {
	Flex,
	Switch,
	Text,
	Tooltip,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';

const ACCOUNT_SETTINGS = [
	{
		id: 'conversionEmails',
		label: 'Получать письма о новой конвертации макроса',
		defaultValue: true,
	},
	{
		id: 'twoFactorAuth',
		label: 'Двух-факторная аутентификация',
		defaultValue: false,
		disabled: true,
	},
];

const PERSONALIZATION_SETTINGS = [
	{
		id: 'darkTheme',
		label: 'Темная тема',
	},
	{
		id: 'platformNews',
		label: 'Получать рассылку о новостях платформы',
		defaultValue: true,
	},
];

function SettingRow({
	label,
	isChecked,
	isDisabled = false,
	onChange,
}) {
	return (
		<Flex align='center' mb='20px'>
			<Switch
				colorScheme='recode'
				me='10px'
				isChecked={isChecked}
				isDisabled={isDisabled}
				onChange={onChange}
			/>
			<Tooltip label={label} hasArrow placement='top-start' openDelay={250}>
				<Text
					noOfLines={1}
					fontSize='md'
					color='gray.500'
					fontWeight='400'
					cursor={isDisabled ? 'not-allowed' : 'pointer'}
				>
					{label}
				</Text>
			</Tooltip>
		</Flex>
	);
}

const PlatformSettings = ({ title, subtitle1, subtitle2 }) => {
	const { colorMode, toggleColorMode } = useColorMode();
	const textColor = useColorModeValue('gray.700', 'white');

	const initialSettings = useMemo(
		() => ({
			conversionEmails: true,
			twoFactorAuth: false,
			platformNews: true,
		}),
		[]
	);

	const [settings, setSettings] = useState(initialSettings);

	useEffect(() => {
		setSettings(initialSettings);
	}, [initialSettings]);

	const handleToggleSetting = (settingId) => {
		setSettings((prev) => ({
			...prev,
			[settingId]: !prev[settingId],
		}));
	};

	return (
		<Card id='settings' scrollMarginTop='110px' p='16px'>
			<CardHeader p='12px 5px' mb='12px'>
				<Text fontSize='lg' color={textColor} fontWeight='bold'>
					{title}
				</Text>
			</CardHeader>
			<CardBody px='5px'>
				<Flex direction='column'>
					<Text fontSize='sm' color='gray.500' fontWeight='600' mb='20px'>
						{subtitle1}
					</Text>
					{ACCOUNT_SETTINGS.map((setting) => (
						<SettingRow
							key={setting.id}
							label={setting.label}
							isChecked={settings[setting.id]}
							isDisabled={setting.disabled}
							onChange={() => handleToggleSetting(setting.id)}
						/>
					))}
					<Text fontSize='sm' color='gray.500' fontWeight='600' m='6px 0px 20px 0px'>
						{subtitle2}
					</Text>
					{PERSONALIZATION_SETTINGS.map((setting) => (
						<SettingRow
							key={setting.id}
							label={setting.label}
							isChecked={setting.id === 'darkTheme' ? colorMode === 'dark' : settings[setting.id]}
							onChange={
								setting.id === 'darkTheme'
									? toggleColorMode
									: () => handleToggleSetting(setting.id)
							}
						/>
					))}
				</Flex>
			</CardBody>
		</Card>
	);
};

export default PlatformSettings;
