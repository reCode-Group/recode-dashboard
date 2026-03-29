// Chakra imports
import { Box, Flex, Grid } from '@chakra-ui/react';
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
		<Flex direction="column" pt={{ base: '120px', md: '75px' }}>
			<Grid templateColumns={{ sm: '1fr', lg: '2fr 1fr' }} templateRows="1fr">
				<Box>
					<Grid
						templateColumns={{
							base: '1fr',
							lg: '1fr 1fr',
						}}
						templateRows={{ base: 'auto', lg: 'auto auto' }}
						alignItems="stretch"
						gap="26px"
					>
						<Box gridColumn={{ base: '1', lg: '1' }} gridRow={{ base: 'auto', lg: '1' }}>
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
						</Box>
						<Box gridColumn={{ base: '1', lg: '1' }} gridRow={{ base: 'auto', lg: '2' }}>
							<OtherTariffs />
						</Box>
						<Box gridColumn={{ base: '1', lg: '2' }} gridRow={{ base: 'auto', lg: '1 / span 2' }}>
							<Transactions
								title={'Транзакции'}
								date={'23 - 30 Марта'}
								newestTransactions={newestTransactions}
								olderTransactions={olderTransactions}
							/>
						</Box>
					</Grid>
					<PaymentMethod title={'Способ оплаты'} />
				</Box>
				<Invoices title={'Отчеты'} data={invoicesData} />
			</Grid>
		</Flex>
	);
}

export default Billing;
