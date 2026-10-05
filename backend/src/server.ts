import { app } from './app.js'

// O "server" só liga o app a uma porta de rede e fica escutando pedidos.
const PORT = Number(process.env.PORT) || 3333

app.listen(PORT, () => {
  console.log(`FixHub API rodando em http://localhost:${PORT}`)
})
