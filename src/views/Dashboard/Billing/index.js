import { Flex, Grid, GridItem } from '@chakra-ui/react';
import BackgroundCard1 from 'assets/img/BackgroundCard1.png';
import { useEffect, useState } from 'react';
import { getCurrentUser } from 'services/auth';
import { newestTransactions, olderTransactions } from 'variables/general';
import Documents from './components/Documents';
import OtherTariffs from './components/OtherTariffs';
import PaymentMethod from './components/PaymentMethod';
import TariffCard from './components/TariffCard';
import Transactions from './components/Transactions';
import useMonthlySpendingReports from './useMonthlySpendingReports';
import useTariffData from './useTariffData';

function canViewOrganizationReports(user) {
	return user?.has_organization === true && user?.organization_role === 'director';
}

function Billing() {
	const { currentTariff, otherTariffs, isLoading, error, reload } = useTariffData();
	const [currentUser, setCurrentUser] = useState(null);
	const showReports = canViewOrganizationReports(currentUser);
	const {
		reports,
		isLoading: isLoadingReports,
		error: reportsError,
		reload: reloadReports,
	} = useMonthlySpendingReports(showReports);

	useEffect(() => {
		let isMounted = true;

		getCurrentUser()
			.then((user) => {
				if (isMounted) {
					setCurrentUser(user);
				}
			})
			.catch(() => {
				if (isMounted) {
					setCurrentUser(null);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<Flex direction="column" pt={{ base: '120px', md: '75px' }} mb="100px">
			<Grid
				templateColumns={{ base: '1fr', xl: showReports ? '2fr 1fr' : '1fr' }}
				templateRows="auto"
				alignItems="stretch"
				gap="24px"
				minH={{ base: 'auto', xl: 'calc(100vh - 95px)' }}
			>
				<GridItem minH="0" display="flex" flexDirection="column" gap="24px">
					<Grid
						templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
						templateRows={{
							base: 'auto auto auto',
							lg: 'auto auto',
							xl: 'minmax(0, 4fr) minmax(0, 5fr)',
						}}
						templateAreas={{
							base: `"tariff" "others" "transactions"`,
							lg: `"tariff others" "transactions transactions"`,
							xl: `"tariff transactions" "others transactions"`,
						}}
						alignItems="stretch"
						gap="26px"
						h={{ base: 'auto', xl: '600px' }}
					>
						<GridItem area="tariff" minH="0">
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
						<GridItem area="others" minH="0">
							<OtherTariffs
								tariffs={otherTariffs}
								isLoading={isLoading}
								error={error}
								onRetry={reload}
							/>
						</GridItem>
						<GridItem area="transactions" minH="0" h={{ base: 'auto', xl: '100%' }}>
							<Transactions
								title="Транзакции"
								date="23 - 30 Марта"
								newestTransactions={newestTransactions}
								olderTransactions={olderTransactions}
							/>
						</GridItem>
					</Grid>
					<PaymentMethod title="Способ оплаты" />
				</GridItem>

				{showReports ? (
					<GridItem minH="0" display="flex">
						<Documents
							title="Отчеты"
							data={reports}
							isLoading={isLoadingReports}
							error={reportsError}
							onRetry={reloadReports}
						/>
					</GridItem>
				) : null}
			</Grid>
		</Flex>
	);
}

export default Billing;
