/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				recode: {
					ink: '#151928',
					primary: '#005de0',
					surface: '#f8f9fa',
				},
			},
			boxShadow: {
				glass: '0 7px 23px rgba(0, 0, 0, 0.05)',
			},
			backgroundImage: {
				'recode-grid':
					'linear-gradient(to right, rgba(0, 93, 224, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 93, 224, 0.08) 1px, transparent 1px)',
			},
		},
	},
	plugins: [],
};
