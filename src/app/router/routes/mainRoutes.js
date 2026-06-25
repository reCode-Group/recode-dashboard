import { routePaths } from '../routePaths';
import { lazyRouteElement } from '../lazyRouteElement';

export const mainRoutes = [
	{ path: routePaths.home(), element: lazyRouteElement(() => import('views/Main/Landing')) },
	{
		path: routePaths.public.documentation(),
		element: lazyRouteElement(() => import('views/Main/Documentation')),
	},
	{ path: routePaths.public.blog(), element: lazyRouteElement(() => import('views/Main/Blog')) },
	{
		path: routePaths.public.blogArticle(),
		element: lazyRouteElement(() => import('views/Main/Blog/Article')),
	},
	{ path: routePaths.public.contacts(), element: lazyRouteElement(() => import('views/Main/Contacts')) },
	{
		path: routePaths.public.privacyPolicy(),
		element: lazyRouteElement(() => import('views/Main/Legal/PrivacyPolicy')),
	},
	{
		path: routePaths.public.publicOffer(),
		element: lazyRouteElement(() => import('views/Main/Legal/PublicOffer')),
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
