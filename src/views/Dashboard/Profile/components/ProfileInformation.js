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
  // location,
}) => {
  // Chakra color mode
  const mainColor = useColorModeValue("gray.700", "white");
  const textColor = useColorModeValue("gray.500", "white");

  return (
    <Card p='16px' my={{ sm: "24px", xl: "0px" }}>
      <CardHeader p='12px 5px' mb='12px'>
        <Text fontSize='lg' color={mainColor} fontWeight='bold'>
          {title}
        </Text>
      </CardHeader>
      <CardBody px='5px'>
        <Flex direction='column'>
          {/* <Text fontSize='md' color='gray.500' fontWeight='400' mb='30px'>
            {description}
          </Text> */}
          <Flex align='center' mb='18px'>
            <Text fontSize='sm' color={textColor} fontWeight='medium' me='10px'>
              КОМПАНИЯ:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {company}
            </Text>
          </Flex>
  				<Flex align='center' mb='18px'>
            <Text fontSize='sm' color={textColor} fontWeight='medium' me='10px'>
              РОЛЬ:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {role}
            </Text>
          </Flex>
					
					<Separator></Separator>

  				<Flex align='center' my='18px'>
            <Text fontSize='sm' color={textColor} fontWeight='medium' me='10px'>
              ПОЛНОЕ ИМЯ:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {name}
            </Text>
          </Flex>

          <Flex align='center' mb='18px'>
            <Text fontSize='sm' color={textColor} fontWeight='medium' me='10px'>
              ТЕЛЕФОН:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {mobile}
            </Text>
          </Flex>
          <Flex align='center' mb='18px'>
            <Text fontSize='sm' color={textColor} fontWeight='medium' me='10px'>
              ПОЧТА:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {email}
            </Text>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ProfileInformation;
