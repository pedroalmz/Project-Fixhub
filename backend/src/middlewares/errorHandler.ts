import type { ErrorRequestHandler, RequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../lib/errors.js'

// Rota que não existe -> 404 em JSON (em vez do HTML padrão do Express).
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.originalUrl}` })
}

// Único lugar que transforma erros em respostas HTTP.
// O Express reconhece um middleware de erro pelos 4 parâmetros (err, req, res, next).
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // 400: o Zod rejeitou os dados enviados pelo cliente.
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Dados inválidos',
      details: err.issues.map((i) => ({ field: i.path.join('.') || '(corpo)', message: i.message })),
    })
    return
  }

  // Erro de negócio lançado de propósito (404 não encontrado, etc.).
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  // 400: o JSON enviado está malformado (express.json() falhou ao ler).
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'JSON inválido no corpo da requisição' })
    return
  }

  // 500: bug nosso ou falha de infraestrutura (ex.: banco fora do ar).
  // Detalhes ficam só no log do servidor; o cliente recebe uma mensagem genérica.
  console.error(err)
  res.status(500).json({ error: 'Erro interno do servidor' })
}
