import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
import { useStore } from '../data/store'
import type { DeviceHistoryEntry, Message, Quote, Ticket } from '../data/types'
import { brl, fmtDate, fmtDateTime, quoteTotal } from '../lib/format'
import { Button, Input, StatusBadge } from './ui'

export function useLookups() {
  const { devices, customers } = useStore()
  return {
    device: (id: string) => devices.find((d) => d.id === id),
    customer: (id: string) => customers.find((c) => c.id === id),
  }
}

export function DeviceHistory({ entries }: { entries: DeviceHistoryEntry[] }) {
  if (!entries.length) return <p className="text-sm text-slate-500">Nenhum atendimento registrado para este equipamento.</p>
  return (
    <ul>
      {entries.map((e, i) => (
        <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
          {i < entries.length - 1 && <span className="absolute left-[5px] top-3 h-full w-px bg-slate-200" />}
          <span className="z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-slate-900 bg-white" />
          <div>
            <p className="text-sm font-medium text-slate-900">
              <span className="text-slate-500">{fmtDate(e.date)}</span> — {e.title}
            </p>
            {e.description && <p className="mt-0.5 text-sm text-slate-500">{e.description}</p>}
            {e.ticketId && <p className="mt-0.5 text-xs text-slate-400">Chamado #{e.ticketId}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}

export function Conversation({ ticket, as }: { ticket: Ticket; as: Message['from'] }) {
  const { actions } = useStore()
  const [text, setText] = useState('')
  const send = () => {
    if (!text.trim()) return
    actions.addMessage(ticket.id, as, text.trim())
    setText('')
  }
  return (
    <div>
      {ticket.messages.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">Ainda não há mensagens neste chamado.</p>
      ) : (
        <ul className="mb-5 space-y-4">
          {ticket.messages.map((m) => {
            const mine = m.from === as
            return (
              <li key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${mine ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'}`}>
                  <p className={`mb-0.5 text-xs ${mine ? 'text-slate-300' : 'text-slate-500'}`}>{m.author} · {fmtDateTime(m.at)}</p>
                  {m.text}
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <div className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Escreva uma mensagem" />
        <Button onClick={send} aria-label="Enviar"><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  )
}

export function QuoteTable({ quote }: { quote: Quote }) {
  const group = (kind: 'peca' | 'mao_de_obra') => quote.items.filter((i) => i.kind === kind)
  const section = (title: string, items: Quote['items']) =>
    items.length > 0 && (
      <>
        <tr className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500"><td colSpan={3} className="px-4 py-2">{title}</td></tr>
        {items.map((i) => (
          <tr key={i.id}>
            <td className="px-4 py-2.5">{i.description}</td>
            <td className="px-4 py-2.5 text-right text-slate-500">{i.qty}x</td>
            <td className="px-4 py-2.5 text-right">{brl(i.qty * i.unitPrice)}</td>
          </tr>
        ))}
      </>
    )
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-slate-100">
          {section('Peças', group('peca'))}
          {section('Mão de obra', group('mao_de_obra'))}
          <tr className="font-semibold">
            <td className="px-4 py-3" colSpan={2}>Total</td>
            <td className="px-4 py-3 text-right">{brl(quoteTotal(quote))}</td>
          </tr>
        </tbody>
      </table>
      <p className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
        Válido até {fmtDate(quote.validUntil)}{quote.notes ? ` · ${quote.notes}` : ''}
      </p>
    </div>
  )
}

/** Linha de lista de chamados usada no dashboard e nas listagens. */
export function TicketLink({ to, ticket, sub }: { to: string; ticket: Ticket; sub: string }) {
  return (
    <Link to={to} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">#{ticket.id} · {ticket.title}</p>
        <p className="truncate text-xs text-slate-500">{sub}</p>
      </div>
      <StatusBadge status={ticket.status} />
    </Link>
  )
}

