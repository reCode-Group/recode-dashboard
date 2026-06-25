import { Box, Spinner } from '@chakra-ui/react';
import { Suspense, lazy } from 'react';

function RouteFallback() {
	return (
		<Box minH="50vh" display="flex" alignItems="center" justifyContent="center">
			<Spinner color="recode.300" size="xl" />
		</Box>
	);
}

export function lazyRouteElement(loader) {
	const LazyComponent = lazy(loader);

	return (
		<Suspense fallback={<RouteFallback />}>
			<LazyComponent />
		</Suspense>
	);
}
