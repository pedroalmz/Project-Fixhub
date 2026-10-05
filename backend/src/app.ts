import express from 'express'
import './lib/zod.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'
import { ticketRouter } from './modules/tickets/ticket.routes.js'

// O "app" é a aplicação Express: aqui ficam os middlewares e as rotas.
export const app = express()

// Middleware: lê o corpo JSON do pedido e o coloca em req.body.
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/tickets', ticketRouter)

// A ORDEM importa: estes dois vêm por último, depois de todas as rotas.
app.use(notFoundHandler)
app.use(errorHandler)
