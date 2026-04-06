import { cn } from 'lib/cn';

export default function Spotlight({ className }) {
	return (
		<div
			className={cn(
				'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
				className
			)}
			aria-hidden="true"
		>
			<div className="absolute left-1/2 top-0 h-[540px] w-[840px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,93,224,0.16),rgba(0,93,224,0.02)_50%,transparent_75%)]" />
			<div className="absolute left-0 top-8 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(21,25,40,0.08),transparent_70%)]" />
		</div>
	);
}
