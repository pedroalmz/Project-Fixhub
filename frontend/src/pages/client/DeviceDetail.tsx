import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { useStore } from '../../data/store'
import { ButtonLink, Card, EmptyState, KeyValue, PageHeader } from '../../components/ui'
import { TicketLink, DeviceHistory } from '../../components/shared'
import { Laptop } from 'lucide-react'
import { fmtDate } from '../../lib/format'

export default function DeviceDetail({ base = '/app' }: { base?: string }) {
  const { id } = useParams()
  const { devices, tickets } = useStore()
  const d = devices.find((x) => x.id === id)
  if (!d) return <EmptyState icon={Laptop} title="Equipamento não encontrado" text="Ele pode ter sido removido." action={<ButtonLink to={`${base}/equipamentos`} variant="secondary">Voltar</ButtonLink>} />
  const related = tickets.filter((t) => t.deviceId === d.id)

  return (
    <>
      <PageHeader
        back={<Link to={`${base}/equipamentos`} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Equipamentos</Link>}
        title={d.name}
        subtitle={d.specs.slice(0, 2).map((s) => s.value).join(' · ')}
        actions={base === '/app' ? <ButtonLink to="/app/chamados/novo"><Plus className="h-4 w-4" />Abrir chamado</ButtonLink> : undefined}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Especificações">
            <KeyValue items={d.specs.map((s) => ({ label: s.label, value: s.value }))} />
          </Card>
          <Card title="Histórico de atendimentos"><DeviceHistory entries={d.history} /></Card>
        </div>
        <Card title="Chamados deste equipamento" padded={false} className="self-start">
          {related.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">Nenhum chamado aberto para este equipamento.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {related.map((t) => <TicketLink key={t.id} to={`${base}/chamados/${t.id}`} ticket={t} sub={fmtDate(t.createdAt)} />)}
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
