import { Router } from 'express'
import { ticketController } from './ticket.controller.js'

// Routes: só liga "método + caminho" ao controller. Montado em /tickets no app.ts.
export const ticketRouter = Router()

ticketRouter.get('/', ticketController.list)
ticketRouter.get('/:id', ticketController.getById)
ticketRouter.post('/', ticketController.create)
ticketRouter.patch('/:id', ticketController.update)
