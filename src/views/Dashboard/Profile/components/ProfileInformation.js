// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { Separator } from "components/Separator/Separator";

const ProfileInformation = ({
  title,
  company,
  role,
  name,
  mobile,
  email,
}) => {
  // Chakra color mode
  const mainColor = useColorModeValue("gray.700", "white");
  const textColor = useColorModeValue("gray.500", "white");

  return (
    <Card p="16px" my={{ sm: "24px", xl: "0px" }}>
      <CardHeader p="12px 5px" mb="12px">
        <Text fontSize="lg" color={mainColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody px="5px">
        <Flex direction="column">
          <Flex align="center" mb="18px">
            <Text fontSize="sm" color={textColor} fontWeight="medium" me="10px">
              Компания:{" "}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {company}
            </Text>
          </Flex>
          <Flex align="center" mb="18px">
            <Text fontSize="sm" color={textColor} fontWeight="medium" me="10px">
              Роль:{" "}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {role}
            </Text>
          </Flex>

          <Separator></Separator>

          <Flex align="center" my="18px">
            <Text fontSize="sm" color={textColor} fontWeight="medium" me="10px">
              Полное имя:{" "}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {name}
            </Text>
          </Flex>

          <Flex align="center" mb="18px">
            <Text fontSize="sm" color={textColor} fontWeight="medium" me="10px">
              Телефон:{" "}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {mobile}
            </Text>
          </Flex>
          <Flex align="center" mb="18px">
            <Text fontSize="sm" color={textColor} fontWeight="medium" me="10px">
              Почта:{" "}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {email}
            </Text>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ProfileInformation;
