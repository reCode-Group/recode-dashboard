import { useCallback, useEffect, useState } from 'react';
import { getOrganizationMonthlySpending } from 'services/organization';
import { normalizeMonthlySpendingReports } from 'utils/monthlySpendingReports';

const defaultState = {
	reports: [],
	isLoading: false,
	error: '',
};

export default function useMonthlySpendingReports(enabled) {
	const [state, setState] = useState(defaultState);

	const loadReports = useCallback(async () => {
		if (!enabled) {
			setState(defaultState);
			return;
		}

		setState((prevState) => ({
			...prevState,
			isLoading: true,
			error: '',
		}));

		try {
			const payload = await getOrganizationMonthlySpending();
			setState({
				reports: normalizeMonthlySpendingReports(payload),
				isLoading: false,
				error: '',
			});
		} catch (error) {
			setState({
				reports: [],
				isLoading: false,
				error: error?.message || 'Не удалось загрузить отчеты',
			});
		}
	}, [enabled]);

	useEffect(() => {
		loadReports();
	}, [loadReports]);

	return {
		...state,
		reload: loadReports,
	};
}
