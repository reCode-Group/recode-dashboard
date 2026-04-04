import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Grid,
	Heading,
	Input,
	SimpleGrid,
	Stack,
	Text,
	Textarea,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FiClock, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const COMPANY_CONTACTS = {
	name: 'ООО «Рекод Решения»',
	phone: '+7 (800) 555-35-35',
	email: 'hello@recode-group.ru',
	address: 'г. Екатеринбург, ул. Примерная, д. 10, офис 301',
	workHours: 'Пн-Пт: 09:00 - 18:00 (МСК)',
};

const SUPPORT_CONTACTS = {
	phone: '+7 (800) 777-10-10',
	email: 'support@recode-group.ru',
	workHours: 'Ежедневно: 08:00 - 22:00 (МСК)',
	sla: 'Среднее время ответа в рабочие часы - до 15 минут.',
};

function ContactInfoItem({ icon: Icon, label, value, valueColor }) {
	const mutedColor = useColorModeValue('gray.500', 'gray.300');
	const textColor = useColorModeValue('gray.700', 'white');

	return (
		<SimpleGrid columns="26px 1fr" spacing="10px" alignItems="start">
			<Box color={mutedColor} pt="2px">
				<Icon />
			</Box>
			<Box>
				<Text fontSize="xs" textTransform="uppercase" letterSpacing="0.4px" color={mutedColor}>
					{label}
				</Text>
				<Text mt="2px" color={valueColor || textColor} fontSize="sm" fontWeight="500">
					{value}
				</Text>
			</Box>
		</SimpleGrid>
	);
}

export default function ContactsPage() {
	const location = useLocation();
	const [formState, setFormState] = useState({
		name: '',
		email: '',
		phone: '',
		message: '',
	});
	const supportRef = useRef(null);

	const pageBg = useColorModeValue('gray.50', 'gray.900');
	const cardBg = useColorModeValue('white', 'gray.800');
	const cardBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
	const titleColor = useColorModeValue('gray.700', 'white');
	const mutedColor = useColorModeValue('gray.500', 'gray.300');

	useEffect(() => {
		if (location.hash !== '#support') return;
		if (!supportRef.current) return;

		requestAnimationFrame(() => {
			supportRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	}, [location.hash]);

	const handleFieldChange = (field) => (event) => {
		setFormState((prev) => ({
			...prev,
			[field]: event.target.value,
		}));
	};

	return (
		<Box py={{ base: '120px', md: '150px' }}>
			<Box
				position="relative"
				overflow="hidden"
				borderRadius="20px"
				bg={cardBg}
				borderWidth="1px"
				borderColor={cardBorder}
				px={{ base: '18px', md: '34px' }}
				py={{ base: '24px', md: '36px' }}
				mb="26px"
			>
				<Box
					position="absolute"
					top="-40px"
					right="-80px"
					w="220px"
					h="220px"
					borderRadius="full"
					bg="rgba(85, 98, 245, 0.13)"
					filter="blur(0.4px)"
				/>
				<Text color="recode.500" fontWeight="700" fontSize="xs" letterSpacing="0.8px">
					КОНТАКТЫ
				</Text>
				<Heading
					color={titleColor}
					mt="10px"
					fontSize={{ base: '30px', md: '40px' }}
					lineHeight="1.15"
				>
					Свяжитесь с нами
				</Heading>
				<Text mt="10px" color={mutedColor} maxW="760px" fontSize={{ base: 'sm', md: 'md' }}>
					Оставьте заявку через форму, напишите на корпоративную почту или обратитесь в
					техподдержку. Мы поможем с вопросами по платформе и сопровождению макросов.
				</Text>
			</Box>

			<Grid templateColumns={{ base: '1fr', lg: '1.2fr 1fr' }} gap="20px">
				<Stack spacing="20px">
					<Box
						bg={cardBg}
						borderWidth="1px"
						borderColor={cardBorder}
						borderRadius="18px"
						p={{ base: '16px', md: '24px' }}
					>
						<Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} color={titleColor} mb="16px">
							Контактные данные компании
						</Heading>
						<Stack spacing="14px">
							<Text color={titleColor} fontWeight="700" fontSize="md">
								{COMPANY_CONTACTS.name}
							</Text>
							<ContactInfoItem icon={FiPhone} label="Телефон" value={COMPANY_CONTACTS.phone} />
							<ContactInfoItem
								icon={FiMail}
								label="Email"
								value={COMPANY_CONTACTS.email}
								valueColor="recode.500"
							/>
							<ContactInfoItem icon={FiMapPin} label="Адрес" value={COMPANY_CONTACTS.address} />
							<ContactInfoItem icon={FiClock} label="График" value={COMPANY_CONTACTS.workHours} />
						</Stack>
					</Box>

					<Box
						ref={supportRef}
						id="support"
						bg={cardBg}
						borderWidth="1px"
						borderColor={cardBorder}
						borderRadius="18px"
						p={{ base: '16px', md: '24px' }}
					>
						<Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} color={titleColor} mb="16px">
							Техническая поддержка
						</Heading>
						<Stack spacing="14px">
							<ContactInfoItem
								icon={FiPhone}
								label="Горячая линия"
								value={SUPPORT_CONTACTS.phone}
							/>
							<ContactInfoItem
								icon={FiMail}
								label="Email поддержки"
								value={SUPPORT_CONTACTS.email}
								valueColor="recode.500"
							/>
							<ContactInfoItem
								icon={FiClock}
								label="Часы работы"
								value={SUPPORT_CONTACTS.workHours}
							/>
							<Text fontSize="sm" color={mutedColor}>
								{SUPPORT_CONTACTS.sla}
							</Text>
						</Stack>
					</Box>
				</Stack>

				<Box
					bg={cardBg}
					borderWidth="1px"
					borderColor={cardBorder}
					borderRadius="18px"
					p={{ base: '16px', md: '24px' }}
					alignSelf="start"
					position={{ base: 'static', lg: 'sticky' }}
					top={{ lg: '115px' }}
				>
					<Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} color={titleColor} mb="8px">
						Форма обратной связи
					</Heading>
					<Text fontSize="sm" color={mutedColor} mb="16px">
						Демонстрационный режим: форма пока без отправки на сервер.
					</Text>

					<Stack spacing="12px">
						<FormControl>
							<FormLabel fontSize="sm" color={titleColor} mb="6px">
								Имя
							</FormLabel>
							<Input value={formState.name} onChange={handleFieldChange('name')} bg={pageBg} />
						</FormControl>
						<FormControl>
							<FormLabel fontSize="sm" color={titleColor} mb="6px">
								Email
							</FormLabel>
							<Input
								type="email"
								value={formState.email}
								onChange={handleFieldChange('email')}
								bg={pageBg}
							/>
						</FormControl>
						<FormControl>
							<FormLabel fontSize="sm" color={titleColor} mb="6px">
								Телефон
							</FormLabel>
							<Input value={formState.phone} onChange={handleFieldChange('phone')} bg={pageBg} />
						</FormControl>
						<FormControl>
							<FormLabel fontSize="sm" color={titleColor} mb="6px">
								Сообщение
							</FormLabel>
							<Textarea
								value={formState.message}
								onChange={handleFieldChange('message')}
								minH="132px"
								resize="vertical"
								bg={pageBg}
							/>
						</FormControl>
						<Button bg="recode.500" color="white" _hover={{ bg: 'recode.400' }}>
							Отправить
						</Button>
					</Stack>
				</Box>
			</Grid>
		</Box>
	);
}
