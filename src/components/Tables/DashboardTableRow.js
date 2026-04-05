import { Button, Td, Text, Tr, useColorModeValue } from '@chakra-ui/react';

function DashboardTableRow(props) {
	const { id, type, tokens_remain, status, date, onViewCode, isViewCodeDisabled = false } = props;
	const textColor = useColorModeValue('gray.700', 'white');
	const bgButton = 'recode.300';
	const colorButton = 'white';

	return (
		<Tr>
			<Td>
				<Text
					fontSize="md"
					color={textColor}
					fontWeight="bold"
					style={{ transform: 'translateX(-22px)' }}
				>
					RCD-{id}
				</Text>
			</Td>

			<Td>
				<Text fontSize="md" color={textColor} fontWeight="bold">
					{type}
				</Text>
			</Td>

			<Td>
				<Text fontSize="md" color={textColor} fontWeight="bold">
					{status}
				</Text>
			</Td>

			<Td>
				<Button
					bg={bgButton}
					color={colorButton}
					_hover={bgButton}
					_active={bgButton}
					_disabled={{
						bg: 'gray.300',
						color: 'gray.500',
						opacity: 1,
					}}
					fontSize="sm"
					fontWeight="medium"
					variant="no-hover"
					borderRadius="8px"
					size="sm"
					px="30px"
					isDisabled={isViewCodeDisabled}
					onClick={onViewCode}
				>
					Просмотреть код
				</Button>
			</Td>

			<Td>
				<Text fontSize="md" color={textColor} fontWeight="bold">
					{tokens_remain}
				</Text>
			</Td>

			<Td>
				<Text fontSize="md" color={textColor} fontWeight="bold">
					{date}
				</Text>
			</Td>
		</Tr>
	);
}

export default DashboardTableRow;
