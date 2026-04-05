import {
	Alert,
	AlertIcon,
	Avatar,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Icon,
	Input,
	Link,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { Separator } from 'components/Separator/Separator';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg'];

const CompanyInformation = ({
	title,
	company,
	email,
	description,
	fullName,
	responsibleFullName,
	legalAddress,
	inn,
	ogrn,
	phone,
}) => {
	const mainColor = useColorModeValue('gray.700', 'white');
	const textColor = useColorModeValue('gray.500', 'white');
	const borderProfileColor = useColorModeValue('gray.100', 'rgba(255, 255, 255, 0.31)');
	const glassBg = useColorModeValue(
		'linear-gradient(113.34deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)',
		'linear-gradient(113.34deg, rgba(26, 32, 44, 0.82) 0%, rgba(26, 32, 44, 0.8) 110.84%)'
	);

	const {
		isOpen: isAvatarModalOpen,
		onOpen: onAvatarModalOpen,
		onClose: onAvatarModalClose,
	} = useDisclosure();
	const {
		isOpen: isContactsModalOpen,
		onOpen: onContactsModalOpen,
		onClose: onContactsModalClose,
	} = useDisclosure();

	const fileInputRef = useRef(null);
	const [avatarFile, setAvatarFile] = useState(null);
	const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');
	const [avatarError, setAvatarError] = useState('');
	const [editableResponsibleFullName, setEditableResponsibleFullName] = useState(
		responsibleFullName || ''
	);
	const [editableEmail, setEditableEmail] = useState(email || '');
	const [editablePhone, setEditablePhone] = useState(phone || '');
	const [editableLegalAddress, setEditableLegalAddress] = useState(legalAddress || '');

	useEffect(() => {
		if (!avatarFile) {
			setAvatarPreviewUrl('');
			return;
		}

		const url = URL.createObjectURL(avatarFile);
		setAvatarPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [avatarFile]);

	const avatarFallback = useMemo(() => company?.slice(0, 2) || 'РР', [company]);

	const handlePickAvatar = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
			setAvatarError('Допустимые форматы: PNG и JPG.');
			return;
		}

		if (file.size > MAX_AVATAR_SIZE) {
			setAvatarError('Размер файла не должен превышать 2 МБ.');
			return;
		}

		setAvatarError('');
		setAvatarFile(file);
	};

	const resetContactsToProps = () => {
		setEditableResponsibleFullName(responsibleFullName || '');
		setEditableEmail(email || '');
		setEditablePhone(phone || '');
		setEditableLegalAddress(legalAddress || '');
	};

	const handleCloseAvatarModal = () => {
		setAvatarError('');
		onAvatarModalClose();
	};

	const handleCloseContactsModal = () => {
		resetContactsToProps();
		onContactsModalClose();
	};

	const handleSaveContacts = () => {
		onContactsModalClose();
	};

	return (
		<>
			<Card
				p="16px"
				backdropFilter="saturate(200%) blur(10.5px)"
				boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
				border="2px solid"
				borderColor={borderProfileColor}
				bg={glassBg}
			>
				<CardBody px="5px" display="flex">
					<Flex direction="column" justifyContent="space-between" align="stretch" w="100%" h="100%">
						<Flex align="center" mb="22px">
							<Box position="relative" me="16px">
								<Avatar
									name={avatarFallback}
									src={avatarPreviewUrl}
									bg={avatarPreviewUrl ? 'transparent' : 'black'}
									color="white"
									borderRadius="12px"
									w="80px"
									h="80px"
								/>
								<Box
									position="absolute"
									right="-6px"
									bottom="-6px"
									w="24px"
									h="24px"
									borderRadius="8px"
									bg="white"
									boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.06)"
									display="flex"
									alignItems="center"
									justifyContent="center"
									cursor="pointer"
									onClick={onAvatarModalOpen}
								>
									<Icon as={FaPen} boxSize="10px" color="gray.600" />
								</Box>
							</Box>
							<Flex direction="column">
								<Text fontSize="xl" color={mainColor} fontWeight="bold">
									{company}
								</Text>
								<Text fontSize="sm" color="gray.500" fontWeight="400">
									{editableEmail}
								</Text>
							</Flex>
						</Flex>

						<CardHeader p="0" mb="10px">
							<Text fontSize="lg" color={mainColor} fontWeight="bold">
								{title}
							</Text>
						</CardHeader>

						<Text fontSize="sm" color="gray.400" fontWeight="400" mb="22px">
							{description}
						</Text>

						<Separator mb="10px" />

						<Flex direction="column" gap="14px" mb="16px">
							<Text fontSize="sm" color={textColor} fontWeight="medium">
								ПОЛНОЕ НАИМЕНОВАНИЕ:{' '}
								<Text as="span" fontSize="sm" color="gray.400" fontWeight="400">
									{fullName}
								</Text>
							</Text>
							<Text fontSize="sm" color={textColor} fontWeight="medium">
								ЮРИДИЧЕСКИЙ АДРЕС:{' '}
								<Text as="span" fontSize="sm" color="gray.400" fontWeight="400">
									{editableLegalAddress}
								</Text>
							</Text>
							<Text fontSize="sm" color={textColor} fontWeight="medium">
								ИНН:{' '}
								<Text as="span" fontSize="sm" color="gray.400" fontWeight="400">
									{inn}
								</Text>
							</Text>
							<Text fontSize="sm" color={textColor} fontWeight="medium">
								ОГРН:{' '}
								<Text as="span" fontSize="sm" color="gray.400" fontWeight="400">
									{ogrn}
								</Text>
							</Text>

							<Separator mb="10px" />

							<Text fontSize="sm" color={textColor} fontWeight="medium">
								ФИО ОТВЕТСТВЕННОГО ЛИЦА:{' '}
								<Text as="span" fontSize="sm" color="gray.400" fontWeight="400">
									{editableResponsibleFullName}
								</Text>
							</Text>
							<Text fontSize="sm" color={textColor} fontWeight="medium">
								ТЕЛЕФОН:{' '}
								<Text as="span" fontSize="sm" color="gray.400" fontWeight="400">
									{editablePhone}
								</Text>
							</Text>
						</Flex>

						<Box mt="auto">
							<Separator mb="10px" />
							<Button
								variant="ghost"
								p="0"
								h="auto"
								minW="auto"
								alignSelf="flex-start"
								justifyContent="flex-start"
								fontSize="xs"
								color="recode.300"
								fontWeight="bold"
								_hover={{ bg: 'transparent', textDecoration: 'underline' }}
								_active={{ bg: 'transparent' }}
								_focus={{ boxShadow: 'none' }}
								onClick={onContactsModalOpen}
							>
								РЕДАКТИРОВАТЬ
							</Button>
						</Box>
					</Flex>
				</CardBody>
			</Card>

			<Modal isOpen={isAvatarModalOpen} onClose={handleCloseAvatarModal} isCentered size="lg">
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent
					bg={useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.86)')}
					border="1px solid"
					borderColor="whiteAlpha.400"
					borderRadius="20px"
					boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
					overflow="hidden"
				>
					<ModalHeader px="24px" py="20px" borderBottom="1px solid" borderColor="blackAlpha.200">
						<Flex justify="space-between" align="center">
							<Text fontSize="24px" fontWeight="600">
								Загрузка новой аватарки
							</Text>
							<Button
								variant="ghost"
								p="0"
								minW="32px"
								h="32px"
								onClick={handleCloseAvatarModal}
								leftIcon={<FiX />}
							>
								&nbsp;
							</Button>
						</Flex>
					</ModalHeader>
					<ModalBody px="24px" py="20px">
						<Flex direction="column" gap="14px">
							<Text fontSize="14px" color="gray.500">
								Допустимые форматы: PNG и JPG. Размер файла не более 2 МБ.
							</Text>
							<Button
								leftIcon={<FiUploadCloud />}
								borderRadius="10px"
								colorScheme="blue"
								variant="outline"
								onClick={() => fileInputRef.current?.click()}
							>
								Выбрать файл
							</Button>
							<Input
								ref={fileInputRef}
								type="file"
								accept=".png,.jpg,.jpeg,image/png,image/jpeg"
								display="none"
								onChange={(event) => {
									handlePickAvatar(event);
									event.target.value = '';
								}}
							/>
							{avatarPreviewUrl ? (
								<Box
									border="1px solid"
									borderColor="blackAlpha.200"
									borderRadius="12px"
									p="12px"
									display="flex"
									alignItems="center"
									gap="12px"
								>
									<Avatar
										src={avatarPreviewUrl}
										name={avatarFallback}
										w="56px"
										h="56px"
										borderRadius="12px"
									/>
									<Box>
										<Text fontSize="12px" color="gray.500" fontWeight="600">
											Предпросмотр
										</Text>
										<Text fontSize="12px" color="gray.500">
											Новая аватарка будет сохранена после подтверждения.
										</Text>
									</Box>
								</Box>
							) : null}
							{avatarFile ? (
								<Text fontSize="12px" color="gray.500">
									Выбран файл: {avatarFile.name}
								</Text>
							) : null}
							{avatarError ? (
								<Text fontSize="12px" color="red.500">
									{avatarError}
								</Text>
							) : null}
						</Flex>
					</ModalBody>
					<ModalFooter px="24px" py="16px" borderTop="1px solid" borderColor="blackAlpha.200">
						<Button colorScheme="blue" borderRadius="12px" onClick={handleCloseAvatarModal}>
							Готово
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Modal isOpen={isContactsModalOpen} onClose={handleCloseContactsModal} isCentered size="xl">
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent
					bg={useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.86)')}
					border="1px solid"
					borderColor="whiteAlpha.400"
					borderRadius="20px"
					boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
					overflow="hidden"
				>
					<ModalHeader px="24px" py="20px" borderBottom="1px solid" borderColor="blackAlpha.200">
						<Text fontSize="24px" fontWeight="600">
							Редактирование контактных данных
						</Text>
					</ModalHeader>
					<ModalBody px="24px" py="20px">
						<Flex direction="column" gap="14px">
							<Alert status="info" borderRadius="12px">
								<AlertIcon />
								<Text fontSize="sm">
									ИНН, ОГРН и название компании можно изменить только обратившись в{' '}
									<Link as={RouterLink} to="/admin/support" color="recode.300" fontWeight="600">
										техподдержку
									</Link>
									.
								</Text>
							</Alert>

							<FormControl>
								<FormLabel fontSize="14px">ФИО ответственного лица</FormLabel>
								<Input
									value={editableResponsibleFullName}
									onChange={(event) => setEditableResponsibleFullName(event.target.value)}
									placeholder="Иванов Иван Иванович"
									bg="white"
									borderRadius="12px"
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontSize="14px">Корпоративная почта</FormLabel>
								<Input
									type="email"
									value={editableEmail}
									onChange={(event) => setEditableEmail(event.target.value)}
									placeholder="company@example.ru"
									bg="white"
									borderRadius="12px"
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontSize="14px">Контактный телефон</FormLabel>
								<Input
									value={editablePhone}
									onChange={(event) => setEditablePhone(event.target.value)}
									placeholder="+7 (___) ___-__-__"
									bg="white"
									borderRadius="12px"
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontSize="14px">Юридический адрес</FormLabel>
								<Input
									value={editableLegalAddress}
									onChange={(event) => setEditableLegalAddress(event.target.value)}
									placeholder="г. Москва, ул. Примерная, д. 1"
									bg="white"
									borderRadius="12px"
								/>
							</FormControl>
						</Flex>
					</ModalBody>
					<ModalFooter px="24px" py="16px" borderTop="1px solid" borderColor="blackAlpha.200">
						<Flex w="100%" justify="space-between" gap="10px">
							<Button variant="ghost" borderRadius="12px" onClick={handleCloseContactsModal}>
								Отмена
							</Button>
							<Button colorScheme="recode" borderRadius="12px" onClick={handleSaveContacts}>
								Сохранить
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CompanyInformation;
