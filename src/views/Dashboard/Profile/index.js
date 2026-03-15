// Chakra imports
import { Flex, Grid, useColorModeValue } from "@chakra-ui/react";
import avatar4 from "assets/img/avatars/avatar4.png";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import ConversionHistory from "components/Tables/ConversionHistory";
import { FaCube, FaPenFancy } from "react-icons/fa";
import { IoDocumentsSharp } from "react-icons/io5";
import { dashboardTableData } from "variables/general";
import Conversations from "./components/Conversations";
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";
import ProfileInformation from "./components/ProfileInformation";

function Profile() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  return (
    <Flex direction='column'>
      <Header
        backgroundHeader={ProfileBgImage}
        backgroundProfile={bgProfile}
        avatarImage={avatar4}
        name={"Виктория Кузнецова"}
        email={"one@recode-group.ru"}
        tabs={[
          {
            name: "ОБЗОР",
            icon: <FaCube w='100%' h='100%' />,
          },
          {
            name: "КОМПАНИЯ",
            icon: <IoDocumentsSharp w='100%' h='100%' />,
          },
          {
            name: "СОТРУДНИКИ",
            icon: <FaPenFancy w='100%' h='100%' />,
          },
        ]}
      />
      <Grid templateColumns={{ sm: "1fr", xl: "repeat(3, 1fr)" }} gap='22px'>
        <PlatformSettings
          title={"Настройки платформы"}
          subtitle1={"АККАУНТ"}
          subtitle2={"ПЕРСОНАЛИЗАЦИЯ"}
        />
        <ProfileInformation
          title={"Персональные данные"}
          company={"ООО «Рога и Копыта»"}
          role={"Администратор"}
          // description={
          //   "Hi, I’m Esthera Jackson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
          // }
          name={"Виктория Генадиевна Кузнецова"}
          mobile={"+7 (903) 123 1234 123"}
          email={"one@recode-group.ru"}
          // location={"United States"}
        />
        <Conversations title={"Открытые тикеты"} />
      </Grid>
      <Grid
        // templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "2fr 1fr" }}
        templateColumns={{ sm: "1fr" }}
        templateRows={{ sm: "1fr auto", md: "1fr", lg: "1fr" }}
        gap='24px'
				mt="24px">
        <ConversionHistory
          title={"Последние конвертации"}
          amount={9}
          captions={["ID", "Тип", "Статус", "Результат перевода", "Затраченные токены", "Дата", ]}
          data={dashboardTableData}
					enablePagination={true}
					showFullHistoryButton={true}
        />
        {/* <OrdersOverview
          title={"Orders Overview"}
          amount={30}
          data={timelineData}
        /> */}
      </Grid>
      {/* <ConversionHistory title={"Projects"} description={"Architects design houses"} /> */}
    </Flex>
  );
}

export default Profile;
