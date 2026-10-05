import { useState } from 'react'
import { Users } from 'lucide-react'
import { useStore } from '../../data/store'
import { Avatar, EmptyState, Input, PageHeader, Table, Td } from '../../components/ui'
import { fmtDate } from '../../lib/format'

export default function TechCustomers() {
  const { customers, devices, tickets } = useStore()
  const [q, setQ] = useState('')
  const list = customers.filter((c) => (c.name + c.email).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title="Clientes" subtitle={`${customers.length} clientes cadastrados`} />
      <div className="mb-4 max-w-sm"><Input placeholder="Buscar por nome ou e-mail" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {list.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum cliente encontrado" text="Tente buscar por outro nome." />
      ) : (
        <Table head={['Cliente', 'Contato', 'Cidade', 'Equipamentos', 'Chamados', 'Desde']}>
          {list.map((c) => (
            <tr key={c.id}>
              <Td><div className="flex items-center gap-3"><Avatar name={c.name} /><span className="font-medium text-slate-900">{c.name}</span></div></Td>
              <Td><p>{c.email}</p><p className="text-xs text-slate-500">{c.phone}</p></Td>
              <Td>{c.city}</Td>
              <Td>{devices.filter((d) => d.customerId === c.id).length}</Td>
              <Td>{tickets.filter((t) => t.customerId === c.id).length}</Td>
              <Td>{fmtDate(c.since)}</Td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
