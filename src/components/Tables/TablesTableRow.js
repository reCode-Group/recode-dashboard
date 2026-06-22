import { Avatar, Badge, Button, Flex, Td, Text, Tr, useColorModeValue } from '@chakra-ui/react';

function TablesTableRow(props) {
	const { logo, name, email, subdomain, domain, status, date, hiddenColumns = [], onEdit, onDeactivate } = props;
	const textColor = useColorModeValue('gray.700', 'white');
	const bgStatus = useColorModeValue('gray.400', '#1a202c');
	const colorStatus = useColorModeValue('white', 'gray.400');
	const hiddenColumnsSet = new Set(hiddenColumns);
	const normalizedStatus = String(status || '').toLowerCase();
	const isActiveStatus = normalizedStatus === 'active' || normalizedStatus === 'активен';

	return (
		<Tr>
			{!hiddenColumnsSet.has('user') && (
				<Td minWidth={{ sm: '250px' }} pl="0px" py="10px">
					<Flex align="center" py="2px" minWidth="100%" flexWrap="nowrap">
						<Avatar src={logo} name={name} w="42px" h="42px" borderRadius="12px" me="14px" />
						<Flex direction="column">
							<Text fontSize="sm" color={textColor} fontWeight="bold" minWidth="100%">
								{name}
							</Text>
							<Text fontSize="xs" color="gray.400" fontWeight="normal">
								{email}
							</Text>
						</Flex>
					</Flex>
				</Td>
			)}

			{!hiddenColumnsSet.has('role') && (
				<Td py="10px">
					<Flex direction="column">
						<Text fontSize="sm" color={textColor} fontWeight="bold">
							{domain}
						</Text>
						<Text fontSize="xs" color="gray.400" fontWeight="normal">
							{subdomain}
						</Text>
					</Flex>
				</Td>
			)}

			{!hiddenColumnsSet.has('status') && (
				<Td py="10px">
					<Badge
						bg={isActiveStatus ? 'green.400' : bgStatus}
						color={isActiveStatus ? 'white' : colorStatus}
						fontSize="13px"
						p="2px 8px"
						borderRadius="8px"
					>
						{status}
					</Badge>
				</Td>
			)}

			{!hiddenColumnsSet.has('tokens') && (
				<Td py="10px">
					<Text fontSize="sm" color={textColor} fontWeight="bold">
						{date}
					</Text>
				</Td>
			)}

			{!hiddenColumnsSet.has('actions') && (
				<Td py="10px">
					<Flex gap="10px">
						<Button p="0px" bg="transparent" variant="no-hover" onClick={onEdit}>
							<Text fontSize="sm" color="recode.300" fontWeight="bold" cursor="pointer">
								Токены
							</Text>
						</Button>
						{onDeactivate ? (
							<Button p="0px" bg="transparent" variant="no-hover" onClick={onDeactivate}>
								<Text fontSize="sm" color="red.400" fontWeight="bold" cursor="pointer">
									Отключить
								</Text>
							</Button>
						) : null}
					</Flex>
				</Td>
			)}
		</Tr>
	);
}

export default TablesTableRow;
