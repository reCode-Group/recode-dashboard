import { Button, Flex, Icon, Td, Text, Tr, useColorModeValue } from '@chakra-ui/react';
import { FaFilePdf } from 'react-icons/fa';

function InvoicesRow({
	date,
	code,
	price,
	actLogo = FaFilePdf,
	actFormat = 'Запросить PDF',
	invoiceLogo = FaFilePdf,
	invoiceFormat = 'Запросить PDF',
	onDocumentRequest,
}) {
	const textColor = useColorModeValue('gray.700', 'white');

	return (
		<Tr>
			<Td ps="0px">
				<Flex direction="column">
					<Text fontSize="md" color={textColor} fontWeight="bold">
						{date}
					</Text>
					<Text fontSize="sm" color="gray.400" fontWeight="semibold">
						{code}
					</Text>
				</Flex>
			</Td>
			<Td>
				<Text fontSize="md" color={textColor} fontWeight="semibold">
					{price}
				</Text>
			</Td>
			<Td>
				<Button
					p="0px"
					bg="transparent"
					variant="no-hover"
					onClick={() => onDocumentRequest?.({ documentType: 'Акт', date, code, price })}
				>
					<Flex alignItems="center">
						<Icon as={actLogo} w="18px" h="auto" me="5px" />
						<Text fontSize="sm" color={textColor} fontWeight="bold">
							{actFormat}
						</Text>
					</Flex>
				</Button>
			</Td>
			<Td>
				<Button
					p="0px"
					bg="transparent"
					variant="no-hover"
					onClick={() => onDocumentRequest?.({ documentType: 'Счёт-фактура', date, code, price })}
				>
					<Flex alignItems="center">
						<Icon as={invoiceLogo} w="18px" h="auto" me="5px" />
						<Text fontSize="sm" color={textColor} fontWeight="bold">
							{invoiceFormat}
						</Text>
					</Flex>
				</Button>
			</Td>
		</Tr>
	);
}

export default InvoicesRow;
