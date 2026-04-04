/*eslint-disable*/
import { Flex, Link, List, ListItem, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function Footer(props) {
  // const linkRecode = useColorModeValue("recode.400", "red.200");=
  return (
    <Flex
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent="space-between"
      px="30px"
      pb="20px"
			fontSize="sm"
    >
      <Text
        color="gray.400"
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}
      >
        &copy; ООО «Рекод Решения», {1900 + new Date().getYear()}
      </Text>
      <List display="flex">
        <ListItem
          me={{
            base: "20px",
            md: "25px",
          }}
        >
          <Link color="gray.400" href="https://recode-group/policy" textDecoration="underline">
						Политика конфиденциальности
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "25px",
          }}
        >
          <Link color="gray.400" href="https://recode-group/policy" textDecoration="underline">
						Публичная оферта
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "25px",
          }}
        >
          <Link color="gray.400" href="https://recode-group/blog" textDecoration="underline">
						Блог
          </Link>
        </ListItem>
        <ListItem>
           <Link
            as={RouterLink}
            to="/main/contacts"
            color="gray.400"
            textDecoration="underline"
          >
						Контакты
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}
