import { prisma } from '../../lib/prisma.js'
import type { CreateTicketInput, UpdateTicketInput } from './ticket.schemas.js'

// Repository: o ÚNICO lugar que conversa com o banco (via Prisma).
// Não tem regra de negócio, nem sabe o que é HTTP.
export const ticketRepository = {
  findMany: () => prisma.ticket.findMany({ orderBy: { id: 'desc' } }),
  findById: (id: number) => prisma.ticket.findUnique({ where: { id } }),
  create: (data: CreateTicketInput) => prisma.ticket.create({ data }),
  update: (id: number, data: UpdateTicketInput) => prisma.ticket.update({ where: { id }, data }),
}
