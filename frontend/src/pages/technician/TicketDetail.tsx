import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, LifeBuoy, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../../data/store'
import type { QuoteItemKind } from '../../data/types'
import { Button, ButtonLink, Card, EmptyState, Field, Input, KeyValue, ModeBadge, PageHeader, PhotoTile, QuoteBadge, Select, StatusBadge, Textarea } from '../../components/ui'
import { Conversation, DeviceHistory, useLookups } from '../../components/shared'
import { brl, fmtDateTime, quoteTotal, STATUS_LABEL, STATUS_ORDER } from '../../lib/format'

export default function TechTicketDetail() {
  const { id } = useParams()
  const { tickets, quotes, actions } = useStore()
  const { customer, device } = useLookups()
  const t = tickets.find((x) => x.id === Number(id))
  const [diag, setDiag] = useState<string | null>(null)
  const [item, setItem] = useState({ description: '', kind: 'peca' as QuoteItemKind, qty: '1', price: '' })

  if (!t) return <EmptyState icon={LifeBuoy} title="Chamado não encontrado" text="Verifique o número do chamado." action={<ButtonLink to="/tecnico/chamados" variant="secondary">Voltar</ButtonLink>} />
  const c = customer(t.customerId)
  const d = device(t.deviceId)
  const quote = quotes.find((q) => q.ticketId === t.id)
  const editable = !quote || quote.status === 'rascunho' || quote.status === 'rejeitado'
  const diagText = diag ?? t.diagnosis ?? ''
  const parts = quote?.items.filter((i) => i.kind === 'peca') ?? []
  const labor = quote?.items.filter((i) => i.kind === 'mao_de_obra') ?? []

  const addItem = () => {
    const price = parseFloat(item.price.replace(',', '.'))
    if (!item.description.trim() || isNaN(price)) return
    actions.addQuoteItem(t.id, { description: item.description.trim(), kind: item.kind, qty: Math.max(1, parseInt(item.qty) || 1), unitPrice: price })
    setItem({ ...item, description: '', price: '', qty: '1' })
  }

  const itemList = (title: string, list: typeof parts) => (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      {list.length === 0 ? (
        <p className="text-sm text-slate-400">Nenhum item.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {list.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
              <span>{i.qty}x {i.description}</span>
              <span className="flex items-center gap-3">
                {brl(i.qty * i.unitPrice)}
                {editable && <button aria-label="Remover item" onClick={() => actions.removeQuoteItem(t.id, i.id)}><Trash2 className="h-4 w-4 text-slate-400 hover:text-red-600" /></button>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <>
      <PageHeader
        back={<Link to="/tecnico/chamados" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Chamados</Link>}
        title={`Chamado #${t.id}`}
        subtitle={`${t.title} · aberto em ${fmtDateTime(t.createdAt)}`}
        actions={<StatusBadge status={t.status} />}
      />

      <Card title="Status do atendimento" className="mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_ORDER.map((s) => (
            <Button key={s} variant={s === t.status ? 'primary' : 'secondary'} onClick={() => actions.setStatus(t.id, s)}>{STATUS_LABEL[s]}</Button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Cada alteração notifica o cliente. Ao finalizar, o serviço entra no histórico do equipamento.</p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Cliente e equipamento">
            <KeyValue items={[
              { label: 'Cliente', value: c?.name },
              { label: 'Contato', value: `${c?.phone} · ${c?.email}` },
              { label: 'Equipamento', value: d ? <Link className="underline decoration-slate-300 underline-offset-2" to={`/tecnico/equipamentos/${d.id}`}>{d.name}</Link> : '-' },
              { label: 'Atendimento', value: <ModeBadge mode={t.mode} /> },
            ]} />
            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="text-xs text-slate-500">Problema relatado</p>
              <p className="mt-1 text-sm text-slate-900">"{t.description}"</p>
            </div>
            {t.photos.length > 0 && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{t.photos.map((p) => <PhotoTile key={p.id} caption={p.caption} url={p.url} />)}</div>}
          </Card>

          <Card title="Diagnóstico">
            <Textarea value={diagText} onChange={(e) => setDiag(e.target.value)} placeholder="Descreva o que foi encontrado e o que deve ser feito." />
            <div className="mt-3 flex justify-end"><Button variant="secondary" disabled={diag === null} onClick={() => { actions.saveDiagnosis(t.id, diagText); setDiag(null) }}>Salvar diagnóstico</Button></div>
          </Card>

          <Card title="Peças, mão de obra e orçamento" action={quote && <QuoteBadge status={quote.status} />}>
            <div className="space-y-5">
              {itemList('Peças utilizadas', parts)}
              {itemList('Mão de obra', labor)}
            </div>

            {editable && (
              <div className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-6">
                <div className="sm:col-span-2"><Field label="Descrição"><Input value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} /></Field></div>
                <Field label="Tipo"><Select value={item.kind} onChange={(e) => setItem({ ...item, kind: e.target.value as QuoteItemKind })}><option value="peca">Peça</option><option value="mao_de_obra">Mão de obra</option></Select></Field>
                <Field label="Qtd."><Input inputMode="numeric" value={item.qty} onChange={(e) => setItem({ ...item, qty: e.target.value })} /></Field>
                <Field label="Valor (R$)"><Input inputMode="decimal" value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} /></Field>
                <div className="flex items-end"><Button variant="secondary" className="w-full" onClick={addItem}><Plus className="h-4 w-4" />Adicionar</Button></div>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">Total do orçamento <span className="ml-2 text-lg font-semibold text-slate-900">{brl(quoteTotal(quote))}</span></p>
              {editable && <Button disabled={!quote || quote.items.length === 0} onClick={() => actions.sendQuote(t.id)}>Enviar orçamento ao cliente</Button>}
              {quote?.status === 'pendente' && <span className="text-sm text-amber-700">Aguardando resposta do cliente</span>}
              {quote?.status === 'aprovado' && <span className="text-sm text-emerald-700">Aprovado pelo cliente</span>}
            </div>
          </Card>

          <Card title="Mensagens"><Conversation ticket={t} as="tecnico" /></Card>
        </div>

        <Card title="Histórico do equipamento" className="self-start">{d && <DeviceHistory entries={d.history} />}</Card>
      </div>
    </>
  )
}
