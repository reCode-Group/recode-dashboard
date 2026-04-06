import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export default function FAQAccordion({ items }) {
	const [activeId, setActiveId] = useState(items[0]?.id ?? null);

	return (
		<div className="space-y-4">
			{items.map((item) => {
				const isActive = activeId === item.id;
				return (
					<div key={item.id} className="rounded-3xl bg-slate-200/80 px-6 py-5">
						<button
							type="button"
							onClick={() => setActiveId(isActive ? null : item.id)}
							className="flex w-full items-center justify-between gap-6 text-left"
						>
							<span className="text-lg font-semibold text-[rgba(21,25,40,0.9)] md:text-xl">
								{item.question}
							</span>
							<span className="inline-flex size-8 items-center justify-center rounded-full bg-[#005de0] text-white">
								{isActive ? '−' : '+'}
							</span>
						</button>
						<AnimatePresence initial={false}>
							{isActive && (
								<motion.p
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.2 }}
									className="overflow-hidden pt-4 text-sm leading-relaxed text-slate-600"
								>
									{item.answer}
								</motion.p>
							)}
						</AnimatePresence>
					</div>
				);
			})}
		</div>
	);
}
