import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import BackgroundCard1 from 'assets/img/BackgroundCard1.png';
import PaymentMethod from 'views/Dashboard/Billing/components/PaymentMethod';
import TariffCard from 'views/Dashboard/Billing/components/TariffCard';
import useTariffData from 'views/Dashboard/Billing/useTariffData';
import OtherTariffs from './components/OtherTariffs';

function Tariff() {
	const { currentTariff, otherTariffs, isLoading, error, reload } = useTariffData();

	return (
		<Flex direction="column" pt={{ base: '120px', md: '75px' }} minH="100vh">
			<Box w="100%">
				<Grid
					templateColumns={{ base: '1fr', xl: 'minmax(0, 420px) minmax(0, 1fr)' }}
					templateRows={{ base: 'auto auto auto', xl: 'auto auto' }}
					templateAreas={{
						base: `"tariff" "others" "payment"`,
						xl: `"tariff others" "payment payment"`,
					}}
					alignItems="stretch"
					gap="24px"
				>
					<GridItem area="tariff" minW="0">
						<TariffCard
							backgroundImage={BackgroundCard1}
							title={currentTariff.title}
							tariffName={currentTariff.tariffName}
							validUntil={currentTariff.validUntil}
							tokenBalance={currentTariff.tokenBalance}
							monthlyCost={currentTariff.monthlyCost}
							statusLabel={currentTariff.statusLabel}
							statusColor={currentTariff.statusColor}
						/>
					</GridItem>
					<GridItem area="others" minW="0">
						<OtherTariffs
							title="Тарифные пакеты"
							tariffs={otherTariffs}
							isLoading={isLoading}
							error={error}
							onRetry={reload}
						/>
					</GridItem>
					<GridItem area="payment" minW="0" w="100%">
						<PaymentMethod title={'Способ оплаты'} />
					</GridItem>
				</Grid>
			</Box>
		</Flex>
	);
}

export default Tariff;
