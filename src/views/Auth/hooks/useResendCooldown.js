import { useCallback, useEffect, useState } from 'react';

function useResendCooldown(durationSeconds = 30) {
	const [remainingSeconds, setRemainingSeconds] = useState(0);

	useEffect(() => {
		if (remainingSeconds <= 0) {
			return undefined;
		}

		const timeoutId = window.setTimeout(() => {
			setRemainingSeconds((current) => Math.max(0, current - 1));
		}, 1000);

		return () => window.clearTimeout(timeoutId);
	}, [remainingSeconds]);

	const startCooldown = useCallback(() => {
		setRemainingSeconds(durationSeconds);
	}, [durationSeconds]);

	const resetCooldown = useCallback(() => {
		setRemainingSeconds(0);
	}, []);

	return {
		remainingSeconds,
		isCoolingDown: remainingSeconds > 0,
		startCooldown,
		resetCooldown,
	};
}

export default useResendCooldown;
