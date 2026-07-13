import { routePaths } from '../routePaths';
import { lazyRouteElement } from '../lazyRouteElement';

export const mainRoutes = [
	{
		path: routePaths.public.documentation(),
		element: lazyRouteElement(() => import('views/Main/Documentation')),
	},
	{
		path: routePaths.public.macroConstructor(),
		element: lazyRouteElement(() => import('features/macroConstructor/MacroConstructorPage')),
	},
	{
		path: routePaths.public.macroTranslator(),
		element: lazyRouteElement(() => import('views/Main/MacroTranslator')),
	},
];
