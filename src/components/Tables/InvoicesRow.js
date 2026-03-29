import { Button, Flex, Icon, Td, Text, Tr, useColorModeValue } from '@chakra-ui/react';

const monthCodeMap = {
	январь: 'ЯН',
	февраль: 'ФЕ',
	март: 'МА',
	апрель: 'АП',
	май: 'МА',
	июнь: 'ИЮ',
	июль: 'ИЛ',
	август: 'АВ',
	сентябрь: 'СЕ',
	октябрь: 'ОК',
	ноябрь: 'НО',
	декабрь: 'ДЕ',
};

const formatReportDate = (rawDate = '') => {
	const parts = rawDate
		.split(',')
		.map((part) => part.trim())
		.filter(Boolean);

	if (parts.length >= 3) {
		return `${parts[0]}, ${parts[2]}`;
	}

	return rawDate;
};

const formatReportCode = (rawDate = '', rawCode = '') => {
	const monthRaw = rawDate.split(',')[0]?.trim()?.toLowerCase() ?? '';
	const monthCode =
		monthCodeMap[monthRaw] ??
		rawCode
			.replace(/[^A-Za-z]/g, '')
			.slice(0, 2)
			.toUpperCase();
	const digits = rawCode.replace(/\D/g, '').slice(-5).padStart(5, '0');

	return `${monthCode}-${digits}`;
};

function InvoicesRow(props) {
	const textColor = useColorModeValue('gray.700', 'white');
	const { date, code, price, actFormat, actLogo, invoiceFormat, invoiceLogo } = props;
	const formattedDate = formatReportDate(date);
	const formattedCode = formatReportCode(date, code);

	return (
		<Tr>
			<Td ps="0px">
				<Flex direction="column">
					<Text fontSize="md" color={textColor} fontWeight="bold">
						{formattedDate}
					</Text>
					<Text fontSize="sm" color="gray.400" fontWeight="semibold">
						{formattedCode}
					</Text>
				</Flex>
			</Td>
			<Td>
				<Text fontSize="md" color="gray.400" fontWeight="semibold">
					{price}
				</Text>
			</Td>
			<Td>
				<Button p="0px" bg="transparent" variant="no-hover">
					<Flex alignItems="center">
						<Icon as={actLogo} w="20px" h="auto" me="5px" />
						<Text fontSize="md" color={textColor} fontWeight="bold">
							{actFormat}
						</Text>
					</Flex>
				</Button>
			</Td>
			<Td>
				<Button p="0px" bg="transparent" variant="no-hover">
					<Flex alignItems="center">
						<Icon as={invoiceLogo} w="20px" h="auto" me="5px" />
						<Text fontSize="md" color={textColor} fontWeight="bold">
							{invoiceFormat}
						</Text>
					</Flex>
				</Button>
			</Td>
		</Tr>
	);
}

export default InvoicesRow;
