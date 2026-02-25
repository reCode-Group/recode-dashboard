// Chakra imports
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Link,
	Switch,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
// Assets
import signInImage from "assets/img/signInImage.png";

function SignIn() {
  // Chakra color mode
  const titleColor = useColorModeValue("recode.300", "recode.200");
  const textColor = useColorModeValue("gray.400", "white");
  return (
    <Flex position='relative' mb='40px'>
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w='100%'
        maxW='1044px'
        mx='auto'
        justifyContent='space-between'
        mb='30px'
        pt={{ sm: "100px", md: "0px" }}>
        <Flex
          alignItems='center'
          justifyContent='start'
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}>
          <Flex
            direction='column'
            w='100%'
            background='transparent'
            p='48px'
            mt={{ md: "150px", lg: "80px" }}>
            <Heading color={titleColor} fontSize='32px' mb='10px' ms='4px'>
              С возвращением!
            </Heading>
            <Text
              mb='36px'
              ms='4px'
              color={textColor}
              fontWeight='medium'
              fontSize='14px'>
              Введите вашу почту и пароль для авторизации
            </Text>
            <FormControl>
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Email
              </FormLabel>
              <Input
                borderRadius='15px'
                mb='24px'
                fontSize='sm'
                type='text'
                placeholder='Ваша почта'
                size='lg'
              />
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Пароль
              </FormLabel>
              <Input
                borderRadius='15px'
                mb='36px'
                fontSize='sm'
                type='password'
                placeholder='Ваш пароль'
                size='lg'
              />
              <FormControl display='flex' alignItems='center'>
                <Switch id='remember-login' colorScheme='recode' me='10px' />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  ms='1'
									fontSize="sm"
                  fontWeight='normal'>
                  Запомнить меня
                </FormLabel>
              </FormControl>
              <Button
                fontSize='xs'
								fontWeight="medium"
                type='submit'
                bg='recode.300'
                w='100%'
                h='45'
                mb='20px'
                color='white'
                mt='20px'
                _hover={{
                  bg: "recode.200",
                }}
                _active={{
                  bg: "recode.400",
                }}>
                ВОЙТИ
              </Button>
            </FormControl>
            <Flex
              flexDirection='column'
              justifyContent='center'
              maxW='100%'
              mt='0px'>
              <Text color={textColor} fontWeight='medium'>
                Нет аккаунта?
                <Link color={titleColor} as='span' ms='5px' fontWeight='bold'>
                  Регистрация
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX='hidden'
          h='100%'
          w='40vw'
          position='absolute'
          right='0px'>
          <Box
            bgImage={signInImage}
            w='100%'
            h='100%'
            bgSize='cover'
            bgPosition='50%'
            position='absolute'
            borderBottomLeftRadius='20px'></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
