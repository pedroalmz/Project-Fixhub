import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { useStore } from '../../data/store'
import { Button, Card, EmptyState, PageHeader, QuoteBadge } from '../../components/ui'
import { QuoteTable, useLookups } from '../../components/shared'

export default function ClientQuotes() {
  const { quotes, tickets, currentCustomer, actions } = useStore()
  const { device } = useLookups()
  const mine = quotes
    .filter((q) => q.status !== 'rascunho')
    .map((q) => ({ q, t: tickets.find((t) => t.id === q.ticketId)! }))
    .filter(({ t }) => t.customerId === currentCustomer.id)
    .sort((a, b) => (a.q.status === 'pendente' ? -1 : 0) - (b.q.status === 'pendente' ? -1 : 0))

  return (
    <>
      <PageHeader title="Orçamentos" subtitle="Revise e aprove os orçamentos enviados pelo técnico." />
      {mine.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhum orçamento" text="Quando o técnico enviar um orçamento, ele aparecerá aqui." />
      ) : (
        <div className="space-y-6">
          {mine.map(({ q, t }) => (
            <Card
              key={q.id}
              title={<span>Orçamento do chamado <Link className="underline decoration-slate-300 underline-offset-2" to={`/app/chamados/${t.id}`}>#{t.id}</Link> · <span className="font-normal text-slate-500">{device(t.deviceId)?.name}</span></span>}
              action={<QuoteBadge status={q.status} />}
            >
              <QuoteTable quote={q} />
              {q.status === 'pendente' && (
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  <Button variant="danger" onClick={() => actions.decideQuote(t.id, false)}>Rejeitar</Button>
                  <Button onClick={() => actions.decideQuote(t.id, true)}>Aprovar orçamento</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
