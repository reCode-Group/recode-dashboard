// Chakra imports
import {
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

const Invoices = ({ title, data }) => {
	const textColor = useColorModeValue('gray.700', 'white');
	const captions = ['Дата', 'Сумма, ₽', 'Акты', 'Счета-фактуры'];

	return (
		<Card
			p="22px"
			flex="1"
			h="100%"
			display="flex"
			flexDirection="column"
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
					>
						{'Все отчеты'}
					</Button>
				</Flex>
			</CardHeader>
			<CardBody flex="1" display="flex" flexDirection="column">
				<Table variant="simple" color={textColor}>
					<Thead>
						<Tr my=".8rem" pl="0px" color="gray.400">
							{captions.map((caption, idx) => (
								<Th
									color="gray.400"
									key={caption}
									ps={idx === 0 ? '0px' : null}
									verticalAlign="top"
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
			</CardBody>
		</Card>
	);
};

export default Invoices;
