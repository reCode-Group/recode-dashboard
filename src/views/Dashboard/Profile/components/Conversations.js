// Chakra imports
import {
	Avatar,
	Button,
	Flex,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
// Assets
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar4 from "assets/img/avatars/avatar4.png";
import avatar5 from "assets/img/avatars/avatar5.png";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

const Conversations = ({ title }) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Card p='16px'>
      <CardHeader p='12px 5px' mb='12px'>
        <Text fontSize='lg' color={textColor} fontWeight='bold'>
          {title}
        </Text>
      </CardHeader>
      <CardBody px='5px'>
        <Flex direction='column' w='100%'>
          <Flex justifyContent='space-between' mb='21px'>
            <Flex align='center'>
              <Avatar
                src={avatar2}
                w='50px'
                h='50px'
                borderRadius='15px'
                me='10px'
              />
              <Flex direction='column'>
                <Text fontSize='sm' color={textColor} fontWeight='bold'>
                  Помощник Андрей{" "}
                </Text>
                <Text fontSize='sm' color='gray.500' fontWeight='400'>
                  Добрый день! Сейчас подскажу...
                </Text>
              </Flex>
            </Flex>
            <Button p='0px' bg='transparent' variant='no-hover'>
              <Text
                fontSize='sm'
                fontWeight='600'
                color='recode.300'
                alignSelf='center'>
                ОТВЕТИТЬ
              </Text>
            </Button>
          </Flex>
          <Flex justifyContent='space-between' mb='21px'>
            <Flex align='center'>
              <Avatar
                src={avatar4}
                w='50px'
                h='50px'
                borderRadius='15px'
                me='10px'
              />
              <Flex direction='column'>
                <Text fontSize='sm' color={textColor} fontWeight='bold'>
                  Помощник Елена{" "}
                </Text>
                <Text fontSize='sm' color='gray.500' fontWeight='400'>
                  Отлично тогда могу закрыть тикет...
                </Text>
              </Flex>
            </Flex>
            <Button p='0px' bg='transparent' variant='no-hover'>
              <Text
                fontSize='sm'
                fontWeight='600'
                color='recode.300'
                alignSelf='center'>
                ОТВЕТИТЬ
              </Text>
            </Button>
          </Flex>
          <Flex justifyContent='space-between' mb='21px'>
            <Flex align='center'>
              <Avatar
                src={avatar5}
                w='50px'
                h='50px'
                borderRadius='15px'
                me='10px'
              />
              <Flex direction='column'>
                <Text fontSize='sm' color={textColor} fontWeight='bold'>
                  Помощник Максим{" "}
                </Text>
                <Text fontSize='sm' color='gray.500' fontWeight='400'>
                  Этот тикет закрыт.
                </Text>
              </Flex>
            </Flex>
						
            <Button p='0px' bg='transparent' variant='no-hover'>
              <Text
                fontSize='sm'
                fontWeight='600'
                color='gray.400'
                alignSelf='center'>
                ЗАКРЫТ
              </Text>
            </Button>
          </Flex>
					<Flex justifyContent='space-between' mb='6px'>
            <Flex align='center'>
              <Avatar
                src={avatar5}
                w='50px'
                h='50px'
                borderRadius='15px'
                me='10px'
              />
              <Flex direction='column'>
                <Text fontSize='sm' color={textColor} fontWeight='bold'>
                  Помощник Максим{" "}
                </Text>
                <Text fontSize='sm' color='gray.500' fontWeight='400'>
                  Этот тикет закрыт.
                </Text>
              </Flex>
            </Flex>
						
            <Button p='0px' bg='transparent' variant='no-hover'>
              <Text
                fontSize='sm'
                fontWeight='600'
                color='gray.400'
                alignSelf='center'>
                ЗАКРЫТ
              </Text>
            </Button>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Conversations;
