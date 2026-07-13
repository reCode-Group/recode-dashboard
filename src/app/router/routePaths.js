export const routePaths = {
	home: () => '/lk/dashboard',
	auth: {
		root: () => '/auth',
		login: () => '/auth/login-page',
		signUp: () => '/auth/sign-up',
	},
	dashboard: {
		root: () => '/lk',
		home: () => '/lk/dashboard',
		profile: () => '/lk/profile',
		profileComplete: () => '/lk/profile/complete',
		company: () => '/lk/company',
		companyRegistration: () => '/lk/company/reg',
		employees: () => '/lk/employees',
		billing: () => '/lk/billing',
		billingPay: () => '/lk/billing/pay',
		support: () => '/lk/support',
		tariff: () => '/lk/tariff',
		conversionHistory: () => '/lk/conversion-history',
	},
	public: {
		documentation: () => '/documentation',
		macroConstructor: () => '/constructor',
		macroTranslator: () => '/translator',
	},
	legacy: {
		main: () => '/main',
		admin: () => '/admin',
	},
};
