import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { appointments as seedAppointments, customers as seedCustomers, devices as seedDevices, notifications as seedNotifications, quotes as seedQuotes, tickets as seedTickets, CURRENT_CUSTOMER_ID } from './mock'
import type { Appointment, Customer, Device, Message, Notification, Photo, Priority, Quote, QuoteItem, ServiceMode, Ticket, TicketStatus } from './types'
import { STATUS_LABEL, TODAY } from '../lib/format'

/**
 * Store local em memória. Cada função de `actions` corresponde a uma
 * operação que futuramente vira uma chamada de API (ver src/data/README).
 * As páginas só consomem este hook, então trocar por um backend real
 * (ex.: React Query + REST) não exige alterar os componentes.
 */
// Estado da aplicação em memória. O protótipo usa dados mockados
// para simular o backend, e cada ação representa uma operação que
// futuramente pode ser substituída por chamadas para API/BD.
interface NewTicketInput {
  deviceId: string
  title: string
  description: string
  mode: ServiceMode
  priority: Priority
  photos: Photo[]
}

interface Store {
  customers: Customer[]
  devices: Device[]
  tickets: Ticket[]
  quotes: Quote[]
  appointments: Appointment[]
  notifications: Notification[]
  currentCustomer: Customer
  actions: {
    addTicket: (input: NewTicketInput) => number
    setStatus: (ticketId: number, status: TicketStatus) => void
    addMessage: (ticketId: number, from: Message['from'], text: string) => void
    saveDiagnosis: (ticketId: number, text: string) => void
    addDevice: (input: { name: string; type: Device['type']; specs: string }) => string
    addQuoteItem: (ticketId: number, item: Omit<QuoteItem, 'id'>) => void
    removeQuoteItem: (ticketId: number, itemId: string) => void
    sendQuote: (ticketId: number) => void
    decideQuote: (ticketId: number, approve: boolean) => void
    markNotificationsRead: (to: Notification['to']) => void
  }
}

const StoreContext = createContext<Store | null>(null)
let seq = 100
let nextTicketId = 1044
const uid = (p: string) => `${p}${++seq}`

export function StoreProvider({ children }: { children: ReactNode }) {
  const [customers] = useState(seedCustomers)
  const [devices, setDevices] = useState(seedDevices)
  const [tickets, setTickets] = useState(seedTickets)
  const [quotes, setQuotes] = useState(seedQuotes)
  const [appointments] = useState(seedAppointments)
  const [notifications, setNotifications] = useState(seedNotifications)

  const ticketsRef = useRef(tickets)
  ticketsRef.current = tickets
  const patchTicket = useCallback((id: number, fn: (t: Ticket) => Ticket) => setTickets((ts) => ts.map((t) => (t.id === id ? fn(t) : t))), [])
  const patchQuote = useCallback((ticketId: number, fn: (q: Quote) => Quote) => setQuotes((qs) => qs.map((q) => (q.ticketId === ticketId ? fn(q) : q))), [])
  const notify = useCallback((to: Notification['to'], text: string) => setNotifications((n) => [{ id: uid('n'), to, text, at: `${TODAY}T12:00:00`, read: false }, ...n]), [])

  const actions = useMemo<Store['actions']>(
    () => ({
      addTicket: (input) => {
        const id = nextTicketId++
        const ticket: Ticket = {
          id,
          customerId: CURRENT_CUSTOMER_ID,
          deviceId: input.deviceId,
          title: input.title,
          description: input.description,
          status: 'aberto',
          mode: input.mode,
          priority: input.priority,
          createdAt: `${TODAY}T12:00:00`,
          photos: input.photos,
          messages: [],
        }
        setTickets((ts) => [ticket, ...ts])
        notify('tecnico', `Novo chamado #${id} de Pedro Almeida.`)
        return id
      },
      setStatus: (ticketId, status) => {
        const t = ticketsRef.current.find((x) => x.id === ticketId)
        if (t && status === 'finalizado' && t.status !== 'finalizado') {
          setDevices((ds) =>
            ds.map((d) => (d.id === t.deviceId ? { ...d, history: [{ date: TODAY, title: t.title, description: 'Atendimento finalizado.', ticketId }, ...d.history] } : d)),
          )
        }
        patchTicket(ticketId, (x) => ({ ...x, status }))
        notify('cliente', `O chamado #${ticketId} mudou para "${STATUS_LABEL[status]}".`)
      },
      addMessage: (ticketId, from, text) =>
        patchTicket(ticketId, (t) => ({
          ...t,
          messages: [
            ...t.messages,
            { id: uid('m'), from, author: from === 'cliente' ? 'Pedro Almeida' : 'Rafael Menezes', text, at: `${TODAY}T12:00:00` },
          ],
        })),
      saveDiagnosis: (ticketId, text) => patchTicket(ticketId, (t) => ({ ...t, diagnosis: text })),
      addDevice: ({ name, type, specs }) => {
        const id = uid('d')
        const parsed = specs
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l, i) => ({ label: `Item ${i + 1}`, value: l }))
        setDevices((ds) => [...ds, { id, customerId: CURRENT_CUSTOMER_ID, name, type, specs: parsed, history: [] }])
        return id
      },
      addQuoteItem: (ticketId, item) => {
        setQuotes((qs) => {
          const newItem = { ...item, id: uid('qi') }
          if (qs.some((q) => q.ticketId === ticketId))
            return qs.map((q) => (q.ticketId === ticketId ? { ...q, items: [...q.items, newItem] } : q))
          return [...qs, { id: uid('q'), ticketId, status: 'rascunho', items: [newItem], validUntil: '2026-10-12' }]
        })
      },
      removeQuoteItem: (ticketId, itemId) => patchQuote(ticketId, (q) => ({ ...q, items: q.items.filter((i) => i.id !== itemId) })),
      sendQuote: (ticketId) => {
        patchQuote(ticketId, (q) => ({ ...q, status: 'pendente' }))
        patchTicket(ticketId, (t) => ({ ...t, status: 'aguardando_aprovacao' }))
        notify('cliente', `Novo orçamento disponível no chamado #${ticketId}.`)
      },
      decideQuote: (ticketId, approve) => {
        patchQuote(ticketId, (q) => ({ ...q, status: approve ? 'aprovado' : 'rejeitado' }))
        patchTicket(ticketId, (t) => ({ ...t, status: approve ? 'manutencao' : 'diagnostico' }))
        notify('tecnico', `Pedro ${approve ? 'aprovou' : 'rejeitou'} o orçamento do chamado #${ticketId}.`)
      },
      markNotificationsRead: (to) => setNotifications((n) => n.map((x) => (x.to === to ? { ...x, read: true } : x))),
    }),
    [notify, patchQuote, patchTicket],
  )

  const value: Store = {
    customers,
    devices,
    tickets,
    quotes,
    appointments,
    notifications,
    currentCustomer: customers.find((c) => c.id === CURRENT_CUSTOMER_ID)!,
    actions,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const s = useContext(StoreContext)
  if (!s) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return s
}

