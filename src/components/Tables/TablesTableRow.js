import { Avatar, Badge, Button, Flex, Td, Text, Tr, useColorModeValue } from '@chakra-ui/react';

function TablesTableRow(props) {
	const { logo, name, email, subdomain, domain, status, date, hiddenColumns = [], onEdit } = props;
	const textColor = useColorModeValue('gray.700', 'white');
	const bgStatus = useColorModeValue('gray.400', '#1a202c');
	const colorStatus = useColorModeValue('white', 'gray.400');
	const hiddenColumnsSet = new Set(hiddenColumns);
	const normalizedStatus = String(status || '').toLowerCase();
	const isActiveStatus = !normalizedStatus.includes('неакт');

	return (
		<Tr>
			{!hiddenColumnsSet.has('user') && (
				<Td minWidth={{ sm: '250px' }} pl="0px">
					<Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
						<Avatar src={logo} w="50px" borderRadius="12px" me="18px" />
						<Flex direction="column">
							<Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
								{name}
							</Text>
							<Text fontSize="sm" color="gray.400" fontWeight="normal">
								{email}
							</Text>
						</Flex>
					</Flex>
				</Td>
			)}

			{!hiddenColumnsSet.has('role') && (
				<Td>
					<Flex direction="column">
						<Text fontSize="md" color={textColor} fontWeight="bold">
							{domain}
						</Text>
						<Text fontSize="sm" color="gray.400" fontWeight="normal">
							{subdomain}
						</Text>
					</Flex>
				</Td>
			)}

			{!hiddenColumnsSet.has('status') && (
				<Td>
					<Badge
						bg={isActiveStatus ? 'green.400' : bgStatus}
						color={isActiveStatus ? 'white' : colorStatus}
						fontSize="16px"
						p="3px 10px"
						borderRadius="8px"
					>
						{status}
					</Badge>
				</Td>
			)}

			{!hiddenColumnsSet.has('tokens') && (
				<Td>
					<Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
						{date}
					</Text>
				</Td>
			)}

			{!hiddenColumnsSet.has('actions') && (
				<Td>
					<Button p="0px" bg="transparent" variant="no-hover" onClick={onEdit}>
						<Text fontSize="md" color="recode.300" fontWeight="bold" cursor="pointer">
							Ред.
						</Text>
					</Button>
				</Td>
			)}
		</Tr>
	);
}

export default TablesTableRow;
