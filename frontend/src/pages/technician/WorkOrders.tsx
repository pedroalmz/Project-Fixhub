import { useNavigate } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { useStore } from '../../data/store'
import { Badge, EmptyState, PageHeader, Table, Td } from '../../components/ui'
import { useLookups } from '../../components/shared'
import { brl, fmtDate, quoteTotal } from '../../lib/format'

/** Uma ordem de serviço nasce de um orçamento aprovado. */
export default function WorkOrders() {
  const { quotes, tickets } = useStore()
  const { customer, device } = useLookups()
  const navigate = useNavigate()
  const orders = quotes
    .filter((q) => q.status === 'aprovado')
    .map((q) => ({ q, t: tickets.find((t) => t.id === q.ticketId)! }))
    .sort((a, b) => b.t.id - a.t.id)
  return (
    <>
      <PageHeader title="Ordens de serviço" subtitle="Geradas automaticamente quando o cliente aprova um orçamento." />
      {orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nenhuma ordem de serviço" text="Ordens aparecem aqui após a aprovação de um orçamento." />
      ) : (
        <Table head={['OS', 'Cliente', 'Equipamento', 'Valor', 'Situação']}>
          {orders.map(({ q, t }) => (
            <tr key={q.id} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/tecnico/chamados/${t.id}`)}>
              <Td><p className="font-medium text-slate-900">OS-{t.id}</p><p className="text-xs text-slate-500">{fmtDate(t.createdAt)}</p></Td>
              <Td>{customer(t.customerId)?.name}</Td>
              <Td>{device(t.deviceId)?.name}</Td>
              <Td className="font-medium">{brl(quoteTotal(q))}</Td>
              <Td>{t.status === 'finalizado' ? <Badge tone="green">Concluída</Badge> : <Badge tone="indigo">Em execução</Badge>}</Td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
