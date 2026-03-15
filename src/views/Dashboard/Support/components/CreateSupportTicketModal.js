import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiPaperclip, FiUploadCloud, FiX } from "react-icons/fi";
import { createSupportTicket, getAllowedAttachmentTypes } from "services/supportTickets";

const MAX_FILES = 3;
const allowedExtensions = ["png", "jpg", "jpeg", "pdf", "docx"];

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function isFileAllowed(file, allowedMimes) {
  if (allowedMimes.includes(file.type)) return true;
  const extension = file.name.split(".").pop()?.toLowerCase();
  return allowedExtensions.includes(extension || "");
}

export default function CreateSupportTicketModal({
  isOpen,
  onClose,
  onTicketCreated,
  onNavigateToTickets,
}) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [formError, setFormError] = useState("");
  const [submitState, setSubmitState] = useState("idle");
  const [requestError, setRequestError] = useState("");
  const [attachmentAlert, setAttachmentAlert] = useState("");

  const inputRef = useRef(null);

  const titleColor = useColorModeValue("gray.800", "white");
  const subtitleColor = useColorModeValue("gray.500", "gray.300");
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(26, 32, 44, 0.86)");
  const sectionBg = useColorModeValue("rgba(255, 255, 255, 0.65)", "rgba(26, 32, 44, 0.6)");
  const allowedMimes = useMemo(() => getAllowedAttachmentTypes(), []);

  const isSending = submitState === "sending";
  const isSuccess = submitState === "success";

  const resetState = () => {
    setSubject("");
    setDescription("");
    setFiles([]);
    setFormError("");
    setSubmitState("idle");
    setRequestError("");
    setAttachmentAlert("");
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const addFiles = (pickedFiles) => {
    const picked = Array.from(pickedFiles || []);
    if (!picked.length) return;

    const accepted = [];
    const rejected = [];

    picked.forEach((file) => {
      if (isFileAllowed(file, allowedMimes)) {
        accepted.push(file);
      } else {
        rejected.push(file.name);
      }
    });

    const existingMap = new Map(files.map((item) => [item.name + item.size, item]));
    accepted.forEach((item) => {
      existingMap.set(item.name + item.size, item);
    });

    const merged = Array.from(existingMap.values());
    const limitExceeded = merged.length > MAX_FILES;
    setFiles(merged.slice(0, MAX_FILES));

    const alerts = [];
    if (rejected.length) {
      alerts.push(`Некоторые файлы не добавлены: ${rejected.join(", ")}. Разрешены png, jpg, pdf, docx.`);
    }
    if (limitExceeded) {
      alerts.push("Можно прикрепить не более 3 файлов.");
    }

    setAttachmentAlert(alerts.join(" "));
    if (!alerts.length) {
      setFormError("");
    }
  };

  const removeFile = (targetFile) => {
    setFiles((prev) => prev.filter((item) => item.name + item.size !== targetFile.name + targetFile.size));
    setAttachmentAlert("");
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      setFormError("Заполните тему и описание обращения.");
      return;
    }

    setFormError("");
    setRequestError("");
    setSubmitState("sending");

    try {
      const ticket = await createSupportTicket({
        subject,
        description,
        files,
      });
      setSubmitState("success");
      onTicketCreated?.(ticket);
    } catch (error) {
      setSubmitState("error");
      setRequestError(error.message || "Не удалось отправить обращение.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={isSending ? () => {} : onClose} isCentered size="4xl">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent
        bg={glassBg}
        border="1px solid"
        borderColor="whiteAlpha.400"
        borderRadius="20px"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        overflow="hidden"
        maxH="88vh"
      >
        <ModalHeader px="32px" py="24px" borderBottom="1px solid" borderColor="blackAlpha.200" bg={sectionBg}>
          <Flex justify="space-between" align="flex-start" gap="16px">
            <Box>
              <Text fontSize="24px" fontWeight="600" color={titleColor} lineHeight="1.1">
                Новое обращение в техподдержку
              </Text>
              <Text mt="6px" fontSize="14px" color={subtitleColor}>
                Опишите проблему, и мы вернемся с ответом в тикете.
              </Text>
            </Box>
            <IconButton
              aria-label="Закрыть"
              icon={<FiX />}
              borderRadius="full"
              onClick={onClose}
              isDisabled={isSending}
              bg="blackAlpha.100"
              _hover={{ bg: "blackAlpha.200" }}
            />
          </Flex>
        </ModalHeader>

        <ModalBody px="32px" py="24px" bg={sectionBg} overflowY="auto">
          <Stack spacing="18px">
            {isSending ? (
              <Box>
                <Text fontWeight="600" mb="10px" color={titleColor}>
                  Отправляем обращение...
                </Text>
                <Progress size="sm" isIndeterminate borderRadius="999px" colorScheme="blue" />
              </Box>
            ) : null}

            {isSuccess ? (
              <Alert status="success" borderRadius="12px" bg="green.50" color="green.700">
                <AlertIcon />
                <Box>
                  <Text fontWeight="600">Обращение отправлено</Text>
                  <Text fontSize="sm">Тикет создан и уже доступен в истории.</Text>
                </Box>
              </Alert>
            ) : null}

            {submitState === "error" ? (
              <Alert status="error" borderRadius="12px">
                <AlertIcon />
                <Text>{requestError}</Text>
              </Alert>
            ) : null}

            {!isSuccess ? (
              <>
                <FormControl isInvalid={Boolean(formError) && !subject.trim()}>
                  <FormLabel fontSize="14px" color={subtitleColor} mb="8px">
                    Тема
                  </FormLabel>
                  <Input
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Например: Не работает загрузка файла"
                    isDisabled={isSending}
                    bg="white"
                    borderRadius="12px"
                    h="46px"
                  />
                </FormControl>

                <FormControl isInvalid={Boolean(formError) && !description.trim()}>
                  <FormLabel fontSize="14px" color={subtitleColor} mb="8px">
                    Описание
                  </FormLabel>
                  <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Опишите проблему максимально подробно"
                    minH="160px"
                    isDisabled={isSending}
                    bg="white"
                    borderRadius="12px"
                    resize="none"
                  />
                  {formError ? <FormErrorMessage>{formError}</FormErrorMessage> : null}
                </FormControl>

                <Box
                  border="1.5px dashed"
                  borderColor="blue.200"
                  borderRadius="16px"
                  p="16px"
                  bg="whiteAlpha.700"
                >
                  <Flex justify="space-between" align={{ base: "stretch", md: "center" }} gap="12px" flexDir={{ base: "column", md: "row" }}>
                    <Flex align="center" gap="10px">
                      <Icon as={FiUploadCloud} boxSize="20px" color="blue.400" />
                      <Box>
                        <Text fontWeight="600" color={titleColor}>
                          Прикрепить файлы
                        </Text>
                        <Text fontSize="12px" color={subtitleColor}>
                          Можно загрузить до 3 файлов: PNG, JPG, PDF, DOCX
                        </Text>
                      </Box>
                    </Flex>
                    <Button
                      leftIcon={<FiPaperclip />}
                      borderRadius="10px"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => inputRef.current?.click()}
                      isDisabled={isSending}
                    >
                      Выбрать файлы
                    </Button>
                  </Flex>

                  <Input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={allowedExtensions.map((ext) => `.${ext}`).join(",")}
                    display="none"
                    onChange={(event) => {
                      addFiles(event.target.files);
                      event.target.value = "";
                    }}
                  />

                  {attachmentAlert ? (
                    <Alert status="warning" mt="12px" borderRadius="10px" py="8px">
                      <AlertIcon />
                      <Text fontSize="sm">{attachmentAlert}</Text>
                    </Alert>
                  ) : null}

                  {files.length ? (
                    <Stack spacing="8px" mt="12px">
                      {files.map((file) => (
                        <Flex
                          key={file.name + file.size}
                          justify="space-between"
                          align="center"
                          borderRadius="10px"
                          borderWidth="1px"
                          borderColor="blackAlpha.100"
                          bg="white"
                          p="8px 10px"
                        >
                          <Box minW="0" flex="1" mr="8px">
                            <Text fontSize="sm" color={titleColor} noOfLines={1}>
                              {file.name}
                            </Text>
                            <Text fontSize="xs" color={subtitleColor}>
                              {formatFileSize(file.size)}
                            </Text>
                          </Box>
                          <IconButton
                            aria-label="Удалить файл"
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            icon={<FiX />}
                            onClick={() => removeFile(file)}
                            isDisabled={isSending}
                          />
                        </Flex>
                      ))}
                    </Stack>
                  ) : null}
                </Box>
              </>
            ) : null}
          </Stack>
        </ModalBody>

        <ModalFooter px="32px" py="20px" borderTop="1px solid" borderColor="blackAlpha.200" bg={sectionBg}>
          {isSuccess ? (
            <Flex w="100%" justify="flex-end" gap="10px">
              <Button borderRadius="12px" onClick={onClose}>
                Закрыть
              </Button>
              <Button colorScheme="blue" borderRadius="12px" onClick={onNavigateToTickets}>
                Перейти к тикетам
              </Button>
            </Flex>
          ) : (
            <Flex w="100%" justify="space-between" align="center" gap="12px">
              <Text fontSize="12px" color={subtitleColor}>
                Поддерживаются форматы: png, jpg, pdf, docx. Максимум 3 файла.
              </Text>
              <Button colorScheme="blue" borderRadius="12px" minW="150px" onClick={handleSubmit} isLoading={isSending}>
                Отправить
              </Button>
            </Flex>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
