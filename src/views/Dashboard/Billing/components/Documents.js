// Chakra imports
import {
	Box,
	Button,
	Flex,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import InvoicesRow from 'components/Tables/InvoicesRow';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Documents = ({ title, data, fixedHeight = '855px' }) => {
	const history = useHistory();
	const textColor = useColorModeValue('gray.700', 'white');
	const cardBg = useColorModeValue('white', 'gray.700');
	const scrollRef = useRef(null);
	const [hasScrollbar, setHasScrollbar] = useState(false);
	const captions = ['Дата', 'Сумма, ₽', 'Акты', 'Счета-фактуры'];

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
		<Card
			p="22px"
			flex="1"
			h={fixedHeight}
			minH={fixedHeight}
			display="flex"
			flexDirection="column"
			overflow="hidden"
		>
			<CardHeader>
				<Flex justify="space-between" align="center" mb="1rem" w="100%">
					<Text fontSize="lg" color={textColor} fontWeight="bold">
						{title}
					</Text>
					<Button
						colorScheme="recode"
						borderColor="recode.300"
						color="recode.300"
						variant="outline"
						fontSize="xs"
						p="8px 32px"
						onClick={() => history.push('/lk/profile?tab=documents')}
					>
						{'Все отчеты'}
					</Button>
				</Flex>
			</CardHeader>
			<CardBody flex="1" minH="0" p="0">
				<Box
					ref={scrollRef}
					w="100%"
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
								/>
							))}
						</Tbody>
					</Table>
				</Box>
			</CardBody>
		</Card>
	);
};

export default Documents;
