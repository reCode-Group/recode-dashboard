// Chakra imports
import {
	Box,
	Button,
	Flex,
	Link,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import InvoicesRow from 'components/Tables/InvoicesRow';
import { useEffect, useRef, useState } from 'react';
import CreateSupportTicketModal from 'views/Dashboard/Support/components/CreateSupportTicketModal';
import DocumentRequestModal from './DocumentRequestModal';
import ReconciliationRequestModal from './ReconciliationRequestModal';

const DocumentsFull = ({ title, data, user, organization, fixedHeight = '560px' }) => {
	const textColor = useColorModeValue('gray.700', 'white');
	const mutedColor = useColorModeValue('gray.400', 'gray.400');
	const cardBg = useColorModeValue('white', 'gray.700');
	const captions = ['Дата', 'Сумма, ₽', 'Акты', 'Счета-фактуры'];
	const scrollRef = useRef(null);
	const [hasScrollbar, setHasScrollbar] = useState(false);
	const [documentRequest, setDocumentRequest] = useState(null);
	const supportModal = useDisclosure();
	const reconciliationModal = useDisclosure();
	const canRequestReconciliation =
		user?.has_organization === true &&
		user?.organization_role === 'director' &&
		Boolean(organization);

	useEffect(() => {
		const element = scrollRef.current;
		if (!element) return;
		let frameId = null;
		let lastHasScrollbar = null;

		const updateScrollbarState = () => {
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
			}
			frameId = requestAnimationFrame(() => {
				const nextHasScrollbar = element.scrollHeight > element.clientHeight;
				if (nextHasScrollbar !== lastHasScrollbar) {
					lastHasScrollbar = nextHasScrollbar;
					setHasScrollbar((prev) => (prev === nextHasScrollbar ? prev : nextHasScrollbar));
				}
			});
		};

		updateScrollbarState();

		const resizeObserver = new ResizeObserver(updateScrollbarState);
		resizeObserver.observe(element);
		window.addEventListener('resize', updateScrollbarState);

		return () => {
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
			}
			resizeObserver.disconnect();
			window.removeEventListener('resize', updateScrollbarState);
		};
	}, [data]);

	return (
		<>
			<Card
				p="22px"
				h={fixedHeight}
				minH={fixedHeight}
				display="flex"
				flexDirection="column"
				overflow="hidden"
			>
				<CardHeader
					p="0"
					pb="14px"
					position="sticky"
					top="0"
					zIndex="2"
					bg={cardBg}
					borderColor="blackAlpha.100"
				>
					<Flex
						justify="space-between"
						align={{ base: 'flex-start', md: 'center' }}
						direction={{ base: 'column', md: 'row' }}
						gap="12px"
						w="100%"
					>
						<Box>
							<Text fontSize="lg" color={textColor} fontWeight="bold">
								{title}
							</Text>
							<Text mt="4px" fontSize="sm" color={mutedColor}>
								Подробнее о получения оригиналов документов{' '}
								<Link
									as="button"
									type="button"
									color="gray.600"
									fontWeight="500"
									textDecoration="underline"
									onClick={supportModal.onOpen}
								>
									в техподдержке
								</Link>
							</Text>
						</Box>
						{canRequestReconciliation ? (
							<Flex gap="8px" wrap="wrap">
								<Button
									colorScheme="recode"
									borderColor="recode.300"
									color="recode.300"
									variant="outline"
									fontSize="xs"
									p="8px 30px"
									onClick={reconciliationModal.onOpen}
								>
									Запросить акты сверки
								</Button>
							</Flex>
						) : null}
					</Flex>
				</CardHeader>
				<CardBody flex="1" minH="0" p="0" pt="8px">
					<Box
						ref={scrollRef}
						width="100%"
						h="100%"
						overflow="auto"
						pr={{ base: '0px', lg: hasScrollbar ? '14px' : '0px' }}
						sx={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
					>
						<Table variant="simple" color={textColor} minW={{ base: '640px', md: '100%' }}>
							<Thead position="sticky" top="0" zIndex="1" bg={cardBg}>
								<Tr my=".8rem" pl="0px" color="gray.400">
									{captions.map((caption, idx) => (
										<Th
											color="gray.400"
											key={caption}
											ps={idx === 0 ? '0px' : null}
											verticalAlign="top"
											position="sticky"
											_after={{
												content: '""',
												position: 'absolute',
												left: 0,
												right: 0,
												bottom: 0,
												height: '0.5px',
												bg: 'blackAlpha.100',
												pointerEvents: 'none',
											}}
											top="0"
											zIndex="1"
											bg={cardBg}
										>
											{caption}
										</Th>
									))}
								</Tr>
							</Thead>
							<Tbody>
								{data.map((row) => (
									<InvoicesRow
										key={`${row.code}-${row.date}`}
										date={row.date}
										code={row.code}
										price={row.price}
										actLogo={row.actLogo ?? row.logo}
										actFormat={row.actFormat ?? row.format}
										invoiceLogo={row.invoiceLogo ?? row.logo}
										invoiceFormat={row.invoiceFormat ?? row.format}
										onDocumentRequest={setDocumentRequest}
									/>
								))}
							</Tbody>
						</Table>
					</Box>
				</CardBody>
			</Card>
			<CreateSupportTicketModal
				isOpen={supportModal.isOpen}
				onClose={supportModal.onClose}
				onEmailSent={() => {}}
			/>
			<DocumentRequestModal request={documentRequest} onClose={() => setDocumentRequest(null)} />
			<ReconciliationRequestModal
				isOpen={reconciliationModal.isOpen}
				onClose={reconciliationModal.onClose}
				user={user}
				organization={organization}
			/>
		</>
	);
};

export default DocumentsFull;
