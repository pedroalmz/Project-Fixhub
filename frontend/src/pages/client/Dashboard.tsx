import { Link } from 'react-router-dom'
import { Bell, CalendarDays, FileText, Laptop, LifeBuoy, Plus } from 'lucide-react'
import { useStore } from '../../data/store'
import { Button, ButtonLink, Card, EmptyState, ModeBadge, PageHeader, Stat } from '../../components/ui'
import { TicketLink, useLookups } from '../../components/shared'
import { fmtDate, fmtDateTime, TODAY } from '../../lib/format'

export default function ClientDashboard() {
  const { tickets, devices, appointments, notifications, quotes, currentCustomer, actions } = useStore()
  const { device } = useLookups()
  const mine = tickets.filter((t) => t.customerId === currentCustomer.id)
  const myDevices = devices.filter((d) => d.customerId === currentCustomer.id)
  const myIds = new Set(mine.map((t) => t.id))
  const upcoming = appointments.filter((a) => myIds.has(a.ticketId) && a.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))
  const notifs = notifications.filter((n) => n.to === 'cliente')
  const pendingQuotes = quotes.filter((q) => myIds.has(q.ticketId) && q.status === 'pendente')
  const open = mine.filter((t) => t.status !== 'finalizado')

  return (
    <>
      <PageHeader
        title={`Olá, ${currentCustomer.name.split(' ')[0]}`}
        subtitle="Acompanhe seus chamados e equipamentos."
        actions={<ButtonLink to="/app/chamados/novo"><Plus className="h-4 w-4" />Abrir chamado</ButtonLink>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Chamados em andamento" value={open.length} icon={LifeBuoy} />
        <Stat label="Orçamentos para aprovar" value={pendingQuotes.length} icon={FileText} />
        <Stat label="Equipamentos" value={myDevices.length} icon={Laptop} />
        <Stat label="Próximos atendimentos" value={upcoming.length} icon={CalendarDays} />
      </div>

      {pendingQuotes.length > 0 && (
        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-900">Você tem {pendingQuotes.length} orçamento aguardando sua aprovação.</p>
          <ButtonLink to="/app/orcamentos" variant="secondary">Ver orçamento</ButtonLink>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card title="Chamados recentes" padded={false} className="lg:col-span-2" action={<Link to="/app/chamados" className="text-sm text-slate-500 hover:text-slate-900">Ver todos</Link>}>
          {mine.length === 0 ? (
            <div className="p-5"><EmptyState icon={LifeBuoy} title="Nenhum chamado ainda" text="Abra um chamado para receber ajuda de um técnico." /></div>
          ) : (
            <div className="divide-y divide-slate-100">
              {mine.slice(0, 4).map((t) => (
                <TicketLink key={t.id} to={`/app/chamados/${t.id}`} ticket={t} sub={`${device(t.deviceId)?.name} · ${fmtDate(t.createdAt)}`} />
              ))}
            </div>
          )}
        </Card>

        <Card title="Próximos atendimentos" padded={false}>
          {upcoming.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">Nenhum atendimento agendado.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcoming.map((a) => (
                <li key={a.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">{fmtDate(a.date)} · {a.time}</p>
                    <ModeBadge mode={a.mode} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">#{a.ticketId} · {a.note}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Meus equipamentos" padded={false} className="lg:col-span-2" action={<Link to="/app/equipamentos" className="text-sm text-slate-500 hover:text-slate-900">Gerenciar</Link>}>
          <ul className="divide-y divide-slate-100">
            {myDevices.map((d) => (
              <li key={d.id}>
                <Link to={`/app/equipamentos/${d.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{d.name}</p>
                    <p className="text-xs text-slate-500">{d.specs.slice(0, 3).map((s) => s.value).join(' · ')}</p>
                  </div>
                  <span className="text-xs text-slate-400">{d.history.length} registros</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Notificações" padded={false} action={<Bell className="h-4 w-4 text-slate-400" />}>
          <ul className="divide-y divide-slate-100">
            {notifs.map((n) => (
              <li key={n.id} className="px-5 py-3.5">
                <p className={`text-sm ${n.read ? 'text-slate-500' : 'text-slate-800'}`}>{n.text}</p>
                <p className="mt-0.5 text-xs text-slate-400">{fmtDateTime(n.at)}</p>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-100 p-3"><Button variant="ghost" className="w-full" onClick={() => actions.markNotificationsRead('cliente')}>Marcar como lidas</Button></div>
        </Card>
      </div>
    </>
  )
}
