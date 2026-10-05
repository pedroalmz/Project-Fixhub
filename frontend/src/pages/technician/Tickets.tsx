import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LifeBuoy } from 'lucide-react'
import { useStore } from '../../data/store'
import { Badge, EmptyState, ModeBadge, PageHeader, Select, StatusBadge, Table, Td } from '../../components/ui'
import { useLookups } from '../../components/shared'
import { fmtDate, STATUS_LABEL, STATUS_ORDER } from '../../lib/format'
import type { TicketStatus } from '../../data/types'

export default function TechTickets() {
  const { tickets } = useStore()
  const { customer, device } = useLookups()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'todos' | TicketStatus>('todos')
  const list = tickets.filter((t) => status === 'todos' || t.status === status).sort((a, b) => b.id - a.id)
  return (
    <>
      <PageHeader title="Chamados" subtitle="Receba, diagnostique e acompanhe os atendimentos." />
      <div className="mb-4 w-full sm:w-64">
        <Select value={status} onChange={(e) => setStatus(e.target.value as 'todos' | TicketStatus)}>
          <option value="todos">Todos os status</option>
          {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </Select>
      </div>
      {list.length === 0 ? (
        <EmptyState icon={LifeBuoy} title="Nenhum chamado neste status" text="Altere o filtro para ver outros chamados." />
      ) : (
        <Table head={['Chamado', 'Cliente', 'Equipamento', 'Urgência', 'Atendimento', 'Status']}>
          {list.map((t) => (
            <tr key={t.id} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/tecnico/chamados/${t.id}`)}>
              <Td><p className="font-medium text-slate-900">#{t.id}</p><p className="max-w-[16rem] truncate text-xs text-slate-500">{t.title}</p><p className="text-xs text-slate-400">{fmtDate(t.createdAt)}</p></Td>
              <Td>{customer(t.customerId)?.name}</Td>
              <Td>{device(t.deviceId)?.name}</Td>
              <Td>{t.priority === 'alta' ? <Badge tone="red">Alta</Badge> : <span className="capitalize text-slate-500">{t.priority}</span>}</Td>
              <Td><ModeBadge mode={t.mode} /></Td>
              <Td><StatusBadge status={t.status} /></Td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
