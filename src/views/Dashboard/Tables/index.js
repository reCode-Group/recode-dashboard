// Chakra imports
import { Flex } from "@chakra-ui/react";
import { tablesTableData } from "variables/general";
import Authors from "./components/Authors";

function Tables() {
  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Authors
        title={"Таблица сотрудников"}
        captions={["Пользователь", "Роль", "Статус", "Остаток токенов", ""]}
        data={tablesTableData}
      />
      {/* <Projects
        title={"Projects Table"}
        captions={["Companies", "Budget", "Status", "Completion", ""]}
        data={dashboardTableData}
      /> */}
    </Flex>
  );
}

export default Tables;
