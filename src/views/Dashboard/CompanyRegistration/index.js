import {
	Box,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	Input,
	Switch,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';

function CompanyRegistration() {
	const [sameAsOwner, setSameAsOwner] = useState(false);
	const [form, setForm] = useState({
		fullName: '',
		shortName: '',
		inn: '',
		kpp: '',
		ogrn: '',
		legalAddress: '',
		contactFio: '',
		contactPosition: '',
		contactPhone: '',
		contactEmail: '',
	});

	const titleColor = useColorModeValue('gray.700', 'white');
	const subtitleColor = useColorModeValue('gray.400', 'gray.300');
	const cardBg = useColorModeValue('white', 'gray.700');
	const cardBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
	const sectionTitleColor = useColorModeValue('gray.700', 'white');
	const labelColor = useColorModeValue('gray.700', 'gray.100');
	const inputTextColor = useColorModeValue('gray.500', 'gray.200');
	const inputBg = useColorModeValue('white', 'whiteAlpha.50');
	const mutedTextColor = useColorModeValue('gray.500', 'gray.300');

	const inputStyles = {
		borderRadius: '15px',
		fontSize: 'sm',
		size: 'lg',
		color: inputTextColor,
		borderColor: cardBorder,
		bg: inputBg,
	};

	const handleFieldChange = (field) => (event) => {
		setForm((prev) => ({ ...prev, [field]: event.target.value }));
	};

	return (
		<Flex direction="column" py={{ base: '120px', md: '75px' }} minH="100vh">
			<Box maxW="1000px" w="100%">
				<Text fontSize="32px" lineHeight="1.3" fontWeight="bold" color={titleColor}>
					Подключение организации
				</Text>
				<Text
					mt="4px"
					mb="24px"
					fontSize="14px"
					lineHeight="1.4"
					fontWeight="bold"
					color={subtitleColor}
				>
					Заполните данные для подключения компании
				</Text>

				<Flex direction="column" gap="16px">
					<Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="15px" p="24px">
						<Text
							fontSize="20px"
							lineHeight="1.3"
							fontWeight="bold"
							color={sectionTitleColor}
							mb="16px"
						>
							Реквизиты компании
						</Text>
						<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="16px">
							<GridItem colSpan={{ base: 1, md: 2 }}>
								<FormControl>
									<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
										Полное наименование
									</FormLabel>
									<Input
										placeholder="ООО Ромашка"
										value={form.fullName}
										onChange={handleFieldChange('fullName')}
										{...inputStyles}
									/>
								</FormControl>
							</GridItem>

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Сокращенное наименование
								</FormLabel>
								<Input
									placeholder="ООО Ромашка"
									value={form.shortName}
									onChange={handleFieldChange('shortName')}
									{...inputStyles}
								/>
							</FormControl>

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									ИНН
								</FormLabel>
								<Input
									placeholder="7700000000"
									value={form.inn}
									onChange={handleFieldChange('inn')}
									{...inputStyles}
								/>
							</FormControl>

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									КПП
								</FormLabel>
								<Input
									placeholder="770001001"
									value={form.kpp}
									onChange={handleFieldChange('kpp')}
									{...inputStyles}
								/>
							</FormControl>

							<FormControl>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									ОГРН
								</FormLabel>
								<Input
									placeholder="1027700132195"
									value={form.ogrn}
									onChange={handleFieldChange('ogrn')}
									{...inputStyles}
								/>
							</FormControl>
						</Grid>
					</Box>

					<Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="15px" p="24px">
						<Text
							fontSize="20px"
							lineHeight="1.3"
							fontWeight="bold"
							color={sectionTitleColor}
							mb="16px"
						>
							Адрес
						</Text>
						<FormControl>
							<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
								Юридический адрес
							</FormLabel>
							<Input
								placeholder="г. Москва, ул. Примерная, д. 1"
								value={form.legalAddress}
								onChange={handleFieldChange('legalAddress')}
								{...inputStyles}
							/>
						</FormControl>
					</Box>

					<Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="15px" p="24px">
						<Text
							fontSize="20px"
							lineHeight="1.3"
							fontWeight="bold"
							color={sectionTitleColor}
							mb="16px"
						>
							Контактное лицо
						</Text>

						<Flex
							align={{ base: 'flex-start', md: 'center' }}
							justify="space-between"
							direction={{ base: 'column', md: 'row' }}
							gap="8px"
							mb="16px"
						>
							<FormControl display="flex" alignItems="center">
								<FormLabel mb="0" fontWeight="normal" fontSize="sm" color={mutedTextColor}>
									Совпадает с владельцем текущего профиля?
								</FormLabel>
								<Switch
									colorScheme="blue"
									isChecked={sameAsOwner}
									onChange={(e) => setSameAsOwner(e.target.checked)}
								/>
							</FormControl>
						</Flex>

						<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="16px">
							<GridItem colSpan={{ base: 1, md: 2 }}>
								<FormControl isDisabled={sameAsOwner}>
									<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
										ФИО ответственного лица
									</FormLabel>
									<Input
										placeholder="Иванов Иван Иванович"
										value={form.contactFio}
										onChange={handleFieldChange('contactFio')}
										{...inputStyles}
									/>
								</FormControl>
							</GridItem>

							<FormControl isDisabled={sameAsOwner}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Должность
								</FormLabel>
								<Input
									placeholder="Руководитель"
									value={form.contactPosition}
									onChange={handleFieldChange('contactPosition')}
									{...inputStyles}
								/>
							</FormControl>

							<FormControl isDisabled={sameAsOwner}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Контактный телефон
								</FormLabel>
								<Input
									placeholder="+7 (___) ___-__-__"
									value={form.contactPhone}
									onChange={handleFieldChange('contactPhone')}
									{...inputStyles}
								/>
							</FormControl>

							<FormControl isDisabled={sameAsOwner}>
								<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
									Корпоративная почта
								</FormLabel>
								<Input
									placeholder="company@example.ru"
									value={form.contactEmail}
									onChange={handleFieldChange('contactEmail')}
									{...inputStyles}
								/>
							</FormControl>
						</Grid>
					</Box>
				</Flex>
			</Box>
		</Flex>
	);
}

export default CompanyRegistration;
