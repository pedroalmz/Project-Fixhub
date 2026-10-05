import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Check, ImageIcon, type LucideIcon } from 'lucide-react'
import { MODE_LABEL, QUOTE_LABEL, QUOTE_TONE, STATUS_LABEL, STATUS_ORDER, STATUS_TIMELINE_LABEL, STATUS_TONE, type Tone } from '../../lib/format'
import type { QuoteStatus, ServiceMode, TicketStatus } from '../../data/types'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

/* ---------- Button ---------- */
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
const variants: Record<Variant, string> = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-white text-red-700 border border-red-200 hover:bg-red-50',
}
const btnBase = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

export function Button({ variant = 'primary', className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cx(btnBase, variants[variant], className)} {...p} />
}
export function ButtonLink({ variant = 'primary', className, ...p }: LinkProps & { variant?: Variant }) {
  return <Link className={cx(btnBase, variants[variant], className)} {...p} />
}

/* ---------- Badge ---------- */
const tones: Record<Tone, string> = {
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  blue: 'bg-sky-50 text-sky-700 ring-sky-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
}
export function Badge({ tone = 'slate', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cx('inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', tones[tone])}>{children}</span>
}
export const StatusBadge = ({ status }: { status: TicketStatus }) => <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
export const QuoteBadge = ({ status }: { status: QuoteStatus }) => <Badge tone={QUOTE_TONE[status]}>{QUOTE_LABEL[status]}</Badge>
export const ModeBadge = ({ mode }: { mode: ServiceMode }) => <Badge tone={mode === 'remoto' ? 'blue' : 'slate'}>{MODE_LABEL[mode]}</Badge>

/* ---------- Layout blocks ---------- */
export function Card({ title, action, children, className, padded = true }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; padded?: boolean }) {
  return (
    <section className={cx('rounded-xl border border-slate-200 bg-white shadow-sm', className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {action}
        </header>
      )}
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </section>
  )
}

export function PageHeader({ title, subtitle, actions, back }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; back?: ReactNode }) {
  return (
    <div className="mb-8">
      {back && <div className="mb-3 text-sm">{back}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export function Stat({ label, value, hint, icon: Icon }: { label: string; value: ReactNode; hint?: string; icon?: LucideIcon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-5 w-5 text-slate-500" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/* ---------- Table (vira lista de cartões no mobile via overflow) ---------- */
export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-5 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  )
}
export const Td = ({ children, className }: { children?: ReactNode; className?: string }) => <td className={cx('px-5 py-3.5 align-middle', className)}>{children}</td>

/* ---------- Forms ---------- */
const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10'
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}
export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input className={field} {...p} />
export const Textarea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={cx(field, 'min-h-28')} {...p} />
export const Select = (p: SelectHTMLAttributes<HTMLSelectElement>) => <select className={field} {...p} />

/* ---------- Timeline ---------- */
export function StatusTimeline({ status }: { status: TicketStatus }) {
  const current = STATUS_ORDER.indexOf(status)
  return (
    <ol>
      {STATUS_ORDER.map((s, i) => {
        const done = i < current || status === 'finalizado'
        const active = i === current && status !== 'finalizado'
        return (
          <li key={s} className="relative flex gap-3 pb-6 last:pb-0">
            {i < STATUS_ORDER.length - 1 && <span className={cx('absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-px', done ? 'bg-slate-900' : 'bg-slate-200')} />}
            <span
              className={cx(
                'z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs',
                done && 'border-slate-900 bg-slate-900 text-white',
                active && 'border-slate-900 bg-white ring-4 ring-slate-900/10',
                !done && !active && 'border-slate-300 bg-white',
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : active ? <span className="h-2 w-2 rounded-full bg-slate-900" /> : null}
            </span>
            <div className="pt-0.5">
              <p className={cx('text-sm', active ? 'font-semibold text-slate-900' : done ? 'font-medium text-slate-700' : 'text-slate-400')}>{STATUS_TIMELINE_LABEL[s]}</p>
              {active && <p className="text-xs text-slate-500">Etapa atual</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/* ---------- Foto (mock: sem imagens reais) ---------- */
export function PhotoTile({ caption, url }: { caption: string; url?: string }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-slate-200">
      {url ? (
        <img src={url} alt={caption} className="h-28 w-full object-cover" />
      ) : (
        <div className="flex h-28 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
          <ImageIcon className="h-6 w-6 text-slate-400" />
        </div>
      )}
      <figcaption className="truncate px-2.5 py-1.5 text-xs text-slate-600">{caption}</figcaption>
    </figure>
  )
}

export function KeyValue({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map((i) => (
        <div key={i.label}>
          <dt className="text-xs text-slate-500">{i.label}</dt>
          <dd className="mt-0.5 text-sm font-medium text-slate-900">{i.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  return <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">{initials}</span>
}
