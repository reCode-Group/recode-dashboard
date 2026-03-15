// import
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";
import PrivacyPolicy from "views/Legal/PrivacyPolicy.js";
import PublicOffer from "views/Legal/PublicOffer.js";
import Billing from "views/Dashboard/Billing";
import Dashboard from "views/Dashboard/Dashboard";
import Profile from "views/Dashboard/Profile";
import Tables from "views/Dashboard/Tables";

import { CreditIcon, HomeIcon, PersonIcon, RocketIcon } from "components/Icons/Icons";

import { CompanyIcon, ConverterIcon, EmployersIcon, HistoryIcon } from "components/Icons/Icons";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Главная",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Профиль",
    icon: <PersonIcon color="inherit" />,
    secondaryNavbar: true,
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/billing",
    name: "Финансы",
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/admin",
  },
  {
    path: "/signup",
    name: "Тариф",
    icon: <RocketIcon color="inherit" />,
    secondaryNavbar: true,
    component: SignUp,
    layout: "/auth",
  },
  {
    path: "/privacy-policy",
    name: "Политика конфиденциальности",
    component: PrivacyPolicy,
    layout: "/auth",
  },
  {
    path: "/public-offer",
    name: "Публичная оферта",
    component: PublicOffer,
    layout: "/auth",
  },
  {
    name: "УПРАВЛЕНИЕ",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/tables",
        name: "Компания",
        icon: <CompanyIcon color="inherit" />,
        component: Tables,
        layout: "/admin",
      },
      {
        path: "/tables",
        name: "Сотрудники",
        icon: <EmployersIcon color="inherit" />,
        component: Tables,
        layout: "/admin",
      },
      {
        path: "/login-page",
        name: "Перейти в переводчик",
        icon: <ConverterIcon color="inherit" />,
        component: SignIn,
        layout: "/auth",
      },
      {
        path: "/tables",
        name: "История конвертаций",
        icon: <HistoryIcon color="inherit" />,
        component: Tables,
        layout: "/admin",
      },
    ],
  },
];
export default dashRoutes;
