// Erro "esperado" da aplicação: carrega o código HTTP que deve ser devolvido.
// Quem lança (ex.: o service) decide o que aconteceu; o errorHandler decide como responder.
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(404, message)
  }
}
