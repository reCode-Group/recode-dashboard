import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Progress,
	Stack,
	Text,
	Textarea,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { sendSupportRequest } from 'services/supportEmail';

const MAX_SUBJECT_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENTS_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = '.pdf,.docx,.jpg,.png';
const ALLOWED_FILE_EXTENSIONS = new Set(ACCEPTED_FILE_TYPES.split(','));

function isAllowedAttachment(file) {
	const extension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
	return ALLOWED_FILE_EXTENSIONS.has(extension);
}

function formatFileSize(size) {
	if (size < 1024 * 1024) {
		return `${Math.max(1, Math.round(size / 1024))} КБ`;
	}

	return `${(size / (1024 * 1024)).toFixed(1)} МБ`;
}

export default function CreateSupportTicketModal({ isOpen, onClose, onEmailSent }) {
	const [subject, setSubject] = useState('');
	const [description, setDescription] = useState('');
	const [attachments, setAttachments] = useState([]);
	const [formError, setFormError] = useState('');
	const [attachmentError, setAttachmentError] = useState('');
	const [submitState, setSubmitState] = useState('idle');
	const [requestError, setRequestError] = useState('');

	const titleColor = useColorModeValue('gray.800', 'white');
	const subtitleColor = useColorModeValue('gray.500', 'gray.300');
	const glassBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.86)');
	const sectionBg = useColorModeValue('rgba(255, 255, 255, 0.65)', 'rgba(26, 32, 44, 0.6)');
	const modalBorderColor = useColorModeValue('whiteAlpha.400', 'whiteAlpha.200');
	const dividerColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
	const closeButtonBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
	const closeButtonHoverBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
	const inputBg = useColorModeValue('white', 'whiteAlpha.100');
	const inputBorderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const successAlertBg = useColorModeValue('green.50', 'green.900');
	const successAlertColor = useColorModeValue('green.700', 'green.100');

	const isSending = submitState === 'sending';
	const isSuccess = submitState === 'success';

	const resetState = () => {
		setSubject('');
		setDescription('');
		setAttachments([]);
		setFormError('');
		setAttachmentError('');
		setSubmitState('idle');
		setRequestError('');
	};

	useEffect(() => {
		if (!isOpen) {
			resetState();
		}
	}, [isOpen]);

	const handleSubmit = async () => {
		if (!subject.trim() || !description.trim()) {
			setFormError('Заполните тему и описание обращения.');
			return;
		}
		if (attachments.length > MAX_ATTACHMENTS) {
			setAttachmentError('Можно прикрепить не более 3 файлов.');
			return;
		}
		if (attachments.reduce((total, file) => total + file.size, 0) > MAX_ATTACHMENTS_SIZE) {
			setAttachmentError('Общий размер вложений не должен превышать 5 МБ.');
			return;
		}

		setFormError('');
		setAttachmentError('');
		setRequestError('');
		setSubmitState('sending');

		try {
			const result = await sendSupportRequest({
				subject,
				description,
				attachments,
			});
			setSubmitState('success');
			onEmailSent?.(result);
		} catch (error) {
			setSubmitState('error');
			setRequestError(error.message || 'Не удалось отправить обращение.');
		}
	};

	const handleAttachmentsChange = (event) => {
		const selectedAttachments = Array.from(event.target.files || []);
		const nextAttachments = [...attachments, ...selectedAttachments];
		event.target.value = '';

		if (selectedAttachments.some((file) => !isAllowedAttachment(file))) {
			setAttachmentError('Допустимые форматы: PDF, DOCX, JPG и PNG.');
			return;
		}
		if (nextAttachments.length > MAX_ATTACHMENTS) {
			setAttachmentError('Можно прикрепить не более 3 файлов.');
			return;
		}
		if (nextAttachments.reduce((total, file) => total + file.size, 0) > MAX_ATTACHMENTS_SIZE) {
			setAttachmentError('Общий размер вложений не должен превышать 5 МБ.');
			return;
		}

		setAttachmentError('');
		setAttachments(nextAttachments);
	};

	const removeAttachment = (index) => {
		setAttachments((currentAttachments) =>
			currentAttachments.filter((_, currentIndex) => currentIndex !== index)
		);
		setAttachmentError('');
	};

	return (
		<Modal isOpen={isOpen} onClose={isSending ? () => {} : onClose} isCentered size="4xl">
			<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
			<ModalContent
				bg={glassBg}
				border="1px solid"
				borderColor={modalBorderColor}
				borderRadius="20px"
				boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
				overflow="hidden"
				maxH="88vh"
			>
				<ModalHeader
					px="32px"
					py="24px"
					borderBottom="1px solid"
					borderColor={dividerColor}
					bg={sectionBg}
				>
					<Flex justify="space-between" align="flex-start" gap="16px">
						<Box>
							<Text fontSize="24px" fontWeight="600" color={titleColor} lineHeight="1.1">
								Новое обращение в техподдержку
							</Text>
							<Text mt="6px" fontSize="14px" color={subtitleColor}>
								Укажите тему и подробно опишите ваш вопрос.
							</Text>
						</Box>
						<IconButton
							aria-label="Закрыть"
							icon={<FiX />}
							borderRadius="full"
							onClick={onClose}
							isDisabled={isSending}
							bg={closeButtonBg}
							_hover={{ bg: closeButtonHoverBg }}
						/>
					</Flex>
				</ModalHeader>

				<ModalBody px="32px" py="24px" bg={sectionBg} overflowY="auto">
					<Stack spacing="18px">
						{isSending ? (
							<Box>
								<Text fontWeight="600" mb="10px" color={titleColor}>
									Отправляем обращение...
								</Text>
								<Progress size="sm" isIndeterminate borderRadius="999px" colorScheme="blue" />
							</Box>
						) : null}

						{isSuccess ? (
							<Alert
								status="success"
								borderRadius="12px"
								bg={successAlertBg}
								color={successAlertColor}
							>
								<AlertIcon />
								<Box>
									<Text fontWeight="600">Письмо отправлено</Text>
									<Text fontSize="sm">Сообщение доставлено в поддержку.</Text>
								</Box>
							</Alert>
						) : null}

						{submitState === 'error' ? (
							<Alert status="error" borderRadius="12px">
								<AlertIcon />
								<Text>{requestError}</Text>
							</Alert>
						) : null}

						{!isSuccess ? (
							<>
								<FormControl isInvalid={Boolean(formError) && !subject.trim()}>
									<FormLabel fontSize="14px" color={subtitleColor} mb="8px">
										Тема
									</FormLabel>
									<Input
										value={subject}
										onChange={(event) => setSubject(event.target.value)}
										placeholder="Например: Не работает загрузка файла"
										maxLength={MAX_SUBJECT_LENGTH}
										isDisabled={isSending}
										bg={inputBg}
										borderColor={inputBorderColor}
										borderRadius="12px"
										h="46px"
									/>
								</FormControl>

								<FormControl isInvalid={Boolean(formError) && !description.trim()}>
									<FormLabel fontSize="14px" color={subtitleColor} mb="8px">
										Описание
									</FormLabel>
									<Textarea
										value={description}
										onChange={(event) => setDescription(event.target.value)}
										placeholder="Опишите проблему максимально подробно"
										minH="160px"
										maxLength={MAX_DESCRIPTION_LENGTH}
										isDisabled={isSending}
										bg={inputBg}
										borderColor={inputBorderColor}
										borderRadius="12px"
										resize="none"
									/>
									{formError ? <FormErrorMessage>{formError}</FormErrorMessage> : null}
								</FormControl>

								<FormControl isInvalid={Boolean(attachmentError)}>
									<FormLabel fontSize="14px" color={subtitleColor} mb="8px">
										Вложения
									</FormLabel>
									<Input
										type="file"
										multiple
										accept={ACCEPTED_FILE_TYPES}
										onChange={handleAttachmentsChange}
										isDisabled={isSending || attachments.length >= MAX_ATTACHMENTS}
										h="46px"
										p="6px 8px"
										fontSize="sm"
										bg={inputBg}
										color={subtitleColor}
										borderColor={inputBorderColor}
										borderRadius="12px"
										sx={{
											'&::file-selector-button, &::-webkit-file-upload-button': {
												mr: '10px',
												px: '10px',
												py: '7px',
												border: 0,
												borderRadius: '8px',
												bg: 'recode.500',
												color: 'white',
												fontSize: '15px',
												lineHeight: '16px',
												cursor: 'pointer',
											},
											'&::file-selector-button:hover, &::-webkit-file-upload-button:hover': {
												bg: 'recode.400',
											},
										}}
									/>
									<Text mt="6px" fontSize="sm" color={subtitleColor}>
										PDF, DOCX, JPG или PNG: до 3 файлов, общий размер до 5 МБ.
									</Text>
									{attachments.map((attachment, index) => (
										<Flex
											key={`${attachment.name}-${attachment.lastModified}-${index}`}
											mt="8px"
											align="center"
											gap="8px"
										>
											<Text flex="1" fontSize="sm" noOfLines={1} color={subtitleColor}>
												{attachment.name} ({formatFileSize(attachment.size)})
											</Text>
											<IconButton
												aria-label={`Удалить ${attachment.name}`}
												icon={<FiX />}
												size="sm"
												variant="ghost"
												color={subtitleColor}
												_hover={{ bg: closeButtonHoverBg }}
												onClick={() => removeAttachment(index)}
												isDisabled={isSending}
											/>
										</Flex>
									))}
									{attachmentError ? <FormErrorMessage>{attachmentError}</FormErrorMessage> : null}
								</FormControl>
							</>
						) : null}
					</Stack>
				</ModalBody>

				<ModalFooter
					px="32px"
					py="20px"
					borderTop="1px solid"
					borderColor={dividerColor}
					bg={sectionBg}
				>
					{isSuccess ? (
						<Flex w="100%" justify="flex-end" gap="10px">
							<Button borderRadius="12px" onClick={onClose}>
								Закрыть
							</Button>
						</Flex>
					) : (
						<Flex w="100%" justify="flex-end">
							<Button
								bg="linear-gradient(135deg, #313860 0%, #151928 100%)"
								color="white"
								borderRadius="12px"
								minW="150px"
								onClick={handleSubmit}
								isLoading={isSending}
								_hover={{ filter: 'saturate(0.5)' }}
							>
								Отправить
							</Button>
						</Flex>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
