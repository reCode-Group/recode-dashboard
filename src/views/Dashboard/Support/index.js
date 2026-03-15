import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Input,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiMessageCircle, FiPlus, FiSend } from "react-icons/fi";
import { useHistory, useLocation } from "react-router-dom";
import { getSupportTickets, sendSupportReply } from "services/supportTickets";
import CreateSupportTicketModal from "./components/CreateSupportTicketModal";

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusLabel(status) {
  if (status === "closed") return "Закрыт";
  if (status === "pending") return "В работе";
  return "Открыт";
}

function statusColor(status) {
  if (status === "closed") return "gray";
  if (status === "pending") return "orange";
  return "green";
}

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const messagesScrollRef = useRef(null);

  const textColor = useColorModeValue("gray.700", "white");
  const mutedColor = useColorModeValue("gray.500", "gray.300");
  const bubbleClient = useColorModeValue("blue.50", "blue.900");
  const bubbleSupport = useColorModeValue("gray.50", "gray.700");

  const selectedTicketId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("ticket");
  }, [location.search]);

  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return tickets[0] || null;
    return tickets.find((ticket) => ticket.id === selectedTicketId) || tickets[0] || null;
  }, [selectedTicketId, tickets]);

  const scrollMessagesToBottom = (behavior = "smooth") => {
    const container = messagesScrollRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  const loadTickets = async () => {
    setLoading(true);
    const nextTickets = await getSupportTickets();
    setTickets(nextTickets);
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (!selectedTicket?.id) return;
    requestAnimationFrame(() => {
      scrollMessagesToBottom("auto");
    });
  }, [selectedTicket?.id]);

  const openTicket = (ticketId) => {
    history.push(`/admin/support?ticket=${ticketId}`);
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !reply.trim()) return;
    setSendingReply(true);
    await sendSupportReply(selectedTicket.id, reply);
    setReply("");
    await loadTickets();
    setSendingReply(false);
    requestAnimationFrame(() => {
      scrollMessagesToBottom("smooth");
    });
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }} gap="24px">
      <Card>
        <CardBody>
          <Flex
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            flexDirection={{ base: "column", md: "row" }}
            gap="16px"
          >
            <Button leftIcon={<FiPlus />} colorScheme="blue" borderRadius="12px" onClick={onOpen}>
              Создать тикет
            </Button>
          </Flex>
        </CardBody>
      </Card>

      <Grid templateColumns={{ base: "1fr", xl: "1.05fr 1.95fr" }} gap="24px">
        <Card h="560px" display="flex" flexDirection="column">
          <CardHeader pb="8px">
            <Flex justify="space-between" align="center" gap="8px">
              <Text fontWeight="700" color={textColor}>
                История тикетов
              </Text>
              <Badge borderRadius="8px" px="10px" py="4px" colorScheme="blue">
                {tickets.length}
              </Badge>
            </Flex>
          </CardHeader>
          <CardBody pt="0" display="flex" flexDirection="column" minH="0">
            {loading ? (
              <Flex minH="420px" align="center" justify="center">
                <Spinner color="blue.400" />
              </Flex>
            ) : (
              <Stack spacing="10px" flex="1" minH="0" overflowY="auto" pr="2px">
                {tickets.map((ticket) => (
                  <Box
                    key={ticket.id}
                    borderWidth="1px"
                    borderColor={selectedTicket?.id === ticket.id ? "blue.200" : "gray.100"}
                    bg={selectedTicket?.id === ticket.id ? "blue.50" : "white"}
                    borderRadius="12px"
                    p="12px"
                    cursor="pointer"
                    onClick={() => openTicket(ticket.id)}
                  >
                    <Flex justify="space-between" align="flex-start" gap="10px">
                      <Box minW="0" flex="1">
                        <Text fontWeight="700" color={textColor} noOfLines={1}>
                          {ticket.subject}
                        </Text>
                        <Text fontSize="xs" color={mutedColor} mt="3px">
                          {ticket.id} {" | "} {formatDate(ticket.updatedAt)}
                        </Text>
                      </Box>
                      <Badge colorScheme={statusColor(ticket.status)} borderRadius="8px">
                        {statusLabel(ticket.status)}
                      </Badge>
                    </Flex>
                    <Text mt="8px" fontSize="sm" color={mutedColor} noOfLines={2}>
                      {ticket.description}
                    </Text>
                  </Box>
                ))}
              </Stack>
            )}
          </CardBody>
        </Card>

        <Card h="560px" display="flex" flexDirection="column">
          <CardHeader>
            <Flex justify="space-between" align="center" gap="16px">
              <Box minW="0" flex="1">
                <Text fontWeight="700" color={textColor} noOfLines={1}>
                  {selectedTicket ? selectedTicket.subject : "Выберите тикет"}
                </Text>
                {selectedTicket ? (
                  <Text fontSize="sm" color={mutedColor}>
                    {selectedTicket.id} {" | "} создан {formatDate(selectedTicket.createdAt)}
                  </Text>
                ) : null}
              </Box>
              {selectedTicket ? (
                <Badge colorScheme={statusColor(selectedTicket.status)} borderRadius="8px" px="10px" py="4px">
                  {statusLabel(selectedTicket.status)}
                </Badge>
              ) : null}
            </Flex>
          </CardHeader>

          <CardBody display="flex" flexDirection="column" minH="0">
            {!selectedTicket ? (
              <Flex minH="400px" align="center" justify="center" direction="column" color={mutedColor}>
                <FiMessageCircle size="30" />
                <Text mt="8px">Тикет пока не выбран</Text>
              </Flex>
            ) : (
              <>
                <Stack ref={messagesScrollRef} spacing="10px" flex="1" minH="0" overflowY="auto" pr="4px">
                  {selectedTicket.messages.map((message) => (
                    <Flex key={message.id} justify={message.sender === "client" ? "flex-end" : "flex-start"}>
                      <Box
                        maxW="75%"
                        bg={message.sender === "client" ? bubbleClient : bubbleSupport}
                        borderWidth="1px"
                        borderColor="blackAlpha.100"
                        borderRadius="14px"
                        p="10px 12px"
                      >
                        <Text fontSize="xs" color={mutedColor} mb="4px" fontWeight="600">
                          {message.sender === "client" ? "Вы" : "Поддержка"} {" | "} {formatDate(message.createdAt)}
                        </Text>
                        <Text color={textColor} fontSize="sm" whiteSpace="pre-wrap">
                          {message.text}
                        </Text>
                        {message.attachments?.length ? (
                          <Stack mt="8px" spacing="4px">
                            {message.attachments.map((file, idx) => (
                              <Text key={file.name + idx} fontSize="xs" color={mutedColor}>
                                {file.name}
                              </Text>
                            ))}
                          </Stack>
                        ) : null}
                      </Box>
                    </Flex>
                  ))}
                </Stack>

                <Divider my="14px" />

                <Flex gap="10px" align="center">
                  <Input
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder="Добавить сообщение в тикет"
                    borderRadius="12px"
                  />
                  <Button
                    leftIcon={<FiSend />}
                    colorScheme="blue"
                    borderRadius="12px"
                    isLoading={sendingReply}
                    onClick={handleSendReply}
                  >
                    Отправить
                  </Button>
                </Flex>
              </>
            )}
          </CardBody>
        </Card>
      </Grid>

      <CreateSupportTicketModal
        isOpen={isOpen}
        onClose={onClose}
        onTicketCreated={async (ticket) => {
          await loadTickets();
          history.push(`/admin/support?ticket=${ticket.id}`);
        }}
        onNavigateToTickets={() => history.push("/admin/support")}
      />
    </Flex>
  );
}
