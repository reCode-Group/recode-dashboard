import { cn } from 'lib/cn';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

export default function FloatingNav({ items }) {
	return (
		<motion.nav
			initial={{ opacity: 0, y: -12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className={cn(
				'sticky top-3 z-40 mx-auto w-full max-w-[1060px] rounded-2xl border border-white/90',
				'bg-white/80 px-4 py-3 shadow-glass backdrop-blur-lg md:px-6'
			)}
		>
			<div className="flex items-center justify-between gap-4">
				<NavLink to="/main/landing" className="shrink-0">
					<img
						src={require('assets/svg/recode-logo-colored.svg').default}
						alt="reCode"
						className="h-8 w-auto md:h-9"
					/>
				</NavLink>

				<div className="hidden items-center gap-5 md:flex">
					{items.map((item) => (
						<a
							key={item.label}
							href={item.href}
							className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700 transition-colors hover:text-[#005de0]"
						>
							{item.label}
						</a>
					))}
				</div>

				<NavLink
					to="/admin/dashboard"
					className="rounded-full bg-gradient-to-r from-[#313860] to-[#151928] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white md:px-6"
				>
					Личный кабинет
				</NavLink>
			</div>
		</motion.nav>
	);
}
