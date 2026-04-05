// Chakra imports
import {
	Button,
	Flex,
	Icon,
	Input,
	Table,
	Tbody,
	Text,
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
import { IoArrowForwardSharp, IoCheckmarkDoneCircleSharp } from 'react-icons/io5';

const ConversionHistory = ({
	title,
	amount,
	captions,
	data,
	enablePagination = true,
	initialRowsPerPage = 5,
	showFullHistoryButton = false,
	fullHistoryPath = '/admin/conversion-history',
	fullHistoryButtonLabel = 'Показать всю историю',
}) => {
	const history = useHistory();
	const textColor = useColorModeValue('gray.700', 'white');
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(Math.max(1, initialRowsPerPage));

	const totalPages = enablePagination ? Math.max(1, Math.ceil(data.length / rowsPerPage)) : 1;

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
		<Flex direction="column" gap="14px">
			<Card p="16px" overflowX={{ sm: 'scroll', xl: 'hidden' }}>
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
				<Table variant="simple" color={textColor}>
					<Thead>
						<Tr my=".8rem" ps="0px">
							{captions.map((caption, idx) => {
								return (
									<Th color="gray.400" key={idx} ps={idx === 0 ? '0px' : null}>
										{caption}
									</Th>
								);
							})}
						</Tr>
					</Thead>
					<Tbody>
						{visibleData.map((row) => {
							return (
								<DashboardTableRow
									key={row.id}
									id={row.id}
									type={row.type}
									tokens_remain={row.tokens_remain}
									result_url={row.result_url}
									status={row.status}
									date={row.date}
								/>
							);
						})}
					</Tbody>
				</Table>
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

					<Flex
						display={{ base: 'flex', md: 'none' }}
						align="center"
						wrap="wrap"
						gap="12px"
						mt="2px"
					>
						{enablePagination && renderPaginationControls()}

						{showFullHistoryButton && (
							<Button
								variant="ghost"
								bg="transparent"
								color="black"
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
		</Flex>
	);
};

export default ConversionHistory;
