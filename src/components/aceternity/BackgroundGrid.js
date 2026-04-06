import { cn } from 'lib/cn';

export default function BackgroundGrid({ className }) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				'pointer-events-none absolute inset-x-0 top-0 -z-20 h-[620px] bg-recode-grid bg-[size:38px_38px] opacity-60',
				className
			)}
		/>
	);
}
