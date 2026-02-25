import {
	Button,
	Link,
	Td,
	Text,
	Tr,
	useColorModeValue
} from "@chakra-ui/react";

function DashboardTableRow(props) {
  const { id, type, tokens_remain, status, result_url, date } = props;
  const textColor = useColorModeValue("gray.700", "white");
	let bgButton = "recode.300"
	let colorButton = "white";

  return (
    <Tr>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" style={{ transform: "translateX(-22px)" }}>
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
				<Link href={result_url}>
          <Button
            bg={bgButton}
            color={colorButton}
            fontSize="sm"
						fontWeight="medium"
            variant="no-hover"
            borderRadius="8px"
						size="sm"
            px="30px"
          >
            Просмотреть код
          </Button>
        </Link>
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
