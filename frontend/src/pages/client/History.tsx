import { Link } from 'react-router-dom'
import { History as HistoryIcon } from 'lucide-react'
import { useStore } from '../../data/store'
import { Card, EmptyState, PageHeader } from '../../components/ui'
import { DeviceHistory } from '../../components/shared'

export default function ClientHistory() {
  const { devices, currentCustomer } = useStore()
  const mine = devices.filter((d) => d.customerId === currentCustomer.id)
  const total = mine.reduce((s, d) => s + d.history.length, 0)
  return (
    <>
      <PageHeader title="Histórico de atendimentos" subtitle="Tudo o que já foi feito nos seus equipamentos." />
      {total === 0 ? (
        <EmptyState icon={HistoryIcon} title="Sem histórico" text="Os atendimentos finalizados aparecerão aqui." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {mine.map((d) => (
            <Card key={d.id} title={<Link to={`/app/equipamentos/${d.id}`} className="hover:underline">{d.name}</Link>}>
              <DeviceHistory entries={d.history} />
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
