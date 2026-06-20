// Chakra imports
import {
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
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Textarea,
	Th,
	Thead,
	Tr,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
// Custom components
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import DashboardTableRow from 'components/Tables/DashboardTableRow';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { IoArrowForwardSharp, IoCheckmarkDoneCircleSharp } from 'react-icons/io5';

const FAILED_STATUS = 'failed';

const ConversionHistory = ({
	title,
	amount,
	captions,
	data,
	fixedHeight,
	enablePagination = true,
	initialRowsPerPage = 5,
	showFullHistoryButton = false,
	fullHistoryPath = '/admin/conversion-history',
	fullHistoryButtonLabel = 'Показать всю историю',
	emptyText = 'Нет данных',
}) => {
	const history = useHistory();
	const textColor = useColorModeValue('gray.700', 'white');
	const tableBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
	const inputBg = useColorModeValue('white', 'gray.700');
	const modalGlassBg = useColorModeValue('rgba(255, 255, 255, 0.92)', 'rgba(26, 32, 44, 0.92)');
	const modalSectionBg = useColorModeValue('rgba(255, 255, 255, 0.72)', 'rgba(26, 32, 44, 0.72)');
	const modalTextColor = useColorModeValue('gray.600', 'gray.200');
	const copyButtonBg = useColorModeValue('gray.200', 'gray.600');
	const copyButtonHoverBg = useColorModeValue('gray.300', 'gray.500');
	const historyDividerColor = useColorModeValue('gray.100', 'whiteAlpha.200');
	const stickyHeaderBg = useColorModeValue('white', '#111827');
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(Math.max(1, initialRowsPerPage));
	const [selectedConversion, setSelectedConversion] = useState(null);
	const [copiedSource, setCopiedSource] = useState(false);
	const [copiedTranslated, setCopiedTranslated] = useState(false);

	const totalPages = enablePagination ? Math.max(1, Math.ceil(data.length / rowsPerPage)) : 1;
	const isEmpty = data.length === 0;
	const selectedConversionFailed = selectedConversion?.rawStatus === FAILED_STATUS;
	const translatedCodeValue = selectedConversionFailed ? '' : selectedConversion?.translatedCode || '';

	useEffect(() => {
		setPage((currentPage) => Math.min(currentPage, totalPages));
	}, [totalPages]);

	const visibleData = useMemo(() => {
		if (!enablePagination) {
			return data;
		}

		const start = (page - 1) * rowsPerPage;
		return data.slice(start, start + rowsPerPage);
	}, [data, enablePagination, page, rowsPerPage]);

	const handleRowsPerPageChange = (event) => {
		const nextValue = Number.parseInt(event.target.value, 10);
		const safeValue = Number.isNaN(nextValue) ? 1 : Math.max(1, nextValue);

		setRowsPerPage(safeValue);
		setPage(1);
	};

	const handleCopy = async (value, type) => {
		if (!value) return;

		try {
			await navigator.clipboard.writeText(value);
			if (type === 'source') {
				setCopiedSource(true);
				setTimeout(() => setCopiedSource(false), 1800);
			} else {
				setCopiedTranslated(true);
				setTimeout(() => setCopiedTranslated(false), 1800);
			}
		} catch (error) {
			// Clipboard API may be unavailable in restricted browser contexts.
		}
	};

	const getPaginationButtonStyles = (isEnabled) => ({
		bg: isEnabled ? 'recode.300' : 'gray.500',
		color: 'white',
		_hover: { bg: isEnabled ? 'recode.400' : 'gray.200' },
		_active: { bg: isEnabled ? 'recode.400' : 'gray.200' },
		_disabled: {
			bg: 'gray.300',
			color: 'gray.500',
			opacity: 1,
			cursor: 'not-allowed',
		},
	});

	const renderPaginationControls = () => {
		const canGoPrev = page > 1;
		const canGoNext = page < totalPages;

		return (
			<Flex align="center" wrap="wrap" gap="10px">
				<Button
					size="sm"
					onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
					isDisabled={!canGoPrev}
					{...getPaginationButtonStyles(canGoPrev)}
				>
					Предыдущая
				</Button>

				<Text minW="30px" textAlign="center" fontSize="md" color={textColor}>
					{page}
				</Text>

				<Button
					size="sm"
					onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
					isDisabled={!canGoNext}
					{...getPaginationButtonStyles(canGoNext)}
				>
					Следующая
				</Button>

				<Text fontSize="sm" color="gray.500">
					Отображать по:
				</Text>

				<Input
					value={rowsPerPage}
					onChange={handleRowsPerPageChange}
					type="number"
					min={1}
					w="84px"
					h="36px"
					px="10px"
				/>
			</Flex>
		);
	};

	return (
		<Flex direction="column" gap="14px" minW="0" w="100%">
			<Card
				p="16px"
				overflow="hidden"
				maxW="100%"
				minW="0"
				h={fixedHeight}
				minH={fixedHeight}
				display={fixedHeight ? 'flex' : undefined}
				flexDirection={fixedHeight ? 'column' : undefined}
			>
				<CardHeader p="12px 0px 28px 0px">
					<Flex direction="column">
						<Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
							{title}
						</Text>
						<Flex align="center">
							<Icon as={IoCheckmarkDoneCircleSharp} color="green.400" w={4} h={4} pe="3px" />
							<Text fontSize="sm" color="gray.400" fontWeight="normal">
								<Text fontWeight="bold" as="span">
									{amount} совершено
								</Text>{' '}
								в этом месяце
							</Text>
						</Flex>
					</Flex>
				</CardHeader>
				<TableContainer
					w="100%"
					maxW="100%"
					minW="0"
					maxH={fixedHeight ? { base: '55vh', lg: '100%' } : { base: '55vh', lg: 'unset' }}
					flex={fixedHeight ? '1' : undefined}
					minH={fixedHeight ? '0' : undefined}
					overflowX="auto"
					overflowY={fixedHeight ? 'auto' : { base: 'auto', lg: 'visible' }}
					borderTop="1px solid"
					borderBottom="1px solid"
					borderColor={historyDividerColor}
					sx={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
				>
					<Table
						variant="simple"
						color={textColor}
						minW={{ base: '700px', lg: '100%' }}
						sx={{
							th: {
								borderColor: historyDividerColor,
								position: 'sticky',
								top: 0,
								zIndex: 1,
								bg: stickyHeaderBg,
							},
							td: {
								borderColor: historyDividerColor,
							},
						}}
					>
						<Thead>
							<Tr my=".8rem" ps="0px">
								{captions.map((caption, idx) => (
									<Th color="gray.400" key={idx} ps={idx === 0 ? '0px' : null}>
										{caption}
									</Th>
								))}
							</Tr>
						</Thead>
						<Tbody>
							{isEmpty ? (
								<Tr>
									<Td colSpan={captions.length} ps="0px" border="none">
										<Text fontSize="sm" color="gray.500" fontWeight="normal">
											{emptyText}
										</Text>
									</Td>
								</Tr>
							) : (
								visibleData.map((row) => {
									const numericID = Number(row.id);
									const isViewCodeDisabled = Number.isFinite(numericID) && (numericID * 13) % 5 === 0;
									return (
										<DashboardTableRow
											key={row.id}
											id={row.id}
											type={row.type}
											tokens_remain={row.tokens_remain}
											result_url={row.result_url}
											status={row.status}
											date={row.date}
											isViewCodeDisabled={isViewCodeDisabled}
											onViewCode={() => {
												setSelectedConversion(row);
												setCopiedSource(false);
												setCopiedTranslated(false);
											}}
										/>
									);
								})
							)}
						</Tbody>
					</Table>
				</TableContainer>
			</Card>

			{(enablePagination || showFullHistoryButton) && (
				<>
					<Flex
						display={{ base: 'none', md: 'grid' }}
						gridTemplateColumns="1fr auto 1fr"
						align="center"
						gap="12px"
					>
						{enablePagination ? <Flex>{renderPaginationControls()}</Flex> : <Flex />}

						{!showFullHistoryButton ? (
							<Flex />
						) : (
							<Button
								variant="ghost"
								bg="transparent"
								color={textColor}
								fontWeight="500"
								rightIcon={<IoArrowForwardSharp />}
								_hover={{ bg: 'transparent', textDecoration: 'underline' }}
								_active={{ bg: 'transparent' }}
								_focus={{ boxShadow: 'none' }}
								onClick={() => history.push(fullHistoryPath)}
							>
								{fullHistoryButtonLabel}
							</Button>
						)}
					</Flex>

					<Flex display={{ base: 'flex', md: 'none' }} align="center" w="100%" wrap="wrap" gap="12px" mt="2px">
						{enablePagination && renderPaginationControls()}

						{showFullHistoryButton && (
							<Button
								variant="ghost"
								bg="transparent"
								color={textColor}
								fontWeight="500"
								rightIcon={<IoArrowForwardSharp />}
								_hover={{ bg: 'transparent', textDecoration: 'underline' }}
								_active={{ bg: 'transparent' }}
								_focus={{ boxShadow: 'none' }}
								onClick={() => history.push(fullHistoryPath)}
								ms={enablePagination ? '10px' : '0'}
							>
								{fullHistoryButtonLabel}
							</Button>
						)}
					</Flex>
				</>
			)}

			<Modal isOpen={Boolean(selectedConversion)} onClose={() => setSelectedConversion(null)} isCentered size="6xl">
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent
					bg={modalGlassBg}
					border="1px solid"
					borderColor="whiteAlpha.400"
					borderRadius="20px"
					boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
					overflow="hidden"
					maxH={{ base: '90vh', md: '85vh' }}
				>
					<ModalHeader px="28px" py="20px" borderBottom="1px solid" borderColor="blackAlpha.200" bg={modalSectionBg}>
						<Text fontSize="24px" fontWeight="600" color={textColor} lineHeight="1.1">
							Просмотр кода
						</Text>
						<Text mt="6px" fontSize="14px" color={modalTextColor}>
							Тип перевода: {selectedConversion?.type || '-'}
						</Text>
					</ModalHeader>
					<ModalBody px="28px" py="22px" bg={modalSectionBg} overflowY="auto">
						<Flex direction={{ base: 'column', xl: 'row' }} gap="18px">
							<Flex direction="column" flex="1" minW="0">
								<Flex justify="space-between" align="center" mb="8px">
									<Text fontSize="sm" color={textColor}>
										Исходный код
									</Text>
									<Button
										size="xs"
										px="10px"
										bg={copyButtonBg}
										color={textColor}
										borderRadius="8px"
										leftIcon={copiedSource ? <FiCheck /> : <FiCopy />}
										fontSize="xs"
										fontWeight="700"
										_hover={{ bg: copyButtonHoverBg }}
										isDisabled={!selectedConversion?.sourceCode}
										onClick={() => handleCopy(selectedConversion?.sourceCode || '', 'source')}
									>
										{copiedSource ? 'Скопировано' : 'Копировать'}
									</Button>
								</Flex>
								<Textarea
									value={selectedConversion?.sourceCode || ''}
									readOnly
									h={{ base: '180px', md: '240px', xl: '360px' }}
									bg={inputBg}
									borderColor={tableBorder}
									borderRadius="15px"
									resize="none"
									overflowY="auto"
									fontSize="sm"
								/>
							</Flex>
							<Flex direction="column" flex="1" minW="0">
								<Flex justify="space-between" align="center" mb="8px">
									<Text fontSize="sm" color={textColor}>
										Переведенный макрос
									</Text>
									<Button
										size="xs"
										px="10px"
										bg={copyButtonBg}
										color={textColor}
										borderRadius="8px"
										leftIcon={copiedTranslated ? <FiCheck /> : <FiCopy />}
										fontSize="xs"
										fontWeight="700"
										_hover={{ bg: copyButtonHoverBg }}
										isDisabled={selectedConversionFailed || !translatedCodeValue}
										onClick={() => handleCopy(translatedCodeValue, 'translated')}
									>
										{copiedTranslated ? 'Скопировано' : 'Копировать'}
									</Button>
								</Flex>
								<Textarea
									value={translatedCodeValue}
									readOnly
									isDisabled={selectedConversionFailed}
									h={{ base: '180px', md: '240px', xl: '360px' }}
									bg={inputBg}
									borderColor={tableBorder}
									borderRadius="15px"
									resize="none"
									overflowY="auto"
									fontSize="sm"
								/>
							</Flex>
						</Flex>
					</ModalBody>
					<ModalFooter px="28px" py="18px" borderTop="1px solid" borderColor="blackAlpha.200" bg={modalSectionBg}>
						<Button colorScheme="recode" borderRadius="12px" onClick={() => setSelectedConversion(null)}>
							Закрыть
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

export default ConversionHistory;
