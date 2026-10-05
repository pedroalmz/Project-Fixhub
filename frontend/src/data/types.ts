export type TicketStatus =
  | 'aberto'
  | 'diagnostico'
  | 'orcamento'
  | 'aguardando_aprovacao'
  | 'manutencao'
  | 'finalizado'

export type ServiceMode = 'presencial' | 'remoto'
export type Priority = 'baixa' | 'normal' | 'alta'
export type QuoteStatus = 'rascunho' | 'pendente' | 'aprovado' | 'rejeitado'
export type QuoteItemKind = 'peca' | 'mao_de_obra'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  city: string
  since: string
}

export interface DeviceHistoryEntry {
  date: string // ISO yyyy-mm-dd
  title: string
  description?: string
  ticketId?: number
}

export interface Device {
  id: string
  customerId: string
  name: string
  type: 'desktop' | 'notebook' | 'impressora' | 'outro'
  specs: { label: string; value: string }[]
  history: DeviceHistoryEntry[]
}

export interface Message {
  id: string
  from: 'cliente' | 'tecnico'
  author: string
  text: string
  at: string // ISO datetime
}

export interface QuoteItem {
  id: string
  description: string
  kind: QuoteItemKind
  qty: number
  unitPrice: number
}

export interface Quote {
  id: string
  ticketId: number
  status: QuoteStatus
  items: QuoteItem[]
  validUntil: string
  notes?: string
}

export interface Photo {
  id: string
  caption: string
  url?: string
}

export interface Ticket {
  id: number
  customerId: string
  deviceId: string
  title: string
  description: string
  status: TicketStatus
  mode: ServiceMode
  priority: Priority
  createdAt: string
  photos: Photo[]
  messages: Message[]
  diagnosis?: string
}

export interface Appointment {
  id: string
  ticketId: number
  date: string // ISO yyyy-mm-dd
  time: string
  mode: ServiceMode
  note: string
}

export interface Notification {
  id: string
  text: string
  at: string
  read: boolean
  to: 'cliente' | 'tecnico'
}
