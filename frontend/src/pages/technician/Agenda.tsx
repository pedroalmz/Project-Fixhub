import { Link } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import { useStore } from '../../data/store'
import { Card, EmptyState, ModeBadge, PageHeader } from '../../components/ui'
import { useLookups } from '../../components/shared'
import { fmtWeekday, TODAY } from '../../lib/format'

export default function Agenda() {
  const { appointments, tickets } = useStore()
  const { customer, device } = useLookups()
  const upcoming = appointments.filter((a) => a.date >= TODAY).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const days = [...new Set(upcoming.map((a) => a.date))]
  return (
    <>
      <PageHeader title="Agenda" subtitle="Atendimentos presenciais e remotos agendados." />
      {days.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Agenda livre" text="Nenhum atendimento agendado." />
      ) : (
        <div className="space-y-6">
          {days.map((day) => (
            <Card key={day} title={<span className="capitalize">{fmtWeekday(day)}</span>} padded={false}>
              <ul className="divide-y divide-slate-100">
                {upcoming.filter((a) => a.date === day).map((a) => {
                  const t = tickets.find((x) => x.id === a.ticketId)!
                  return (
                    <li key={a.id}>
                      <Link to={`/tecnico/chamados/${t.id}`} className="flex items-center gap-5 px-5 py-4 hover:bg-slate-50">
                        <span className="w-14 text-sm font-semibold text-slate-900">{a.time}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">{customer(t.customerId)?.name} · {device(t.deviceId)?.name}</p>
                          <p className="truncate text-xs text-slate-500">#{t.id} · {a.note}</p>
                        </div>
                        <ModeBadge mode={a.mode} />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
