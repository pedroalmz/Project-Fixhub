import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Laptop } from 'lucide-react'
import { useStore } from '../../data/store'
import { Badge, EmptyState, Input, PageHeader, Table, Td } from '../../components/ui'
import { useLookups } from '../../components/shared'
import { fmtDate } from '../../lib/format'

const TYPE: Record<string, string> = { desktop: 'Desktop', notebook: 'Notebook', impressora: 'Impressora', outro: 'Outro' }

export default function TechDevices() {
  const { devices } = useStore()
  const { customer } = useLookups()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const list = devices.filter((d) => (d.name + customer(d.customerId)?.name).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title="Equipamentos" subtitle={`${devices.length} equipamentos cadastrados pelos clientes`} />
      <div className="mb-4 max-w-sm"><Input placeholder="Buscar equipamento ou cliente" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {list.length === 0 ? (
        <EmptyState icon={Laptop} title="Nenhum equipamento encontrado" text="Tente outro termo de busca." />
      ) : (
        <Table head={['Equipamento', 'Cliente', 'Tipo', 'Especificações', 'Último serviço']}>
          {list.map((d) => (
            <tr key={d.id} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/tecnico/equipamentos/${d.id}`)}>
              <Td className="font-medium text-slate-900">{d.name}</Td>
              <Td>{customer(d.customerId)?.name}</Td>
              <Td><Badge>{TYPE[d.type]}</Badge></Td>
              <Td className="max-w-xs truncate text-slate-500">{d.specs.slice(0, 3).map((s) => s.value).join(' · ')}</Td>
              <Td>{d.history[0] ? fmtDate(d.history[0].date) : '-'}</Td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
