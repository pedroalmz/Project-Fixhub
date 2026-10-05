import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LifeBuoy, Plus } from 'lucide-react'
import { useStore } from '../../data/store'
import { ButtonLink, EmptyState, ModeBadge, PageHeader, StatusBadge, Table, Td } from '../../components/ui'
import { useLookups } from '../../components/shared'
import { fmtDate } from '../../lib/format'

type Filter = 'todos' | 'andamento' | 'finalizados'

export default function ClientTickets() {
  const { tickets, currentCustomer } = useStore()
  const { device } = useLookups()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('todos')
  const mine = tickets.filter((t) => t.customerId === currentCustomer.id).filter((t) => (filter === 'todos' ? true : filter === 'finalizados' ? t.status === 'finalizado' : t.status !== 'finalizado'))

  return (
    <>
      <PageHeader title="Meus chamados" subtitle="Todos os atendimentos solicitados por você." actions={<ButtonLink to="/app/chamados/novo"><Plus className="h-4 w-4" />Abrir chamado</ButtonLink>} />
      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 text-sm sm:w-fit">
        {([['todos', 'Todos'], ['andamento', 'Em andamento'], ['finalizados', 'Finalizados']] as [Filter, string][]).map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`flex-1 rounded-md px-3 py-1.5 font-medium ${filter === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{l}</button>
        ))}
      </div>
      {mine.length === 0 ? (
        <EmptyState icon={LifeBuoy} title="Nenhum chamado encontrado" text="Não há chamados com esse filtro." />
      ) : (
        <Table head={['Chamado', 'Equipamento', 'Aberto em', 'Atendimento', 'Status']}>
          {mine.map((t) => (
            <tr key={t.id} onClick={() => navigate(`/app/chamados/${t.id}`)} className="cursor-pointer hover:bg-slate-50">
              <Td><p className="font-medium text-slate-900">#{t.id}</p><p className="max-w-xs truncate text-xs text-slate-500">{t.title}</p></Td>
              <Td>{device(t.deviceId)?.name}</Td>
              <Td>{fmtDate(t.createdAt)}</Td>
              <Td><ModeBadge mode={t.mode} /></Td>
              <Td><StatusBadge status={t.status} /></Td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
