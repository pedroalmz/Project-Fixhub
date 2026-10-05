import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowLeftRight, Bell, Menu, Wrench, X, type LucideIcon } from 'lucide-react'
import { useStore } from '../../data/store'
import { CURRENT_TECHNICIAN } from '../../data/mock'
import { Avatar } from '../ui'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
        <Wrench className="h-4 w-4" />
      </span>
      <span className={`text-lg font-semibold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>FixHub</span>
    </Link>
  )
}

export function AppShell({ role, nav }: { role: 'cliente' | 'tecnico'; nav: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const { notifications, actions, currentCustomer } = useStore()
  const [showNotifs, setShowNotifs] = useState(false)
  const location = useLocation()
  const mine = notifications.filter((n) => n.to === role)
  const unread = mine.filter((n) => !n.read).length
  const user = role === 'cliente' ? { name: currentCustomer.name, sub: 'Cliente' } : { name: CURRENT_TECHNICIAN.name, sub: CURRENT_TECHNICIAN.business }
  const other = role === 'cliente' ? { to: '/tecnico', label: 'Ver como técnico' } : { to: '/app', label: 'Ver como cliente' }

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo />
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu"><X className="h-5 w-5 text-slate-500" /></button>
      </div>
      <div className="px-5 pb-2 pt-2 text-xs font-medium uppercase tracking-wide text-slate-400">{role === 'cliente' ? 'Área do cliente' : 'Área do técnico'}</div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
            }
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <Link to={other.to} className="mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50">
          <ArrowLeftRight className="h-3.5 w-3.5" /> {other.label} <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase">demo</span>
        </Link>
        <div className="flex items-center gap-3 px-3">
          <Avatar name={user.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.sub}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-xl">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-8">
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu className="h-5 w-5" /></button>
          <div className="hidden text-sm text-slate-500 lg:block">Sexta-feira, 02 de outubro de 2026</div>
          <div className="relative">
            <button
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              onClick={() => setShowNotifs((v) => !v)}
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold text-white">{unread}</span>}
            </button>
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <span className="text-sm font-semibold">Notificações</span>
                  <button className="text-xs text-slate-500 hover:text-slate-900" onClick={() => actions.markNotificationsRead(role)}>Marcar como lidas</button>
                </div>
                <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                  {mine.map((n) => (
                    <li key={n.id} className="flex gap-3 px-4 py-3 text-sm">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-slate-900'}`} />
                      <span className={n.read ? 'text-slate-500' : 'text-slate-800'}>{n.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </header>
        <main key={location.pathname} className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
