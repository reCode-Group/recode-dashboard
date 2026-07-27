import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import BackgroundCard1 from 'assets/img/BackgroundCard1.png';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser } from 'services/auth';
import PaymentMethod, {
	AccountFundingSwitcher,
	PAYMENT_METHODS,
} from 'views/Dashboard/Billing/components/PaymentMethod';
import TariffCard from 'views/Dashboard/Billing/components/TariffCard';
import useTariffData from 'views/Dashboard/Billing/useTariffData';
import OtherTariffs from './components/OtherTariffs';

const ACCOUNT_TYPES = {
	PERSONAL: 'personal',
	ORGANIZATION: 'organization',
};

function canUseStatementPayment(user) {
	return (
		user?.has_organization === true &&
		user?.organization_role === 'director' &&
		user?.organization_status === 'active'
	);
}

function Tariff() {
	const { currentTariff, otherTariffs, isLoading, error, reload } = useTariffData();
	const [currentUser, setCurrentUser] = useState(null);
	const [accountType, setAccountType] = useState(ACCOUNT_TYPES.PERSONAL);
	const canUseOrganizationAccount = canUseStatementPayment(currentUser);
	const isOrganizationAccount = accountType === ACCOUNT_TYPES.ORGANIZATION;
	const paymentMethods = useMemo(
		() =>
			canUseOrganizationAccount && isOrganizationAccount
				? [PAYMENT_METHODS.statement]
				: [PAYMENT_METHODS.tbank],
		[canUseOrganizationAccount, isOrganizationAccount]
	);
	const accountOptions = useMemo(
		() =>
			canUseOrganizationAccount
				? [
						{ id: ACCOUNT_TYPES.PERSONAL, label: 'Личный' },
						{ id: ACCOUNT_TYPES.ORGANIZATION, label: 'Организация' },
				  ]
				: [],
		[canUseOrganizationAccount]
	);

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

	useEffect(() => {
		if (!canUseOrganizationAccount && accountType !== ACCOUNT_TYPES.PERSONAL) {
			setAccountType(ACCOUNT_TYPES.PERSONAL);
		}
	}, [accountType, canUseOrganizationAccount]);

	return (
		<Flex direction="column" pt={{ base: '120px', md: '75px' }} minH="100vh">
			<Box w="100%">
				<AccountFundingSwitcher
					options={accountOptions}
					value={accountType}
					onChange={setAccountType}
					title="Счёт для пополнения"
					description="Выберите, на какой баланс будут зачисляться купленные токены"
				/>
				<Grid
					mt={accountOptions.length > 1 ? '20px' : '0'}
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
							title="Пакеты"
							tariffs={otherTariffs}
							isLoading={isLoading}
							error={error}
							onRetry={reload}
						/>
					</GridItem>
					<GridItem area="payment" minW="0" w="100%">
						<PaymentMethod
							title="Способ оплаты"
							methods={paymentMethods}
							defaultValue="tbank"
							accountType={accountType}
						/>
					</GridItem>
				</Grid>
			</Box>
		</Flex>
	);
}

export default Tariff;
