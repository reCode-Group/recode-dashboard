import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import BackgroundCard1 from 'assets/img/BackgroundCard1.png';
import OtherTariffs from 'views/Dashboard/Billing/components/OtherTariffs';
import PaymentMethod from 'views/Dashboard/Billing/components/PaymentMethod';
import TariffCard from 'views/Dashboard/Billing/components/TariffCard';

function Tariff() {
	return (
		<Flex direction="column" pt={{ base: '120px', md: '75px' }} minH="100vh">
			<Box w={{ base: '100%', lg: '70%' }}>
				<Grid
					templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
					templateRows={{ base: 'auto auto auto', lg: 'auto auto' }}
					templateAreas={{
						base: `"tariff" "others" "payment"`,
						lg: `"tariff others" "payment payment"`,
					}}
					gap="24px"
				>
					<GridItem area="tariff">
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
					<GridItem area="others">
						<OtherTariffs />
					</GridItem>
					<GridItem area="payment">
						<PaymentMethod title={'Способ оплаты'} />
					</GridItem>
				</Grid>
			</Box>
		</Flex>
	);
}

export default Tariff;
