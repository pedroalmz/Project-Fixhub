import { useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { useStore } from '../../data/store'
import { EmptyState, PageHeader, QuoteBadge, Stat, Table, Td } from '../../components/ui'
import { useLookups } from '../../components/shared'
import { brl, fmtDate, quoteTotal } from '../../lib/format'

export default function TechQuotes() {
  const { quotes, tickets } = useStore()
  const { customer } = useLookups()
  const navigate = useNavigate()
  const rows = quotes.map((q) => ({ q, t: tickets.find((t) => t.id === q.ticketId)! })).sort((a, b) => b.t.id - a.t.id)
  const pending = quotes.filter((q) => q.status === 'pendente')
  return (
    <>
      <PageHeader title="Orçamentos" subtitle="Orçamentos criados e enviados aos clientes." />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat label="Aguardando aprovação" value={pending.length} hint={brl(pending.reduce((s, q) => s + quoteTotal(q), 0))} />
        <Stat label="Aprovados" value={quotes.filter((q) => q.status === 'aprovado').length} />
        <Stat label="Rascunhos" value={quotes.filter((q) => q.status === 'rascunho').length} />
      </div>
      {rows.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhum orçamento" text="Crie um orçamento a partir de um chamado." />
      ) : (
        <Table head={['Chamado', 'Cliente', 'Valor', 'Validade', 'Status']}>
          {rows.map(({ q, t }) => (
            <tr key={q.id} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/tecnico/chamados/${t.id}`)}>
              <Td><p className="font-medium text-slate-900">#{t.id}</p><p className="max-w-xs truncate text-xs text-slate-500">{t.title}</p></Td>
              <Td>{customer(t.customerId)?.name}</Td>
              <Td className="font-medium">{brl(quoteTotal(q))}</Td>
              <Td>{fmtDate(q.validUntil)}</Td>
              <Td><QuoteBadge status={q.status} /></Td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
