// Assets
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar10 from "assets/img/avatars/avatar10.png";
import { default as avatar2, default as avatar7 } from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import avatar4 from "assets/img/avatars/avatar4.png";
import avatar5 from "assets/img/avatars/avatar5.png";
import avatar8 from "assets/img/avatars/avatar8.png";
import avatar9 from "assets/img/avatars/avatar9.png";
import system_avatar from "assets/img/avatars/system.png";
// Custom icons
import {
	AdobexdLogo,
	AtlassianLogo,
	InvisionLogo,
	JiraLogo,
	SlackLogo,
	SpotifyLogo,
} from "components/Icons/Icons.js";
import { AiOutlineExclamation } from "react-icons/ai";
import {
	FaArrowDown,
	FaArrowUp,
	FaBell,
	FaCreditCard,
	FaFilePdf,
	FaHtml5,
	FaShoppingCart,
} from "react-icons/fa";
import { SiDropbox } from "react-icons/si";

export const dashboardTableData = [
  {
		id: 42342,
		type: "VBA -> JS",
    tokens_remain: 2090,
		result_url: "https://recode-group.ru",
    status: "Завершен",
		date: "02.02.2023"
  },
  {
		id: 65343,
		type: "VBA -> JS",
    tokens_remain: 2810,
		result_url: "https://recode-group.ru",
    status: "Завершен",
		date: "02.02.2023"
  },
  {
		id: 21451,
		type: "VBA -> JS",
    tokens_remain: 2710,
		result_url: "https://recode-group.ru",
    status: "Завершен",
		date: "02.02.2023"
  },
  {
		id: 14342,
		type: "VBA -> JS",
    tokens_remain: 1250,
		result_url: "https://recode-group.ru",
    status: "Завершен",
		date: "02.02.2023"
  },
  {
		id: 73242,
		type: "VBA -> JS",
    tokens_remain: 8300,
		result_url: "https://recode-group.ru",
    status: "Завершен",
		date: "02.02.2023"
  },
  {
		id: 23323,
		type: "VBA -> JS",
    tokens_remain: 4300,
		result_url: "https://recode-group.ru",
    status: "Завершен",
		date: "02.02.2023"
  },
];

export const timelineData = [
  {
    logo: FaBell,
    title: "$2400, Design changes",
    date: "22 DEC 7:20 ",
    color: "recode.300",
  },
  {
    logo: FaHtml5,
    title: "New order #4219423",
    date: "21 DEC 11:21 ",
    color: "orange",
  },
  {
    logo: FaShoppingCart,
    title: "Server Payments for April",
    date: "21 DEC 9:28 ",
    color: "blue.400",
  },
  {
    logo: FaCreditCard,
    title: "New card added for order #3210145",
    date: "20 DEC 3:52 ",
    color: "orange.300",
  },
  {
    logo: SiDropbox,
    title: "Unlock packages for Develoent",
    date: "19 DEC 11:35 ",
    color: "purple",
  },
  {
    logo: AdobexdLogo,
    title: "New order #9851258",
    date: "18 DEC 4:41 ",
  },
];

export const tablesTableData = [
  {
    logo: system_avatar,
    name: "Иван Петров",
    email: "i.petrov@recode-group.ru",
    subdomain: "Все права",
    domain: "Администратор",
    status: "Активен",
    date: "6 500",
  },
  {
    logo: system_avatar,
    name: "Анна Смирнова",
    email: "a.smirnova@recode-group.ru",
    subdomain: "Права ограничены",
    domain: "Сотрудник",
    status: "Активен",
    date: "4 300",
  },
  {
    logo: system_avatar,
    name: "Сергей Иванов",
    email: "s.ivanov@recode-group.ru",
    subdomain: "Права ограничены",
    domain: "Сотрудник",
    status: "Неактивен",
    date: "2 100",
  },
  {
    logo: system_avatar,
    name: "Елена Козлова",
    email: "e.kozlova@recode-group.ru",
    subdomain: "Все права",
    domain: "Сотрудник",
    status: "Активен",
    date: "10 000",
  },
  {
    logo: system_avatar,
    name: "Дмитрий Новиков",
    email: "d.novikov@recode-group.ru",
    subdomain: "Права ограничены",
    domain: "Сотрудник",
    status: "Неактивен",
    date: "10 000",
  },
  {
    logo: system_avatar,
    name: "Ольга Морозова",
    email: "o.morozova@recode-group.ru",
    subdomain: "Права ограничены",
    domain: "Сотрудник",
    status: "Активен",
    date: "1 000",
  },
];
export const tablesProjectData = [
  {
    logo: AdobexdLogo,
    name: "Purity UI Version",
    budget: "$14,000",
    status: "Working",
    progression: 60,
  },
  {
    logo: AtlassianLogo,
    name: "Add Progress Track",
    budget: "$3,000",
    status: "Canceled",
    progression: 10,
  },
  {
    logo: SlackLogo,
    name: "Fix Platform Errors",
    budget: "Not set",
    status: "Done",
    progression: 100,
  },
  {
    logo: SpotifyLogo,
    name: "Launch our Mobile App",
    budget: "$32,000",
    status: "Done",
    progression: 100,
  },
  {
    logo: JiraLogo,
    name: "Add the New Pricing Page",
    budget: "$400",
    status: "Working",
    progression: 25,
  },
];

export const invoicesData = [
  {
    date: "Март, 01, 2020",
    code: "#MS-415646",
    price: "18 000",
    logo: FaFilePdf,
    format: "PDF",
  },
  {
    date: "Февраль, 10, 2020",
    code: "#RV-126749",
    price: "25 000",
    logo: FaFilePdf,
    format: "PDF",
  },
  {
    date: "Апрель, 05, 2020",
    code: "#FB-212562",
    price: "5 600",
    logo: FaFilePdf,
    format: "PDF",
  },
  {
    date: "Июнь, 25, 2019",
    code: "#QW-103578",
    price: "12 000",
    logo: FaFilePdf,
    format: "PDF",
  },
  {
    date: "Март, 01, 2019",
    code: "#AR-803481",
    price: "3 000",
    logo: FaFilePdf,
    format: "PDF",
  },
];

export const billingData = [
  {
    name: "Oliver Liam",
    company: "Viking Burrito",
    email: "oliver@burrito.com",
    number: "FRB1235476",
  },
  {
    name: "Lucas Harper",
    company: "Stone Tech Zone",
    email: "lucas@stone-tech.com",
    number: "FRB1235476",
  },
  {
    name: "Ethan James",
    company: "Fiber Notion",
    email: "ethan@fiber.com",
    number: "FRB1235476",
  },
];

export const newestTransactions = [
  {
    name: "Оплата тарифа",
    date: "27 Март 2021, в 12:30 (МСК)",
    price: "- 2 500 руб.",
    logo: FaArrowDown,
  },
  {
    name: "Зачисление на счет",
    date: "27 Март 2021, в 12:30 (МСК)",
    price: "+ 2 500 руб.",
    logo: FaArrowUp,
  },
];

export const olderTransactions = [
  {
    name: "Зачисление на счет",
    date: "26 Март 2021, в 13:45 (МСК)",
    price: "+ 800 руб.",
    logo: FaArrowUp,
  },
  {
    name: "Зачисление на счет",
    date: "26 Март 2021, в 12:30 (МСК)",
    price: "+ 1,700 руб.",
    logo: FaArrowUp,
  },
  {
    name: "Зачисление на счет",
    date: "26 Март 2021, в 05:00 (МСК)",
    price: "Обработка",
    logo: AiOutlineExclamation,
  },
  {
    name: "Оплата тарифа",
    date: "25 Март 2021, в 16:30 (МСК)",
    price: "- 987 руб.",
    logo: FaArrowDown,
  },
];
