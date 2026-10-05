import type { Request, Response } from 'express'
import { createTicketSchema, ticketIdParamSchema, updateTicketSchema } from './ticket.schemas.js'
import { ticketService } from './ticket.service.js'

// Controller: a "tradução" entre HTTP e o service.
// 1) valida a entrada com Zod  2) chama o service  3) devolve a resposta.
// Se parse() falhar, lança ZodError e o errorHandler responde 400 sem chegar ao service.
export const ticketController = {
  async list(_req: Request, res: Response) {
    res.json(await ticketService.list())
  },

  async getById(req: Request, res: Response) {
    const { id } = ticketIdParamSchema.parse(req.params)
    res.json(await ticketService.getById(id))
  },

  async create(req: Request, res: Response) {
    const data = createTicketSchema.parse(req.body)
    res.status(201).json(await ticketService.create(data))
  },

  async update(req: Request, res: Response) {
    const { id } = ticketIdParamSchema.parse(req.params)
    const data = updateTicketSchema.parse(req.body)
    res.json(await ticketService.update(id, data))
  },
}
