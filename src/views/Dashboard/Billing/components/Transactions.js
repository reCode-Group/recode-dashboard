// Chakra imports
import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import TransactionRow from 'components/Tables/TransactionRow';
import { useEffect, useRef, useState } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';

const Transactions = ({ title, date, newestTransactions, olderTransactions }) => {
	const textColor = useColorModeValue('gray.700', 'white');
	const cardBg = useColorModeValue('white', 'gray.700');
	const scrollRef = useRef(null);
	const [hasScrollbar, setHasScrollbar] = useState(false);

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
	}, [newestTransactions, olderTransactions]);

	return (
		<Card h={{ base: 'auto', lg: '100%' }} overflow="hidden" display="flex" flexDirection="column">
			<CardHeader
				mb="0"
				position="sticky"
				top="0"
				zIndex="2"
				bg={cardBg}
				borderBottom="1px solid"
				borderColor="blackAlpha.100"
			>
				<Flex direction="column" w="100%">
					<Flex
						direction={{ sm: 'column', lg: 'row' }}
						justify={{ sm: 'center', lg: 'space-between' }}
						align={{ sm: 'center' }}
						w="100%"
						my={{ md: '12px' }}
					>
						<Text color={textColor} fontSize={{ sm: 'lg', md: 'xl', lg: 'lg' }} fontWeight="bold">
							{title}
						</Text>
						<Flex align="center">
							<Icon as={FaRegCalendarAlt} color="gray.400" fontSize="md" me="6px"></Icon>
							<Text color="gray.400" fontSize="sm" fontWeight="semibold">
								{date}
							</Text>
						</Flex>
					</Flex>
				</Flex>
			</CardHeader>

			<CardBody flex="1" minH="0" p="0">
				<Box
					ref={scrollRef}
					width="100%"
					h="100%"
					overflowY={{ base: 'visible', lg: 'auto' }}
					pr={{ base: '0px', lg: hasScrollbar ? '14px' : '0px' }}
				>
					<Flex direction="column" w="100%">
						<Text
							color="gray.400"
							fontSize={{ sm: 'xs', md: 'sm' }}
							fontWeight="semibold"
							my="12px"
						>
							ПОСЛЕДНИЕ
						</Text>
						{newestTransactions.map((row) => {
							return (
								<TransactionRow name={row.name} logo={row.logo} date={row.date} price={row.price} />
							);
						})}
						<Text
							color="gray.400"
							fontSize={{ sm: 'xs', md: 'sm' }}
							fontWeight="semibold"
							my="12px"
						>
							РАНЕЕ
						</Text>
						{olderTransactions.map((row) => {
							return (
								<TransactionRow name={row.name} logo={row.logo} date={row.date} price={row.price} />
							);
						})}
					</Flex>
				</Box>
			</CardBody>
		</Card>
	);
};

export default Transactions;
