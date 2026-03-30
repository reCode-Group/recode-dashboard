// Chakra imports
import { Flex, Grid, GridItem } from '@chakra-ui/react';
// Assets
import BackgroundCard1 from 'assets/img/BackgroundCard1.png';
import { invoicesData, newestTransactions, olderTransactions } from 'variables/general';
import Invoices from './components/Invoices';
import OtherTariffs from './components/OtherTariffs';
import PaymentMethod from './components/PaymentMethod';
import TariffCard from './components/TariffCard';
import Transactions from './components/Transactions';

function Billing() {
	return (
		<Flex direction="column" pt={{ base: '120px', md: '75px' }} mb="100px">
			<Grid
				templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
				templateRows="auto"
				alignItems="stretch"
				gap="24px"
				minH={{ base: 'auto', lg: 'calc(100vh - 95px)' }}
			>
				<GridItem minH="0" display="flex" flexDirection="column" gap="24px">
					<Grid
						templateColumns={{ base: '1fr', md: '1fr 1fr' }}
						templateRows={{
							base: 'auto auto auto',
							md: 'auto auto',
							lg: 'minmax(0, 4fr) minmax(0, 5fr)',
						}}
						templateAreas={{
							base: `"tariff" "others" "transactions"`,
							md: `"tariff others" "transactions transactions"`,
							lg: `"tariff transactions" "others transactions"`,
						}}
						alignItems="stretch"
						gap="26px"
						h={{ base: 'auto', lg: '600px' }}
					>
						<GridItem area="tariff" minH="0">
							<TariffCard
								backgroundImage={BackgroundCard1}
								title={'Ваш тариф'}
								tariffName={'БАЗОВЫЙ'}
								validUntil={{
									name: 'ДЕЙСТВИТЕЛЕН ДО',
									data: '25.11.2025',
								}}
								tokenBalance={{
									name: 'ОСТАТОК ТОКЕНОВ',
									code: '1 100 / 10 000',
								}}
								monthlyCost={{
									name: 'СТОИМОСТЬ',
									code: '20 000 ₽/мес.',
								}}
							/>
						</GridItem>
						<GridItem area="others" minH="0">
							<OtherTariffs />
						</GridItem>
						<GridItem area="transactions" minH="0" h={{ base: 'auto', lg: '100%' }}>
							<Transactions
								title={'Транзакции'}
								date={'23 - 30 Марта'}
								newestTransactions={newestTransactions}
								olderTransactions={olderTransactions}
							/>
						</GridItem>
					</Grid>
					<PaymentMethod title={'Способ оплаты'} />
				</GridItem>

				<GridItem minH="0" display="flex">
					<Invoices title={'Отчеты'} data={invoicesData} />
				</GridItem>
			</Grid>
		</Flex>
	);
}

export default Billing;
