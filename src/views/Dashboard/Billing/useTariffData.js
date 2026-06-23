import { useCallback, useEffect, useState } from 'react';
import { getTokenPackages, getUserSubscription } from 'services/subscription';
import {
	buildCurrentTariffCardData,
	isNoSubscriptionError,
	normalizeTokenPackages,
} from 'utils/subscription';

const defaultTariffState = {
	currentTariff: buildCurrentTariffCardData(null),
	otherTariffs: [],
	isLoading: true,
	error: '',
};

function getErrorMessage(error) {
	return error?.message || 'Не удалось загрузить тарифы';
}

export default function useTariffData() {
	const [state, setState] = useState(defaultTariffState);

	const loadTariffs = useCallback(async () => {
		setState((prevState) => ({
			...prevState,
			isLoading: true,
			error: '',
		}));

		try {
			const [packagesPayload, subscriptionResult] = await Promise.allSettled([
				getTokenPackages(),
				getUserSubscription(),
			]);

			if (packagesPayload.status !== 'fulfilled') {
				throw packagesPayload.reason;
			}

			const tokenPackages = normalizeTokenPackages(packagesPayload.value);
			if (
				subscriptionResult.status === 'rejected' &&
				!isNoSubscriptionError(subscriptionResult.reason)
			) {
				throw subscriptionResult.reason;
			}

			const subscription =
				subscriptionResult.status === 'fulfilled' ? subscriptionResult.value : null;

			const currentPackageName = subscription?.package_name || '';
			const otherTariffs = tokenPackages.filter((item) => item?.name !== currentPackageName);

			setState({
				currentTariff: buildCurrentTariffCardData(subscription),
				otherTariffs,
				isLoading: false,
				error: '',
			});
		} catch (error) {
			setState({
				currentTariff: buildCurrentTariffCardData(null),
				otherTariffs: [],
				isLoading: false,
				error: getErrorMessage(error),
			});
		}
	}, []);

	useEffect(() => {
		loadTariffs();
	}, [loadTariffs]);

	return {
		...state,
		reload: loadTariffs,
	};
}
