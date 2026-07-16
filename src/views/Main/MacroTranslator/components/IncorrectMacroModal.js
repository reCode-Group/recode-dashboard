import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
	Textarea,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { sendSupportRequest } from 'services/supportEmail';

const MAX_CODE_LENGTH = 1900;
const MAX_COMMENT_LENGTH = 700;

function truncateCode(value) {
	const normalizedValue = String(value || '').trim();
	if (normalizedValue.length <= MAX_CODE_LENGTH) return normalizedValue;
	return `${normalizedValue.slice(
		0,
		MAX_CODE_LENGTH
	)}\n[Код сокращён из-за ограничения длины обращения]`;
}

function buildEmailDescription({ conversionId, source, translated, targetLanguage, comment }) {
	const sections = [
		'Источник обращения: страница «Переводчик макросов» (/translator)',
		`ID перевода: ${conversionId || 'не определён'}`,
		'Исходный язык: VBA',
		`Целевой язык: ${targetLanguage}`,
		`Исходный макрос:\n${truncateCode(source)}`,
		`Переведённый макрос:\n${truncateCode(translated)}`,
	];

	if (comment.trim()) {
		sections.push(`Комментарий пользователя:\n${comment.trim()}`);
	}

	return sections.join('\n\n');
}

export default function IncorrectMacroModal({
	isOpen,
	onClose,
	conversionId,
	source,
	translated,
	targetLanguage,
}) {
	const [comment, setComment] = useState('');
	const [submitState, setSubmitState] = useState('idle');
	const [requestError, setRequestError] = useState('');

	const titleColor = useColorModeValue('gray.800', 'white');
	const textColor = useColorModeValue('gray.600', 'gray.200');
	const glassBg = useColorModeValue('rgba(255, 255, 255, 0.92)', 'rgba(26, 32, 44, 0.92)');
	const sectionBg = useColorModeValue('rgba(255, 255, 255, 0.72)', 'rgba(26, 32, 44, 0.72)');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const inputBg = useColorModeValue('white', 'gray.700');

	const isSending = submitState === 'sending';
	const isSuccess = submitState === 'success';

	useEffect(() => {
		if (!isOpen) {
			setComment('');
			setSubmitState('idle');
			setRequestError('');
		}
	}, [isOpen]);

	const handleSubmit = async () => {
		setSubmitState('sending');
		setRequestError('');

		try {
			await sendSupportRequest({
				subject: `Некорректный перевод макроса${
					conversionId ? ` #${conversionId}` : ''
				}: VBA → ${targetLanguage}`,
				description: buildEmailDescription({
					conversionId,
					source,
					translated,
					targetLanguage,
					comment,
				}),
			});
			setSubmitState('success');
		} catch (error) {
			setSubmitState('error');
			setRequestError(error.message || 'Не удалось отправить сообщение о некорректном макросе.');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={isSending ? () => {} : onClose} isCentered size="6xl">
			<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
			<ModalContent
				bg={glassBg}
				border="1px solid"
				borderColor="whiteAlpha.400"
				borderRadius="20px"
				boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
				overflow="hidden"
				maxH="90vh"
			>
				<ModalHeader
					px={{ base: '20px', md: '28px' }}
					py="20px"
					borderBottom="1px solid"
					borderColor={borderColor}
					bg={sectionBg}
				>
					<Text fontSize={{ base: '20px', md: '24px' }} fontWeight="600" color={titleColor}>
						Некорректный макрос?
					</Text>
					<Text mt="6px" pr="32px" fontSize="sm" fontWeight="normal" color={textColor}>
						Опишите неточность, и мы получим исходный и переведенный макросы вместе с вашим
						комментарием.
					</Text>
					{conversionId ? (
						<Text mt="4px" fontSize="xs" fontWeight="normal" color={textColor}>
							ID перевода: {conversionId}
						</Text>
					) : null}
				</ModalHeader>
				<ModalCloseButton top="20px" right="20px" isDisabled={isSending} />

				<ModalBody px={{ base: '20px', md: '28px' }} py="22px" bg={sectionBg} overflowY="auto">
					<Stack spacing="18px">
						{isSuccess ? (
							<Alert status="success" borderRadius="12px">
								<AlertIcon />
								<Box>
									<Text fontWeight="600">Сообщение отправлено</Text>
									<Text fontSize="sm">Спасибо, мы проверим результат перевода.</Text>
								</Box>
							</Alert>
						) : null}

						{submitState === 'error' ? (
							<Alert status="error" borderRadius="12px">
								<AlertIcon />
								<Text fontSize="sm">{requestError}</Text>
							</Alert>
						) : null}

						{!isSuccess ? (
							<>
								<Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="18px">
									<FormControl>
										<FormLabel fontSize="sm" color={titleColor}>
											Исходный макрос
										</FormLabel>
										<Textarea
											value={source}
											readOnly
											minH="220px"
											bg={inputBg}
											borderColor={borderColor}
											borderRadius="12px"
											fontFamily="mono"
											fontSize="sm"
											resize="none"
										/>
									</FormControl>

									<FormControl>
										<FormLabel fontSize="sm" color={titleColor}>
											Переведенный макрос
										</FormLabel>
										<Textarea
											value={translated}
											readOnly
											minH="220px"
											bg={inputBg}
											borderColor={borderColor}
											borderRadius="12px"
											fontFamily="mono"
											fontSize="sm"
											resize="none"
										/>
									</FormControl>
								</Grid>

								<FormControl>
									<FormLabel fontSize="sm" color={titleColor}>
										Комментарий
									</FormLabel>
									<Textarea
										value={comment}
										onChange={(event) => setComment(event.target.value)}
										placeholder="Опишите, что именно переведено некорректно"
										maxLength={MAX_COMMENT_LENGTH}
										minH="120px"
										isDisabled={isSending}
										bg={inputBg}
										borderColor={borderColor}
										borderRadius="12px"
										resize="none"
									/>
									<Text mt="4px" textAlign="right" fontSize="xs" color={textColor}>
										{comment.length}/{MAX_COMMENT_LENGTH}
									</Text>
								</FormControl>
							</>
						) : null}
					</Stack>
				</ModalBody>

				<ModalFooter
					px={{ base: '20px', md: '28px' }}
					py="18px"
					borderTop="1px solid"
					borderColor={borderColor}
					bg={sectionBg}
				>
					{isSuccess ? (
						<Button borderRadius="12px" onClick={onClose}>
							Закрыть
						</Button>
					) : (
						<Flex w="100%" justify="flex-end" gap="10px">
							<Button variant="ghost" borderRadius="12px" onClick={onClose} isDisabled={isSending}>
								Отмена
							</Button>
							<Button
								colorScheme="recode"
								borderRadius="12px"
								minW="140px"
								onClick={handleSubmit}
								isLoading={isSending}
								loadingText="Отправляем"
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
