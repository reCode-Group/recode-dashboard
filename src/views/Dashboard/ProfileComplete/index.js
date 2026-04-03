import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	Input,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';

const CYRILLIC_PATTERN = /^[А-Яа-яЁё-]+$/;
const MAX_FIO_LENGTH = 32;

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

const getFioErrors = (label, value, { required = false } = {}) => {
	const trimmed = value.trim();
	const errors = [];

	if (required && trimmed.length === 0) {
		errors.push(`${label}: обязательное поле`);
		return errors;
	}

	if (trimmed.length === 0) {
		return errors;
	}

	if (trimmed.length > MAX_FIO_LENGTH) {
		errors.push(`${label}: не более ${MAX_FIO_LENGTH} символов`);
	}

	if (!CYRILLIC_PATTERN.test(trimmed)) {
		errors.push(`${label}: допускается только кириллица`);
	}

	return errors;
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
	const panelBg = useColorModeValue('white', 'gray.700');
	const panelTitleColor = useColorModeValue('gray.700', 'white');
	const mutedTextColor = useColorModeValue('gray.500', 'gray.300');
	const errorTextColor = useColorModeValue('red.600', 'red.200');
	const errorItemBg = useColorModeValue('red.50', 'rgba(229, 62, 62, 0.16)');
	const errorItemBorder = useColorModeValue('red.100', 'rgba(254, 178, 178, 0.35)');
	const panelSubtleBg = useColorModeValue('gray.50', 'whiteAlpha.100');

	const fioErrors = useMemo(
		() => [
			...getFioErrors('Фамилия', lastName, { required: true }),
			...getFioErrors('Имя', firstName, { required: true }),
			...getFioErrors('Отчество', middleName),
		],
		[firstName, lastName, middleName]
	);

	const phoneErrors = useMemo(() => {
		const digits = phone.replace(/\D/g, '');
		const errors = [];
		if (digits.length === 0 || phone.trim() === '' || phone === '+7') {
			errors.push('Телефон: обязательное поле');
		} else if (digits.length !== 11) {
			errors.push('Телефон: введите номер в формате +7 (XXX) XXX-XX-XX');
		}
		return errors;
	}, [phone]);

	const validationErrors = useMemo(() => [...fioErrors, ...phoneErrors], [fioErrors, phoneErrors]);
	const isDirty = useMemo(
		() => lastName !== '' || firstName !== '' || middleName !== '' || phone !== '+7',
		[firstName, lastName, middleName, phone]
	);
	const shouldShowErrors = isDirty && validationErrors.length > 0;
	const canSave = validationErrors.length === 0;

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
		<Flex direction="column" pt={{ base: '120px', md: '75px' }} minH="100vh">
			{isSaved ? (
				<Alert status="success" borderRadius="12px" mb="16px">
					<AlertIcon />
					Профиль сохранен успешно
				</Alert>
			) : null}

			<Grid templateColumns={{ base: '1fr', xl: '1fr 1fr' }} gap="24px" alignItems="start">
				<GridItem>
					<Box maxW="500px" w="100%">
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
											placeholder="Иванов"
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											bg={inputBg}
											{...inputStyles}
										/>
									</FormControl>

									<FormControl>
										<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
											Имя
										</FormLabel>
										<Input
											placeholder="Иван"
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											bg={inputBg}
											{...inputStyles}
										/>
									</FormControl>

									<FormControl>
										<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
											Отчество
										</FormLabel>
										<Input
											value={middleName}
											onChange={(e) => setMiddleName(e.target.value)}
											bg={inputBg}
											placeholder="Иванович"
											{...inputStyles}
										/>
									</FormControl>

									<FormControl>
										<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
											Телефон
										</FormLabel>
										<Input
											value={phone}
											onChange={(e) => setPhone(formatPhone(e.target.value))}
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
				</GridItem>

				<GridItem>
					{shouldShowErrors ? (
						<Box
							bg={panelBg}
							border="1px solid"
							borderColor={borderColor}
							borderRadius="15px"
							p="24px"
						>
							<Text fontSize="24px" lineHeight="1.3" fontWeight="bold" color={panelTitleColor}>
								Ошибки заполнения
							</Text>
							<Box
								mt="12px"
								px="12px"
								py="10px"
								bg={panelSubtleBg}
								border="1px solid"
								borderColor={borderColor}
								borderRadius="12px"
							>
								<Text fontSize="12px" fontWeight="bold" color={mutedTextColor}>
									{`Найдено ошибок: ${validationErrors.length}`}
								</Text>
							</Box>

							<Flex direction="column" mt="12px" gap="8px">
								{validationErrors.map((error) => (
									<Flex
										key={error}
										align="flex-start"
										gap="10px"
										bg={errorItemBg}
										border="1px solid"
										borderColor={errorItemBorder}
										borderRadius="12px"
										px="12px"
										py="10px"
									>
										<Box mt="7px" w="6px" h="6px" borderRadius="full" bg={errorTextColor} />
										<Text fontSize="14px" lineHeight="1.45" color={errorTextColor}>
											{error}
										</Text>
									</Flex>
								))}
							</Flex>
						</Box>
					) : null}
				</GridItem>
			</Grid>
		</Flex>
	);
}

export default ProfileComplete;
