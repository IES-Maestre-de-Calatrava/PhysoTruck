import { motion } from 'framer-motion';

export function SidebarItem({ icon, label, active, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className={[
        'group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition',
        active
          ? 'bg-blue-600/10 text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-200'
          : 'text-slate-600 hover:bg-blue-600/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-cyan-400/10 dark:hover:text-slate-100',
      ].join(' ')}
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600/10 text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-200">
        {icon}
      </span>
      <span className="text-sm font-semibold">{label}</span>
    </motion.button>
  );
}

