import {
	Box,
	Button,
	Flex,
	Grid,
	HStack,
	Icon,
	Image,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useColorModeValue,
} from '@chakra-ui/react';
import BannerConstructor from 'assets/img/banner_constructor.png';
import ConversionHistory from 'components/Tables/ConversionHistory';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FiAlertCircle, FiCheck, FiCopy } from 'react-icons/fi';
import { IoArrowForwardSharp } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

const CONVERSION_HISTORY_DATA = [
	{
		id: 43324,
		type: '29.10.2026',
		status: 'Ожидает доработки',
		result_url: 'https://recode-group.ru',
		tokens_remain: '14 000',
		date: '29.10.2026',
	},
	{
		id: 32524,
		type: '26.10.2026',
		status: 'Не удалось (подробнее)',
		result_url: 'https://recode-group.ru',
		tokens_remain: '3 000',
		date: '26.10.2026',
	},
	{
		id: 23524,
		type: '23.10.2026',
		status: 'Завершен',
		result_url: 'https://recode-group.ru',
		tokens_remain: '2 000',
		date: '23.10.2026',
	},
	{
		id: 13324,
		type: '21.10.2026',
		status: 'Завершен',
		result_url: 'https://recode-group.ru',
		tokens_remain: '22 000',
		date: '21.10.2026',
	},
	{
		id: 12354,
		type: '20.10.2026',
		status: 'Завершен',
		result_url: 'https://recode-group.ru',
		tokens_remain: '10 400',
		date: '20.10.2026',
	},
];

function translateMacro(source) {
	if (!source.trim()) return '';

	return source
		.replace(/\bFOR EACH\b/gi, 'for (const')
		.replace(/\bEND FOR\b/gi, '}')
		.replace(/\bIF\b/gi, 'if')
		.replace(/\bELSE\b/gi, 'else')
		.replace(/\bEND IF\b/gi, '}')
		.replace(/\bSET\b/gi, 'let')
		.replace(/\bPRINT\b/gi, 'console.log')
		.replace(/\bSEND\b/gi, 'return');
}

export default function MacroTranslatorPage() {
	const history = useHistory();
	const [source, setSource] = useState('');
	const [translated, setTranslated] = useState('');
	const [copied, setCopied] = useState(false);
	const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
	const copyResetTimeoutRef = useRef(null);

	const textColor = useColorModeValue('gray.700', 'white');
	const mutedColor = useColorModeValue('gray.400', 'gray.300');
	const tableBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
	const inputBg = useColorModeValue('white', 'gray.700');
	const modalTitleColor = useColorModeValue('gray.800', 'white');
	const modalTextColor = useColorModeValue('gray.600', 'gray.200');
	const modalGlassBg = useColorModeValue('rgba(255, 255, 255, 0.92)', 'rgba(26, 32, 44, 0.92)');
	const modalSectionBg = useColorModeValue('rgba(255, 255, 255, 0.72)', 'rgba(26, 32, 44, 0.72)');

	const charCounter = useMemo(() => `${source.length} / 600`, [source.length]);

	const handleTranslate = () => {
		setTranslated(translateMacro(source));
		setCopied(false);
	};

	useEffect(() => {
		return () => {
			if (copyResetTimeoutRef.current) {
				clearTimeout(copyResetTimeoutRef.current);
			}
		};
	}, []);

	const handleCopyResult = async () => {
		if (!translated) return;
		try {
			await navigator.clipboard.writeText(translated);
			setCopied(true);
			if (copyResetTimeoutRef.current) {
				clearTimeout(copyResetTimeoutRef.current);
			}
			copyResetTimeoutRef.current = setTimeout(() => {
				setCopied(false);
			}, 3000);
		} catch (error) {
			// Clipboard API may be unavailable in restricted browser contexts.
		}
	};

	return (
		<>
			<Flex direction="column" py={{ base: '120px', md: '150px' }} gap="48px">
				<Box>
					<Text
						fontSize={{ base: '28px', md: '32px' }}
						lineHeight="1.3"
						fontWeight="700"
						color={textColor}
					>
						Переводчик макросов
					</Text>
					<Text mt="6px" fontSize="sm" fontWeight="medium" color={mutedColor}>
						Перевод VBA макросов в другие форматы в один клик
					</Text>
				</Box>

				<Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="20px">
					<Box>
						<Text fontSize="sm" color={textColor} mb="8px">
							Исходный макрос
						</Text>
						<Box position="relative">
							<Textarea
								value={source}
								onChange={(event) => setSource(event.target.value.slice(0, 600))}
								placeholder="Введите или вставьте ваш код здесь..."
								minH={{ base: '250px', md: '320px' }}
								bg={inputBg}
								borderColor={tableBorder}
								borderRadius="15px"
								resize="none"
								fontSize="sm"
								pb="34px"
								position="relative"
								zIndex={1}
							/>
							<Text
								position="absolute"
								right="12px"
								bottom="10px"
								fontSize="xs"
								color={mutedColor}
								zIndex={2}
								pointerEvents="none"
							>
								{charCounter}
							</Text>
						</Box>

						<Flex
							borderWidth="1px"
							borderColor={tableBorder}
							borderRadius="15px"
							bg={inputBg}
							mt="8px"
							px="16px"
							py="12px"
							justify="space-between"
							align={{ base: 'flex-start', sm: 'center' }}
							direction={{ base: 'column', sm: 'row' }}
							gap="12px"
						>
							<Box>
								<Text fontSize="xs" fontWeight="500" color={mutedColor}>
									ОСТАЛОСЬ ТОКЕНОВ:{' '}
									<Text as="span" color={textColor}>
										4
									</Text>
								</Text>
								<Text fontSize="xs" fontWeight="500" color={mutedColor}>
									ТАРИФ:{' '}
									<Link color={textColor} textDecor="underline">
										Пробный
									</Link>
								</Text>
							</Box>
							<Button
								size="sm"
								px="1rem"
								bg="gray.200"
								color={textColor}
								fontSize="xs"
								fontWeight="semibold"
								borderRadius="8px"
								rightIcon={<IoArrowForwardSharp />}
								onClick={() => history.push('/admin/tariff')}
								_hover={{ bg: 'gray.300' }}
							>
								ТАРИФЫ
							</Button>
						</Flex>
					</Box>

					<Box>
						<Text fontSize="sm" color={textColor} mb="8px">
							Переведенный макрос
						</Text>
						<Box position="relative">
							<Button
								size="xs"
								px="10px"
								onClick={handleCopyResult}
								bg="gray.200"
								color="gray.400"
								borderRadius="8px"
								leftIcon={copied ? <FiCheck /> : <FiCopy />}
								fontSize="xs"
								fontWeight="700"
								position="absolute"
								top="10px"
								right="10px"
								zIndex={2}
								_hover={{ bg: 'gray.300' }}
							>
								{copied ? 'Скопировано.' : 'Копировать'}
							</Button>
							<Textarea
								value={translated}
								placeholder="..."
								minH={{ base: '250px', md: '320px' }}
								bg={inputBg}
								borderColor={tableBorder}
								borderRadius="15px"
								resize="none"
								fontSize="sm"
								pt="8px"
								position="relative"
								zIndex={1}
							/>
						</Box>
						<HStack spacing="12px" mt="8px" align="flex-start">
							<Icon as={FiAlertCircle} color={mutedColor} stroke={1} boxSize="48px" mt="2px" />
							<Text fontSize="12px" color={mutedColor}>
								Внимание! Переведенный макрос может содержать неточности и ошибки. Рекомендуем
								проверять результат перевода вручную перед его использованием в своих проектах.{' '}
								<Link
									textDecor="underline"
									color={mutedColor}
									onClick={(event) => {
										event.preventDefault();
										setIsDisclaimerOpen(true);
									}}
								>
									Подробнее
								</Link>
							</Text>
						</HStack>
					</Box>
				</Grid>

				<Flex justify="center" mb="22px">
					<Button
						onClick={handleTranslate}
						bg="recode.300"
						color="white"
						borderRadius="15px"
						h="50px"
						minW={{ base: '220px', md: '300px' }}
						fontSize="xs"
						letterSpacing="0.2px"
						_hover={{ bg: 'recode.400' }}
					>
						ПРЕОБРАЗОВАТЬ
					</Button>
				</Flex>

				<ConversionHistory
					title="Последние конвертации"
					amount={9}
					captions={['ID', 'ДАТА', 'СТАТУС', 'РЕЗУЛЬТАТ ПЕРЕВОДА', 'ЗАТРАЧЕННЫЕ ТОКЕНЫ', 'ДАТА']}
					data={CONVERSION_HISTORY_DATA}
					enablePagination={false}
					showFullHistoryButton={true}
					fullHistoryPath="/admin/conversion-history"
					fullHistoryButtonLabel="Показать полную историю"
				/>

				<Box borderRadius="15px" overflow="hidden">
					<Image
						src={BannerConstructor}
						alt="reCode banner"
						w="100%"
						h="auto"
						objectFit="contain"
						display="block"
					/>
				</Box>
			</Flex>

			<Modal
				isOpen={isDisclaimerOpen}
				onClose={() => setIsDisclaimerOpen(false)}
				isCentered
				size="3xl"
			>
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent
					bg={modalGlassBg}
					border="1px solid"
					borderColor="whiteAlpha.400"
					borderRadius="20px"
					boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
					overflow="hidden"
				>
					<ModalHeader
						px="28px"
						py="20px"
						borderBottom="1px solid"
						borderColor="blackAlpha.200"
						bg={modalSectionBg}
					>
						<Text fontSize="24px" fontWeight="600" color={modalTitleColor} lineHeight="1.1">
							Отказ от ответственности
						</Text>
					</ModalHeader>
					<ModalCloseButton top="20px" right="20px" />
					<ModalBody px="28px" py="22px" bg={modalSectionBg}>
						<Text fontSize="14px" lineHeight="1.6" color={modalTextColor}>
							Наш онлайн-сервис предоставляет возможность автоматизированного перевода кода между
							языками программирования исключительно "как есть" без каких-либо гарантий точности,
							полноты или пригодности результата для конкретных целей использования. Пользователь
							несет полную ответственность за проверку и исправление полученного кода перед его
							применением в своих проектах.
						</Text>
						<Text fontSize="14px" lineHeight="1.6" color={modalTextColor} mt="12px">
							Мы не несем ответственности за любые возможные убытки, ущерб или другие последствия,
							возникшие вследствие использования нашего сервиса, включая, но не ограничиваясь,
							ошибками в результате конвертации, потерей данных или нарушением работы программного
							обеспечения пользователя.
						</Text>
						<Text fontSize="14px" lineHeight="1.6" color={modalTextColor} mt="12px">
							Продолжая использовать наш сервис, вы соглашаетесь с данным отказом от ответственности
							и принимаете все риски, связанные с его использованием.
						</Text>
					</ModalBody>
					<ModalFooter
						px="28px"
						py="18px"
						borderTop="1px solid"
						borderColor="blackAlpha.200"
						bg={modalSectionBg}
					>
						<Button
							colorScheme="recode"
							borderRadius="12px"
							onClick={() => setIsDisclaimerOpen(false)}
						>
							Понятно
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
