'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useDialogBehavior } from '../ModalShell';

/* ---------- Toasts and confirm dialogs, shared by every dashboard section ---------- */

type Tone = 'success' | 'error';
interface Toast {
  id: number;
  tone: Tone;
  message: string;
}
interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

interface AdminUiValue {
  notify: (message: string, tone?: Tone) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const AdminUiContext = createContext<AdminUiValue | null>(null);

export const useAdminUi = () => {
  const ctx = useContext(AdminUiContext);
  if (!ctx) throw new Error('useAdminUi must be used inside AdminUiProvider');
  return ctx;
};

const ConfirmDialog: React.FC<{ options: ConfirmOptions; onClose: (ok: boolean) => void }> = ({ options, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehavior(true, () => onClose(false), panelRef);
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(false);
      }}
    >
      <motion.div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        tabIndex={-1}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        className="w-full max-w-md rounded-panel bg-white p-6 text-[#111113] shadow-2xl focus:outline-none dark:bg-[#151517] dark:text-white"
      >
        <div className="flex items-start gap-3">
          {options.danger && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">
              <AlertTriangle className="h-5 w-5" />
            </span>
          )}
          <div>
            <h2 id="confirm-title" className="font-display text-lg font-bold">
              {options.title}
            </h2>
            <p id="confirm-message" className="mt-1.5 text-base text-muted">
              {options.message}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => onClose(false)} className="rounded-control border ui-divider px-5 py-3 text-sm font-bold cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onClose(true)}
            className={`rounded-control px-5 py-3 text-sm font-bold cursor-pointer ${options.danger ? 'bg-signal text-white hover:bg-[#b81f27]' : 'btn-theme'}`}
          >
            {options.confirmLabel ?? 'Confirm'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const AdminUiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pending, setPending] = useState<{ options: ConfirmOptions; resolve: (ok: boolean) => void } | null>(null);

  const notify = useCallback((message: string, tone: Tone = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, tone, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === 'error' ? 7000 : 4000);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => setPending({ options, resolve })), []);

  return (
    <AdminUiContext.Provider value={{ notify, confirm }}>
      {children}

      {/* Sits above the phone tab bar, top-right on desktop. */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-3 bottom-24 z-[95] flex flex-col items-center gap-2 lg:inset-x-auto lg:bottom-auto lg:right-6 lg:top-6 lg:items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-panel bg-[#111113] px-4 py-3 text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10"
              role={t.tone === 'error' ? 'alert' : 'status'}
            >
              {t.tone === 'error' ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-signal" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />}
              <span className="flex-1">{t.message}</span>
              <button
                type="button"
                onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
                className="-mr-1 rounded p-0.5 text-white/60 hover:text-white cursor-pointer"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {pending && (
          <ConfirmDialog
            options={pending.options}
            onClose={(ok) => {
              pending.resolve(ok);
              setPending(null);
            }}
          />
        )}
      </AnimatePresence>
    </AdminUiContext.Provider>
  );
};

/* ---------- Layout primitives ---------- */

export const Panel: React.FC<{ title?: string; description?: string; action?: React.ReactNode; className?: string; children: React.ReactNode }> = ({
  title,
  description,
  action,
  className = '',
  children,
}) => (
  <section className={`rounded-panel border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6 dark:border-white/10 dark:bg-[#121214] ${className}`}>
    {(title || action) && (
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {title && <h2 className="font-display text-lg font-bold">{title}</h2>}
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; count?: number }[];
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto rounded-control bg-black/[0.05] p-1 [scrollbar-width:none] dark:bg-white/[0.06]">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[3px] px-3 py-2 text-sm font-bold transition-colors cursor-pointer ${
              active ? 'bg-white text-[#111113] shadow-sm dark:bg-white/15 dark:text-white' : 'text-muted hover:text-[#111113] dark:hover:text-white'
            }`}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={`rounded-full px-1.5 text-xs tabular-nums ${active ? 'bg-black/[0.07] dark:bg-white/15' : 'bg-black/[0.05] dark:bg-white/10'}`}>{o.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export const EmptyState: React.FC<{ icon: React.ElementType; title: string; message: string; action?: React.ReactNode }> = ({ icon: Icon, title, message, action }) => (
  <div className="flex flex-col items-center px-6 py-14 text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/[0.05] dark:bg-white/[0.08]">
      <Icon className="h-5 w-5 text-muted" />
    </span>
    <p className="mt-4 font-display text-lg font-bold">{title}</p>
    <p className="mt-1 max-w-sm text-base text-muted">{message}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);