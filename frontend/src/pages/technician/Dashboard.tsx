import { Link } from 'react-router-dom'
import { CheckCircle2, FileClock, LifeBuoy, Search, Wrench } from 'lucide-react'
import { useStore } from '../../data/store'
import { Card, ModeBadge, PageHeader, Stat } from '../../components/ui'
import { TicketLink, useLookups } from '../../components/shared'
import { fmtDate, TODAY } from '../../lib/format'

export default function TechDashboard() {
  const { tickets, appointments } = useStore()
  const { customer } = useLookups()
  const count = (s: string) => tickets.filter((t) => t.status === s).length
  const upcoming = appointments.filter((a) => a.date >= TODAY).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 5)
  const needAttention = tickets.filter((t) => t.status === 'aberto')

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão geral dos atendimentos de hoje." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="Chamados abertos" value={count('aberto')} icon={LifeBuoy} />
        <Stat label="Em diagnóstico" value={count('diagnostico')} icon={Search} />
        <Stat label="Aguardando aprovação" value={count('aguardando_aprovacao')} icon={FileClock} />
        <Stat label="Em andamento" value={count('manutencao')} icon={Wrench} />
        <Stat label="Finalizados" value={count('finalizado')} icon={CheckCircle2} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card title="Novos chamados para atender" padded={false} className="lg:col-span-2" action={<Link to="/tecnico/chamados" className="text-sm text-slate-500 hover:text-slate-900">Ver todos</Link>}>
          {needAttention.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">Nenhum chamado novo. Bom trabalho!</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {needAttention.map((t) => <TicketLink key={t.id} to={`/tecnico/chamados/${t.id}`} ticket={t} sub={`${customer(t.customerId)?.name} · ${fmtDate(t.createdAt)}`} />)}
            </div>
          )}
        </Card>

        <Card title="Próximos atendimentos" padded={false} action={<Link to="/tecnico/agenda" className="text-sm text-slate-500 hover:text-slate-900">Agenda</Link>}>
          <ul className="divide-y divide-slate-100">
            {upcoming.map((a) => {
              const t = tickets.find((x) => x.id === a.ticketId)!
              return (
                <li key={a.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">{fmtDate(a.date)} · {a.time}</p>
                    <ModeBadge mode={a.mode} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{customer(t.customerId)?.name} · {a.note}</p>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </>
  )
}
