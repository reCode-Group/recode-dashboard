// Chakra imports
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Image,
	Input,
	Link,
	Switch,
	Text,
	useColorModeValue
} from "@chakra-ui/react";
// Assets
import BgSignUp from "assets/img/BgSignUp.png";
import gosuslugi_logo from "assets/svg/gosuslugi-logo.svg";
import yandex_id_logo from "assets/svg/ya-id-logo.svg";

function SignUp() {
  const titleColor = useColorModeValue("recode.300", "recode.200");
  const textColor = useColorModeValue("gray.700", "white");
  const secondTextColor = useColorModeValue("gray.400", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const bgIcons = useColorModeValue("gray.50", "rgba(255, 255, 255, 0.5)");
  return (
    <Flex
      direction='column'
      alignSelf='center'
      justifySelf='center'
      overflow='hidden'>
      <Box
        position='absolute'
        minH={{ base: "70vh", md: "50vh" }}
        w={{ md: "calc(100vw - 50px)" }}
        borderRadius={{ md: "15px" }}
        left='0'
        right='0'
        bgRepeat='no-repeat'
        overflow='hidden'
        zIndex='-1'
        top='0'
        bgImage={BgSignUp}
        bgSize='cover'
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}></Box>
      <Flex
        direction='column'
        textAlign='center'
        justifyContent='center'
        align='center'
        mt='8.5rem'
        mb='30px'>
        <Text fontSize='4xl' color='white' fontWeight='bold'>
          Добро пожаловать!
        </Text>
        <Text
          fontSize='md'
          color='white'
          fontWeight='normal'
          mt='10px'
          mb='26px'
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "60%" }}>
	          Используйте форму ниже для бесплатной регистрации на платформе
        </Text>
      </Flex>
      <Flex alignItems='center' justifyContent='center' mb='60px' mt='20px'>
        <Flex
          direction='column'
          w='445px'
          background='transparent'
          borderRadius='15px'
          p='40px'
          mx={{ base: "100px" }}
          bg={bgColor}
          boxShadow='0 20px 27px 0 rgb(0 0 0 / 5%)'>
          <Text
            fontSize='xl'
            color={textColor}
            fontWeight='bold'
            textAlign='center'
            mb='22px'>
            Регистрация
          </Text>
          <HStack spacing='15px' justify='center' mb='25px'>
            <Flex
              justify='center'
              align='center'
              h='70px'
							p='20px'
              borderRadius='15px'
              border='1px solid lightgray'
              cursor='pointer'
              transition='all .25s ease'
              _hover={{ bg: bgIcons }}>
              <Link href='#' style={{ transform: "translateY(2px)" }} >
								<Image width="100px" src={gosuslugi_logo} />
              </Link>
            </Flex>
            <Flex
              justify='center'
							p='20px'
              h='70px'
              borderRadius='15px'
              border='1px solid lightgray'
              cursor='pointer'
              transition='all .25s ease'
              _hover={{ bg: bgIcons }}>
							<Link href='#' style={{ transform: "translateY(1px)" }}>
								<Image width="100px" src={yandex_id_logo} />
							</Link>
            </Flex>
          </HStack>
          <FormControl>
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Email
            </FormLabel>
            <Input
              fontSize='sm'
              ms='4px'
              borderRadius='15px'
              type='email'
              placeholder='Ваша рабочая почта'
              mb='24px'
              size='lg'
            />
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Пароль
            </FormLabel>
            <Input
              fontSize='sm'
              ms='4px'
              borderRadius='15px'
              type='password'
              placeholder='Ваш пароль'
              mb='24px'
              size='lg'
            />
            <FormControl display='flex' alignItems='center' mb='24px'>
              <Switch id='remember-login' colorScheme='recode' me='10px' />
              <FormLabel htmlFor='remember-login' mb='0' fontWeight='normal' fontSize="sm">
                Запомнить меня
              </FormLabel>
            </FormControl>
            <Button
              type='submit'
              bg='recode.300'
              fontSize='xs'
              color='white'
              w='100%'
              h='45'
              mb='24px'
              _hover={{
                bg: "recode.200",
              }}
              _active={{
                bg: "recode.400",
              }}>
              ЗАРЕГИСТРИРОВАТЬСЯ
            </Button>
          </FormControl>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            maxW='100%'
            mt='0px'>
            <Text color={secondTextColor} fontWeight='regular'>
              Уже есть аккаунт?
              <Link
                color={titleColor}
                as='span'
                ms='5px'
                href='#'
                fontWeight='bold'>
                Войти
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;
