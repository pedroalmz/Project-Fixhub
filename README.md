# FixHub

Plataforma de gestão de suporte técnico e assistência de computadores. O cliente abre chamados, cadastra equipamentos, acompanha diagnósticos e aprova orçamentos; o técnico gerencia chamados, orçamentos, ordens de serviço e agenda.

O projeto está sendo evoluído em fases: de um protótipo de frontend com dados fictícios para uma aplicação full-stack real.

## Status atual

| Fase | Descrição | Situação |
|---|---|---|
| 0 | Protótipo frontend navegável (dados mockados) | Concluída |
| 1 | Backend mínimo com `GET /health` | Concluída |
| 2 | PostgreSQL (Docker) + Prisma + tabela `Ticket` | Concluída |
| 3 | CRUD de tickets com validação (Zod) | Concluída |
| 4 | Frontend lendo chamados da API | Próxima |
| 5 | Usuários, login e demais módulos | Pendente |

## Estrutura

```text
fixhub/
├── frontend/   # React 19 + Vite + TypeScript + Tailwind (protótipo com dados mockados)
├── docker-compose.yml   # PostgreSQL 17 local (usuário/senha/banco: fixhub)
└── backend/    # Node.js + Express + TypeScript + Prisma 7
    ├── prisma/
    │   ├── schema.prisma   # modelo de dados (tabela tickets)
    │   └── migrations/     # histórico de alterações do banco
    ├── prisma.config.ts    # configuração do Prisma (lê DATABASE_URL)
    ├── .env.example        # modelo das variáveis de ambiente
    └── src/
        ├── app.ts          # monta o app Express: middlewares, rotas, tratamento de erros
        ├── server.ts       # liga o app a uma porta e escuta pedidos
        ├── lib/
        │   ├── prisma.ts   # conexão única com o banco
        │   ├── errors.ts   # AppError / NotFoundError (erros com código HTTP)
        │   └── zod.ts      # mensagens de validação do Zod em português
        ├── middlewares/
        │   └── errorHandler.ts   # notFoundHandler (404) e errorHandler (400/404/500)
        ├── modules/tickets/      # um módulo por assunto, uma camada por arquivo
        │   ├── ticket.routes.ts      # método + caminho -> controller
        │   ├── ticket.controller.ts  # valida com Zod, chama o service, responde
        │   ├── ticket.service.ts     # regras de negócio (ex.: 404 se não existe)
        │   ├── ticket.repository.ts  # único que fala com o banco (Prisma)
        │   └── ticket.schemas.ts     # schemas Zod e tipos de entrada
        └── generated/      # cliente Prisma gerado (não versionar)
```

Caminho de um pedido: `Postman → app.ts (express.json) → routes → controller (Zod) → service → repository → Prisma → PostgreSQL`, e a resposta volta pelo mesmo caminho. Qualquer erro lançado no meio vai para o `errorHandler`.

## Como rodar

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173`. A landing tem links para a área do cliente (`/app`) e do técnico (`/tecnico`). Os dados ainda são fictícios e ficam em memória.

### Banco de dados (PostgreSQL)

Com o Docker Desktop aberto, na raiz do projeto:

```bash
docker compose up -d
```

### Backend

```bash
cd backend
npm install
cp .env.example .env        # só na primeira vez
npm run db:generate         # gera o cliente Prisma
npm run db:migrate          # aplica as migrations no banco
npm run dev
```

A API sobe em `http://localhost:3333` (porta configurável pela variável `PORT`).

Outros comandos úteis: `npm run db:studio` abre uma interface visual para ver as tabelas.

#### Tabela `tickets` (fase 2)

Campos: `id`, `title`, `description`, `status` (ABERTO, DIAGNOSTICO, ORCAMENTO, AGUARDANDO_APROVACAO, MANUTENCAO, FINALIZADO), `priority` (BAIXA, NORMAL, ALTA), `mode` (PRESENCIAL, REMOTO), `createdAt`, `updatedAt`. Cliente e equipamento entram quando essas tabelas existirem.

#### Rotas disponíveis

| Método | Rota | O que faz | Sucesso |
|---|---|---|---|
| GET | `/health` | Verifica se a API está no ar | 200 |
| POST | `/tickets` | Cria um chamado | 201 |
| GET | `/tickets` | Lista os chamados (mais novos primeiro) | 200 |
| GET | `/tickets/:id` | Busca um chamado | 200 |
| PATCH | `/tickets/:id` | Atualiza só os campos enviados | 200 |

Não há `DELETE` por enquanto: a decisão sobre apagar x cancelar chamados (status `CANCELADO`) fica para depois, para não perder histórico.

**Regras de validação (Zod):**

- `POST /tickets`: `title` (3 a 120 caracteres) e `description` (5 a 2000) obrigatórios; `priority` (BAIXA, NORMAL, ALTA) e `mode` (PRESENCIAL, REMOTO) opcionais. `status` não pode ser enviado: todo chamado nasce `ABERTO`. Campos desconhecidos são recusados.
- `PATCH /tickets/:id`: aceita `title`, `description`, `status`, `priority` e `mode`, todos opcionais, mas pelo menos um é obrigatório.
- `:id` precisa ser inteiro positivo.

**Exemplo no Postman** (`POST http://localhost:3333/tickets`, Body > raw > JSON):

```json
{
  "title": "Computador não liga",
  "description": "O PC parou de ligar.",
  "priority": "ALTA"
}
```

Resposta `201 Created`:

```json
{
  "id": 1,
  "title": "Computador não liga",
  "description": "O PC parou de ligar.",
  "status": "ABERTO",
  "priority": "ALTA",
  "mode": "PRESENCIAL",
  "createdAt": "2026-10-05T20:45:45.886Z",
  "updatedAt": "2026-10-05T20:45:45.886Z"
}
```

`PATCH http://localhost:3333/tickets/1` com `{ "status": "DIAGNOSTICO" }` devolve o chamado atualizado (`200`).

**Erros e códigos HTTP:**

| Código | Quando | Exemplo de resposta |
|---|---|---|
| 400 | Dados inválidos (Zod) ou JSON quebrado | `{ "error": "Dados inválidos", "details": [{ "field": "title", "message": "..." }] }` |
| 404 | Chamado ou rota inexistente | `{ "error": "Chamado #999 não encontrado" }` |
| 500 | Falha interna (ex.: banco fora do ar) | `{ "error": "Erro interno do servidor" }` (o detalhe vai só para o log) |

## Frontend: organização

```text
frontend/src/
  App.tsx                # rotas
  components/layout/     # AppShell (sidebar, header, notificações)
  components/ui/         # componentes visuais reutilizáveis
  components/shared.tsx  # histórico, conversa, tabela de orçamento
  data/                  # types.ts, mock.ts e store.tsx (estado em memória)
  lib/format.ts          # formatação de moeda, datas e status
  pages/                 # Landing, client/ e technician/
```

As páginas consomem os dados só pelo hook `useStore()`. Esse é o ponto que será trocado por chamadas à API nas próximas fases.

## Próximos passos

Fase 4: a página de chamados do frontend passa a ler e gravar na API (CORS, cliente de API e troca do `useStore` nessa página).
