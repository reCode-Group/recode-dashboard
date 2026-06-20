import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import signInImage from "assets/img/signInImage.png";
import { useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { login } from "services/auth";
import { markAuthenticated } from "services/session";

function getFriendlyError(error) {
  const message = error.message || "";
  if (message.includes("wrong credentials")) {
    return "Неверная почта или пароль";
  }
  if (message.includes("Invalid input")) {
    return "Введите корректную почту и пароль";
  }
  if (message.includes("Too Many Requests")) {
    return "Слишком много запросов. Подождите пару секунд и попробуйте снова";
  }
  return message || "Не удалось войти";
}

function SignIn() {
  const history = useHistory();
  const titleColor = useColorModeValue("recode.300", "recode.200");
  const textColor = useColorModeValue("gray.400", "white");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Введите почту и пароль");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await login(normalizedEmail, password);
      markAuthenticated();
      history.replace("/admin/dashboard");
    } catch (requestError) {
      setError(getFriendlyError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex position="relative" mb="40px">
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}
        >
          <Flex
            as="form"
            onSubmit={handleSubmit}
            direction="column"
            w="100%"
            background="transparent"
            p="48px"
            mt={{ md: "150px", lg: "80px" }}
          >
            <Heading color={titleColor} fontSize="32px" mb="10px" ms="4px">
              С возвращением!
            </Heading>
            <Text mb="36px" ms="4px" color={textColor} fontWeight="medium" fontSize="14px">
              Введите почту и пароль для входа
            </Text>
            {error ? (
              <Alert status="error" borderRadius="12px" mb="20px" fontSize="sm">
                <AlertIcon />
                {error}
              </Alert>
            ) : null}
            <FormControl isRequired>
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Email
              </FormLabel>
              <Input
                borderRadius="15px"
                mb="24px"
                fontSize="sm"
                type="email"
                placeholder="Ваша почта"
                size="lg"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                isDisabled={isSubmitting}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Пароль
              </FormLabel>
              <Input
                borderRadius="15px"
                mb="24px"
                fontSize="sm"
                type="password"
                placeholder="Ваш пароль"
                size="lg"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                isDisabled={isSubmitting}
              />
            </FormControl>
            <Button
              fontSize="xs"
              fontWeight="medium"
              type="submit"
              bg="recode.300"
              w="100%"
              h="45"
              mb="20px"
              color="white"
              mt="12px"
              isLoading={isSubmitting}
              loadingText="Входим"
              _hover={{
                bg: "recode.200",
              }}
              _active={{
                bg: "recode.400",
              }}
            >
              Войти
            </Button>
            <Flex flexDirection="column" justifyContent="center" maxW="100%" mt="0px">
              <Text color={textColor} fontWeight="medium">
                Нет аккаунта?
                <Link as={RouterLink} to="/auth/sign-up" color={titleColor} ms="5px" fontWeight="bold">
                  Регистрация
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX="hidden"
          h="100%"
          w="40vw"
          position="absolute"
          right="0px"
        >
          <Box
            bgImage={signInImage}
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius="20px"
          ></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
