import { z } from 'zod'
import { Priority, ServiceMode, TicketStatus } from '../../generated/prisma/enums.js'

// Um schema do Zod descreve a "forma" que os dados devem ter.
// .strict() faz o Zod recusar campos que não estão no schema (em vez de ignorá-los).

export const createTicketSchema = z
  .object({
    title: z.string().trim().min(3, 'O título deve ter pelo menos 3 caracteres').max(120, 'O título deve ter no máximo 120 caracteres'),
    description: z.string().trim().min(5, 'A descrição deve ter pelo menos 5 caracteres').max(2000, 'A descrição deve ter no máximo 2000 caracteres'),
    priority: z.enum(Priority).optional(),
    mode: z.enum(ServiceMode).optional(),
  })
  .strict()

export const updateTicketSchema = z
  .object({
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().min(5).max(2000),
    status: z.enum(TicketStatus),
    priority: z.enum(Priority),
    mode: z.enum(ServiceMode),
  })
  .partial() // no PATCH todos os campos são opcionais
  .strict()
  .refine((data) => Object.keys(data).length > 0, { message: 'Envie pelo menos um campo para atualizar' })

// O :id chega da URL como texto ("12"). coerce converte para número antes de validar.
export const ticketIdParamSchema = z.object({
  id: z.coerce.number().int('O id deve ser um número inteiro').positive('O id deve ser positivo'),
})

// Os tipos TypeScript são derivados dos schemas: uma única fonte de verdade.
export type CreateTicketInput = z.infer<typeof createTicketSchema>
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>
