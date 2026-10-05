import { useState } from 'react'
import { Link } from 'react-router-dom'
import { History as HistoryIcon } from 'lucide-react'
import { useStore } from '../../data/store'
import { EmptyState, Input, PageHeader, Table, Td } from '../../components/ui'
import { useLookups } from '../../components/shared'
import { fmtDate } from '../../lib/format'

export default function TechHistory() {
  const { devices } = useStore()
  const { customer } = useLookups()
  const [q, setQ] = useState('')
  const rows = devices
    .flatMap((d) => d.history.map((h) => ({ d, h })))
    .filter(({ d, h }) => (d.name + h.title + customer(d.customerId)?.name).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.h.date.localeCompare(a.h.date))
  return (
    <>
      <PageHeader title="Histórico" subtitle="Todos os serviços realizados, do mais recente ao mais antigo." />
      <div className="mb-4 max-w-sm"><Input placeholder="Buscar por cliente, equipamento ou serviço" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {rows.length === 0 ? (
        <EmptyState icon={HistoryIcon} title="Nada encontrado" text="Tente outro termo de busca." />
      ) : (
        <Table head={['Data', 'Serviço', 'Equipamento', 'Cliente']}>
          {rows.map(({ d, h }, i) => (
            <tr key={i}>
              <Td className="whitespace-nowrap text-slate-500">{fmtDate(h.date)}</Td>
              <Td><p className="font-medium text-slate-900">{h.title}</p>{h.description && <p className="max-w-sm truncate text-xs text-slate-500">{h.description}</p>}</Td>
              <Td><Link className="hover:underline" to={`/tecnico/equipamentos/${d.id}`}>{d.name}</Link></Td>
              <Td>{customer(d.customerId)?.name}</Td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
