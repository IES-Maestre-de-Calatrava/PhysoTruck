import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { SidebarItem } from './SidebarItem';

function Icon({ name }) {
  return (
    <span className="material-symbols-outlined text-[20px] leading-none">
      {name}
    </span>
  );
}

export function Sidebar({ activeKey, onNavigate }) {
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useMemo(
    () => ([
      { key: 'dashboard', label: 'Dashboard', icon: <Icon name="dashboard" /> },
      { key: 'patients', label: 'Pacientes', icon: <Icon name="group" /> },
      { key: 'reports', label: 'Informes', icon: <Icon name="assessment" /> },
      { key: 'agenda', label: 'Agenda', icon: <Icon name="calendar_today" /> },
    ]),
    [],
  );

  function navigate(key) {
    onNavigate?.(key);
    setMobileOpen(false);
  }

  return (
    <>
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Icon name="health_and_safety" />
            </div>
            <div>
              <div className="font-display text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                PhysioTrack
              </div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Deep Ocean & Cyan UI
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-lg shadow-blue-500/10 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-cyan-500/15 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">
                PT
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                  Dr. Sarah Miller
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  CLINICAL LEAD · Clinic A-12
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-5">
          {items.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeKey === item.key}
              onClick={() => navigate(item.key)}
            />
          ))}
        </nav>

        <div className="px-5 py-5">
          <SidebarItem
            icon={<Icon name="settings" />}
            label="Configuración"
            active={activeKey === 'settings'}
            onClick={() => navigate('settings')}
          />
          <button type="button" className="mt-3 w-full pt-btn-ghost" onClick={toggleTheme}>
            <Icon name={isDark ? 'light_mode' : 'dark_mode'} />
            {isDark ? 'Modo claro' : 'Modo oscuro'}
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-[#000]/40"
              onClick={() => setMobileOpen(false)}
              role="presentation"
            />
            <motion.div
              className="absolute left-0 top-0 h-full w-72 border-r border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="font-display text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  PhysioTrack
                </div>
                <button type="button" className="pt-btn-ghost" onClick={() => setMobileOpen(false)}>
                  <Icon name="close" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <SidebarItem
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    active={activeKey === item.key}
                    onClick={() => navigate(item.key)}
                  />
                ))}
              </div>

              <button type="button" className="mt-4 w-full pt-btn-ghost" onClick={toggleTheme}>
                <Icon name={isDark ? 'light_mode' : 'dark_mode'} />
                {isDark ? 'Modo claro' : 'Modo oscuro'}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

