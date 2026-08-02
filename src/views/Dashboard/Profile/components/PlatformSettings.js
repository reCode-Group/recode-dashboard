// Chakra imports
import {
	Button,
	Flex,
	Switch,
	Text,
	Tooltip,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';

const ACCOUNT_SETTINGS = [
	{
		id: 'twoFactorAuth',
		label: 'Двух-факторная аутентификация',
		defaultValue: false,
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
		defaultValue: false,
	},
];

function SettingRow({
	label,
	isChecked,
	isDisabled = false,
	onChange,
}) {
	const switchElement = (
		<Switch
			colorScheme='recode'
			me='10px'
			isChecked={isChecked}
			isDisabled={isDisabled}
			onChange={onChange}
		/>
	);

	return (
		<Flex align='center' mb='12px'>
			{isDisabled ? (
				<Tooltip label='Недоступно' hasArrow placement='top' openDelay={250}>
					<span>{switchElement}</span>
				</Tooltip>
			) : (
				switchElement
			)}
			<Text
				noOfLines={1}
				fontSize='md'
				color='gray.500'
				fontWeight='400'
			>
				{label}
			</Text>
		</Flex>
	);
}

const PlatformSettings = ({ title, subtitle1, subtitle2, onChangePassword }) => {
	const { colorMode, toggleColorMode } = useColorMode();
	const textColor = useColorModeValue('gray.700', 'white');
	const passwordButtonBorderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const passwordButtonHoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

	return (
		<Card id='settings' scrollMarginTop='110px' p='16px'>
			<CardHeader p='12px 5px' mb='12px'>
				<Text fontSize='lg' color={textColor} fontWeight='bold'>
					{title}
				</Text>
			</CardHeader>
			<CardBody px='5px'>
				<Flex direction='column'>
					<Text fontSize='sm' color='gray.500' fontWeight='600' mb='12px'>
						{subtitle1}
					</Text>
					{ACCOUNT_SETTINGS.map((setting) => (
						<Flex key={setting.id} direction="column" align="flex-start">
							<SettingRow
								label={setting.label}
								isChecked={setting.defaultValue}
								isDisabled={setting.id !== 'darkTheme'}
								onChange={setting.id === 'darkTheme' ? toggleColorMode : undefined}
							/>
							{setting.id === 'twoFactorAuth' ? (
								<Button
									type="button"
									variant="outline"
									size="sm"
									borderRadius="12px"
									color="gray.500"
									borderColor={passwordButtonBorderColor}
									mb="16px"
									onClick={onChangePassword}
									_hover={{ bg: passwordButtonHoverBg }}
								>
									Сменить пароль
								</Button>
							) : null}
						</Flex>
					))}
					<Text fontSize='sm' color='gray.500' fontWeight='600' m='6px 0px 20px 0px'>
						{subtitle2}
					</Text>
					{PERSONALIZATION_SETTINGS.map((setting) => (
						<SettingRow
							key={setting.id}
							label={setting.label}
							isChecked={setting.id === 'darkTheme' ? colorMode === 'dark' : setting.defaultValue}
							isDisabled={setting.id !== 'darkTheme'}
							onChange={
								setting.id === 'darkTheme'
									? toggleColorMode
									: undefined
							}
						/>
					))}
				</Flex>
			</CardBody>
		</Card>
	);
};

export default PlatformSettings;
