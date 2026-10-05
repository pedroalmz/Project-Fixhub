import { NotFoundError } from '../../lib/errors.js'
import { ticketRepository } from './ticket.repository.js'
import type { CreateTicketInput, UpdateTicketInput } from './ticket.schemas.js'

// Service: regras de negócio. Não sabe de req/res (HTTP) nem de Prisma (banco).
// Por enquanto a única regra é "chamado inexistente = erro 404".
export const ticketService = {
  list: () => ticketRepository.findMany(),

  async getById(id: number) {
    const ticket = await ticketRepository.findById(id)
    if (!ticket) throw new NotFoundError(`Chamado #${id} não encontrado`)
    return ticket
  },

  create: (data: CreateTicketInput) => ticketRepository.create(data),

  async update(id: number, data: UpdateTicketInput) {
    await ticketService.getById(id) // garante que existe (senão lança 404)
    return ticketRepository.update(id, data)
  },
}
