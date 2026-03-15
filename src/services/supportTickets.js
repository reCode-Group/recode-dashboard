const STORAGE_KEY = "recode_support_tickets_v2";

const allowedAttachmentTypes = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const initialTickets = [
  {
    id: "TCK-1001",
    subject: "Не открывается страница конвертации",
    description:
      "После авторизации открываю раздел конвертаций и получаю пустой экран. Проблема повторяется в Chrome и Edge.",
    status: "open",
    createdAt: "2026-03-13T09:20:00.000Z",
    updatedAt: "2026-03-13T10:15:00.000Z",
    attachments: [{ name: "screenshot-error.png", type: "image/png", size: 214223 }],
    messages: [
      {
        id: "MSG-1001",
        sender: "client",
        text: "Не открывается раздел конвертаций после входа.",
        createdAt: "2026-03-13T09:20:00.000Z",
        attachments: [],
      },
      {
        id: "MSG-1002",
        sender: "support",
        text: "Проверяем. Уточните, пожалуйста, в каком браузере возникает ошибка.",
        createdAt: "2026-03-13T09:30:00.000Z",
        attachments: [],
      },
      {
        id: "MSG-1003",
        sender: "client",
        text: "Chrome 134 и Edge 134, приложил скриншот.",
        createdAt: "2026-03-13T10:15:00.000Z",
        attachments: [{ name: "screenshot-error.png", type: "image/png", size: 214223 }],
      },
    ],
  },
  {
    id: "TCK-1002",
    subject: "Нужна консультация по тарифу",
    description:
      "Подскажите, какие ограничения по токенам и количеству сотрудников на тарифе Стандарт.",
    status: "closed",
    createdAt: "2026-03-10T14:00:00.000Z",
    updatedAt: "2026-03-10T15:30:00.000Z",
    attachments: [],
    messages: [
      {
        id: "MSG-2001",
        sender: "client",
        text: "Подскажите, какие ограничения по токенам и сотрудникам?",
        createdAt: "2026-03-10T14:00:00.000Z",
        attachments: [],
      },
      {
        id: "MSG-2002",
        sender: "support",
        text: "На тарифе Стандарт доступно 10 сотрудников и 200 000 токенов в месяц.",
        createdAt: "2026-03-10T14:20:00.000Z",
        attachments: [],
      },
      {
        id: "MSG-2003",
        sender: "client",
        text: "Спасибо, вопрос закрыт.",
        createdAt: "2026-03-10T15:30:00.000Z",
        attachments: [],
      },
    ],
  },
];

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function readStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTickets));
      return [...initialTickets];
    }
    return JSON.parse(raw);
  } catch (error) {
    return [...initialTickets];
  }
}

function writeStorage(tickets) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function normalizeAttachments(files = []) {
  return files.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
  }));
}

function createTicketId(existingCount) {
  return `TCK-${1000 + existingCount + 1}`;
}

function createMessageId() {
  return `MSG-${Date.now()}`;
}

export async function getSupportTickets() {
  await delay(250);
  const tickets = readStorage();
  return tickets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function createSupportTicket(payload) {
  await delay(1200);
  const isSuccess = Math.random() > 0.2;
  if (!isSuccess) {
    throw new Error("Не удалось отправить обращение. Попробуйте еще раз.");
  }

  const tickets = readStorage();
  const now = new Date().toISOString();
  const newTicket = {
    id: createTicketId(tickets.length),
    subject: payload.subject.trim(),
    description: payload.description.trim(),
    status: "open",
    createdAt: now,
    updatedAt: now,
    attachments: normalizeAttachments(payload.files),
    messages: [
      {
        id: createMessageId(),
        sender: "client",
        text: payload.description.trim(),
        createdAt: now,
        attachments: normalizeAttachments(payload.files),
      },
      {
        id: createMessageId(),
        sender: "support",
        text: "Обращение получено. Специалист подключится в ближайшее время.",
        createdAt: now,
        attachments: [],
      },
    ],
  };

  writeStorage([newTicket, ...tickets]);
  return newTicket;
}

export async function sendSupportReply(ticketId, message) {
  await delay(800);
  const tickets = readStorage();
  const nextTickets = tickets.map((ticket) => {
    if (ticket.id !== ticketId) return ticket;
    const now = new Date().toISOString();
    return {
      ...ticket,
      updatedAt: now,
      messages: [
        ...ticket.messages,
        {
          id: createMessageId(),
          sender: "client",
          text: message.trim(),
          createdAt: now,
          attachments: [],
        },
        {
          id: createMessageId(),
          sender: "support",
          text: "Спасибо, получили уточнение. Вернемся с ответом в этом тикете.",
          createdAt: now,
          attachments: [],
        },
      ],
    };
  });
  writeStorage(nextTickets);
  return nextTickets.find((ticket) => ticket.id === ticketId);
}

export function getAllowedAttachmentTypes() {
  return [...allowedAttachmentTypes];
}
