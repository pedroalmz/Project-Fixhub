import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, LifeBuoy } from 'lucide-react'
import { useStore } from '../../data/store'
import { Button, ButtonLink, Card, EmptyState, KeyValue, ModeBadge, PageHeader, PhotoTile, QuoteBadge, StatusBadge, StatusTimeline } from '../../components/ui'
import { Conversation, QuoteTable, useLookups } from '../../components/shared'
import { fmtDateTime, PRIORITY_LABEL } from '../../lib/format'

export default function ClientTicketDetail() {
  const { id } = useParams()
  const { tickets, quotes, actions } = useStore()
  const { device } = useLookups()
  const t = tickets.find((x) => x.id === Number(id))
  if (!t) return <EmptyState icon={LifeBuoy} title="Chamado não encontrado" text="Verifique o número do chamado." action={<ButtonLink to="/app/chamados" variant="secondary">Voltar</ButtonLink>} />
  const quote = quotes.find((q) => q.ticketId === t.id && q.status !== 'rascunho')
  const dev = device(t.deviceId)

  return (
    <>
      <PageHeader
        back={<Link to="/app/chamados" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Meus chamados</Link>}
        title={`Chamado #${t.id}`}
        subtitle={`Aberto em ${fmtDateTime(t.createdAt)}`}
        actions={<StatusBadge status={t.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Resumo">
            <KeyValue items={[
              { label: 'Equipamento', value: dev ? <Link className="underline decoration-slate-300 underline-offset-2" to={`/app/equipamentos/${dev.id}`}>{dev.name}</Link> : '-' },
              { label: 'Atendimento', value: <ModeBadge mode={t.mode} /> },
              { label: 'Urgência', value: PRIORITY_LABEL[t.priority] },
              { label: 'Status', value: <StatusBadge status={t.status} /> },
            ]} />
            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="text-xs text-slate-500">Problema relatado</p>
              <p className="mt-1 text-sm text-slate-900">"{t.description}"</p>
            </div>
            {t.photos.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {t.photos.map((p) => <PhotoTile key={p.id} caption={p.caption} url={p.url} />)}
              </div>
            )}
          </Card>

          <Card title="Diagnóstico">
            {t.diagnosis ? <p className="text-sm leading-relaxed text-slate-700">{t.diagnosis}</p> : <p className="text-sm text-slate-500">O técnico ainda não registrou o diagnóstico.</p>}
          </Card>

          {quote && (
            <Card title="Orçamento" action={<QuoteBadge status={quote.status} />}>
              <QuoteTable quote={quote} />
              {quote.status === 'pendente' && (
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  <Button variant="danger" onClick={() => actions.decideQuote(t.id, false)}>Rejeitar</Button>
                  <Button onClick={() => actions.decideQuote(t.id, true)}>Aprovar orçamento</Button>
                </div>
              )}
            </Card>
          )}

          <Card title="Mensagens"><Conversation ticket={t} as="cliente" /></Card>
        </div>

        <Card title="Acompanhamento" className="self-start"><StatusTimeline status={t.status} /></Card>
      </div>
    </>
  )
}
