// Chakra imports
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
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { FiUploadCloud, FiX } from 'react-icons/fi';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg'];

function getInitials(name) {
	if (!name) {
		return 'ПР';
	}

	const parts = name
		.trim()
		.split(/\s+/)
		.filter(Boolean);

	if (parts.length === 0) {
		return 'ПР';
	}

	if (parts.length === 1) {
		return parts[0].slice(0, 2).toUpperCase();
	}

	return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

function AvatarFallback({ initials, size, radius, fontSize }) {
	return (
		<Flex
			align='center'
			justify='center'
			bg='gray.800'
			color='white'
			w={size}
			h={size}
			borderRadius={radius}
			fontWeight='800'
			fontSize={fontSize}
			letterSpacing='0.04em'
			userSelect='none'
		>
			{initials}
		</Flex>
	);
}

const Header = ({
	backgroundHeader,
	backgroundProfile,
	avatarImage,
	name,
	email,
	tabs,
	activeTab,
	onTabChange,
}) => {
	// Chakra color mode
	const textColor = useColorModeValue('gray.700', 'white');
	const borderProfileColor = useColorModeValue('white', 'rgba(255, 255, 255, 0.31)');
	const emailColor = useColorModeValue('gray.400', 'gray.300');
	const modalBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.86)');

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

	const avatarFallback = useMemo(() => getInitials(name), [name]);
	const avatarSrc = avatarPreviewUrl || avatarImage;

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
			<Box
				mb={{ sm: '205px', md: '75px', xl: '70px' }}
				borderRadius="15px"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				align="center"
			>
				<Box
					bgImage={backgroundHeader}
					w="100%"
					h="300px"
					borderRadius="25px"
					bgPosition="50%"
					bgRepeat="no-repeat"
					position="relative"
					display="flex"
					justifyContent="center"
				>
					<Flex
						direction={{ sm: 'column', md: 'row' }}
						mx="1.5rem"
						maxH="330px"
						w={{ sm: '90%', xl: '95%' }}
						justifyContent={{ sm: 'center', md: 'flex-start' }}
						align="center"
						backdropFilter="saturate(200%) blur(50px)"
						position="absolute"
						boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
						border="2px solid"
						borderColor={borderProfileColor}
						bg={backgroundProfile}
						p="24px"
						borderRadius="20px"
						transform={{
							sm: 'translateY(45%)',
							md: 'translateY(110%)',
							lg: 'translateY(160%)',
						}}
					>
						<Flex
							align="center"
							mb={{ sm: '10px', md: '0px' }}
							direction={{ sm: 'column', md: 'row' }}
							w={{ xxl: '100%' }}
							textAlign={{ sm: 'center', md: 'start' }}
						>
							<Box position="relative" me={{ md: '22px' }}>
								{avatarSrc ? (
									<Avatar
										src={avatarSrc}
										w="80px"
										h="80px"
										borderRadius="15px"
										overflow="hidden"
										imgProps={{ objectFit: 'cover' }}
									/>
								) : (
									<AvatarFallback initials={avatarFallback} size="80px" radius="15px" fontSize="2xl" />
								)}
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
							<Flex direction="column" maxWidth="100%" my={{ sm: '14px' }}>
								<Text
									fontSize={{ sm: 'lg', lg: 'xl' }}
									color={textColor}
									fontWeight="bold"
									ms={{ sm: '8px', md: '0px' }}
								>
									{name}
								</Text>
								<Text fontSize={{ sm: 'sm', md: 'md' }} color={emailColor} fontWeight="semibold">
									{email}
								</Text>
							</Flex>
						</Flex>
						<Flex
							direction={{ sm: 'column', lg: 'row' }}
							gap={{ sm: '8px', md: '10px', lg: '12px' }}
							w={{ sm: '100%', md: '50%', lg: 'auto' }}
							ml={{ sm: '20px', md: '30px', lg: '40px' }}
						>
							{tabs.map((tab) => {
								const isActive = activeTab === tab.id;
								return (
									<Button
										key={tab.id}
										p="0px"
										bg="transparent"
										onClick={() => onTabChange(tab.id)}
										_hover={{ bg: 'none' }}
									>
										<Flex
											align="center"
											w={{ sm: '100%', lg: '135px' }}
											bg={isActive ? 'hsla(0,0%,100%,.3)' : 'transparent'}
											borderRadius="15px"
											justifyContent="center"
											py={isActive ? '12px' : '10px'}
											boxShadow={
												isActive
													? 'inset 0 0 1px 1px hsl(0deg 0% 100% / 90%), 0 20px 27px 0 rgb(0 0 0 / 5%)'
													: 'none'
											}
											border={isActive ? '1px solid' : 'none'}
											borderColor={isActive ? 'gray.200' : 'transparent'}
											cursor="pointer"
										>
											{tab.icon}
											<Text fontSize="xs" color={textColor} fontWeight="bold" ms="6px">
												{tab.name}
											</Text>
										</Flex>
									</Button>
								);
							})}
						</Flex>
					</Flex>
				</Box>
			</Box>

			<Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size='lg'>
				<ModalOverlay bg='blackAlpha.600' backdropFilter='blur(4px)' />
				<ModalContent
					bg={modalBg}
					border='1px solid'
					borderColor='whiteAlpha.400'
					borderRadius='20px'
					boxShadow='0 25px 50px -12px rgba(0, 0, 0, 0.25)'
					overflow='hidden'
				>
					<ModalHeader px='24px' py='20px' borderBottom='1px solid' borderColor='blackAlpha.200'>
						<Flex justify='space-between' align='center'>
							<Text fontSize='24px' fontWeight='600'>
								Загрузка новой аватарки
							</Text>
							<Button
								variant='ghost'
								p='0'
								minW='32px'
								h='32px'
								onClick={handleCloseModal}
								leftIcon={<FiX />}
							>
								&nbsp;
							</Button>
						</Flex>
					</ModalHeader>
					<ModalBody px='24px' py='20px'>
						<Flex direction='column' gap='14px'>
							<Text fontSize='14px' color='gray.500'>
								Допустимые форматы: PNG и JPG. Размер файла не более 2 МБ.
							</Text>
							<Button
								leftIcon={<FiUploadCloud />}
								borderRadius='10px'
								colorScheme='blue'
								variant='outline'
								onClick={() => fileInputRef.current?.click()}
							>
								Выбрать файл
							</Button>
							<Input
								ref={fileInputRef}
								type='file'
								accept='.png,.jpg,.jpeg,image/png,image/jpeg'
								display='none'
								onChange={(event) => {
									handlePickAvatar(event);
									event.target.value = '';
								}}
							/>
							{avatarPreviewUrl ? (
								<Box
									border='1px solid'
									borderColor='blackAlpha.200'
									borderRadius='12px'
									p='12px'
									display='flex'
									alignItems='center'
									gap='12px'
								>
									{avatarPreviewUrl ? (
										<Avatar src={avatarPreviewUrl} w='56px' h='56px' borderRadius='12px' />
									) : (
										<AvatarFallback initials={avatarFallback} size='56px' radius='12px' fontSize='lg' />
									)}
									<Box>
										<Text fontSize='12px' color='gray.500' fontWeight='600'>
											Предпросмотр
										</Text>
										<Text fontSize='12px' color='gray.500'>
											Новая аватарка будет сохранена после подтверждения.
										</Text>
									</Box>
								</Box>
							) : null}
							{avatarFile ? (
								<Text fontSize='12px' color='gray.500'>
									Выбран файл: {avatarFile.name}
								</Text>
							) : null}
							{avatarError ? (
								<Text fontSize='12px' color='red.500'>
									{avatarError}
								</Text>
							) : null}
						</Flex>
					</ModalBody>
					<ModalFooter px='24px' py='16px' borderTop='1px solid' borderColor='blackAlpha.200'>
						<Button colorScheme='blue' borderRadius='12px' onClick={handleCloseModal}>
							Готово
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Header;
