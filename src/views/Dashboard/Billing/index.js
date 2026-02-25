// Chakra imports
import { Box, Flex, Grid, Icon } from "@chakra-ui/react";
// Assets
import BackgroundCard1 from "assets/img/BackgroundCard1.png";
import { MastercardIcon, VisaIcon } from "components/Icons/Icons";
import { FaPaypal, FaWallet } from "react-icons/fa";
import { RiMastercardFill } from "react-icons/ri";
import {
	invoicesData,
	newestTransactions,
	olderTransactions
} from "variables/general";
import CreditCard from "./components/CreditCard";
import Invoices from "./components/Invoices";
import PaymentMethod from "./components/PaymentMethod";
import PaymentStatistics from "./components/PaymentStatistics";
import Transactions from "./components/Transactions";

function Billing() {
  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Grid templateColumns={{ sm: "1fr", lg: "2fr 1.2fr" }} templateRows='1fr'>
        <Box>
          <Grid
            templateColumns={{
              sm: "1fr",
              md: "1fr 1fr",
              xl: "1fr 1fr 1fr 1fr",
            }}
            templateRows={{ sm: "auto auto auto", md: "1fr auto", xl: "1fr" }}
            gap='26px'>
            <CreditCard
              backgroundImage={BackgroundCard1}
              title={"Ваш тариф"}
              number={"БАЗОВЫЙ"}
              validity={{
                name: "ДЕЙСТВИТЕЛЕН ДО",
                data: "05/05/24",
              }}
              cvv={{
                name: "ОСТАТОК ТОКЕНОВ",
                code: "1 100 / 10 000",
              }}
              icon={
                <Icon
                  as={RiMastercardFill}
                  w='48px'
                  h='auto'
                  color='gray.400'
                />
              }
            />
            <PaymentStatistics
              icon={<Icon h={"24px"} w={"24px"} color='white' as={FaWallet} />}
              title={"Баланс"}
              description={"Остаток на счете"}
              amount={2000}
            />
            <PaymentStatistics
              icon={<Icon h={"24px"} w={"24px"} color='white' as={FaPaypal} />}
              title={"Заблокированная сумма на услуги"}
              description={""}
              amount={4550}
            />
          </Grid>
          <PaymentMethod
            title={"Способы оплаты"}
            mastercard={{
              icon: <MastercardIcon w='100%' h='100%' />,
              number: "7812 2139 0823 XXXX",
            }}
            visa={{
              icon: <VisaIcon w='100%' h='100%' />,
              number: "7812 2139 0823 XXXX",
            }}
          />
        </Box>
        <Invoices title={"Отчеты"} data={invoicesData} />
      </Grid>
      <Grid templateColumns={{ sm: "1fr", lg: "1.6fr 1.2fr" }}>
				<Transactions
          title={"Транзакции"}
          date={"23 - 30 Марта"}
          newestTransactions={newestTransactions}
          olderTransactions={olderTransactions}
        />
        {/* <BillingInformation title={"Billing Information"} data={billingData} /> */}
      </Grid>
    </Flex>
  );
}

export default Billing;
