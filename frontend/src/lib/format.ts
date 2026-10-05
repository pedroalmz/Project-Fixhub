import type { Priority, Quote, QuoteStatus, ServiceMode, TicketStatus } from '../data/types'

// Helpers de formatação usados em vários componentes da interface.
// Eles padronizam moeda, data, status e nomes visíveis para o usuário.
/** "Hoje" fixo para que o protótipo seja consistente com os dados mockados. */
export const TODAY = '2026-10-02'

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

export const fmtDateTime = (iso: string) => `${fmtDate(iso)} às ${iso.slice(11, 16)}`

export const fmtWeekday = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

export const quoteTotal = (q?: Quote) => (q ? q.items.reduce((s, i) => s + i.qty * i.unitPrice, 0) : 0)

export const STATUS_ORDER: TicketStatus[] = ['aberto', 'diagnostico', 'orcamento', 'aguardando_aprovacao', 'manutencao', 'finalizado']

export const STATUS_LABEL: Record<TicketStatus, string> = {
  aberto: 'Aberto',
  diagnostico: 'Em diagnóstico',
  orcamento: 'Orçamento',
  aguardando_aprovacao: 'Aguardando aprovação',
  manutencao: 'Em manutenção',
  finalizado: 'Finalizado',
}

export const STATUS_TIMELINE_LABEL: Record<TicketStatus, string> = {
  aberto: 'Chamado aberto',
  diagnostico: 'Diagnóstico',
  orcamento: 'Orçamento',
  aguardando_aprovacao: 'Aguardando aprovação',
  manutencao: 'Em manutenção',
  finalizado: 'Finalizado',
}

export const STATUS_TONE: Record<TicketStatus, Tone> = {
  aberto: 'slate',
  diagnostico: 'blue',
  orcamento: 'violet',
  aguardando_aprovacao: 'amber',
  manutencao: 'indigo',
  finalizado: 'green',
}

export type Tone = 'slate' | 'blue' | 'violet' | 'amber' | 'indigo' | 'green' | 'red'

export const QUOTE_LABEL: Record<QuoteStatus, string> = {
  rascunho: 'Rascunho',
  pendente: 'Aguardando aprovação',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
}
export const QUOTE_TONE: Record<QuoteStatus, Tone> = { rascunho: 'slate', pendente: 'amber', aprovado: 'green', rejeitado: 'red' }

export const MODE_LABEL: Record<ServiceMode, string> = { presencial: 'Presencial', remoto: 'Remoto' }
export const PRIORITY_LABEL: Record<Priority, string> = { baixa: 'Baixa', normal: 'Normal', alta: 'Alta' }
