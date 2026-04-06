import { cn } from 'lib/cn';

export function BentoGrid({ className, children }) {
	return <div className={cn('grid gap-6 md:grid-cols-2', className)}>{children}</div>;
}

export function BentoCard({ className, children }) {
	return (
		<div
			className={cn(
				'rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.45)]',
				className
			)}
		>
			{children}
		</div>
	);
}
