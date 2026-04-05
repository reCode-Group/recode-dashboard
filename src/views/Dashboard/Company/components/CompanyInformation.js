import {
	Avatar,
	Box,
	Button,
	Flex,
	Icon,
	Input,
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

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg'];

const CompanyInformation = ({ title, company, email, description, fullName, inn, ogrn, phone }) => {
	const mainColor = useColorModeValue('gray.700', 'white');
	const textColor = useColorModeValue('gray.500', 'white');
	const borderProfileColor = useColorModeValue('gray.100', 'rgba(255, 255, 255, 0.31)');
	const glassBg = useColorModeValue(
		'linear-gradient(113.34deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)',
		'linear-gradient(113.34deg, rgba(26, 32, 44, 0.82) 0%, rgba(26, 32, 44, 0.8) 110.84%)'
	);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const fileInputRef = useRef(null);
	const [avatarFile, setAvatarFile] = useState(null);
	const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');
	const [avatarError, setAvatarError] = useState('');

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

	const handleCloseModal = () => {
		setAvatarError('');
		onClose();
	};

	return (
		<>
			<Card
				p="16px"
				minH={{ xl: '481px' }}
				backdropFilter="saturate(200%) blur(10.5px)"
				boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
				border="2px solid"
				borderColor={borderProfileColor}
				bg={glassBg}
			>
				<CardBody px="5px" display="flex">
					<Flex direction="column" align="stretch" w="100%" minH={{ xl: '100%' }}>
						<Flex align="center" mb="22px">
							<Box position="relative" me="16px">
								<Avatar
									name={avatarFallback}
									src={avatarPreviewUrl}
									bg="transparent"
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
									onClick={onOpen}
								>
									<Icon as={FaPen} boxSize="10px" color="gray.600" />
								</Box>
							</Box>
							<Flex direction="column">
								<Text fontSize="xl" color={mainColor} fontWeight="bold">
									{company}
								</Text>
								<Text fontSize="sm" color="gray.500" fontWeight="400">
									{email}
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

						<Separator mb="14px" />

						<Flex direction="column" gap="14px" mb="16px">
							<Text fontSize="sm" color={textColor} fontWeight="medium">
								Полное название:{' '}
								<Text as="span" fontSize="sm" color="gray.400" fontWeight="400">
									{fullName}
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
							<Text fontSize="sm" color={textColor} fontWeight="medium">
								Телефон:{' '}
								<Text as="span" fontSize="sm" color="gray.400" fontWeight="400">
									{phone}
								</Text>
							</Text>
						</Flex>

						<Box mt="auto">
							<Separator mb="14px" />
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
							>
								РЕДАКТИРОВАТЬ
							</Button>
						</Box>
					</Flex>
				</CardBody>
			</Card>

			<Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size="lg">
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
								onClick={handleCloseModal}
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
						<Button colorScheme="blue" borderRadius="12px" onClick={handleCloseModal}>
							Готово
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CompanyInformation;
