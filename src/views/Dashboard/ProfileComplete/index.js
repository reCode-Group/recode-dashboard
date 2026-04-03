import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';

const formatPhone = (input) => {
	let digits = input.replace(/\D/g, '');

	if (digits.startsWith('8')) {
		digits = `7${digits.slice(1)}`;
	}

	if (!digits.startsWith('7')) {
		digits = `7${digits}`;
	}

	const localDigits = digits.slice(1, 11);
	const p1 = localDigits.slice(0, 3);
	const p2 = localDigits.slice(3, 6);
	const p3 = localDigits.slice(6, 8);
	const p4 = localDigits.slice(8, 10);

	let result = '+7';
	if (p1) {
		result += ` (${p1}`;
	}
	if (p1.length === 3) {
		result += ')';
	}
	if (p2) {
		result += ` ${p2}`;
	}
	if (p3) {
		result += `-${p3}`;
	}
	if (p4) {
		result += `-${p4}`;
	}

	return result;
};

function ProfileComplete() {
	const [lastName, setLastName] = useState('');
	const [firstName, setFirstName] = useState('');
	const [middleName, setMiddleName] = useState('');
	const [phone, setPhone] = useState('+7');
	const [isSaving, setIsSaving] = useState(false);
	const [isSaved, setIsSaved] = useState(false);

	const titleColor = useColorModeValue('gray.700', 'white');
	const subtitleColor = useColorModeValue('gray.400', 'gray.300');
	const labelColor = useColorModeValue('gray.700', 'gray.100');
	const inputTextColor = useColorModeValue('gray.500', 'gray.200');
	const inputBg = useColorModeValue('white', 'whiteAlpha.50');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

	const canSave = useMemo(() => {
		const phoneDigits = phone.replace(/\D/g, '');
		return (
			lastName.trim() !== '' &&
			firstName.trim() !== '' &&
			middleName.trim() !== '' &&
			phoneDigits.length === 11
		);
	}, [firstName, lastName, middleName, phone]);

	const inputStyles = {
		borderRadius: '15px',
		fontSize: 'sm',
		size: 'lg',
		color: inputTextColor,
		borderColor,
	};

	const handleSave = () => {
		if (!canSave || isSaving) {
			return;
		}

		setIsSaving(true);
		window.setTimeout(() => {
			setIsSaving(false);
			setIsSaved(true);
		}, 1200);
	};

	return (
		<Flex direction="column" pt={{ base: '120px', md: '75px' }} height="100vh">
			<Box maxW="500px" w="100%">
				{isSaved ? (
					<Alert status="success" borderRadius="12px" mb="16px">
						<AlertIcon />
						Профиль сохранен успешно
					</Alert>
				) : null}

				{isSaved ? null : (
					<>
						<Text fontSize="32px" lineHeight="1.3" fontWeight="bold" color={titleColor}>
							Заполните профиль
						</Text>
						<Text
							mt="4px"
							mb="32px"
							fontSize="14px"
							lineHeight="1.4"
							fontWeight="bold"
							color={subtitleColor}
						>
							Это займет пару минут и откроет доступ ко всем возможностям платформы
						</Text>
						<Flex direction="column" gap="16px">
							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Фамилия
								</FormLabel>
								<Input
									value={lastName}
									onChange={(event) => setLastName(event.target.value)}
									bg={inputBg}
									{...inputStyles}
								/>
							</FormControl>

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Имя
								</FormLabel>
								<Input
									value={firstName}
									onChange={(event) => setFirstName(event.target.value)}
									bg={inputBg}
									{...inputStyles}
								/>
							</FormControl>

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Отчество (при наличии)
								</FormLabel>
								<Input
									value={middleName}
									onChange={(event) => setMiddleName(event.target.value)}
									bg={inputBg}
									{...inputStyles}
								/>
							</FormControl>

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Телефон
								</FormLabel>
								<Input
									value={phone}
									onChange={(event) => setPhone(formatPhone(event.target.value))}
									placeholder="+7 (___) ___-__-__"
									bg={inputBg}
									{...inputStyles}
								/>
							</FormControl>

							<Button
								mt="8px"
								h="45px"
								borderRadius="12px"
								bg="#005DE0"
								color="white"
								fontSize="xs"
								fontWeight="medium"
								letterSpacing="0.02em"
								isLoading={isSaving}
								loadingText="Сохраняем..."
								isDisabled={!canSave}
								_hover={{ bg: '#0A54BE' }}
								_active={{ bg: '#0A54BE' }}
								onClick={handleSave}
							>
								СОХРАНИТЬ
							</Button>
						</Flex>
					</>
				)}
			</Box>
		</Flex>
	);
}

export default ProfileComplete;
