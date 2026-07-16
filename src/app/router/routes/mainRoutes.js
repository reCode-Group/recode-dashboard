import { routePaths } from '../routePaths';
import { lazyRouteElement } from '../lazyRouteElement';
import { RequireMacroConstructorAccess } from '../ui/RequireMacroConstructorAccess';

export const mainRoutes = [
	{
		path: routePaths.public.documentation(),
		element: lazyRouteElement(() => import('views/Main/Documentation')),
	},
	{
		element: <RequireMacroConstructorAccess />,
		children: [
			{
				path: routePaths.public.macroConstructor(),
				element: lazyRouteElement(() => import('features/macroConstructor/MacroConstructorPage')),
			},
		],
	},
	{
		path: routePaths.public.macroTranslator(),
		element: lazyRouteElement(() => import('views/Main/MacroTranslator')),
	},
];
